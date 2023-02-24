
// Description: This script is used to open images in a modal when clicked on

// insert a div with class modal at start of body
var modal = document.createElement('dialog');
document.body.insertBefore(modal, document.body.firstChild);
modal.classList.add('modal');

// create a button to close the modal
const modalClose = document.createElement('button');
modalClose.classList.add('button','modal-close');
modal.appendChild(modalClose);

// insert a div with class fullscreen
const fullscreen = document.createElement('button');
fullscreen.classList.add('button','fullscreen');
modal.appendChild(fullscreen);

// insert two divs for a previous and next button
const previousButton = document.createElement('button');
previousButton.classList.add('button','previous');
modal.appendChild(previousButton);
const nextButton = document.createElement('button');
nextButton.classList.add('button','next');
modal.appendChild(nextButton);

// get all figures on the page
const figures = document.querySelectorAll('figure');

// add an id to each figure
var figureNumber = 0;

// open the modal when a figure is clicked
figures.forEach(figure => {
    // add an numerical id to each figure, start with 0 and increment by 1 for each figure
    figureNumber++;
    figure.id = figureNumber;

    // listen for click on figure
    figure.addEventListener('click', () => {
        // clone the figure inside the modal
        var figureClone = figure.cloneNode(true);
        modal.appendChild(figureClone);
        
        // prepend the figure.id to the figure figcaption
        var figureCaption = figureClone.querySelector('figcaption');
        figureCaption.textContent = figure.id + '. ' + figureCaption.textContent;

        // set style display to block to show modal
        modal.showModal();

        // prevent scrolling on body while modal is open
        document.querySelector("body").style.overflow = "hidden";
        // wait 0.2 seconds then add class modal-open to animate the modal
        setTimeout(() => {
            modal.classList.add('modal-open');
        }, 50);
    });
});

// when clicked on the fullscreen element, fullscreen the modal
fullscreen.addEventListener('click', () => {

    // if the fullscreen element is clicked, open the modal in fullscreen
    if (modal.requestFullscreen) {
        modal.requestFullscreen();
        modal.classList.add('fullscreen-open');
    } else if (modal.webkitRequestFullscreen) { /* Safari */
        modal.webkitRequestFullscreen();
        modal.classList.add('fullscreen-open');
    } else if (modal.mozRequestFullScreen) { /* Firefox */
        modal.mozRequestFullScreen();
        modal.classList.add('fullscreen-open');
    } else if (modal.msRequestFullscreen) { /* IE11 */
        modal.msRequestFullscreen();
        modal.classList.add('fullscreen-open');
    }
    // close fullscreen if the modal is already fullscreen
    closeFullscreen();
});

function closeFullscreen () {
    // if the modal is already fullscreen, exit fullscreen
    if (document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement) {
        if (document.exitFullscreen) {
            document.exitFullscreen();
            modal.classList.remove('fullscreen-open');
        } else if (document.webkitExitFullscreen) { /* Safari */
            document.webkitExitFullscreen();
            modal.classList.remove('fullscreen-open');
        } else if (document.mozCancelFullScreen) { /* Firefox */
            document.mozCancelFullScreen();
            modal.classList.remove('fullscreen-open'); 
        } else if (document.msExitFullscreen) { /* IE11 */
            document.msExitFullscreen();
            modal.classList.remove('fullscreen-open');
        }
        return;
    }
}

