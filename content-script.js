let jobPostingHTML = null

const processJobPosting = () => {
    jobPostingHTML = document.querySelector('.jobs-box__html-content').innerHTML
    console.log('HTML', jobPostingHTML)
}

window.addEventListener('load', () => {
    // job posting html is lazily loaded, so retry until the text is there
    const retry = setInterval(() => {
        // Unloaded job posting has innerText "About the job", which is 13 characters, but other languages might have more characters
        if (document.querySelector('#job-details')?.innerText.length >= 40) {
            clearInterval(retry)
            processJobPosting()
        }
    }, 200)
})
