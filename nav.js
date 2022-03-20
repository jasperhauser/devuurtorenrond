// scroll &	resize event listener
window.addEventListener('resize', throttle(onScroll, 200));
window.addEventListener('scroll', throttle(onScroll, 200));

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

    // nav title bar show and hide
    var mastHeight = document.getElementById("masthead-photo").offsetHeight;
    // add/remove sticky to show the nav
    if (window.pageYOffset >= mastHeight){
        document.getElementById("nav-global").classList.add("sticky");
    } else if (window.pageYOffset < mastHeight) {
        document.getElementById("nav-global").classList.remove("sticky");
    }
}