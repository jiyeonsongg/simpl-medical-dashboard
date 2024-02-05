DROP TABLE IF EXISTS COHORT_SELECTION;
CREATE TABLE COHORT_SELECTION AS
WITH co AS
(
  SELECT icu.subject_id, icu.hadm_id, icu.icustay_id
  , EXTRACT(EPOCH FROM outtime - intime)/60.0/60.0/24.0 as icu_length_of_stay
  , EXTRACT('epoch' from icu.intime - pat.dob) / 60.0 / 60.0 / 24.0 / 365.242 as age
  , RANK() OVER (PARTITION BY icu.subject_id ORDER BY icu.intime) AS icustay_id_order
  FROM mimiciii.icustays icu
  INNER JOIN mimiciii.patients pat
    ON icu.subject_id = pat.subject_id
)
, serv AS
(
  SELECT icu.hadm_id, icu.icustay_id, se.curr_service
  , CASE
      WHEN curr_service like '%SURG' then 1
      WHEN curr_service = 'ORTHO' then 1
      ELSE 0 END
    as surgical
  , RANK() OVER (PARTITION BY icu.hadm_id ORDER BY se.transfertime DESC) as rank
  FROM mimiciii.icustays icu
  LEFT JOIN mimiciii.services se
   ON icu.hadm_id = se.hadm_id
  AND se.transfertime < icu.intime + interval '12' hour
)
SELECT
  co.subject_id, co.hadm_id, co.icustay_id, co.icu_length_of_stay
  , co.age
  , co.icustay_id_order
  , CASE
        WHEN co.age < 16 then 1
    ELSE 0 END
    AS exclusion_age
FROM co
LEFT JOIN serv
  ON  co.icustay_id = serv.icustay_id
  AND serv.rank = 1
WHERE (co.age >= 16);
-- WHERE co.icustay_id_order = 1 AND (co.age >= 16);

-- SELECT * FROM COHORT_SELECTION;

DROP TABLE IF EXISTS POPULATION_SELECTION;
CREATE TABLE POPULATION_SELECTION AS
SELECT 
    c.subject_id, 
    c.hadm_id, 
    c.icustay_id, 
    c.icu_length_of_stay, 
    CASE 
      WHEN c.age >= 300 THEN 90
      ELSE ROUND(c.age)
    END AS rounded_age,  -- Renamed the calculated age column
    c.icustay_id_order,
    CASE 
        WHEN adm.admission_type = 'EMERGENCY' THEN 1
        ELSE 0
    END AS admission_type_encoded -- Renamed after encoded admission type
FROM 
    COHORT_SELECTION c
INNER JOIN mimiciii.admissions adm 
    ON c.subject_id = adm.subject_id AND c.hadm_id = adm.hadm_id
WHERE 
    adm.admission_type IN ('EMERGENCY', 'ELECTIVE');

-- SELECT * FROM POPULATION_SELECTION;

DROP TABLE IF EXISTS ELIXHAUSER_QUAN CASCADE;
CREATE TABLE ELIXHAUSER_QUAN AS
with icd as
(
  select hadm_id, seq_num, icd9_code
  from mimiciii.diagnoses_icd
  where seq_num != 1 -- we do not include the primary icd-9 code
)
, eliflg as
(
select hadm_id, seq_num, icd9_code
, CASE
  when icd9_code in ('39891','40201','40211','40291','40401','40403','40411','40413','40491','40493') then 1
  when SUBSTRING(icd9_code FROM 1 for 4) in ('4254','4255','4257','4258','4259') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('428') then 1
  else 0 end as CHF       /* Congestive heart failure */

, CASE
  when icd9_code in ('42613','42610','42612','99601','99604') then 1
  when SUBSTRING(icd9_code FROM 1 for 4) in ('4260','4267','4269','4270','4271','4272','4273','4274',
  '4276','4278','4279','7850','V450','V533') then 1
  else 0 end as ARRHY

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('0932','7463','7464','7465','7466','V422','V433') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('394','395','396','397','424') then 1
  else 0 end as VALVE     /* Valvular disease */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('4150','4151','4170','4178','4179') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('416') then 1
  else 0 end as PULMCIRC  /* Pulmonary circulation disorder */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('0930','4373','4431','4432','4438','4439','4471','5571','5579','V434') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('440','441') then 1
  else 0 end as PERIVASC  /* Peripheral vascular disorder */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 3) in ('401') then 1
  else 0 end as HTN       /* Hypertension, uncomplicated */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 3) in ('402','403','404','405') then 1
  else 0 end as HTNCX     /* Hypertension, complicated */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('3341','3440','3441','3442','3443','3444','3445','3446','3449') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('342','343') then 1
  else 0 end as PARA      /* Paralysis */

