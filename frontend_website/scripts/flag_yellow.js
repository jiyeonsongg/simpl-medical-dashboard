// JavaScript to explain the medium risk description
function updateNextSteps() {
    // Targeting the span by its ID
    const nextStepsElement = document.getElementById('nextSteps');

    // Define the instructions for medium risk next steps
    const mediumRiskSteps = "According to our machine learning algorithm, this patient has been classified as having a medium risk of developing sepsis, based on an analysis of the patient's vital signs and existing comorbidities. <br><br> Please conduct a thorough review of the patient's medical history, including comorbid conditions and current vital sign metrics, to mitigate the risk of sepsis onset.";

    // Updating the innerHTML of the targeted element with the medium risk steps
    nextStepsElement.innerHTML = mediumRiskSteps;
}

// Attaching the updateNextSteps function to the window's onload event
window.onload = updateNextSteps;