// use the arrow keys to navigate between images
document.addEventListener('keydown', (e) => {
    var figure = document.querySelector('.modal figure');
    if (modal.classList.contains('modal-open')) {
        if (e.key === 'ArrowLeft') {;
            // get the previous figure
            var previousFigure = document.getElementById(figure.id - 1);
            // clone the previous figure
            if (previousFigure === null){
                
                // we are at the first figure, let's loop around and show the last figure
                // let's loop around and show the last figure

                // remove the current figure present in the modal
                figure.remove();
                // clone the last figure
                var lastFigure = document.getElementById(figureNumber);
                var lastFigureClone = lastFigure.cloneNode(true);
                // insert the last figure clone into the modal
                modal.appendChild(lastFigureClone);

                // prepend the previousFigure.id to the previousFigure figcaption
                var previousFigureCaption = lastFigureClone.querySelector('figcaption');
                previousFigureCaption.textContent = lastFigure.id + '. ' + previousFigureCaption.textContent;

            } else {
                // remove the current figure present in the modal
                figure.remove();
                var previousFigureClone = previousFigure.cloneNode(true);
                // insert the previous figure clone into the modal 
                modal.appendChild(  previousFigureClone);
                
                // prepend the previousFigure.id to the previousFigure figcaption
                var previousFigureCaption = previousFigureClone.querySelector('figcaption');
                previousFigureCaption.textContent = previousFigure.id + '. ' + previousFigureCaption.textContent;
            }
        } else if (e.key === 'ArrowRight') {
            // get the next figure
            var nextFigure = document.getElementById(parseInt(figure.id) + 1);
            if (nextFigure === null){
                
                // we have reached the end of the figures, let's loop around and show the first figure
                
                // remove the current figure present in the modal
                figure.remove();
                // clone the first figure
                var firstFigure = document.getElementById(1);
                var firstFigureClone = firstFigure.cloneNode(true);
                // insert the first figure clone into the modal
                modal.appendChild(firstFigureClone);

                // prepend the nextFigure.id to the nextFigure figcaption
                var nextFigureCaption = firstFigureClone.querySelector('figcaption');
                nextFigureCaption.textContent = firstFigure.id + '. ' + nextFigureCaption.textContent;

            } else {
                // remove the current figure present in the modal
                figure.remove();
                // clone the next figure
                var nextFigureClone = nextFigure.cloneNode(true);
                // insert the next figure clone into the modal
                modal.appendChild(nextFigureClone);
                
                // prepend the nextFigure.id to the nextFigure figcaption
                var nextFigureCaption = nextFigureClone.querySelector('figcaption');
                nextFigureCaption.textContent = nextFigure.id + '. ' + nextFigureCaption.textContent;
            }
        }
    }
});

// previous button
previousButton.addEventListener('click', () => {
    var arrowRight = new KeyboardEvent('keydown', {
        key: 'ArrowLeft'
    });
    document.dispatchEvent(arrowRight);
});
// next button
nextButton.addEventListener('click', () => {
    var arrowRight = new KeyboardEvent('keydown', {
        key: 'ArrowRight'
    });
    document.dispatchEvent(arrowRight);
});


// close modal when clicked
modalClose.addEventListener('click', () => {
    closeModal();
});

// close modal when clicked in the background not the figure
modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal();
    }
}); 

// close modal when escape key is pressed
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// close modal when swiped down
let touchstartY = 0
let touchendY = 0
let touchstartX = 0
let touchendX = 0

function checkDirection() {
    // if touchendY is greater than touchstartY, and is more than 10, the user swiped down
    var slop = 60
    
    if (touchendX > touchstartX  && touchendY - touchstartY < slop && touchendY - touchstartY > -slop) {
        // swiped right
        // fire the next arrow left keydown event
        var arrowRight = new KeyboardEvent('keydown', {
            key: 'ArrowLeft'
        });
        document.dispatchEvent(arrowRight);
    } else if (touchendX < touchstartX && touchendY - touchstartY < slop && touchendY - touchstartY > -slop) {
        // swiped left
        // fire the next arrow right keydown event
        var arrowRight = new KeyboardEvent('keydown', {
            key: 'ArrowRight'
        });
        document.dispatchEvent(arrowRight);
    } else if (touchendY > touchstartY) {
        // swiped down
        closeModal();
    } else if (touchendY < touchstartY) {
        // swiped up
        closeModal();
    } 
};

// listen for touch events on the modal
modal.addEventListener('touchstart', e => {
    touchstartY = e.changedTouches[0].screenY
    touchstartX = e.changedTouches[0].screenX
});
modal.addEventListener('touchend', e => {
    touchendY = e.changedTouches[0].screenY
    touchendX = e.changedTouches[0].screenX
    checkDirection()
});

// manage the closing of the modal
// close modal function
function closeModal() {
    if (modal.classList.contains('modal-open')) {

        // reset the body overflow to auto, so we can scroll again
        document.querySelector("body").style.overflow = "auto";

        // get the id of the last figure in the modal
        var lastFigure = document.querySelector('.modal figure');
        var lastFigureId = lastFigure.id;

        // remove the figure from the modal
        lastFigure.remove();

        // scroll to the figure with the id of the last figure in the modal
        var figureToScrollTo = document.getElementById(lastFigureId);

        // scroll to the figure such that it's centered in the viewport
        var figureFromTop = figureToScrollTo.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2) + (figureToScrollTo.offsetHeight / 2);
        window.scrollTo({
            top: figureFromTop,
            behavior: 'auto'
        });

        // close the modal
        modal.classList.remove('modal-open');
        modal.close();
        
        // exit native fullscreen if it is enabled
        closeFullscreen();
        
        // remove the fullscreen-open class from the modal
        if (modal.classList.contains('fullscreen-open')) {
            modal.classList.remove('fullscreen-open');
        }
    }
};