, CASE
  when icd9_code in ('33392') then 1
  when SUBSTRING(icd9_code FROM 1 for 4) in ('3319','3320','3321','3334','3335','3362','3481','3483','7803','7843') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('334','335','340','341','345') then 1
  else 0 end as NEURO     /* Other neurological */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('4168','4169','5064','5081','5088') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('490','491','492','493','494','495','496','500','501','502','503','504','505') then 1
  else 0 end as CHRNLUNG  /* Chronic pulmonary disease */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('2500','2501','2502','2503') then 1
  else 0 end as DM        /* Diabetes w/o chronic complications*/

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('2504','2505','2506','2507','2508','2509') then 1
  else 0 end as DMCX      /* Diabetes w/ chronic complications */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('2409','2461','2468') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('243','244') then 1
  else 0 end as HYPOTHY   /* Hypothyroidism */

, CASE
  when icd9_code in ('40301','40311','40391','40402','40403','40412','40413','40492','40493') then 1
  when SUBSTRING(icd9_code FROM 1 for 4) in ('5880','V420','V451') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('585','586','V56') then 1
  else 0 end as RENLFAIL  /* Renal failure */

, CASE
  when icd9_code in ('07022','07023','07032','07033','07044','07054') then 1
  when SUBSTRING(icd9_code FROM 1 for 4) in ('0706','0709','4560','4561','4562','5722','5723','5724','5728',
    '5733','5734','5738','5739','V427') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('570','571') then 1
  else 0 end as LIVER     /* Liver disease */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('5317','5319','5327','5329','5337','5339','5347','5349') then 1
  else 0 end as ULCER     /* Chronic Peptic ulcer disease (includes bleeding only if obstruction is also present) */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 3) in ('042','043','044') then 1
  else 0 end as AIDS      /* HIV and AIDS */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('2030','2386') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('200','201','202') then 1
  else 0 end as LYMPH     /* Lymphoma */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 3) in ('196','197','198','199') then 1
  else 0 end as METS      /* Metastatic cancer */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 3) in
  (
     '140','141','142','143','144','145','146','147','148','149','150','151','152'
    ,'153','154','155','156','157','158','159','160','161','162','163','164','165'
    ,'166','167','168','169','170','171','172','174','175','176','177','178','179'
    ,'180','181','182','183','184','185','186','187','188','189','190','191','192'
    ,'193','194','195'
  ) then 1
  else 0 end as TUMOR     /* Solid tumor without metastasis */

, CASE
  when icd9_code in ('72889','72930') then 1
  when SUBSTRING(icd9_code FROM 1 for 4) in ('7010','7100','7101','7102','7103','7104','7108','7109','7112','7193','7285') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('446','714','720','725') then 1
  else 0 end as ARTH              /* Rheumatoid arthritis/collagen vascular diseases */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('2871','2873','2874','2875') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('286') then 1
  else 0 end as COAG      /* Coagulation deficiency */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('2780') then 1
  else 0 end as OBESE     /* Obesity      */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('7832','7994') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('260','261','262','263') then 1
  else 0 end as WGHTLOSS  /* Weight loss */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('2536') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('276') then 1
  else 0 end as LYTES     /* Fluid and electrolyte disorders */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('2800') then 1
  else 0 end as BLDLOSS   /* Blood loss anemia */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('2801','2808','2809') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('281') then 1
  else 0 end as ANEMDEF  /* Deficiency anemias */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('2652','2911','2912','2913','2915','2918','2919','3030',
    '3039','3050','3575','4255','5353','5710','5711','5712','5713','V113') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('980') then 1
  else 0 end as ALCOHOL /* Alcohol abuse */

