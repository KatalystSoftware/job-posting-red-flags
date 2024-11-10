const questions = /** @type {const} */ ([
  {
    question: "I prefer to work",
    answers: ["In an office", "Hybrid", "Remotely"],
  },
  {
    question: "My ideal work environment is",
    answers: ["Quiet", "Collaborative", "Fast-paced"],
  },
  {
    question: "I am most productive",
    answers: ["In the morning", "In the afternoon", "At night"],
  },
  {
    question: "I prefer to communicate",
    answers: ["Via email", "Via chat", "In person"],
  },
  {
    question: "I am looking for a job that is",
    answers: ["Full-time", "Part-time", "Contract"],
  },
  {
    question: "I prefer a company culture that is",
    answers: ["Formal", "Casual", "Flexible"],
  },
  {
    question: "I value most",
    answers: ["Work-life balance", "Career advancement", "High salary"],
  },
  {
    question: "I prefer to work in a team that is",
    answers: ["Small", "Medium", "Large"],
  },
  {
    question: "I am comfortable with",
    answers: ["Frequent travel", "Occasional travel", "No travel"],
  },
  {
    question: "I prefer to work for a company that is",
    answers: ["Startup", "Mid-sized", "Large corporation"],
  },
]);

/**
 * @type {Map<number, number>}
 */
let answers = new Map();
let currentPage = 0;

const renderQuestion = (initialRender = false) => {
  if (initialRender) {
    const storedAnswerString = localStorage["hire-hazard-answers"];
    if (storedAnswerString) {
      const storedAnswers = new Map(JSON.parse(storedAnswerString));
      answers = storedAnswers;
    }
    const storedCurrentPage = localStorage["hire-hazard-current-page"];
    if (storedCurrentPage) {
      currentPage = parseInt(storedCurrentPage, 10);
    }
  } else {
    localStorage["hire-hazard-answers"] = JSON.stringify(
      Array.from(answers.entries()),
    );
    localStorage["hire-hazard-current-page"] = currentPage;
  }

  const pageStepperEl = /** @type {HTMLDivElement} */ (
    document.querySelector(".page-stepper")
  );
  pageStepperEl.textContent = "";
  questions.forEach((_, i) => {
    const step = document.createElement("button");
    if (i === currentPage) {
      step.ariaCurrent = "step";
    }
    step.onclick = () => {
      currentPage = i;
      renderQuestion();
    };
    pageStepperEl.appendChild(step);
  });

  const questionEl = /** @type {HTMLDivElement} */ (
    document.querySelector(".question")
  );
  questionEl.textContent = "";
  const currentQuestion = questions[currentPage] ?? questions[0];
  const selectedAnswer = answers.get(currentPage);
  const questionParagraph = document.createElement("p");
  questionParagraph.textContent = currentQuestion.question;
  questionEl.appendChild(questionParagraph);
  const answerContainerEl = document.createElement("div");
  currentQuestion.answers.forEach((answer, i) => {
    const answerButtonEl = document.createElement("button");
    answerButtonEl.classList.add("btn", "btn-select");
    answerButtonEl.textContent = answer;
    if (selectedAnswer === i) {
      answerButtonEl.ariaSelected = "true";
    }
    answerButtonEl.onclick = () => {
      answers.set(currentPage, i);
      if (currentPage !== questions.length - 1) {
        currentPage += 1;
      }
      renderQuestion();
    };
    answerContainerEl.appendChild(answerButtonEl);
  });
  questionEl.appendChild(answerContainerEl);

  const secondaryActionsEl = /** @type {HTMLDivElement} */ (
    document.querySelector(".secondary-actions")
  );
  secondaryActionsEl.textContent = "";

  if (currentPage !== 0) {
    const backButtonEl = document.createElement("button");
    backButtonEl.classList.add("btn", "btn-secondary");
    backButtonEl.textContent = "Back";
    backButtonEl.onclick = () => {
      currentPage -= 1;
      renderQuestion();
    };
    secondaryActionsEl.appendChild(backButtonEl);
  }

  if (currentPage !== questions.length - 1) {
    const skipButtonEl = document.createElement("button");
    skipButtonEl.classList.add("btn", "btn-ghost");
    skipButtonEl.textContent = "Skip";
    skipButtonEl.onclick = () => {
      currentPage += 1;
      renderQuestion();
    };
    secondaryActionsEl.appendChild(skipButtonEl);
  }
};

renderQuestion(true);
