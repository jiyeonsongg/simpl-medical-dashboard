document.addEventListener('DOMContentLoaded', function() {
    var selectElement = document.getElementById('disease-select');
    var descriptionElement = document.getElementById('disease-description');

    selectElement.addEventListener('change', function() {
        var value = this.value;
        var description = getDiseaseDescription(value);
        descriptionElement.innerHTML = description; // Change 'textContent' to 'innerHTML'
    });

    // Shared part of the descriptions with style added for indentation
    var sharedDescription = "This patient is in the Subgroup6, and the following comorbidities have been found to be highly correlated with {disease}: <ul style='margin-left: 20px;'>{comorbidities}</ul><br> The significant correlation (p <= 0.01) suggests that these conditions may share common risk factors with {disease} or could contribute to its development or severity.";

    // Map each disease to its specific comorbidities
    var diseaseDescriptions = {
        congestive_heart_failure: "Cardiac Arrhythmias, Hypertension, Paralysis, Other Neurological Disorders, Renal Failure, Metastatic Cancer, Rheumatoid Arthritis, Weight Loss, Fluid and Electrolyte Disorders, Psychoses",
        cardiac_arrhythmias: "Congestive Heart Failure, Peripheral Vascular Disease, Pulmonary Circulation Disorders, Paralysis, Other Neurological Disorders, Hypothyroidism, Renal Failure, Weight Loss, Fluid and Electrolyte Disorders, Psychoses, Alcohol Abuse, Drug Abuse",
        valvular_disease: "Pulmonary Circulation Disorders, Paralysis, Other Neurological Disorders, Metastatic Cancer, Obesity, Weight Loss, Fluid and Electrolyte Disorders",
        pulmonary_circulation: "Age, Cardiac Arrhythmias, Valvular Disease, Paralysis, Metastatic Cancer",
        peripheral_vascular: "Cardiac Arrhythmias, Paralysis, Chronic Pulmonary, Fluid and Electrolyte Disorders, Depression",
        hypertension: "Congestive Heart Failure, Cardiac Arrhythmias, Valvular Disease, Paralysis, Other Neurological Disorders, Uncomplicated Diabetes, Renal Failure, Lymphoma, Metastatic Cancer, Solid Tumor without Metastasis, Obesity, Weight Loss, Fluid and Electrolyte Disorders, Alcohol Abuse, Depression",
        paralysis: "Congestive Heart Failure, Cardiac Arrhythmias, Valvular Disease, Pulmonary Circulation Disorders, Peripheral Vascular Disease, Hypertension, Complicated Diabetes, Liver Disease, Lymphoma, Metastatic Cancer, Solid Tumor without Metastasis, Rheumatoid Arthritis, Coagulopathy, Obesity, Fluid and Electrolyte Disorders, Psychoses",
        other_neurological: "Congestive Heart Failure, Cardiac Arrhythmias, Valvular Disease, Peripheral Vascular Disease, Hypertension, Complicated Diabetes, Hypothyroidism, Peptic Ulcer, Lymphoma, Metastatic Cancer, Solid Tumor without Metastasis, Rheumatoid Arthritis, Coagulopathy, Obesity, Weight Loss, Fluid and Electrolyte Disorders, Blood Loss Anemia, Deficiency Anemias, Alcohol Abuse, Psychoses",
        chronic_pulmonary: "Peripheral Vascular Disease, Renal Failure, Alcohol Abuse, Psychoses, Depression",
        diabetes_uncomplicated: "Cardiac Arrhythmias, Hypertension, Liver Disease, Lymphoma, Metastatic Cancer, Obesity, Fluid and Electrolyte Disorders, Psychoses",
        diabetes_complicated: "Paralysis, Other Neurological Disorders, Metastatic Cancer, Fluid and Electrolyte Disorders",
        hypothyroidism: "Cardiac Arrhythmias, Other Neurological Disorders, Solid Tumor without Metastasis, Rheumatoid Arthritis, Obesity, Weight Loss, Fluid and Electrolyte Disorders, Blood Loss Anemia, Deficiency Anemias, Depression",
        renal_failure: "Congestive Heart Failure, Cardiac Arrhythmias, Hypertension, Chronic Pulmonary, Rheumatoid Arthritis",
        liver_disease: "Paralysis, Uncomplicated Diabetes, Metastatic Cancer",
        peptic_ulcer: "Other Neurological Disorders",
        aids: "(No significant variables)",
        lymphoma: "Congestive Heart Failure, Hypertension, Paralysis, Other Neurological Disorders, Uncomplicated Diabetes, Metastatic Cancer, Solid Tumor without Metastasis, Coagulopathy, Weight Loss, Fluid and Electrolyte Disorders, Psychoses",
        metastatic_cancer: "Congestive Heart Failure, Cardiac Arrhythmias, Valvular Disease, Pulmonary Circulation Disorders, Hypertension, Paralysis, Other Neurological Disorders, Uncomplicated Diabetes, Complicated Diabetes, Liver Disease, Lymphoma, Rheumatoid Arthritis, Coagulopathy, Weight Loss, Fluid and Electrolyte Disorders, Deficiency Anemias, Psychoses",
        solid_tumor: "Valvular Disease, Hypertension, Paralysis, Other Neurological Disorders, Hypothyroidism, Lymphoma, Rheumatoid Arthritis, Fluid and Electrolyte Disorders, Deficiency Anemias, Psychoses",
        rheumatoid_arthritis: "Congestive Heart Failure, Paralysis, Other Neurological Disorders, Hypothyroidism, Renal Failure, Metastatic Cancer, Solid Tumor without Metastasis, Fluid and Electrolyte Disorders, Psychoses",
        coagulopathy: "Paralysis, Other Neurological Disorders, Lymphoma, Metastatic Cancer, Weight Loss, Alcohol Abuse, Depression",
        obesity: "Valvular Disease, Hypertension, Paralysis, Other Neurological Disorders, Chronic Pulmonary, Uncomplicated Diabetes, Hypothyroidism, Rheumatoid Arthritis, Fluid and Electrolyte Disorders, Depression",
        weight_loss: "Congestive Heart Failure, Cardiac Arrhythmias, Valvular Disease, Hypertension, Other Neurological Disorders, Hypothyroidism, Lymphoma, Coagulopathy",
        fluid_electrolyte: "Congestive Heart Failure, Cardiac Arrhythmias, Valvular Disease, Peripheral Vascular Disease, Hypertension, Paralysis, Other Neurological Disorders, Uncomplicated Diabetes, Complicated Diabetes, Hypothyroidism, Lymphoma, Metastatic Cancer, Solid Tumor without Metastasis, Rheumatoid Arthritis, Obesity, Blood Loss Anemia, Deficiency Anemias, Psychoses, Depression",
        blood_loss_anemia: "Other Neurological Disorders, Hypothyroidism, Obesity, Fluid and Electrolyte Disorders, Depression",
        deficiency_anemias: "Other Neurological Disorders, Hypothyroidism, Metastatic Cancer, Solid Tumor without Metastasis, Fluid and Electrolyte Disorders, Depression",
        alcohol_abuse: "Hypertension, Other Neurological Disorders, Chronic Pulmonary",
        drug_abuse: "Cardiac Arrhythmias",
        psychoses: "Congestive Heart Failure, Cardiac Arrhythmias, Paralysis, Other Neurological Disorders, Chronic Pulmonary, Uncomplicated Diabetes, Metastatic Cancer, Solid Tumor without Metastasis, Rheumatoid Arthritis, Fluid and Electrolyte Disorders",
        depression: "Peripheral Vascular Disease, Hypertension, Chronic Pulmonary, Hypothyroidism, Coagulopathy, Obesity, Fluid and Electrolyte Disorders, Blood Loss Anemia, Deficiency Anemias"
        
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