, CASE
  when icd9_code in ('V6542') then 1
  when SUBSTRING(icd9_code FROM 1 for 4) in ('3052','3053','3054','3055','3056','3057','3058','3059') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('292','304') then 1
  else 0 end as DRUG /* Drug abuse */

, CASE
  when icd9_code in ('29604','29614','29644','29654') then 1
  when SUBSTRING(icd9_code FROM 1 for 4) in ('2938') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('295','297','298') then 1
  else 0 end as PSYCH /* Psychoses */

, CASE
  when SUBSTRING(icd9_code FROM 1 for 4) in ('2962','2963','2965','3004') then 1
  when SUBSTRING(icd9_code FROM 1 for 3) in ('309','311') then 1
  else 0 end as DEPRESS  /* Depression */
from icd
)
-- collapse the icd9_code specific flags into hadm_id specific flags
-- this groups comorbidities together for a single patient admission
, eligrp as
(
  select 
	hadm_id, max(chf) as chf, max(arrhy) as arrhy, max(valve) as valve, max(pulmcirc) as pulmcirc, 
  max(perivasc) as perivasc, max(htn) as htn, max(htncx) as htncx, max(para) as para, max(neuro) as neuro, 
  max(chrnlung) as chrnlung, max(dm) as dm, max(dmcx) as dmcx, max(hypothy) as hypothy, max(renlfail) as renlfail, 
  max(liver) as liver, max(ulcer) as ulcer, max(aids) as aids, max(lymph) as lymph, max(mets) as mets, max(tumor) as tumor, 
  max(arth) as arth, max(coag) as coag, max(obese) as obese, max(wghtloss) as wghtloss, max(lytes) as lytes, 
  max(bldloss) as bldloss, max(anemdef) as anemdef, max(alcohol) as alcohol, max(drug) as drug, max(psych) as psych, max(depress) as depress
from eliflg
group by hadm_id
)
-- now merge these flags together to define elixhauser
-- most are straightforward.. but hypertension flags are a bit more complicated

select adm.hadm_id, chf as CONGESTIVE_HEART_FAILURE, arrhy as CARDIAC_ARRHYTHMIAS, valve as VALVULAR_DISEASE, 
pulmcirc as PULMONARY_CIRCULATION, perivasc as PERIPHERAL_VASCULAR
-- we combine "htn" and "htncx" into "HYPERTENSION"
, case
    when htn = 1 then 1
    when htncx = 1 then 1
  else 0 end as HYPERTENSION
, para as PARALYSIS, neuro as OTHER_NEUROLOGICAL, chrnlung as CHRONIC_PULMONARY
-- only the more severe comorbidity (complicated diabetes) is kept
, case
    when dmcx = 1 then 0
    when dm = 1 then 1
  else 0 end as DIABETES_UNCOMPLICATED
, dmcx as DIABETES_COMPLICATED, hypothy as HYPOTHYROIDISM, renlfail as RENAL_FAILURE, liver as LIVER_DISEASE, ulcer as PEPTIC_ULCER, 
aids as AIDS, lymph as LYMPHOMA, mets as METASTATIC_CANCER
-- only the more severe comorbidity (metastatic cancer) is kept
, case
    when mets = 1 then 0
    when tumor = 1 then 1
  else 0 end as SOLID_TUMOR
