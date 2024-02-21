document.addEventListener('DOMContentLoaded', function() {
    const selectElement = document.getElementById('disease-select');

    selectElement.addEventListener('change', function() {
        const disease = this.value;
        if(disease) {
            fetch('http://localhost:8000/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({comorbidity: disease}),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Success:', data);
            })
            .catch((error) => {
                console.error('Error:', error);
            });
        }
    });
});
