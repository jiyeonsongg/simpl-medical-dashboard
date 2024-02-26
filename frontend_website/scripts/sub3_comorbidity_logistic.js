document.addEventListener('DOMContentLoaded', function() {
    var selectElement = document.getElementById('disease-select');
    var descriptionElement = document.getElementById('disease-description');

    selectElement.addEventListener('change', function() {
        var value = this.value;
        var description = getDiseaseDescription(value);
        descriptionElement.innerHTML = description; // Change 'textContent' to 'innerHTML'
    });

    // Shared part of the descriptions with style added for indentation
    var sharedDescription = "This patient is in the Subgroup3, and the following comorbidities have been found to be highly correlated with {disease}: <ul style='margin-left: 20px;'>{comorbidities}</ul><br> The significant correlation (p <= 0.01) suggests that these conditions may share common risk factors with {disease} or could contribute to its development or severity.";

    // Map each disease to its specific comorbidities
    var diseaseDescriptions = {
        congestive_heart_failure: "Cardiac Arrhythmias, Valvular Disease, Pulmonary Circulation Disorders, Renal Failure, Liver Disease, Solid Tumor without Metastasis, Obesity, Fluid and Electrolyte Disorders, Metastatic Cancer, Alcohol Abuse, Depression",
        cardiac_arrhythmias: "Congestive Heart Failure, Valvular Disease, Obesity, Fluid and Electrolyte Disorders, Weight Loss",
        valvular_disease: "Congestive Heart Failure, Cardiac Arrhythmias, Paralysis, Weight Loss, Alcohol Abuse, Drug Abuse",
        pulmonary_circulation: "Congestive Heart Failure, Chronic Pulmonary, Metastatic Cancer",
        peripheral_vascular: "Weight Loss",
        hypertension: "Other Neurological Disorders, Uncomplicated Diabetes, Complicated Diabetes, Hypothyroidism, Renal Failure, Liver Disease, Lymphoma, Metastatic Cancer, Coagulopathy, Obesity, Weight Loss, Alcohol Abuse, Depression",
        paralysis: "Valvular Disease, Other Neurological Disorders",
        other_neurological: "Hypertension, Paralysis, Uncomplicated Diabetes, Weight Loss, Drug Abuse",
        chronic_pulmonary: "Pulmonary Circulation, Hypothyroidism, Metastatic Cancer, Obesity, Drug Abuse, Psychoses, Depression",
        diabetes_uncomplicated: "Hypertension, Other Neurological Disorders, AIDS/HIV, Obesity, Weight Loss, Blood Loss Anemia, Alcohol Abuse",
        diabetes_complicated: "Hypertension, Hypothyroidism, Weight Loss",
        hypothyroidism: "Hypertension, Chronic Pulmonary, Complicated Diabetes, Psychoses, Depression",
        renal_failure: "Congestive Heart Failure, Cardiac Arrhythmias, Hypertension, Liver Disease, AIDS/HIV, Metastatic Cancer, Solid Tumor without Metastasis, Weight Loss, Fluid and Electrolyte Disorders, Deficiency Anemias, Alcohol Abuse",
        liver_disease: "Congestive Heart Failure, Hypertension, Renal Failure, AIDS/HIV, Lymphoma, Weight Loss, Fluid and Electrolyte Disorders, Alcohol Abuse, Drug Abuse, Depression",
        peptic_ulcer: "(No significant variables beyond the Intercept)",
        aids: "Hypertension, Uncomplicated Diabetes, Renal Failure, Liver Disease, Solid Tumor without Metastasis, Coagulopathy, Obesity, Weight Loss, Fluid and Electrolyte Disorders, Alcohol Abuse, Depression",
        lymphoma: "Hypertension, Liver Disease, Alcohol Abuse",
        metastatic_cancer: "Congestive Heart Failure, Pulmonary Circulation, Hypertension, Renal Failure, Fluid and Electrolyte Disorders, Alcohol Abuse.",
        solid_tumor: "Congestive Heart Failure, Valvular Disease, Renal Failure, Deficiency Anemias, Alcohol Abuse, Depression",
        rheumatoid_arthritis: "Alcohol Abuse",
        coagulopathy: "Pulmonary Circulation, Hypertension, AIDS/HIV, Fluid and Electrolyte Disorders, Alcohol Abuse, Drug Abuse, Psychoses, Depression",
        obesity: "Congestive Heart Failure, Cardiac Arrhythmias, Hypertension, Chronic Pulmonary, Uncomplicated Diabetes, AIDS/HIV, Weight Loss, Fluid and Electrolyte Disorders, Alcohol Abuse, Psychoses",
        weight_loss: "Cardiac Arrhythmias, Peripheral Vascular Disease, Hypertension, Other Neurological Disorders, Uncomplicated Diabetes, Complicated Diabetes, Renal Failure, Liver Disease, AIDS/HIV, Obesity, Fluid and Electrolyte Disorders, Blood Loss Anemia, Deficiency Anemias",
        fluid_electrolyte: "Congestive Heart Failure, Cardiac Arrhythmias, Renal Failure, Liver Disease, Metastatic Cancer, Coagulopathy, Obesity, Weight Loss, Alcohol Abuse, Drug Abuse",
        blood_loss_anemia: "Weight Loss",
        deficiency_anemias: "Renal Failure, Solid Tumor without Metastasis, Weight Loss",
        alcohol_abuse: "Congestive Heart Failure, Valvular Disease, Hypertension, Uncomplicated Diabetes, Renal Failure, Liver Disease, AIDS/HIV, Lymphoma, Metastatic Cancer, Solid Tumor without Metastasis, Rheumatoid Arthritis, Coagulopathy, Obesity, Fluid and Electrolyte Disorders",
        drug_abuse: "Valvular Disease, Other Neurological Disorders, Chronic Pulmonary, Liver Disease, AIDS/HIV, Coagulopathy, Fluid and Electrolyte Disorders, Depression",
        psychoses: "Chronic Pulmonary, Hypothyroidism, Coagulopathy, Obesity",
        depression: "Congestive Heart Failure, Hypertension, Chronic Pulmonary, Hypothyroidism, Liver Disease, Solid Tumor without Metastasis, Coagulopathy, Drug Abuse"
    };

    function getDiseaseDescription(diseaseKey) {
        var comorbidities = diseaseDescriptions[diseaseKey];
        if (!comorbidities) {
            return "Select a disease to see its description.";
        }
        // Convert comorbidities string to an HTML bulleted list
        var comorbiditiesList = comorbidities.split(', ').map(function(comorbidity) {
            return '<li> - ' + comorbidity + '</li>';
        }).join('');
        // Replace placeholders with actual disease and formatted comorbidities
        return sharedDescription.replace('{disease}', diseaseKey.replace(/_/g, ' ')).replace('{comorbidities}', comorbiditiesList);
    }
});
