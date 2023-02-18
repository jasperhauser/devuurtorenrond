
const figures = document.querySelectorAll('figure');
figures.forEach(figure => {
    // listen for click on figure
    figure.addEventListener('click', () => {
        // insert a div with class modal at start of body
        var modal = document.createElement('div');
        document.body.insertBefore(modal, document.body.firstChild);
            modal.classList.add('modal');

        // set style display to block to show modal
        modal.style.display = 'block';
        // wait 0.2 seconds then add class modal-open to animate the modal
        setTimeout(() => {
            modal.classList.add('modal-open');
        }, 50);

        // manage the closing of the modal
        // close modal function
        function closeModal() {
            modal.classList.remove('modal-open');
            modal.style.display = 'none';
            modal.remove();
        };

        // clone the figure inside the modal
        var figureClone = figure.cloneNode(true);
        modal.appendChild(figureClone);

        // create a button to close the modal
        const modalClose = document.createElement('div');
        modalClose.classList.add('modal-close');
        modal.appendChild(modalClose);

        // add a span inside the button
        const modalCloseSpan = document.createElement('span');
        // insert the span inside the button
        modalCloseSpan.textContent = '×';
        modalClose.appendChild(modalCloseSpan);
        
        
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

    });
});


// // get all images that are inside a figure tag
// const imgs = document.querySelectorAll('figure img');

// // when an image is clicked show it big in the middle of the screen
// imgs.forEach(img => {	
//     const src = img.getAttribute('src');
//     const srcset = img.getAttribute('srcset');
    
//     img.addEventListener('click', () => {
//         console.log('clicked'+src);

//         // insert a div with class modal at start of body
//         var modal = document.createElement('div');
//         document.body.insertBefore(modal, document.body.firstChild);
//             modal.classList.add('modal');

//         // set style display to block to show modal
//         modal.style.display = 'block';
//         // wait 0.2 seconds then add class modal-open to animate the modal
//         setTimeout(() => {
//             modal.classList.add('modal-open');
//         }, 50);

//         // manage the closing of the modal
//         // close modal function
//         function closeModal() {
//             modal.classList.remove('modal-open');
//             modal.style.display = 'none';
//             modal.remove();
//         };

//         // create img with src of clicked image inside modal div
//         const modalImg = document.createElement('img');
//         modalImg.setAttribute('src', src);
//         modalImg.setAttribute('srcset', srcset);
//         modal.appendChild(modalImg);

//         // create a button to close the modal
//         const modalClose = document.createElement('div');
//         modalClose.classList.add('modal-close');
//         modal.appendChild(modalClose);

//         // add a span inside the button
//         const modalCloseSpan = document.createElement('span');
//         // insert the span inside the button
//         modalCloseSpan.textContent = '×';
//         modalClose.appendChild(modalCloseSpan);
        
        
//         // close modal when clicked
//         modalClose.addEventListener('click', () => {
//             closeModal();
//         });

//         // close modal when clicked on modal
//         modal.addEventListener('click', () => {
//             closeModal();
//         });

//         // close modal when escape key is pressed
//         document.addEventListener('keydown', (e) => {
//             if (e.key === 'Escape') {
//                 closeModal();
//             }
//         });

//     });
// });