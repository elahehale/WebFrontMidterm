 // code inside this function will be executed when the DOM is fully loaded
document.addEventListener('DOMContentLoaded', function () {
    // clear btn for radio btns to set gender
    var clearGenderButton = document.querySelector('.clear-btn');

    // gender selection radio btns
    var radioButtons = document.querySelectorAll('input[name=gender]');

    // btn to send predition request with input name query
    var submitButton = document.getElementById('submit-btn');

    // the text-input field for name
    var nameInput = document.getElementById('name')

    // a text element to show predicted probability by sending request to given url
    var probOutput = document.getElementById('predicted-probability')

    // a text element to show predicted gender by sending request to given url
    var genderOutput = document.getElementById('predicted-gender')

    // a container which shows saved answer 
    var answerSection = document.getElementById('saved-answer-section');

    // a text element under name input field which could show errors of input
    var nameErrorMessageElement = document.getElementById('error-message');

    // a btn which clears client's saved gender for given name
    var clearSavedAnswerButton = document.getElementById('clear-saved-answer-btn');

    // the snackbar element which shows alerts or errors
    var snackbar = document.getElementById("snackbar");

    // a variable to save prediction result from fetch
    var prediction = null

    // gender selection radio btns
    var maleRadio = document.getElementById("male");
    var femaleRadio = document.getElementById("female");

    // add event listener to handle click on radio btns with handleRadioClick function
    maleRadio.addEventListener("click", handleRadioClick);
    femaleRadio.addEventListener("click", handleRadioClick);

    // this functions shows a clear btn for radio btns selection if any radio btn was selected
    function handleRadioClick() {
        if (this.checked) {
            clearGenderButton.classList.remove('btn-hide')
        }
    }

    // clearGenderButton, unchecks all radio btns for selecting gender on click event
    // after clearing the selection, it gets hide
    clearGenderButton.addEventListener('click', function () {
        radioButtons.forEach(function (radioButton) {
            radioButton.checked = false;
            clearGenderButton.classList.add('btn-hide')

        });
    });


    // input event occures when the input of field is changed
    // on each change in input, input gets validated by nameValidate() function
    // if input is invalid, error will be shown and submit and save btns get disabled
    nameInput.addEventListener('input', function () {
        prediction = null
        console.log('input change', prediction)
        if (!nameValidate(nameInput.value)) {
            nameErrorMessageElement.style.opacity = 1
            nameInput.classList.add('input-error');
            enableButtons(false)
        } else {
            nameErrorMessageElement.style.opacity = 0
            nameInput.classList.remove('input-error');
            enableButtons(true)
        }
    })

    // enables or disables submit and save btns
    function enableButtons(enability) {
        submitButton.disabled = !enability
        saveButton.disabled = !enability
    }

    // reset btns templates
    // enables submit and save btns
    // set proper text for submit btn
    function resetButtons() {
        enableButtons(true)
        submitButton.innerHTML = 'Submit'
    }

    // validate given name with 3 constraints
    // constraint 1: checks name to not to be empty
    // constraint 2: checks name only contains a-z and A-Z and space with regex pattern
    // constraint 3: checks name length be lower than 255 characters
    // whenever any constraint is violated, function returns false and sets proper message in input error text
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

    // on click on submitButton, request for predicting gender of input name will be sent
    // step 1: clear previous prediction results
    // step 2: disable submit and save buttons
    // step 3: set submit button to show loading
    // step 4: send request with fetch api
    // if fetch gets response with status code other than ok, snackbar shows error message
    // if fetch get response which has status=ok but the predicted gender is null, snackbar shows error message
    // else the results will be showd in prediction section
    submitButton.addEventListener('click', function () {
        var name = nameInput.value.toLowerCase()
        var url = 'https://api.genderize.io/?name=' + name;
        clearResults()
        enableButtons(false)
        submitButton.innerHTML = '<div class="loader"></div>'
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
                    // set prediction results in page
                    genderOutput.textContent = data.gender;
                    probOutput.textContent = data.probability;
                    // set prediction variable to result gender
                    prediction = data.gender
                    console.log(prediction)
                }
                // show saved prediction for input
                showSavedPrediction(nameInput.value)
            })
            .catch(error => {
                resetButtons()
                showSnackBar(error.message, 'red')

            });

    })



    // btn for saving prediction
    var saveButton = document.getElementById('save-btn');
    // container of a hint for save btn
    var saveHint = document.getElementById('save-hint');

    // show a hint under save btn for what will be saved if no gender is selected
    saveButton.addEventListener('mouseenter', function () {
        var saveValue = null
        radioButtons.forEach(function (radioButton) {
            if (radioButton.checked) {
                saveValue = radioButton.value
            }
        });
        saveHint.style.opacity = 0;
        // if no gender is selected for input and btn is not disabled, show hint which says the prediction will be saved
        if (saveValue === null && !saveButton.disabled) {
            saveHint.style.opacity = 1;
        }

    });

    saveButton.addEventListener('mouseleave', function () {
        // Hide the hint when the mouse leaves the saveButton
        saveHint.style.opacity = 0;
    });


    // saveButton on click, saves selected gender for name in input field
    // constraint 1: name input should not be empty string
    saveButton.addEventListener('click', function () {
        var saveValue = null
        radioButtons.forEach(function (radioButton) {
            if (radioButton.checked) {
                saveValue = radioButton.value
            }
        });
        // if no gender is selected and no prediction has made yet for this input, shows error
        if (saveValue === null && prediction === null) {
            showSnackBar('Choose or predict gender for this input first!', 'red')
        } else {
            if (saveValue != null){
                localStorage.setItem(nameInput.value.toLowerCase(), saveValue);
            }
            else{
                localStorage.setItem(nameInput.value.toLowerCase(), prediction);
            }
            showSnackBar('Name saved successfully', 'black')
            showSavedPrediction(nameInput.value)
            if (prediction === null)
                clearPredictionResult()

        }
    })
    // empty prediction results in page
    function clearPredictionResult(){
        genderOutput.textContent = '';
        probOutput.textContent = '';
    }
    // clearSavedAnswerButton on click, removes the name in input field from local storage
    clearSavedAnswerButton.addEventListener('click', function () {
        localStorage.removeItem(nameInput.value.toLowerCase());
        showSavedPrediction(nameInput.value)
    })

    // this function shows saved gender for given name
    // at first it gets value of given name(its a key in local storage)
    // if name is not in local storage the value will be null so answerSection will not be showed
    // if value is not null, we set result text to value and make answerSection visible
    function showSavedPrediction(name) {
        var item = localStorage.getItem(name.toLowerCase());
        if (item !== null) {
            // a text element which shows gender of given name and its in answerSection
            var savedValue = document.getElementById('saved-gender');
            savedValue.textContent = item
            answerSection.style.display = 'block'
        } else {
            answerSection.style.display = 'none'
        }
    }


    // empty prediction results
    // hide saved answer section
    function clearResults() {
        answerSection.style.display = 'none'
        genderOutput.textContent = null;
        probOutput.textContent = null
    }

    // this function shows snackbar with given text and color
    // the color is set as background-color of snackbar
    // snackbar will disapear after 2 secs
    // "show" class changes the opacity of snackbar to 1 so snackbar becomes visible
    function showSnackBar(text, color) {
        snackbar.style.backgroundColor = color
        snackbar.textContent = text
        snackbar.classList.add('show');

        setTimeout(function () {
            snackbar.classList.remove('show');
        }, 2000);
    }
});