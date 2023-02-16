

function openMenuAnimation() {
    document.querySelector('#top-line').classList.add('animate-top-line');
    document.querySelector('#bottom-line').classList.add('animate-bottom-line');
    document.querySelector('#top-line').classList.remove('animate-top-line-reverse');
    document.querySelector('#bottom-line').classList.remove('animate-bottom-line-reverse');
}

function closeMenuAnimation() {
    document.querySelector('#top-line').classList.add('animate-top-line-reverse');
    document.querySelector('#bottom-line').classList.add('animate-bottom-line-reverse');
    document.querySelector('#top-line').classList.remove('animate-top-line');
    document.querySelector('#bottom-line').classList.remove('animate-bottom-line'); 
}

let isMenuOpen = false;

function toggleMenu() {
    !isMenuOpen ? openMenuAnimation() : closeMenuAnimation();
    isMenuOpen = !isMenuOpen;
}

// nav bar more (hamburger) menu behavior
document.getElementById("nav-more").onclick = function(){
    document.body.classList.toggle('open'); // let's make this things smooth
    toggleMenu();
};

// close nav when any tap/click registers on it
document.getElementById("nav-menu-list").onclick = function(){
    document.body.classList.remove('open'); // let's make this things smooth
    toggleMenu();
};

// close nav when any tap/click registers on it
document.getElementById("nav-menu-backdrop").onclick = function(){
    document.body.classList.remove('open'); // let's make this things smooth
    toggleMenu();
};

// scroll &	resize event listener
window.addEventListener('resize', throttle(onScroll, 50));
window.addEventListener('scroll', throttle(onScroll, 50));

// let's make the events not eat all the resources
function throttle(fn, wait) {
    var time = Date.now();
    return function() {
    if ((time + wait - Date.now()) < 0) {
        fn();
        time = Date.now();
    }
    }
}

function onScroll(){
    // only show/hide nav bar when on home page
    var home = document.getElementById("home");
    if (home) {
        // nav title bar show and hide
        var mastHeight = document.getElementById("masthead-photo").offsetHeight;
        // add/remove sticky to show the nav
        if (window.pageYOffset >= (mastHeight / 2)) {
            document.getElementById("nav-global").classList.add("sticky");
        } else if (window.pageYOffset < (mastHeight / 2)) {
            document.getElementById("nav-global").classList.remove("sticky");
            document.getElementById("nav-menu").classList.remove('open');
            // console.log("hello")
        }
    }
    
    // show hide nav bar shadow on article pages
    var article = document.getElementById("article");
    if (article) {
        // nav bar height
        var navHeight = document.getElementById("nav-global").offsetHeight;
        // nav toggle nav shadow
        if (window.pageYOffset >= navHeight) {
            document.getElementById("nav-global").classList.add("shadow");
        } else if (window.pageYOffset < navHeight) {
            document.getElementById("nav-global").classList.remove("shadow");
        }
        // progress bar for artcile pages
        var progress = document.getElementById('progress');
        // get the total height of the page
        var totalHeight = document.body.scrollHeight - window.innerHeight;
        // calculate the percentage of the page scrolled
        var progressWidth = (window.pageYOffset / totalHeight) * 100;
        // set the width of the progress bar
        progress.style.width = progressWidth + "%";
    }
}