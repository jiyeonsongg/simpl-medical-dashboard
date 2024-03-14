function updateNextStepsForLowRisk() {
    // Targeting the span by its ID
    const nextStepsElement = document.getElementById('nextSteps');

    // Define the instructions for low risk next steps, incorporating machine learning model details
    const lowRiskSteps = "According to our Random Forest Classifier-based machine learning algorithm, this patient has been classified as having a low (green flag) risk of developing sepsis. This classification is based on an analysis of the patient's vital signs (temperature, blood pressure, heart rate, oxygen level, respiratory rate) and existing comorbidities, along with factors such as number of readmissions, hours in the hospital per admission, and age. The predicted SOFA score range for this category is between 7 and 10, inclusive. <br><br> The patient currently appears to be stable, but continuous observation is recommended. Please ensure regular monitoring of vital signs and reassess the patient's condition periodically to detect any unforeseen changes or deterioration.";

    // Updating the innerHTML of the targeted element with the low risk steps
    nextStepsElement.innerHTML = lowRiskSteps;
}
window.onload = updateNextStepsForLowRisk;