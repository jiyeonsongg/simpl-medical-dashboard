document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById('disease-select');
    const resultDisplay = document.getElementById('result-display');
    const analysisResult = document.getElementById('analysis-result');
    const analysisInfo = document.getElementById('analysis-info');

    selectElement.addEventListener('change', function() {
        const disease = this.value;
        if (disease) {
            fetch(`http://localhost:8000/run_analysis?disease=${disease}`)
                .then(response => response.json())
                .then(data => {
                    analysisResult.textContent = `Likelihood: ${data.likelihood}%`;
                    resultDisplay.classList.remove('hidden');
                    analysisInfo.textContent = `Our automated analysis is ${data.likelihood}% confident this patient belongs in the ${data.subgroup} subgroup. This is taken into account for our sepsis risk analysis.`;
                    analysisInfo.classList.remove('hidden');
                })
                .catch(error => {
                    console.error('Error:', error);
                });
        }
    });
});
