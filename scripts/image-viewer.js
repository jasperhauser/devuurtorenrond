
// Description: This script is used to open images in a modal when clicked on

// insert a div with class modal at start of body
var modal = document.createElement('div');
document.body.insertBefore(modal, document.body.firstChild);
modal.classList.add('modal');

// create a button to close the modal
const modalClose = document.createElement('div');
modalClose.classList.add('modal-close');
modal.appendChild(modalClose);

// add a span inside the button
const modalCloseSpan = document.createElement('span');
// insert the span inside the button
modalCloseSpan.textContent = '×';
modalClose.appendChild(modalCloseSpan);

// get all figures on the page
const figures = document.querySelectorAll('figure');

// to add an id to each figure
var figureNumber = 0;

// function to open the modal
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
        modal.style.display = 'block';
        // wait 0.2 seconds then add class modal-open to animate the modal
        setTimeout(() => {
            modal.classList.add('modal-open');
        }, 50);
    });
});

// allow people on laptops to use the arrow keys to navigate between images
document.addEventListener('keydown', (e) => {
    var figure = document.querySelector('.modal figure');
    if (modal.classList.contains('modal-open')) {
        if (e.key === 'ArrowLeft') {;
            // get the previous figure
            var previousFigure = document.getElementById(figure.id - 1);
            // clone the previous figure
            if (previousFigure === null){
                closeModal();
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
                closeModal();
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

// close modal when clicked
modalClose.addEventListener('click', () => {
    closeModal();
});

// close modal when clicked on modal
modal.addEventListener('click', () => {
    closeModal();
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

function checkDirection() {
    if (touchendY < touchstartY) {
        closeModal();
        console.log('swiped down!')
        // alert('swiped down!')
    } else if (touchendY > touchstartY) {
        closeModal();
        console.log('swiped up!')
        // alert('swiped up!')
    }
};

modal.addEventListener('touchstart', e => {
    touchstartY = e.changedTouches[0].screenY
});

modal.addEventListener('touchend', e => {
    touchendY = e.changedTouches[0].screenY
    checkDirection()
});

// manage the closing of the modal
// close modal function
function closeModal() {
    if (modal.classList.contains('modal-open')) {
        modal.classList.remove('modal-open');
        modal.style.display = 'none';
        // remove the figure from the modal
        var figure = document.querySelector('.modal figure');
        figure.remove();
    }
};