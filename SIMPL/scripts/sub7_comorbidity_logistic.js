document.addEventListener('DOMContentLoaded', function() {
    var selectElement = document.getElementById('disease-select');
    var descriptionElement = document.getElementById('disease-description');

    selectElement.addEventListener('change', function() {
        var value = this.value;
        var description = getDiseaseDescription(value);
        descriptionElement.innerHTML = description; // Change 'textContent' to 'innerHTML'
    });

    // Shared part of the descriptions with style added for indentation
    var sharedDescription = "This patient is in the Subgroup7, and the following comorbidities have been found to be highly correlated with {disease}: <ul style='margin-left: 20px;'>{comorbidities}</ul><br> The significant correlation (p <= 0.01) suggests that these conditions may share common risk factors with {disease} or could contribute to its development or severity.";

    // Map each disease to its specific comorbidities
    var diseaseDescriptions = {
        congestive_heart_failure: "Valvular Disease, Pulmonary Circulation Disorders, Hypertension, Uncomplicated Diabetes, Complicated Diabetes, Chronic Pulmonary Conditions, Renal Failure",
        cardiac_arrhythmias: "Valvular Disease, Hypertension, Hypothyroidism, Fluid and Electrolyte Disorders",
        valvular_disease: "Congestive Heart Failure, Cardiac Arrhythmias, Complicated Diabetes, Metastatic Cancer, Obesity",
        pulmonary_circulation: "Congestive Heart Failure, Chronic Pulmonary, Uncomplicated Diabetes, Complicated Diabetes, Obesity, Fluid and Electrolyte Disorders, Alcohol Abuse, Drug Abuse, Psychoses, Depression",
        peripheral_vascular: "Complicated Diabetes, Renal Failure, Alcohol Abuse",
        hypertension: "Congestive Heart Failure, Cardiac Arrhythmias, Uncomplicated Diabetes, Renal Failure, Depression",
        paralysis: "Other Neurological Disorders",
        other_neurological: "Paralysis, Weight Loss",
        chronic_pulmonary: "Congestive Heart Failure, Pulmonary Circulation Disorders",
        diabetes_uncomplicated: "Congestive Heart Failure, Pulmonary Circulation Disorders, Hypertension, Obesity, Alcohol Abuse, Psychoses",
        diabetes_complicated: "Congestive Heart Failure, Valvular Disease, Pulmonary Circulation Disorders, Peripheral Vascular Disease, Renal Failure, Rheumatoid Arthritis, Obesity, Depression",
        hypothyroidism: "Cardiac Arrhythmias, Depression",
        renal_failure: "Congestive Heart Failure, Peripheral Vascular Disease, Hypertension, Uncomplicated Diabetes, Complicated Diabetes, Coagulopathy, Fluid and Electrolyte Disorders",
        liver_disease: "Uncomplicated Diabetes, Peptic Ulcer, Solid Tumor without Metastasis, Coagulopathy, Obesity, Fluid and Electrolyte Disorders, Alcohol Abuse",
        peptic_ulcer: "Peripheral Vascular Disease, Liver Disease, Fluid and Electrolyte Disorders",
        aids: "(No significant variables)",
        lymphoma: "(No significant variables)",
        metastatic_cancer: "Valvular Disease",
        solid_tumor: "Liver Disease, Weight Loss",
        rheumatoid_arthritis: "Complicated Diabetes",
        coagulopathy: "Renal Failure, Liver Disease, Weight Loss, Fluid and Electrolyte Disorders, Deficiency Anemias",
        obesity: "Valvular Disease, Pulmonary Circulation Disorders, Uncomplicated Diabetes, Complicated Diabetes, Liver Disease, Alcohol Abuse",
        weight_loss: "Other Neurological Disorders, Solid Tumor without Metastasis, Coagulopathy, Depression",
        fluid_electrolyte: "Cardiac Arrhythmias, Pulmonary Circulation Disorders, Renal Failure, Liver Disease, Coagulopathy",
        blood_loss_anemia: "(No significant variables beyond the Intercept and Age)",
        deficiency_anemias: "Coagulopathy",
        alcohol_abuse: "Congestive Heart Failure, Pulmonary Circulation Disorders, Peripheral Vascular Disease, Uncomplicated Diabetes, Liver Disease, Obesity",
        drug_abuse: "Pulmonary Circulation Disorders, Peptic Ulcer, AIDS/HIV",
        psychoses: "Valvular Disease, Pulmonary Circulation Disorders, Depression",
        depression: "Pulmonary Circulation Disorders, Hypertension, Complicated Diabetes, Hypothyroidism, Psychoses"
        
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
