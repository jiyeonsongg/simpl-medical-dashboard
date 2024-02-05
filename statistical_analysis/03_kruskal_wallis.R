# Compare the characteristics of subgroups
# 2. Kruskal-Wallis Test and Post-Hoc Test

# The null hypothesis (H0): Median severity scores of the subgroups are equal.
# The alternative hypothesis (H1): not equal; some groups have high median values of severity scores

# Load necessary libraries
library(dunn.test)
library(dplyr)

# Step 1: Load the Data
subgroup_list <- lapply(1:7, function(x) read.csv(paste0("../processed_data/subgroup_", x, ".csv")))

# Combine all subgroups into one dataframe
combined_data <- do.call(rbind, subgroup_list)
sofa_score_data <- read.csv('../processed_data/sofa_scores.csv')

# Left join where we have patient's information and add their SOFA score accordingly
merged_sofa <- merge(combined_data, sofa_score_data, by = "hadm_id", all.x = TRUE)
merged_sofa

# Step 1: Kruskal-Wallis Test
# Perform the Kruskal-Wallis test to see if there's a significant difference across subgroups
kruskal_test_result <- kruskal.test(sofa ~ subgroup, data = merged_sofa)
print(kruskal_test_result)

# Step 2: Post-Hoc Test (for pairwise;familyise comparisons)
# If the Kruskal-Wallis test is significant, perform post-hoc analysis
if(kruskal_test_result$p.value < 0.05){
  post_hoc_result <- dunn.test(merged_sofa$sofa, merged_sofa$subgroup, method = "bonferroni")
  cat("There is a significan difference in the groups according to the median values of the SOFA score. It rejects the Null Hypothesis.")
  print(post_hoc_result)
} else {
  cat("No significant difference found by the Kruskal-Wallis test. Post-hoc test not required.")
}

# ----------------------------------------------------------------------
# p-value of 0: suggests there is a statistically significant difference between
# the median values of the groups tested.
# REJECT THE NULL HYPOTHESIS(the group medians are equal) --> NOT EQUAL!

# Z: standardized test statistics for each comparison
# P: original p-values for these comparison
# P.adjusted: p-values adjusted for multiple comparisons
