document.addEventListener('DOMContentLoaded', function () {
    // clear btn for radio btns
    var clearButton = document.querySelector('.clear-btn');
    var radioButtons = document.querySelectorAll('input[name=gender]');

    clearButton.addEventListener('click', function () {
        radioButtons.forEach(function (radioButton) {
            radioButton.checked = false;
        });
    });


    // send request for prediction
    var submitButton = document.getElementById('submit-btn');
    var nameInput = document.getElementById('name')
    var probOutput = document.getElementById('predicted-probability')
    var genderOutput = document.getElementById('predicted-gender')

    submitButton.addEventListener('click', function () {
        var name = nameInput.value
        var url = 'https://api.genderize.io/?name=' + name;
        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                console.log(data);
                genderOutput.textContent = data.gender;
                probOutput.textContent = data.probability

            })
            .catch(error => {
                console.error('Error:', error);
                // Handle the error (e.g., display an error message to the user)
            });

    })

});