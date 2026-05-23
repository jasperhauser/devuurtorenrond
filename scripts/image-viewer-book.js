// Open book preview photos in a fullscreen carousel dialog (same UX as season articles).

var dialog = document.createElement('dialog');
document.body.insertBefore(dialog, document.body.firstChild);

var dialogClose = document.createElement('button');
dialogClose.classList.add('button', 'close');
dialogClose.setAttribute('title', 'Close Image Viewer');
dialog.appendChild(dialogClose);
var dialogCloseSpan = document.createElement('span');
dialogClose.appendChild(dialogCloseSpan);
dialogCloseSpan.appendChild(document.createTextNode('Close'));

var nextButton = document.createElement('button');
nextButton.classList.add('button', 'next');
nextButton.setAttribute('title', 'Next Image');
dialog.appendChild(nextButton);
var nextButtonSpan = document.createElement('span');
nextButton.appendChild(nextButtonSpan);
nextButtonSpan.appendChild(document.createTextNode('Next'));

var previousButton = document.createElement('button');
previousButton.classList.add('button', 'previous');
previousButton.setAttribute('title', 'Previous Image');
dialog.appendChild(previousButton);
var previousButtonSpan = document.createElement('span');
previousButton.appendChild(previousButtonSpan);
previousButtonSpan.appendChild(document.createTextNode('Previous'));

const figures = document.querySelectorAll('.book-preview-photo');
if (!figures.length) {
	dialog.remove();
} else {
	const carousel = document.createElement('div');
	carousel.classList.add('carousel');
	dialog.appendChild(carousel);

	var figureCount = figures.length;
	var activeFigure = 1;

	function scrollCarouselToSlide(figureNumber) {
		const carouselItem = document.getElementById('carousel-' + figureNumber);
		if (!carouselItem) {
			return;
		}
		carousel.scrollLeft = carouselItem.offsetLeft;
		activeFigure = String(figureNumber);
	}

	for (let i = 0; i < figures.length; i++) {
		const figure = figures[i];
		const figureNumber = i + 1;
		figure.dataset.viewerId = figureNumber;

		const carouselItem = document.createElement('div');
		carouselItem.classList.add('carousel-item');
		carouselItem.setAttribute('id', 'carousel-' + figureNumber);
		carousel.appendChild(carouselItem);

		const clone = figure.cloneNode(true);
		clone.removeAttribute('id');
		const caption = clone.querySelector('figcaption');
		if (caption) {
			caption.textContent = figureNumber + '. ' + caption.textContent;
		}
		carouselItem.appendChild(clone);

		figure.addEventListener('click', function () {
			dialog.showModal();
			document.querySelector('body').style.overflow = 'hidden';
			scrollCarouselToSlide(figureNumber);
			requestAnimationFrame(function () {
				scrollCarouselToSlide(figureNumber);
				dialog.classList.add('open');
			});
		});
	}

	function isClickOnVisibleImage(img, event) {
		if (!img.naturalWidth || !img.naturalHeight) {
			return false;
		}

		const rect = img.getBoundingClientRect();
		const naturalRatio = img.naturalWidth / img.naturalHeight;
		const elementRatio = rect.width / rect.height;
		var renderedWidth;
		var renderedHeight;
		var offsetX;
		var offsetY;

		if (naturalRatio > elementRatio) {
			renderedWidth = rect.width;
			renderedHeight = rect.width / naturalRatio;
			offsetX = 0;
			offsetY = (rect.height - renderedHeight) / 2;
		} else {
			renderedHeight = rect.height;
			renderedWidth = rect.height * naturalRatio;
			offsetX = (rect.width - renderedWidth) / 2;
			offsetY = 0;
		}

		const x = event.clientX - rect.left - offsetX;
		const y = event.clientY - rect.top - offsetY;
		return x >= 0 && x <= renderedWidth && y >= 0 && y <= renderedHeight;
	}

	document.addEventListener(
		'keydown',
		function (e) {
			if (!dialog.classList.contains('open')) {
				return;
			}
			if (e.key === 'ArrowLeft') {
				var previousFigure = parseInt(activeFigure, 10) - 1;
				if (previousFigure < 1) {
					previousFigure = figureCount;
				}
				scrollCarouselToSlide(previousFigure);
			} else if (e.key === 'ArrowRight') {
				var nextFigure = parseInt(activeFigure, 10) + 1;
				if (nextFigure > figureCount) {
					nextFigure = 1;
				}
				scrollCarouselToSlide(nextFigure);
			}
		},
		{ passive: true }
	);

	previousButton.addEventListener(
		'click',
		function () {
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowLeft' }));
		},
		{ passive: true }
	);

	nextButton.addEventListener(
		'click',
		function () {
			document.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowRight' }));
		},
		{ passive: true }
	);

	carousel.addEventListener('scroll', function () {
		updateActiveFigure();
	});

	function updateActiveFigure() {
		const centerEl = document.elementFromPoint(window.innerWidth / 2, window.innerHeight / 2);
		const carouselItem = centerEl && centerEl.closest('.carousel-item');
		if (!carouselItem) {
			return;
		}
		const match = carouselItem.id.match(/^carousel-(\d+)$/);
		if (match) {
			activeFigure = match[1];
		}
	}

	function scrollToPageFigure() {
		updateActiveFigure();
		var figureToScrollTo = document.querySelector('.book-preview-photo[data-viewer-id="' + activeFigure + '"]');
		if (!figureToScrollTo) {
			return;
		}
		var figureFromTop =
			figureToScrollTo.getBoundingClientRect().top +
			window.scrollY -
			window.innerHeight / 2 +
			figureToScrollTo.offsetHeight / 2;
		window.scrollTo({
			top: figureFromTop,
			behavior: 'auto'
		});
	}

	dialogClose.addEventListener('click', function () {
		closeDialog();
	});

	dialog.addEventListener('click', function (e) {
		if (e.target.closest('.button')) {
			return;
		}

		const clickedImage = e.target.closest('.carousel-item img');
		if (clickedImage && isClickOnVisibleImage(clickedImage, e)) {
			return;
		}

		closeDialog();
	});

	document.addEventListener('keydown', function (e) {
		if (e.key === 'Escape') {
			closeDialog();
		}
	});

	let touchstartY = 0;
	let touchendY = 0;
	let touchstartX = 0;
	let touchendX = 0;
	var slop = 60;

	function checkDirection() {
		if (touchendY > touchstartY && touchendX - touchstartX < slop && touchendX - touchstartX > -slop) {
			closeDialog();
		} else if (touchendY < touchstartY && touchendX - touchstartX < slop && touchendX - touchstartX > -slop) {
			closeDialog();
		}
	}

	dialog.addEventListener(
		'touchstart',
		function (e) {
			touchstartY = e.changedTouches[0].screenY;
			touchstartX = e.changedTouches[0].screenX;
		},
		{ passive: true }
	);
	dialog.addEventListener(
		'touchend',
		function (e) {
			touchendY = e.changedTouches[0].screenY;
			touchendX = e.changedTouches[0].screenX;
			checkDirection();
		},
		{ passive: true }
	);

	function closeDialog() {
		if (!dialog.classList.contains('open')) {
			return;
		}
		document.querySelector('body').style.overflow = 'auto';
		scrollToPageFigure();

		const carouselFigures = document.querySelectorAll('.carousel-item figure');
		for (let i = 0; i < carouselFigures.length; i++) {
			carouselFigures[i].classList.remove('large');
		}

		dialog.classList.remove('open');
		dialog.close();
	}
}