, arth as RHEUMATOID_ARTHRITIS, coag as COAGULOPATHY, obese as OBESITY, wghtloss as WEIGHT_LOSS, lytes as FLUID_ELECTROLYTE, 
bldloss as BLOOD_LOSS_ANEMIA, anemdef as DEFICIENCY_ANEMIAS, alcohol as ALCOHOL_ABUSE, drug as DRUG_ABUSE, psych as PSYCHOSES
, depress as DEPRESSION

from mimiciii.admissions adm
left join eligrp eli
  on adm.hadm_id = eli.hadm_id
order by adm.subject_id;

-- CALCULATE ELIXHAUSER
-- SELECT * FROM ELIXHAUSER_QUAN;

DROP TABLE IF EXISTS ELIXHAUSER_MATCH;
CREATE TABLE ELIXHAUSER_MATCH AS
(SELECT pop.subject_id, q.hadm_id, pop.rounded_age, pop.admission_type_encoded,
  CONGESTIVE_HEART_FAILURE,
  CARDIAC_ARRHYTHMIAS,
  VALVULAR_DISEASE,
  PULMONARY_CIRCULATION,
  PERIPHERAL_VASCULAR,
  HYPERTENSION,
  PARALYSIS,
  OTHER_NEUROLOGICAL,
  CHRONIC_PULMONARY,
  DIABETES_UNCOMPLICATED,
  DIABETES_COMPLICATED,
  HYPOTHYROIDISM,
  RENAL_FAILURE,
  LIVER_DISEASE,
  PEPTIC_ULCER,
  AIDS,
  LYMPHOMA,
  METASTATIC_CANCER,
  SOLID_TUMOR,
  RHEUMATOID_ARTHRITIS,
  COAGULOPATHY,
  OBESITY,
  WEIGHT_LOSS,
  FLUID_ELECTROLYTE,
  BLOOD_LOSS_ANEMIA,
  DEFICIENCY_ANEMIAS,
  ALCOHOL_ABUSE,
  DRUG_ABUSE,
  PSYCHOSES,
  DEPRESSION
FROM ELIXHAUSER_QUAN as q
INNER JOIN POPULATION_SELECTION as pop ON q.hadm_id = pop.hadm_id
WHERE CONGESTIVE_HEART_FAILURE IS NOT NULL
  AND CARDIAC_ARRHYTHMIAS IS NOT NULL
  AND VALVULAR_DISEASE IS NOT NULL
  AND PULMONARY_CIRCULATION IS NOT NULL
  AND PERIPHERAL_VASCULAR IS NOT NULL
  AND HYPERTENSION IS NOT NULL
  AND PARALYSIS IS NOT NULL
  AND OTHER_NEUROLOGICAL IS NOT NULL
  AND CHRONIC_PULMONARY IS NOT NULL
  AND DIABETES_UNCOMPLICATED IS NOT NULL
  AND DIABETES_COMPLICATED IS NOT NULL
  AND HYPOTHYROIDISM IS NOT NULL
  AND RENAL_FAILURE IS NOT NULL
  AND LIVER_DISEASE IS NOT NULL
  AND PEPTIC_ULCER IS NOT NULL
  AND AIDS IS NOT NULL
  AND LYMPHOMA IS NOT NULL
  AND METASTATIC_CANCER IS NOT NULL
  AND SOLID_TUMOR IS NOT NULL
  AND RHEUMATOID_ARTHRITIS IS NOT NULL
  AND COAGULOPATHY IS NOT NULL
  AND OBESITY IS NOT NULL
  AND WEIGHT_LOSS IS NOT NULL
  AND FLUID_ELECTROLYTE IS NOT NULL
  AND BLOOD_LOSS_ANEMIA IS NOT NULL
  AND DEFICIENCY_ANEMIAS IS NOT NULL
  AND ALCOHOL_ABUSE IS NOT NULL
  AND DRUG_ABUSE IS NOT NULL
  AND PSYCHOSES IS NOT NULL
  AND DEPRESSION IS NOT NULL);

SELECT * FROM ELIXHAUSER_MATCH
ORDER BY subject_id;