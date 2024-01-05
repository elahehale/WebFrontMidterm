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
    var nameErrorMessageElement = document.getElementById('error-message');

    nameInput.addEventListener('input', function () {
        if (!nameValidate(nameInput.value)) {
            nameErrorMessageElement.style.opacity = 1
            nameInput.classList.add('error');
            enableButtons(false)
        } else {
            nameErrorMessageElement.style.opacity = 0
            nameInput.classList.remove('error');
            enableButtons(true)

        }
    })
    function enableButtons(enability) {
        submitButton.disabled = !enability
        saveButton.disabled = !enability
    }
    function nameValidate(name) {
        var regexPattern = /^[a-zA-Z\s]+$/;
        if (name.trim() === '') {
            nameErrorMessageElement.textContent = 'Name should not be empty'
            return false
        } else {
            if (!regexPattern.test(name)) {
                nameErrorMessageElement.textContent = 'Just use english letters'
                return false
            } else {
                if (name.length > 255) {
                    nameErrorMessageElement.textContent = 'Name should be at most 255 charcters'
                    return false
                } else {
                    return true
                }
            }
        }
    }

    submitButton.addEventListener('click', function () {
        var name = nameInput.value
        var url = 'https://api.genderize.io/?name=' + name;
        clearResults()
        submitButton.innerHTML = '<div class="loader"></div>'
        enableButtons(false)
        fetch(url)
            .then(response => {
                resetButtons()
                if (!response.ok)
                    throw new Error('Network response was not ok');
                return response.json();
            })
            .then(data => {
                resetButtons()
                if (data.gender === null) {
                    showSnackBar('No result for this name from server', 'red')
                    genderOutput.textContent = 'No result for this name from server';
                } else {
                    genderOutput.textContent = data.gender;
                    probOutput.textContent = data.probability;
                }
                showSavedPrediction(nameInput.value)
            })
            .catch(error => {
                resetButtons()
                console.error('Error:', error);
                showSnackBar(error.message, 'red')

            });

    })

    function resetButtons(){
        enableButtons(true)
        submitButton.innerHTML='Submit'
    }
    // save input prediction
    var saveButton = document.getElementById('save-btn');
    saveButton.addEventListener('click', function () {
        var saveValue = null
        radioButtons.forEach(function (radioButton) {
            if (radioButton.checked) {
                saveValue = radioButton.value
            }
        });
        if (saveValue === null) {
            showSnackBar('Choose a gender', 'red')
        } else {

            localStorage.setItem(nameInput.value, saveValue);
            showSnackBar('Name saved successfully', 'black')

        }
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
            answerSection.style.display = 'block'

        } else {
            console.log('Item with key ' + name + ' does not exist in local storage.');
            answerSection.style.display = 'none'

        }
    }

    function clearResults() {
        answerSection.style.display = 'none'
        genderOutput.textContent = null;
        probOutput.textContent = null
    }

    var timer = null
    var snackbar = document.getElementById("snackbar");

    function showSnackBar(text, color) {
        // Add the "show" class to DIV
        snackbar.style.backgroundColor = color
        snackbar.textContent = text
        snackbar.classList.add('show');

        // Hide the snackbar after 3 seconds (adjust as needed)
        setTimeout(function () {
            snackbar.classList.remove('show');
        }, 2000);
    }
});