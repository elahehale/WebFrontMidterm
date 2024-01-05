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
    var answerSection = document.getElementById('saved-answer-section');

    submitButton.addEventListener('click', function () {
        var name = nameInput.value
        var url = 'https://api.genderize.io/?name=' + name;
        clearResults()
        fetch(url)
            .then(response => {
                if (!response.ok)
                    throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                console.log(data);
                genderOutput.textContent = data.gender;
                probOutput.textContent = data.probability
                showSavedPrediction(nameInput.value)
            })
            .catch(error => {
                console.error('Error:', error);
            });

    })


    // save input prediction
    var saveButton = document.getElementById('save-btn');
    saveButton.addEventListener('click', function () {
        var saveValue = ""
        radioButtons.forEach(function (radioButton) {
            if (radioButton.checked) {
                saveValue = radioButton.value
            }
        });
        localStorage.setItem(nameInput.value, saveValue);
    })

    var clearSavedAnswerButton = document.getElementById('clear-saved-answer-btn');
    clearSavedAnswerButton.addEventListener('click', function () {
        localStorage.removeItem(nameInput.value);
        showSavedPrediction()
    })


    function showSavedPrediction(name) {
        var item = localStorage.getItem(name);
        console.log(name)
        if (item !== null) {
            var savedValue = document.getElementById('saved-gender');
            savedValue.textContent = item
            answerSection.style.display='block'

        } else {
            console.log('Item with key ' + name + ' does not exist in local storage.');
            answerSection.style.display='none'

        }
    }

    function clearResults(){
        answerSection.style.display='none'
        genderOutput.textContent = null;
        probOutput.textContent = null
    }
});