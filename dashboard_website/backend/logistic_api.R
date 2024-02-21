# Assuming you have Plumber installed
install.packages("plumber")
library(plumber)

# Define the endpoint
#* @get /run_analysis
function(disease){
  source('../statistical_analysis/02_logistic_regression.R')
  result <- run_comorbidity_analysis(disease, "subgroup_1")
  return(list(likelihood = result$likelihood, subgroup = result$subgroup))
}

# Run the server
pr <- plumb('logistic_api.R')  # The file you just created
pr$run(port=8000)
