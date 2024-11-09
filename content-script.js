/** @type {Element | undefined | null} */
let jobPostingHTMLElement = null;

const loadJobPosting = () => {
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
};

const processJobPosting = () => {
  console.log("Processing job posting");
  jobPostingHTMLElement = document.querySelector(".jobs-box__html-content");
  console.log("HTML", jobPostingHTMLElement?.innerHTML);

  const description = jobPostingHTMLElement?.lastChild?.textContent;
  const firstSentence = description?.split(".")[0];

  console.log("First sentence", firstSentence);

  if (firstSentence) {
    const highlight = createHighlight({ type: "note" });
    jobPostingHTMLElement?.insertAdjacentElement("beforebegin", highlight);
    highlight.innerText = "Lorem ipsum hello";

    console.log("Highlight", highlight);
  }
};

/**
 *
 * @param {{
 *   type: "note" | "positive" | "negative",
 * }} options
 */
const createHighlight = (options) => {
  const highlight = document.createElement("span");
  highlight.classList.add("highlight");
  highlight.classList.add(`highlight-${options.type}`);
  window.tippy(highlight, { content: "Testing tippy" });
  return highlight;
};

const loadExtension = async () => {
  await import(window.chrome.runtime.getURL("./lib/popper.min.js"));
  await import(window.chrome.runtime.getURL("./lib/tippy-bundle.umd.js"));
  loadJobPosting();
};

window.addEventListener("load", () => {
  void loadExtension();
});
