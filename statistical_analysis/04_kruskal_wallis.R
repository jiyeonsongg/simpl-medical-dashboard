# Compare the characteristics of subgroups
# 2. Kruskal-Wallis Test and Post-Hoc Test

# Load necessary libraries
library(dunn.test)
library(dplyr)

# Step 1: Load the Data
subgroup_list <- lapply(1:8, function(x) read.csv(paste0("C:/Users/jyson/dsc180ab/dsc180b-wi24-quarter2/subgroup_", x, ".csv")))

# Combine all subgroups into one dataframe
combined_data <- do.call(rbind, subgroup_list)

# Step 1: Kruskal-Wallis Test
# Perform the Kruskal-Wallis test to see if there's a significant difference across subgroups
kruskal_test_result <- kruskal.test(severity_score ~ subgroup, data = combined_data)
print(kruskal_test_result)

# Step 2: Post-Hoc Test
# If the Kruskal-Wallis test is significant, perform post-hoc analysis
if(kruskal_test_result$p.value < 0.05){
  post_hoc_result <- dunn.test(combined_data$severity_score, combined_data$subgroup, method = "bonferroni")
  print(post_hoc_result)
} else {
  cat("No significant difference found by the Kruskal-Wallis test. Post-hoc test not required.")
}
