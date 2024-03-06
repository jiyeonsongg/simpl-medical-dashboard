# Statistical Analysis: 
# 1. GET THE OPTIMAL SUBGROUP NUMBER (nclass = 6 in the research paper)

install.packages("poLCA")

library(poLCA)

final_table <- read.csv("../processed_data/cohort_selected.csv")

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

lca_out <- poLCA(lca_formula, data=final_table, nclass=7, graph=FALSE)

# Assuming lca_out is your fitted LCA model with the optimal number of classes
# Calculate the maximum posterior probability for each patient
final_table$max_post_prob <- apply(lca_out$posterior, 1, max)

# Calculate the second highest probability to assess ambiguity
second_max_post_prob <- apply(lca_out$posterior, 1, function(x) sort(x, decreasing = TRUE)[2])
final_table$second_max_post_prob <- second_max_post_prob

# Calculate the difference between the highest and second highest probabilities
final_table$prob_diff <- final_table$max_post_prob - final_table$second_max_post_prob

# You can decide on a threshold for what constitutes 'certain' classification
# For example, if you want the max probability to be at least 0.7 to consider a classification certain
final_table$certainty_classification <- ifelse(final_table$max_post_prob >= 0.7, "Certain", "Uncertain")

# Review the distribution of the maximum posterior probabilities
summary(final_table$max_post_prob)
hist(final_table$max_post_prob, main = "Distribution of Maximum Posterior Probabilities", xlab = "Probability")

# Review the distribution of the differences to assess how distinct the classifications are
hist(final_table$prob_diff, main = "Distribution of Probability Differences", xlab = "Probability Difference")

# You might want to look at cases with high ambiguity specifically
ambiguous_cases <- final_table[final_table$prob_diff < 0.2, ]  # Adjust the threshold as needed

# Print or save the results for review
print(summary(final_table$certainty_classification))
# write.csv(ambiguous_cases, "ambiguous_cases.csv", row.names = FALSE)


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

# RESULT: seems 7 is an optimal number for nclass
final_table$subgroup <- apply(lca_out7$posterior, 1, which.max) 
subgroup_counts <- table(final_table$subgroup)
print(subgroup_counts)

# # Export CSV files
# for (i in 1:7) {
#   subgroup_data <- final_table[final_table$subgroup == i, ]
#   write.csv(subgroup_data, sprintf("subgroup_%d.csv", i), row.names = FALSE)
# }

# ------------------------------------------------------------------------------
# Run chi-square test for assessing preferred heterogeneity of morbidity within classes (categorical variables)
latent_class_memberships <- lca_out$predclass
significant_p_values <- TRUE 

# Loops through each variable (morbidity) and perform chi-square tests
for (variable in comorbidity_columns) {
  contingency_table <- table(final_table[[variable]], latent_class_memberships)
  
  # Checks if there are cells with expected frequency < 5
  if (any(chisq.test(contingency_table)$expected < 5)) {
    # Performs chi-square test with simulated p-value for small expected frequencies
    chi_square_result <- chisq.test(contingency_table, simulate.p.value = TRUE, B = 1000)
  } else {
    # Performs chi-square test
    chi_square_result <- chisq.test(contingency_table)
  }
  
  # Checks if the p-value is significant
  if (chi_square_result$p.value >= 0.05) {
    significant_p_values <- FALSE
    break  # No need to continue checking if any p-value is not significant
  }
}

# Outputs statement based on the result
if (significant_p_values) {
  cat("All p-values are significant (less than 0.05)\nThere is sufficient evidence to conclude all associations between each latent class and morbidity are significant")
} else {
  cat("Not all p-values are significant (greater than or equal to 0.05)\n")
}