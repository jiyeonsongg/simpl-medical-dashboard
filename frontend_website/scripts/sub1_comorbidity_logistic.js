document.addEventListener('DOMContentLoaded', function() {
    var selectElement = document.getElementById('disease-select');
    var descriptionElement = document.getElementById('disease-description');

    selectElement.addEventListener('change', function() {
        var value = this.value;
        var description = getDiseaseDescription(value);
        descriptionElement.innerHTML = description; // Change 'textContent' to 'innerHTML'
    });

    // Shared part of the descriptions with style added for indentation
    var sharedDescription = "This patient is in the Cardiopulmonary group, and the following comorbidities have been found to be highly correlated with {disease}: <ul style='margin-left: 20px;'>{comorbidities}</ul><br> The significant correlation (p <= 0.01) suggests that these conditions may share common risk factors with {disease} or could contribute to its development or severity.";

    // Map each disease to its specific comorbidities
    var diseaseDescriptions = {
        congestive_heart_failure: "Cardiac Arrhythmias, Valvular Disease, Hypertension, Chronic Pulmonary Conditions, Complicated Diabetes, Renal Failure, Coagulopathy",
        cardiac_arrhythmias: "Congestive Heart Failure, Peripheral Vascular Disease, Hypertension, Complicated Diabetes, Renal Failure, Coagulopathy, Fluid and Electrolyte Disorders",
        valvular_disease: "Congestive Heart Failure, Cardiac Arrhythmias",
        pulmonary_circulation: "(No significant variables beyond the Intercept)",
        peripheral_vascular: "Cardiac Arrhythmias, Complicated Diabetes",
        hypertension: "Congestive Heart Failure, Complicated Diabetes, Renal Failure, Depression",
        paralysis: "(No significant variables beyond the Intercept)",
        other_neurological: "Complicated Diabetes, Coagulopathy, Obesity, Weight Loss, Fluid and Electrolyte Disorders, Alcohol Abuse",
        chronic_pulmonary: "Congestive Heart Failure, Complicated Diabetes, Obesity, Depression",
        diabetes_uncomplicated: "(No significant variables beyond the Intercept)",
        diabetes_complicated: "Congestive Heart Failure, Cardiac Arrhythmias, Peripheral Vascular Disease, Hypertension, Other Neurological Disorders, Chronic Pulmonary, Renal Failure, AIDS/HIV, Rheumatoid Arthritis, Obesity, Psychoses",
        hypothyroidism: "Solid Tumor without Metastasis, Psychoses, Depression",
        renal_failure: "Congestive Heart Failure, Cardiac Arrhythmias, Hypertension, Complicated Diabetes, Obesity, Depression",
        liver_disease: "Solid Tumor without Metastasis, Coagulopathy, Weight Loss, Alcohol Abuse",
        peptic_ulcer: "(No significant variables beyond the Intercept)",
        aids: "Complicated Diabetes",
        lymphoma: "Coagulopathy",
        metastatic_cancer: "(No significant variables beyond the Intercept)",
        solid_tumor: "Hypothyroidism, Coagulopathy, Fluid and Electrolyte Disorders",
        rheumatoid_arthritis: "Paralysis, Complicated Diabetes, Coagulopathy, Depression",
        coagulopathy: "Congestive Heart Failure, Cardiac Arrhythmias, Other Neurological Disorders, Liver Disease, Lymphoma, Solid Tumor without Metastasis, Rheumatoid Arthritis, Fluid and Electrolyte Disorders, Blood Loss Anemia",
        obesity: "Other Neurological Disorders, Chronic Pulmonary, Complicated Diabetes, Hypothyroidism, Renal Failure, Fluid and Electrolyte Disorders",
        weight_loss: "Other Neurological Disorders, Liver Disease",
        fluid_electrolyte: "Cardiac Arrhythmias, Other Neurological Disorders, Solid Tumor without Metastasis, Coagulopathy, Obesity, Deficiency Anemias, Depression",
        blood_loss_anemia: "Coagulopathy",
        deficiency_anemias: "Fluid and Electrolyte Disorders",
        alcohol_abuse: "Other Neurological Disorders, Liver Disease, Drug Abuse",
        drug_abuse: "Alcohol Abuse",
        psychoses: "Complicated Diabetes",
        depression: "Hypertension, Chronic Pulmonary, Hypothyroidism, Renal Failure, Fluid and Electrolyte Disorders"
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
