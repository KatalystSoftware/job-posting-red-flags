/** @type {Element | undefined | null} */
let jobPostingHTMLElement = null;

const loadJobPosting = () => {
  // job posting html is lazily loaded, so retry until the text is there
  const retry = setInterval(() => {
    // Unloaded job posting has innerText "About the job", which is 13 characters, but other languages might have more characters
    if (
      (document.querySelector("#job-details")?.textContent?.length ?? 0) >= 40
    ) {
      console.log("job-detials-text-content", document.querySelector("#job-details")?.textContent)
      clearInterval(retry);
      processJobPosting();
    }
  }, 200);
};

const processJobPosting = async () => {
  jobPostingHTMLElement = document.querySelector(".jobs-box__html-content");
  console.log("HTML", jobPostingHTMLElement?.innerHTML);
  
  if (jobPostingHTMLElement?.innerHTML) {
    const resp = await fetch("https://job-posting-red-flags-detector.siidorow.workers.dev", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        html: jobPostingHTMLElement.innerHTML,
      })

    })
    
    console.log(resp)

    if (!resp.ok) {
      console.error("Failed to fetch job posting", resp.statusText);
      return;
    }

    const newHtml = await resp.text()
    
    console.log('new html', newHtml)

    jobPostingHTMLElement.innerHTML = newHtml;

    const highlights =
      jobPostingHTMLElement.querySelectorAll("[data-highlight]");
    highlights.forEach((highlight) => {
      if (highlight instanceof HTMLElement) {
        createHighlight(highlight);
      }
    });
  }
};

const validTypes = /** @type {const} */ ([
  "positive",
  "info",
  "context",
  "negative",
]);
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
    positive: "✅",
    info: "ℹ️",
    context: "⚠️",
    negative: "❌",
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
