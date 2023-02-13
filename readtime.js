function readingTime() {
    // Get the text from the article
    const text = document.getElementById("article").innerText;
    // Set the reading speed
    const wpm = 225;
    // Calculate the reading time
    const words = text.trim().split(/\s+/).length;
    const time = Math.ceil(words / wpm);
    // Display the reading time
    document.getElementById("readingTime").innerText = time;
}
readingTime();