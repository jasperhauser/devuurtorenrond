// Description: This script is used to open images in a modal when clicked on, and to display a carousel of images when the modal is open.

// insert a div with class modal at start of body
var modal = document.createElement('dialog');
document.body.insertBefore(modal, document.body.firstChild);
modal.classList.add('modal');

// create a button to close the modal
var modalClose = document.createElement('button');
modalClose.classList.add('button','modal-close');
// add a title to the button
modalClose.setAttribute('title', 'Close Image Viewer');
modal.appendChild(modalClose);
// and text inside the button for accessibility
var modalCloseSpan = document.createElement('span');
modalClose.appendChild(modalCloseSpan);
var closeText = document.createTextNode("Close");
modalCloseSpan.appendChild(closeText);

// next button
var nextButton = document.createElement('button');
nextButton.classList.add('button','next');
nextButton.setAttribute('title', 'Next Image');
modal.appendChild(nextButton);
// and text inside the button for accessibility
var nextButtonSpan = document.createElement('span');
nextButton.appendChild(nextButtonSpan);
var nextText = document.createTextNode("Next");
nextButtonSpan.appendChild(nextText);

// previous button
const previousButton = document.createElement('button');
previousButton.classList.add('button','previous');
previousButton.setAttribute('title', 'Previous Image');
modal.appendChild(previousButton);
// and text inside the button for accessibility
var previousButtonSpan = document.createElement('span');
previousButton.appendChild(previousButtonSpan);
var previousText = document.createTextNode("Previous");
previousButtonSpan.appendChild(previousText);

// insert a div with class fullscreen
const fullscreen = document.createElement('button');
fullscreen.classList.add('button','fullscreen');
fullscreen.setAttribute('title', 'Show Image Fullscreen');
modal.appendChild(fullscreen);
// and text inside the button for accessibility
var fullscreenSpan = document.createElement('span');
fullscreen.appendChild(fullscreenSpan);
var fullscreenText = document.createTextNode("Fullscreen");
fullscreenSpan.appendChild(fullscreenText);

// get all figures on the page
const figures = document.querySelectorAll('article figure');

// insert a div in the modal for the carousel
const carousel = document.createElement('div');
carousel.classList.add('carousel');
modal.appendChild(carousel);

// add an id to each figure
var figureNumber = 0;
var activeFigure = 0;

// loop through all figure and add each into a new div in the carousel
for (let i = 0; i < figures.length; i++) {
    
    // add an unique id to each figure
    const figure = figures[i];
    figureNumber++;
    figure.setAttribute('id', + figureNumber);

    // prepend the figureNumber to the caption
    const caption = figure.querySelector('figcaption');
    const captionText = caption.innerHTML;
    caption.innerHTML = figureNumber + '. ' + captionText;
    
    // setup the carousel items
    const carouselItem = document.createElement('div');
    carouselItem.classList.add('carousel-item');
    // add an id to each carousel item to match the figure id
    carouselItem.setAttribute('id', 'carousel-' + figureNumber);
    // add the figure to the carousel
    carousel.appendChild(carouselItem);
    // clone the figure so it can be added to the modal
    carouselItem.appendChild(figure.cloneNode(true));

    // listen for click on each figure
    figure.addEventListener('click', function() {
        // open the modal
        modal.showModal();
        // prevent scrolling on body while modal is open
        document.querySelector("body").style.overflow = "hidden";
        // wait 0.2 seconds then add class modal-open to animate the modal
        setTimeout(() => {
            modal.classList.add('modal-open');
        }, 50);

        // get the id of the figure that was clicked
        const figureId = figure.getAttribute('id');
        activeFigure = figureId;

        // scroll the carousel to the figure that was clicked
        const carouselItem = document.getElementById('carousel-' + figureId);
        carouselItem.scrollIntoView({block: "center", inline: "center"});
    });
}

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
}, {passive: true} );

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
            // get activeFigure id and subtract 1 from it
            var previousFigure = parseInt(activeFigure) - 1;

            // if the previous figure is less than 1, set it to the number of figures
            if (previousFigure < 1) {
                previousFigure = figureNumber;
            }
            // scroll the carousel to the previous figure
            const previousCarouselItem = document.getElementById('carousel-' + previousFigure);
            previousCarouselItem.scrollIntoView({block: "center", inline: "center"});
            // set the active figure
            activeFigure = previousFigure;

        } else if (e.key === 'ArrowRight') {
            // get activeFigure id and add 1 to it
            var nextFigure = parseInt(activeFigure) + 1;

            // if the next figure is greater than the number of figures, set it to 1
            if (nextFigure > figureNumber) {
                nextFigure = 1;
            }
            // scroll the carousel to the next figure
            const nextCarouselItem = document.getElementById('carousel-' + nextFigure);
            nextCarouselItem.scrollIntoView({block: "center", inline: "center"});
            // set the active figure
            activeFigure = nextFigure;
        }
    }
}, {passive: true} );

// create a previous button click even listener, pass on the passive flag to the event listener options
previousButton.addEventListener('click', () => {
    var arrowRight = new KeyboardEvent('keydown', {
        key: 'ArrowLeft'
    });
    document.dispatchEvent(arrowRight);
}, {passive: true} );
// next button
nextButton.addEventListener('click',  () => {
    var arrowRight = new KeyboardEvent('keydown', {
        key: 'ArrowRight'
    });
    document.dispatchEvent(arrowRight);
}, {passive: true} );

// close modal when clicked
modalClose.addEventListener('click', () => {
    closeModal();
});

// close modal when clicked in the background not the figure
modal.addEventListener('click', (e) => {
    if (e.target.classList.contains('carousel-item')) {
        closeModal();
    }
}); 

// close modal when escape key is pressed
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
    }
});

// listen to scroll events on the carousel
carousel.addEventListener('scroll', (e) => {
    // get the id of the figure that is in the center of the carousel
    var visibleFigure = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2).parentNode.parentNode.getAttribute('id');
    activeFigure = visibleFigure;
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
    } else if (touchendX < touchstartX && touchendY - touchstartY < slop && touchendY - touchstartY > -slop) {
        // swiped left
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
}, {passive: true} );
modal.addEventListener('touchend', e => {
    touchendY = e.changedTouches[0].screenY
    touchendX = e.changedTouches[0].screenX
    checkDirection()
}, {passive: true} );


// manage the closing of the modal
function closeModal() {
    if (modal.classList.contains('modal-open')) {

        // reset the body overflow to auto, so we can scroll again
        document.querySelector("body").style.overflow = "auto";

        // scroll to the figure in the article with the id of the active figure in the modal
        var figureToScrollTo = document.querySelector('article figure[id="' + activeFigure + '"]');

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