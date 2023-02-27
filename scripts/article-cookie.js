
// manage cookie for when an article is read

// get all the articles
var articles = document.querySelectorAll('.publications a.card');

// click event listener to each article
articles.forEach(function(article) {
    article.addEventListener('click', function() {
        var articleId = this.getAttribute('id'); // get the article id 
        // if no cookie set, set the cookie and add a class of read to the card
        if (!checkCookie(articleId)) {
            setCookie(articleId, 'read', 365); // set the cookie
            this.classList.add('read'); // add a class of read to the card
            // insert a span with class 'read-article' with text 'read' into the card
            this.insertAdjacentHTML('beforeend', '<span class="read-article">✓ Gelezen</span>');
        }
        // if cookie exists, do nothing
    });
});

// when page loads, check if the article has been read, give the card a class of read
window.onload = function() {
    articles.forEach(function(article) {
        var articleId = article.getAttribute('id'); // get the article id
        if (checkCookie(articleId)) { // check if the cookie exists
            article.classList.add('read'); // add a class of read to the card
            // insert a span with class 'read-article' with text 'read' into the card
            article.insertAdjacentHTML('beforeend', '<span class="read-article">✓ Gelezen</span>');
        }
    });
}

// set a cookie
function setCookie(cname, cvalue, exdays) {
    var d = new Date(); // get the current date
    d.setTime(d.getTime() + (exdays*24*60*60*1000));  // set the expiry date
    var expires = "expires="+ d.toUTCString(); // set the expiry date
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/"; // set the cookie
}  

// get a cookie
function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

// check if a cookie exists
function checkCookie(cname) {
    var cookie = getCookie(cname);
    if (cookie != "") {
        return true;
    } else {
        return false;
    }
}

// delete all cookies
function deleteAllCookies() {
    var cookies = document.cookie.split(";");

    for (var i = 0; i < cookies.length; i++) {
        var cookie = cookies[i];
        var eqPos = cookie.indexOf("=");
        var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
    }
}