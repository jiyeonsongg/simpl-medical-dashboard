document.addEventListener('DOMContentLoaded', function() {
    var selectElement = document.getElementById('disease-select');
    var descriptionElement = document.getElementById('disease-description');

    selectElement.addEventListener('change', function() {
        var value = this.value;
        var description = getDiseaseDescription(value);
        descriptionElement.innerHTML = description; // Change 'textContent' to 'innerHTML'
    });

    // Shared part of the descriptions with style added for indentation
    var sharedDescription = "This patient is in the Subgroup2, and the following comorbidities have been found to be highly correlated with {disease}: <ul style='margin-left: 20px;'>{comorbidities}</ul><br> The significant correlation (p <= 0.01) suggests that these conditions may share common risk factors with {disease} or could contribute to its development or severity.";

    // Map each disease to its specific comorbidities
    var diseaseDescriptions = {
        congestive_heart_failure: "Cardiac Arrhythmias, Peripheral Vascular Disease, Hypertension, Chronic Pulmonary Conditions, Complicated Diabetes, Obesity, Other Neurological Disorders, Coagulopathy, Alcohol Abuse",
        cardiac_arrhythmias: "Congestive Heart Failure, Valvular Disease, Hypertension, Paralysis, Uncomplicated Diabetes, Renal Failure, Obesity, Lymphoma, Metastatic Cancer",
        valvular_disease: "Cardiac Arrhythmias, Hypertension, Chronic Pulmonary, Uncomplicated Diabetes, Complicated Diabetes, Renal Failure, Liver Disease, Solid Tumor without Metastasis, Obesity, Deficiency Anemias",
        pulmonary_circulation: "(No significant variables beyond the Intercept)",
        peripheral_vascular: "Congestive Heart Failure, Cardiac Arrhythmias, Hypertension, Chronic Pulmonary, Uncomplicated Diabetes, Complicated Diabetes, Renal Failure",
        hypertension: "Congestive Heart Failure, Cardiac Arrhythmias, Valvular Disease, Peripheral Vascular Disease, Uncomplicated Diabetes, Hypothyroidism, Renal Failure, Fluid and Electrolyte Disorders, Drug Abuse, Depression",
        paralysis: "Cardiac Arrhythmias, Peripheral Vascular Disease, Other Neurological Disorders",
        other_neurological: "Congestive Heart Failure, Paralysis, Weight Loss, Fluid and Electrolyte Disorders, Depression",
        chronic_pulmonary: "Congestive Heart Failure, Valvular Disease, Peripheral Vascular Disease, Uncomplicated Diabetes, Complicated Diabetes, Liver Disease, Solid Tumor without Metastasis, Obesity",
        diabetes_uncomplicated: "Cardiac Arrhythmias, Valvular Disease, Peripheral Vascular Disease, Hypertension, Chronic Pulmonary, Renal Failure, Liver Disease, Lymphoma, Coagulopathy, Obesity",
        diabetes_complicated: "Congestive Heart Failure, Cardiac Arrhythmias, Valvular Disease, Peripheral Vascular Disease, Chronic Pulmonary, Renal Failure",
        hypothyroidism: "Congestive Heart Failure, Hypertension, Obesity, Depression",
        renal_failure: "Cardiac Arrhythmias, Valvular Disease, Peripheral Vascular Disease, Hypertension, Uncomplicated Diabetes, Metastatic Cancer, Coagulopathy, Fluid and Electrolyte Disorders",
        liver_disease: "Valvular Disease, Uncomplicated Diabetes, Solid Tumor without Metastasis, Coagulopathy, Fluid and Electrolyte Disorders, Blood Loss Anemia, Alcohol Abuse, Depression",
        peptic_ulcer: "(No significant variables beyond the Intercept)",
        aids: "(No significant variables)",
        lymphoma: "Cardiac Arrhythmias, Uncomplicated Diabetes, Coagulopathy",
        metastatic_cancer: "Cardiac Arrhythmias, Renal Failure, Blood Loss Anemia",
        solid_tumor: "Valvular Disease, Chronic Pulmonary, Liver Disease",
        rheumatoid_arthritis: "(No significant variables beyond the Intercept and Age)",
        coagulopathy: "Congestive Heart Failure, Uncomplicated Diabetes, Renal Failure, Liver Disease, Lymphoma, Weight Loss, Fluid and Electrolyte Disorders",
        obesity: "Congestive Heart Failure, Cardiac Arrhythmias, Valvular Disease, Chronic Pulmonary, Uncomplicated Diabetes, Hypothyroidism",
        weight_loss: "Other Neurological Disorders, Coagulopathy, Fluid and Electrolyte Disorders, Blood Loss Anemia",
        fluid_electrolyte: "Hypertension, Other Neurological Disorders, Renal Failure, Liver Disease, Coagulopathy, Weight Loss, Deficiency Anemias, Drug Abuse",
        blood_loss_anemia: "Liver Disease, Metastatic Cancer, Weight Loss",
        deficiency_anemias: "Valvular Disease, Fluid and Electrolyte Disorders, Depression",
        alcohol_abuse: "Congestive Heart Failure, Liver Disease",
        drug_abuse: "Hypertension, Fluid and Electrolyte Disorders",
        psychoses: "(No significant variables beyond the Intercept)",
        depression: "Hypertension, Other Neurological Disorders, Hypothyroidism, Liver Disease, Deficiency Anemias"
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
