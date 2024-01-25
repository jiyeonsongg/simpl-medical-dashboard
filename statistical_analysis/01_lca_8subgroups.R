# Statistical Analysis: 
# 1. GET THE OPTIMAL SUBGROUP NUMBER (nclass = 6 in the research paper)

install.packages("poLCA")

library(poLCA)

final_table <- read.csv("C:/Users/jyson/dsc180ab/dsc180b-wi24-quarter2/cohort.csv")

final_table$age <- as.factor(final_table$rounded_age)

final_table$admission_type_encoded <- as.factor(final_table$admission_type_encoded)

comorbidity_columns <- c(
  "congestive_heart_failure",
  "cardiac_arrhythmias",
  "valvular_disease",
  "pulmonary_circulation",
  "peripheral_vascular",
  "hypertension",
  "paralysis",
  "other_neurological",
  "chronic_pulmonary",
  "diabetes_uncomplicated",
  "diabetes_complicated",
  "hypothyroidism",
  "renal_failure",
  "liver_disease",
  "peptic_ulcer",
  "aids",
  "lymphoma",
  "metastatic_cancer",
  "solid_tumor",
  "rheumatoid_arthritis",
  "coagulopathy",
  "obesity",
  "weight_loss",
  "fluid_electrolyte",
  "blood_loss_anemia",
  "deficiency_anemias",
  "alcohol_abuse",
  "drug_abuse",
  "psychoses",
  "depression"
)


final_table[comorbidity_columns] <- lapply(
  final_table[comorbidity_columns], as.factor)

lca_formula <- cbind(rounded_age, admission_type_encoded, congestive_heart_failure, 
                     cardiac_arrhythmias, valvular_disease, 
                     pulmonary_circulation,
                     peripheral_vascular, hypertension,
                     paralysis,
                     other_neurological,
                     chronic_pulmonary,
                     diabetes_uncomplicated,
                     diabetes_complicated, 
                     hypothyroidism,
                     renal_failure,
                     liver_disease,
                     peptic_ulcer,
                     aids,
                     lymphoma,
                     metastatic_cancer,
                     solid_tumor,
                     rheumatoid_arthritis,
                     coagulopathy,
                     obesity,
                     weight_loss,
                     fluid_electrolyte,
                     blood_loss_anemia,
                     deficiency_anemias,
                     alcohol_abuse,
                     drug_abuse,
                     psychoses,
                     depression) ~1

# lca_out <- poLCA(lca_formula, data=final_table, nclass=8, graph=FALSE)


# ---------------------------------------------------------------------
# test the optimal number of subgroups (on research paper = 6 subgroups)

# Create a data frame to store AIC and BIC values
comparison_df <- data.frame(nclass = integer(), AIC = numeric(), BIC = numeric())

# Loop through nclass values from 5 to 9
for(nc in 5:12) {
  # Run LCA for each nclass value
  lca_out <- poLCA(lca_formula, data = final_table, nclass = nc, graph = FALSE)
  
  assign(paste("lca_out", nc, sep=""), lca_out)
  
  # Extract AIC and BIC from the summary
  AIC_value <- lca_out$aic
  BIC_value <- lca_out$bic
  
  # Check if AIC and BIC values are available and store them in the data frame
  if (!is.null(AIC_value) && !is.null(BIC_value)) {
    comparison_df <- rbind(comparison_df, data.frame(nclass = nc, AIC = AIC_value, BIC = BIC_value))
  }
}

# Print the comparison data frame
print(comparison_df)


# Optionally, you can also plot the AIC and BIC values for visual comparison
library(ggplot2)
ggplot(comparison_df, aes(x = nclass)) + 
  geom_line(aes(y = AIC, colour = "AIC")) +
  geom_line(aes(y = BIC, colour = "BIC")) +
  labs(title = "AIC and BIC Comparison for Different nclass Values", x = "nclass", y = "Criterion Value") +
  theme_minimal()

# RESULT: seems 8 is an optimal number for nclass

final_table$subgroup <- apply(lca_out8$posterior, 1, which.max) 
subgroup_counts <- table(final_table$subgroup)
print(subgroup_counts)

for (i in 1:8) {
  subgroup_data <- final_table[final_table$subgroup == i, ]
  write.csv(subgroup_data, sprintf("subgroup_%d.csv", i), row.names = FALSE)
}
