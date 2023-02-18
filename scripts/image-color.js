
// extract color from image url
// get every image in the document
var images = document.getElementsByTagName('img');
// loop through the images
for (var i = 0; i < images.length; i++) {
    // get the image url
    var url = images[i].src;
    // get the image color
    // exactly the last 6 numbers before the file extension, else it's not a color
    var color = url.substring(url.lastIndexOf('-') + 1, url.lastIndexOf('.'));
    // only if the color 6 numbers long, it's a color
    if (color.length >= 6) {
        // regex to check if color is valid
        var reg=/^([0-9a-f]{3}){1,2}$/i;
        // if color matches regex, set background color
        if(reg.test(color)) {
            // set the background color
            // console.log(url);
            // console.log(color);
            images[i].style.backgroundColor = "#" + color;
        }
    }
}