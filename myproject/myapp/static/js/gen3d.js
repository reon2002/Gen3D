document.addEventListener('DOMContentLoaded', function () {
    var helpButton = document.getElementById('helpButton');
    var offcanvas = document.getElementById('offcanvas');
    var closeButton = document.getElementById('closeButton');
    var closeButtonInside = document.getElementById('closeButtonInside');

    helpButton.addEventListener('click', function () {
        offcanvas.classList.add('active');
    });

    closeButtonInside.addEventListener('click', function () {
        offcanvas.classList.remove('active');
    });

    document.addEventListener('click', function (event) {
        if (!offcanvas.contains(event.target) && event.target !== helpButton) {
            offcanvas.classList.remove('active');
        }
    });
});
