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
  jobPostingHTMLElement = document.querySelector(".jobs-box__html-content");
  console.log("HTML", jobPostingHTMLElement?.innerHTML);

  if (jobPostingHTMLElement?.innerHTML) {
    // AI generated HTML
    const processedHTML =
      "<span data-highlight data-type='error' data-description='!!!!!!!!!!!!' class='highlight-negative'>Lorem ipsum</span>" +
      "<span data-highlight data-type='good' data-description='Nice!!' class='highlight-positive'>Lorem ipsum</span>" +
      jobPostingHTMLElement.innerHTML;

    jobPostingHTMLElement.innerHTML = processedHTML;

    const highlights =
      jobPostingHTMLElement.querySelectorAll("[data-highlight]");
    highlights.forEach((highlight) => {
      if (highlight instanceof HTMLElement) {
        createHighlight(highlight);
      }
    });
  }
};

const validTypes = /** @type {const} */ (["good", "info", "warning", "error"]);
/**
 * @param {HTMLElement} element
 */
const createHighlight = (element) => {
  const hlType = element.dataset["type"];

  const options = {
    type: validTypes.includes(/** @type {typeof validTypes[number]} */ (hlType))
      ? /** @type {typeof validTypes[number]} */ (hlType)
      : "info",
    description: element.dataset["description"] ?? "",
  };

  const emoji = {
    good: "✅",
    info: "ℹ️",
    warning: "⚠️",
    error: "❌",
  };

  const content = document.createElement("span");
  content.innerHTML = `${emoji[options.type]} ${options.description}`;

  window.tippy(element, { content });
};

const loadExtension = async () => {
  await import(window.chrome.runtime.getURL("./lib/popper.min.js"));
  await import(window.chrome.runtime.getURL("./lib/tippy-bundle.umd.js"));
  loadJobPosting();
};

window.addEventListener("load", () => {
  void loadExtension();
});
