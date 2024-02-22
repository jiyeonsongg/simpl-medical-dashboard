// JavaScript for updating disease descriptions
document.addEventListener('DOMContentLoaded', function() {
    var selectElement = document.getElementById('disease-select');
    var descriptionElement = document.getElementById('disease-description');

    selectElement.addEventListener('change', function() {
        var value = this.value;
        var description = getDiseaseDescription(value);
        descriptionElement.textContent = description;
    });

    function getDiseaseDescription(disease) {
        var descriptions = {
            congestive_heart_failure: "This patient is in the Cardiopulmonary group, and the following comorbidities have been found to be highly correlated with congestive heart failure: Cardiac arrhythmias, Valvular disease, Disorders related to pulmonary circulation, Hypertension, Chronic pulmonary conditions, Complicated forms of diabetes, Renal failure, Coagulopathy, Obesity, Fluid and electrolyte imbalances. The significant correlation (p < 0.01) suggests that these conditions may share common risk factors with congestive heart failure or could contribute to its development or severity.",            
            cardiac_arrhythmias: "This patient is in the Cardiopulmonary group, and the following comorbidities have been found to be highly correlated with Cardiac Arrhythmias: Congestive heart failure, Valvular disease, Disorders related to pulmonary circulation, Peripheral vascular, Paralysis, Chronic pulmonary conditions, Complicated forms of diabetes, Renal failure, Rheumatoid arthritis, Coagulopathy, Obesity, Fluid and electrolyte imbalances. The significant correlation (p < 0.01) suggests that these conditions may share common risk factors with congestive heart failure or could contribute to its development or severity.",
            valvular_disease: "Description for Valvular Disease.",
            pulmonary_circulation: "Description for Pulmonary Circulation Disorders.",
            peripheral_vascular: "Description for Peripheral Vascular Disease.",
            hypertension: "Description for Hypertension.",
            paralysis: "Description for Paralysis.",
            other_neurological: "Description for Other Neurological Disorders.",
            chronic_pulmonary: "Description for Chronic Pulmonary Disease.",
            diabetes_uncomplicated: "Description for Uncomplicated Diabetes.",
            diabetes_complicated: "Description for Complicated Diabetes.",
            hypothyroidism: "Description for Hypothyroidism.",
            renal_failure: "Description for Renal Failure.",
            liver_disease: "Description for Liver Disease.",
            peptic_ulcer: "Description for Peptic Ulcer Disease.",
            aids: "Description for AIDS/HIV.",
            lymphoma: "Description for Lymphoma.",
            metastatic_cancer: "Description for Metastatic Cancer.",
            solid_tumor: "Description for Solid Tumor without Metastasis.",
            rheumatoid_arthritis: "Description for Rheumatoid Arthritis.",
            coagulopathy: "Description for Coagulopathy.",
            obesity: "Description for Obesity.",
            weight_loss: "Description for Weight Loss.",
            fluid_electrolyte: "Description for Fluid and Electrolyte Disorders.",
            blood_loss_anemia: "Description for Blood Loss Anemia.",
            deficiency_anemias: "Description for Deficiency Anemias.",
            alcohol_abuse: "Description for Alcohol Abuse.",
            drug_abuse: "Description for Drug Abuse.",
            psychoses: "Description for Psychoses.",
            depression: "Description for Depression."
        };
        return descriptions[disease] || "Select a disease to see its description.";
    }
});
