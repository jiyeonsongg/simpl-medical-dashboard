document.addEventListener('DOMContentLoaded', function() {
    var selectElement = document.getElementById('disease-select');
    var descriptionElement = document.getElementById('disease-description');

    selectElement.addEventListener('change', function() {
        var value = this.value;
        var description = getDiseaseDescription(value);
        descriptionElement.innerHTML = description; // Change 'textContent' to 'innerHTML'
    });

    // Shared part of the descriptions with style added for indentation
    var sharedDescription = "This patient is in the Subgroup5, and the following comorbidities have been found to be highly correlated with {disease}: <ul style='margin-left: 20px;'>{comorbidities}</ul><br> The significant correlation (p <= 0.01) suggests that these conditions may share common risk factors with {disease} or could contribute to its development or severity.";

    // Map each disease to its specific comorbidities
    var diseaseDescriptions = {
        congestive_heart_failure: "Valvular Disease, Lymphoma",
        cardiac_arrhythmias: "Deficiency Anemias, Drug Abuse, Valvular Disease, Fluid and Electrolyte Disorders, Psychoses.",
        valvular_disease: "Congestive Heart Failure, Cardiac Arrhythmias, Fluid and Electrolyte Disorders, Drug Abuse",
        pulmonary_circulation: "Chronic Pulmonary, Coagulopathy, Obesity",
        peripheral_vascular: "(No significant variables beyond the Intercept)",
        hypertension: "Other Neurological Disorders, Liver Disease, AIDS/HIV, Fluid and Electrolyte Disorders, Alcohol Abuse, Drug Abuse",
        paralysis: "Other Neurological Disorders, Deficiency Anemias",
        other_neurological: "Hypertension, Paralysis, Weight Loss",
        chronic_pulmonary: "Pulmonary Circulation Disorders, Liver Disease, Obesity, Alcohol Abuse, Drug Abuse, Depression",
        diabetes_uncomplicated: "(No significant variables beyond the Intercept)",
        diabetes_complicated: "Hypothyroidism, Fluid and Electrolyte Disorders, Alcohol Abuse, Drug Abuse, Depression",
        hypothyroidism: "Complicated Diabetes, Lymphoma, Depression",
        renal_failure: "Rheumatoid Arthritis",
        liver_disease: "Hypertension, Chronic Pulmonary, Lymphoma, Fluid and Electrolyte Disorders, Drug Abuse",
        peptic_ulcer: "(No significant variables beyond the Intercept)",
        aids: "Hypertension, Lymphoma, Solid Tumor without Metastasis, Fluid and Electrolyte Disorders",
        lymphoma: "Congestive Heart Failure, Hypothyroidism, Liver Disease, AIDS/HIV, Coagulopathy",
        metastatic_cancer: "Alcohol Abuse, Depression",
        solid_tumor: "AIDS/HIV",
        rheumatoid_arthritis: "Renal Failure",
        coagulopathy: "Pulmonary Circulation Disorders, Lymphoma, Fluid and Electrolyte Disorders, Alcohol Abuse",
        obesity: "Pulmonary Circulation Disorders, Chronic Pulmonary, Alcohol Abuse",
        weight_loss: "Other Neurological Disorders, Alcohol Abuse",
        fluid_electrolyte: "Cardiac Arrhythmias, Valvular Disease, Hypertension, Complicated Diabetes, Liver Disease, AIDS/HIV, Coagulopathy, Depression",
        blood_loss_anemia: "(No significant variables beyond the Intercept)",
        deficiency_anemias: "Cardiac Arrhythmias, Paralysis",
        alcohol_abuse: "Hypertension, Chronic Pulmonary, Complicated Diabetes, Metastatic Cancer, Coagulopathy, Obesity, Weight Loss, Drug Abuse, Depression",
        drug_abuse: "Cardiac Arrhythmias, Valvular Disease, Hypertension, Chronic Pulmonary, Complicated Diabetes, Liver Disease, Alcohol Abuse, Depression",
        psychoses: "Cardiac Arrhythmias",
        depression: "Hypertension, Chronic Pulmonary, Complicated Diabetes, Hypothyroidism, Liver Disease, Fluid and Electrolyte Disorders, Alcohol Abuse, Drug Abuse"
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
