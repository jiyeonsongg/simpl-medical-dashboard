# Compare the characteristics of subgroups
# 1.Logistic Regression

library(dplyr)

# Step 1: Load the Data
subgroup_list <- lapply(1:7, function(x) read.csv(paste0("../processed_data/subgroup_", x, ".csv")))

# Combine all subgroups into one dataframe
combined_data <- do.call(rbind, subgroup_list)

# Define the function
run_comorbidity_analysis <- function(comorbidity, data) {
  results <- list()
  
  for (i in 1:7) {
    subgroup_data <- data[data$subgroup == i, ]
    
    # Define the formula
    formula <- as.formula(paste(comorbidity, "~ age + admission_type_encoded + subgroup +", 
                                paste(setdiff(comorbidity_columns, comorbidity), collapse = " + ")))
    
    # Run logistic regression
    model <- glm(formula, family = binomial(), data = subgroup_data)
    
    # Store the summary of the model
    results[[paste("Subgroup", i)]] <- summary(model)
  }
  
  return(results)
}



# ---------------------------------------------------------------------------------------------------

# Example of using the function

results_congestive_heart_failure <- run_comorbidity_analysis("congestive_heart_failure", subgroup_list)
results_congestive_heart_failure

results_depression <- run_comorbidity_analysis("depression", combined_data)
results_depression





























# Step 2: Prepare the Data
# Ensure that the comorbidity variables are in the correct format
comorbidity_columns <- c(
  "congestive_heart_failure", "cardiac_arrhythmias", "valvular_disease",
  "pulmonary_circulation", "peripheral_vascular", "hypertension",
  "paralysis", "other_neurological", "chronic_pulmonary",
  "diabetes_uncomplicated", "diabetes_complicated", "hypothyroidism",
  "renal_failure", "liver_disease", "peptic_ulcer", "aids",
  "lymphoma", "metastatic_cancer", "solid_tumor", "rheumatoid_arthritis",
  "coagulopathy", "obesity", "weight_loss", "fluid_electrolyte",
  "blood_loss_anemia", "deficiency_anemias", "alcohol_abuse",
  "drug_abuse", "psychoses", "depression"
)

# Step 3: Run Logistic Regression
# Example: Logistic regression for 'congestive_heart_failure' as the dependent variable
model <- glm(congestive_heart_failure ~ age + admission_type_encoded + subgroup + 
               cardiac_arrhythmias + valvular_disease + pulmonary_circulation + 
               peripheral_vascular + hypertension + paralysis + other_neurological + 
               chronic_pulmonary + diabetes_uncomplicated + diabetes_complicated + 
               hypothyroidism + renal_failure + liver_disease + peptic_ulcer + aids + 
               lymphoma + metastatic_cancer + solid_tumor + rheumatoid_arthritis + 
               coagulopathy + obesity + weight_loss + fluid_electrolyte + 
               blood_loss_anemia + deficiency_anemias + alcohol_abuse + 
               drug_abuse + psychoses + depression, 
             family = binomial(), data = combined_data)

# Step 4: Analyze the Results
summary(model)