// nav bar more (hamburger) menu behavior
document.getElementById("nav-more").onclick = function(){
    document.getElementById("nav-menu").classList.toggle('open'); // let's make this things smooth
};
// close nav when any tap/click registers on it
document.getElementById("nav-menu-list").onclick = function(){
    document.getElementById("nav-menu").classList.remove('open'); // let's make this things smooth
};

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
            console.log("hello")
        }
    }
}