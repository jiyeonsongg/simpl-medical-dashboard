function updateNextStepsForHighRisk() {
    // Targeting the span by its ID
    const nextStepsElement = document.getElementById('nextSteps');

    // Define the instructions for high risk next steps, incorporating machine learning model details
    const highRiskSteps = "According to our Random Forest Classifier-based machine learning algorithm, this patient has been classified as having a high (red flag) risk of developing sepsis. This classification is based on an analysis of the patient's vital signs (temperature, blood pressure, heart rate, oxygen level, respiratory rate) and existing comorbidities, along with factors such as number of readmissions, hours in the hospital per admission, and age. The predicted SOFA score range for this category is between 0 and 3, inclusive. <br><br> Immediate and consistent attention is required. Please initiate emergency procedures, conduct a comprehensive review of the patient's medical records, and prepare for potential intensive care intervention. This condition demands prompt action to prevent critical outcomes.";

    // Updating the innerHTML of the targeted element with the high risk steps
    nextStepsElement.innerHTML = highRiskSteps;
}
window.onload = updateNextStepsForHighRisk;