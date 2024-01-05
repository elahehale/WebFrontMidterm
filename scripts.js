document.addEventListener('DOMContentLoaded', function () {
    var clearButton = document.querySelector('.clear-btn');
    var radioButtons = document.querySelectorAll('input[name=gender]');

    clearButton.addEventListener('click', function () {
        radioButtons.forEach(function (radioButton) {
            radioButton.checked = false;
        });
    });
});