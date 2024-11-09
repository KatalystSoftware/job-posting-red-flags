/** @type {string | undefined | null} */
let jobPostingHTML = null;

const processJobPosting = () => {
  jobPostingHTML = document.querySelector(".jobs-box__html-content")?.innerHTML;
  console.log("HTML", jobPostingHTML);
};

window.addEventListener("load", () => {
  let scripttag1 = document.createElement("script");
  scripttag1.src = window.chrome.runtime.getURL("./lib/popper.min.js");

  scripttag1.addEventListener("load", () => {
    let scripttag2 = document.createElement("script");
    scripttag2.src = window.chrome.runtime.getURL("./lib/tippy-bundle.umd.js");
    document.head.appendChild(scripttag2);

    console.log(scripttag2);
  });

  document.head.appendChild(scripttag1);
  console.log(scripttag1);
  // job posting html is lazily loaded, so retry until the text is there
  const retry = setInterval(() => {
    // Unloaded job posting has innerText "About the job", which is 13 characters, but other languages might have more characters
    if (
      (document.querySelector("#job-details")?.textContent?.length ?? 0) >= 40
    ) {
      clearInterval(retry);
      processJobPosting();
    }
  }, 200);
});
