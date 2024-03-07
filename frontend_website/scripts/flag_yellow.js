function updateNextStepsForMediumRisk() {
    // Targeting the span by its ID
    const nextStepsElement = document.getElementById('nextSteps');

    // Define the instructions for medium risk next steps, incorporating machine learning model details
    const mediumRiskSteps = "According to our Random Forest Classifier-based machine learning algorithm, this patient has been classified as having a medium (yellow flag) risk of developing sepsis. This classification is based on an analysis of the patient's vital signs (temperature, blood pressure, heart rate, oxygen level, respiratory rate) and existing comorbidities, along with other factors such as number of readmissions, hours in the hospital per admission, and age. The predicted SOFA score range for this category is between 4 and 6, inclusive. <br><br> Please conduct a thorough review of the patient's medical history, including comorbidity conditions and current vital sign metrics, to mitigate the risk of sepsis onset. Regular monitoring and potential intervention may be required. It is important to note that our model's accuracy ranges from 60 to 70% per subgroup, which underscores the need for clinical judgment in conjunction with the algorithm's predictions.";

    // Updating the innerHTML of the targeted element with the medium risk steps
    nextStepsElement.innerHTML = mediumRiskSteps;
}

// Attaching the updateNextStepsForMediumRisk function to the window's onload event
window.onload = updateNextStepsForMediumRisk;
