// Description: This script is used to open images in a dialog when clicked on, 
// and to display a carousel of images when the dialog is open.

// insert a div with class dialog at start of body
var dialog = document.createElement('dialog');
document.body.insertBefore(dialog, document.body.firstChild);

// create a button to close the dialog
var dialogClose = document.createElement('button');
dialogClose.classList.add('button','close');
// add a title to the button
dialogClose.setAttribute('title', 'Close Image Viewer');
dialog.appendChild(dialogClose);
// and text inside the button for accessibility
var dialogCloseSpan = document.createElement('span');
dialogClose.appendChild(dialogCloseSpan);
var closeText = document.createTextNode("Close");
dialogCloseSpan.appendChild(closeText);

// next button
var nextButton = document.createElement('button');
nextButton.classList.add('button','next');
nextButton.setAttribute('title', 'Next Image');
dialog.appendChild(nextButton);
// and text inside the button for accessibility
var nextButtonSpan = document.createElement('span');
nextButton.appendChild(nextButtonSpan);
var nextText = document.createTextNode("Next");
nextButtonSpan.appendChild(nextText);

// previous button
const previousButton = document.createElement('button');
previousButton.classList.add('button','previous');
previousButton.setAttribute('title', 'Previous Image');
dialog.appendChild(previousButton);
// and text inside the button for accessibility
var previousButtonSpan = document.createElement('span');
previousButton.appendChild(previousButtonSpan);
var previousText = document.createTextNode("Previous");
previousButtonSpan.appendChild(previousText);

// get all figures on the page
const figures = document.querySelectorAll('article figure');

// insert a div in the dialog for the carousel
const carousel = document.createElement('div');
carousel.classList.add('carousel');
dialog.appendChild(carousel);

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
    carousel.appendChild(carouselItem);
    carouselItem.appendChild(figure.cloneNode(true));

    // listen for click on each figure top open the dialog
    figure.addEventListener('click', function() {
        // open the dialog
        dialog.showModal();
        // prevent scrolling on body while dialog is open
        document.querySelector("body").style.overflow = "hidden";
        // wait 0.2 seconds then add class dialog-open to animate the dialog
        setTimeout(() => {
            dialog.classList.add('open');
        }, 50);

        // get the id of the figure that was clicked
        const figureId = figure.getAttribute('id');
        activeFigure = figureId;

        // scroll the carousel to the figure that was clicked
        const carouselItem = document.getElementById('carousel-' + figureId);
        carouselItem.scrollIntoView({block: "center", inline: "center"});
        
    });
}

// listen for a click on each img within each carousel item
const carouselItems = document.querySelectorAll('.carousel-item');
for (let i = 0; i < carouselItems.length; i++) {
    const carouselItem = carouselItems[i];
    const img = carouselItem.querySelector('figure');
    img.addEventListener('click', function() {
        // console.log('image clicked');
        // increase the size of the image
        if (img.classList.contains('large')) {
            img.classList.remove('large');
            // console.log('make image normal size');
        } else {
            img.classList.add('large');
            // console.log('make image large size');
        }
    });
}

// use the arrow keys to navigate between images
document.addEventListener('keydown', (e) => {
    if (dialog.classList.contains('open')) {
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

// listen to scroll events on the carousel
carousel.addEventListener('scroll', (e) => {
    updateActiveFigure()
});

function updateActiveFigure() {
    // get the id of the figure that is in the center of the carousel
    var visibleFigure = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2).parentNode.parentNode.getAttribute('id');
    activeFigure = visibleFigure;
}

// scroll to the figure in the article
function scrollToArticleFigure() {
    // get the id of the figure that is in the center of the carousel
    updateActiveFigure();

    // scroll to the figure in the article with the id of the active figure in the dialog
    var figureToScrollTo = document.querySelector('article figure[id="' + activeFigure + '"]');

    // scroll to the figure such that it's centered in the viewport
    var figureFromTop = figureToScrollTo.getBoundingClientRect().top + window.scrollY - (window.innerHeight / 2) + (figureToScrollTo.offsetHeight / 2);
    window.scrollTo({
        top: figureFromTop,
        behavior: 'auto'
    });
}

// close dialog when close button is clicked
dialogClose.addEventListener('click', () => {
    closeDialog();
});

// close dialog when clicked in the background not the figure
dialog.addEventListener('click', (e) => {
    if (e.target.classList.contains('carousel-item')) {
        closeDialog();
    }
}); 

// close dialog when escape key is pressed
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeDialog();
    }
});

// close dialog when swiped down
let touchstartY = 0
let touchendY = 0
let touchstartX = 0
let touchendX = 0
var slop = 60

function checkDirection() {
    if (touchendY > touchstartY && touchendX - touchstartX < slop && touchendX - touchstartX > -slop) {
        // swiped down
        closeDialog();
    } else if (touchendY < touchstartY && touchendX - touchstartX < slop && touchendX - touchstartX > -slop) {
        // swiped up
        closeDialog();
    } 
};

// listen for touch events on the dialog
dialog.addEventListener('touchstart', e => {
    touchstartY = e.changedTouches[0].screenY
    touchstartX = e.changedTouches[0].screenX
}, {passive: true} );
dialog.addEventListener('touchend', e => {
    touchendY = e.changedTouches[0].screenY
    touchendX = e.changedTouches[0].screenX
    checkDirection()
}, {passive: true} );


// manage the closing of the dialog
function closeDialog() {
    if (dialog.classList.contains('open')) {
        // reset the body overflow to auto, so we can scroll again
        document.querySelector("body").style.overflow = "auto";

        // scroll to the currently visible figure in the article
        scrollToArticleFigure();

        // remove all "large" classes from images
        const images = document.querySelectorAll('.carousel-item figure');
        for (let i = 0; i < images.length; i++) {
            const image = images[i];
            image.classList.remove('large');
        }

        // actually close the dialog
        dialog.classList.remove('open');
        dialog.close();
    }
};