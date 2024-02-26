document.addEventListener('DOMContentLoaded', function() {
    var selectElement = document.getElementById('disease-select');
    var descriptionElement = document.getElementById('disease-description');

    selectElement.addEventListener('change', function() {
        var value = this.value;
        var description = getDiseaseDescription(value);
        descriptionElement.innerHTML = description; // Change 'textContent' to 'innerHTML'
    });

    // Shared part of the descriptions with style added for indentation
    var sharedDescription = "This patient is in the Subgroup4, and the following comorbidities have been found to be highly correlated with {disease}: <ul style='margin-left: 20px;'>{comorbidities}</ul><br> The significant correlation (p <= 0.01) suggests that these conditions may share common risk factors with {disease} or could contribute to its development or severity.";

    // Map each disease to its specific comorbidities
    var diseaseDescriptions = {
        congestive_heart_failure: "Peripheral Vascular Disease, Chronic Pulmonary Conditions, Uncomplicated Diabetes, Hypothyroidism, Obesity, Renal Failure, Fluid and Electrolyte Disorders",
        cardiac_arrhythmias: "Valvular Disease, Hypertension, Uncomplicated Diabetes, Hypothyroidism, Obesity, Renal Failure, Metastatic Cancer, Depression",
        valvular_disease: "Cardiac Arrhythmias, Peripheral Vascular Disease, Hypertension, Paralysis, Other Neurological Disorders, Chronic Pulmonary, Uncomplicated Diabetes, Renal Failure, Metastatic Cancer, Psychoses",
        pulmonary_circulation: "Hypertension",
        peripheral_vascular: "Congestive Heart Failure, Valvular Disease, Other Neurological Disorders, Chronic Pulmonary, Metastatic Cancer, Coagulopathy",
        hypertension: "Congestive Heart Failure, Cardiac Arrhythmias, Valvular Disease, Pulmonary Circulation, Chronic Pulmonary, Uncomplicated Diabetes, Complicated Diabetes, Hypothyroidism, Renal Failure, Metastatic Cancer, Obesity, Depression",
        paralysis: "Valvular Disease",
        other_neurological: "Valvular Disease, Peripheral Vascular Disease, Obesity, Fluid and Electrolyte Disorders",
        chronic_pulmonary: "Congestive Heart Failure, Cardiac Arrhythmias, Valvular Disease, Peripheral Vascular Disease, Hypertension, Metastatic Cancer, Rheumatoid Arthritis, Coagulopathy, Obesity",
        diabetes_uncomplicated: "Congestive Heart Failure, Cardiac Arrhythmias, Valvular Disease, Hypertension, Renal Failure, Liver Disease, Coagulopathy, Obesity, Fluid and Electrolyte Disorders, Psychoses",
        diabetes_complicated: "Hypertension, Obesity, Fluid and Electrolyte Disorders",
        hypothyroidism: "Congestive Heart Failure, Cardiac Arrhythmias, Hypertension, Metastatic Cancer, Solid Tumor without Metastasis, Obesity",
        renal_failure: "Congestive Heart Failure, Cardiac Arrhythmias, Valvular Disease, Hypertension, Uncomplicated Diabetes, Depression",
        liver_disease: "Uncomplicated Diabetes",
        peptic_ulcer: "(No significant variables beyond the Intercept)",
        aids: "(No significant variables)",
        lymphoma: "(No significant variables)",
        metastatic_cancer: "Cardiac Arrhythmias, Valvular Disease, Peripheral Vascular Disease, Hypertension, Chronic Pulmonary, Hypothyroidism, Obesity, Fluid and Electrolyte Disorders",
        solid_tumor: "Hypothyroidism",
        rheumatoid_arthritis: "Chronic Pulmonary",
        coagulopathy: "Peripheral Vascular Disease, Chronic Pulmonary, Uncomplicated Diabetes, Fluid and Electrolyte Disorders",
        obesity: "Congestive Heart Failure, Cardiac Arrhythmias, Hypertension, Other Neurological Disorders, Chronic Pulmonary, Uncomplicated Diabetes, Complicated Diabetes, Hypothyroidism, Metastatic Cancer, Fluid and Electrolyte Disorders, Deficiency Anemias, Depression",
        weight_loss: "(No significant variables)",
        fluid_electrolyte: "Congestive Heart Failure, Other Neurological Disorders, Uncomplicated Diabetes, Complicated Diabetes, Metastatic Cancer, Coagulopathy, Obesity",
        blood_loss_anemia: "(No significant variables beyond the Intercept and Admission Type)",
        deficiency_anemias: "Obesity",
        alcohol_abuse: "(No significant variables beyond the Intercept and Admission Type)",
        drug_abuse: "Depression",
        psychoses: "Valvular Disease, Uncomplicated Diabetes, Depression",
        depression: "Hypertension, Uncomplicated Diabetes, Renal Failure, Obesity, Drug Abuse"
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
