# Compare the characteristics of subgroups
# 1.Logistic Regression

library(dplyr)

# Step 1: Load the Data
sub1 <- read.csv("C:/Users/jyson/dsc180ab/dsc180b-wi24-quarter2/processed_data/subgroup_1.csv")
sub2 <- read.csv("C:/Users/jyson/dsc180ab/dsc180b-wi24-quarter2/processed_data/subgroup_2.csv")
sub3 <- read.csv("C:/Users/jyson/dsc180ab/dsc180b-wi24-quarter2/processed_data/subgroup_3.csv")
sub4 <- read.csv("C:/Users/jyson/dsc180ab/dsc180b-wi24-quarter2/processed_data/subgroup_4.csv")
sub5 <- read.csv("C:/Users/jyson/dsc180ab/dsc180b-wi24-quarter2/processed_data/subgroup_5.csv")
sub6 <- read.csv("C:/Users/jyson/dsc180ab/dsc180b-wi24-quarter2/processed_data/subgroup_6.csv")
sub7 <- read.csv("C:/Users/jyson/dsc180ab/dsc180b-wi24-quarter2/processed_data/subgroup_7.csv")

run_comorbidity_analysis <- function(morbidity, subgroup) {
  if (!(morbidity %in% names(subgroup))) {
    stop(paste("Morbidity", morbidity, "not found in the dataset."))
  }
  
  formula <- as.formula(paste(morbidity, "~ age + admission_type_encoded +
                 cardiac_arrhythmias + valvular_disease + pulmonary_circulation + 
                 peripheral_vascular + hypertension + paralysis + other_neurological + 
                 chronic_pulmonary + diabetes_uncomplicated + diabetes_complicated + 
                 hypothyroidism + renal_failure + liver_disease + peptic_ulcer + aids + 
                 lymphoma + metastatic_cancer + solid_tumor + rheumatoid_arthritis + 
                 coagulopathy + obesity + weight_loss + fluid_electrolyte + 
                 blood_loss_anemia + deficiency_anemias + alcohol_abuse + 
                 drug_abuse + psychoses + depression", sep = " "))
  model <- glm(formula, family = binomial(), data = subgroup)
  result <- summary(model)
  
  return(result)
}

# ---------------------------------------------------------------------------------------------------
results_congestive_heart_failure <- run_comorbidity_analysis("congestive_heart_failure", sub6)
results_congestive_heart_failure