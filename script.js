const TOTAL_QUESTIONS = 6;

let studentName = "";
let studentClass = "";
let selectedMode = "";
let selectedCharacter = "";
let selectedCharacterImage = "";
let computerFinishSeconds = 90;

const questions = [
  { top: 452, bottom: 126, correctAnswer: 326, choices: [326, 336, 316, 329] },
  { top: 631, bottom: 224, correctAnswer: 407, choices: [407, 417, 397, 410] },
  { top: 724, bottom: 318, correctAnswer: 406, choices: [406, 416, 396, 411] },
  { top: 543, bottom: 168, correctAnswer: 375, choices: [375, 385, 365, 381] },
  { top: 812, bottom: 215, correctAnswer: 597, choices: [597, 587, 607, 617] },
  { top: 561, bottom: 243, correctAnswer: 318, choices: [318, 328, 308, 338] }
];

let currentQuestionIndex = 0;
let score = 0;
let mistakes = 0;
let startTime = 0;
let timerInterval = null;
let computerInterval = null;
let finalSeconds = 0;

function showPage(pageId) {
  document.querySelectorAll(".page").forEach(page => page.classList.remove("active"));
  document.getElementById(pageId).classList.add("active");
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function openStudentPage() {
  const music = document.getElementById("bgMusic");
  music.volume = 0.25;
  music.play().catch(() => {});
  showPage("studentPage");
}

function continueToMode() {
  studentName = document.getElementById("studentName").value.trim();
  studentClass = document.getElementById("studentClass").value.trim();

  if (!studentName) {
    alert("Sila masukkan nama murid.");
    return;
  }

  if (!studentClass) {
    alert("Sila masukkan kelas.");
    return;
  }

  showPage("modePage");
}

function selectMode(mode, button) {
  selectedMode = mode;
  document.querySelectorAll(".mode-card").forEach(card => card.classList.remove("selected"));
  button.classList.add("selected");

  const difficultyArea = document.getElementById("difficultyArea");
  if (mode === "Lawan Komputer") {
    difficultyArea.classList.remove("hidden");
  } else {
    difficultyArea.classList.add("hidden");
  }
}

function selectDifficulty(seconds, button) {
  computerFinishSeconds = seconds;
  document.querySelectorAll(".difficulty-grid button").forEach(item => item.classList.remove("selected"));
  button.classList.add("selected");
}

function continueToCharacter() {
  if (!selectedMode) {
    alert("Sila pilih mod permainan.");
    return;
  }
  showPage("characterPage");
}

function selectCharacter(name, image, button) {
  selectedCharacter = name;
  selectedCharacterImage = image;
  document.querySelectorAll(".character-card").forEach(card => card.classList.remove("selected"));
  button.classList.add("selected");
}

function startGame() {
  if (!selectedCharacter) {
    alert("Sila pilih karakter.");
    return;
  }

  currentQuestionIndex = 0;
  score = 0;
  mistakes = 0;

  document.getElementById("headerName").textContent = studentName;
  document.getElementById("headerClass").textContent = studentClass;
  document.getElementById("headerCharacter").src = selectedCharacterImage;
  document.getElementById("raceCharacter").src = selectedCharacterImage;
  document.getElementById("modeDisplay").textContent = selectedMode;

  updateDashboard();
  updatePlayerPosition();
  updateComputerPosition(0);

  showPage("gamePage");
  startTimer();
  displayQuestion();
}

function displayQuestion() {
  const question = questions[currentQuestionIndex];
  const topDigits = getThreeDigits(question.top);
  const bottomDigits = getThreeDigits(question.bottom);

  document.getElementById("topHundreds").textContent = topDigits[0];
  document.getElementById("topTens").textContent = topDigits[1];
  document.getElementById("topOnes").textContent = topDigits[2];

  document.getElementById("bottomHundreds").textContent = bottomDigits[0];
  document.getElementById("bottomTens").textContent = bottomDigits[1];
  document.getElementById("bottomOnes").textContent = bottomDigits[2];

  const feedback = document.getElementById("feedbackText");
  feedback.textContent = "Pilih jawapan yang betul";
  feedback.className = "";

  const optionContainer = document.getElementById("answerOptions");
  optionContainer.innerHTML = "";

  const labels = ["A", "B", "C", "D"];
  shuffleArray(question.choices).forEach((choice, index) => {
    const button = document.createElement("button");
    button.className = "answer-button";
    button.textContent = `${labels[index]}. ${choice}`;
    button.addEventListener("click", () => checkAnswer(choice));
    optionContainer.appendChild(button);
  });

  updateDashboard();
}

function checkAnswer(selectedAnswer) {
  const question = questions[currentQuestionIndex];
  const feedback = document.getElementById("feedbackText");

  if (selectedAnswer === question.correctAnswer) {
    feedback.textContent = "✅ Hebat! Jawapan Betul!";
    feedback.className = "feedback-correct";
    score++;
    currentQuestionIndex++;
    updateDashboard();
    updatePlayerPosition();

    if (currentQuestionIndex >= TOTAL_QUESTIONS) {
      setTimeout(finishGame, 700);
    } else {
      setTimeout(displayQuestion, 650);
    }
  } else {
    mistakes++;
    feedback.textContent = "❌ Cuba Lagi";
    feedback.className = "feedback-wrong";
    updateDashboard();
  }
}

function updateDashboard() {
  document.getElementById("questionNumber").textContent = Math.min(currentQuestionIndex + 1, TOTAL_QUESTIONS);
  document.getElementById("scoreDisplay").textContent = score;
  document.getElementById("mistakeDisplay").textContent = mistakes;
}

function startTimer() {
  clearInterval(timerInterval);
  clearInterval(computerInterval);
  startTime = Date.now();

  timerInterval = setInterval(() => {
    const elapsedSeconds = Math.floor((Date.now() - startTime) / 1000);
    document.getElementById("timerDisplay").textContent = formatTime(elapsedSeconds);
  }, 250);

  if (selectedMode === "Lawan Komputer") {
    computerInterval = setInterval(() => {
      const elapsedSeconds = (Date.now() - startTime) / 1000;
      const progress = Math.min(elapsedSeconds / computerFinishSeconds, 1);
      updateComputerPosition(progress);
    }, 250);
  } else {
    updateComputerPosition(0);
  }
}

function updatePlayerPosition() {
  const positions = [5, 20, 35, 50, 65, 80, 95];
  const playerPosition = positions[Math.min(currentQuestionIndex, TOTAL_QUESTIONS)];
  document.getElementById("playerRunner").style.left = `${playerPosition}%`;
}

function updateComputerPosition(progress) {
  const runner = document.getElementById("computerRunner");

  if (selectedMode === "Lawan Komputer") {
    runner.style.display = "block";
    runner.style.left = `${5 + progress * 90}%`;
  } else {
    runner.style.display = "none";
  }
}

function finishGame() {
  clearInterval(timerInterval);
  clearInterval(computerInterval);

  finalSeconds = Math.floor((Date.now() - startTime) / 1000);

  const record = {
    name: studentName,
    className: studentClass,
    character: selectedCharacter,
    mode: selectedMode,
    time: finalSeconds,
    mistakes,
    date: new Date().toLocaleDateString("ms-MY")
  };

  const rank = saveRanking(record);

  document.getElementById("resultName").textContent = studentName;
  document.getElementById("resultClass").textContent = studentClass;
  document.getElementById("resultCharacter").textContent = selectedCharacter;
  document.getElementById("resultMode").textContent = selectedMode;
  document.getElementById("resultTime").textContent = formatTime(finalSeconds);
  document.getElementById("resultMistakes").textContent = mistakes;
  document.getElementById("resultRank").textContent = `Tempat ke-${rank}`;

  showPage("resultPage");
}

function saveRanking(record) {
  const rankings = getRankings();
  rankings.push(record);

  rankings.sort((a, b) => {
    if (a.time !== b.time) return a.time - b.time;
    return a.mistakes - b.mistakes;
  });

  localStorage.setItem("angryBirdSpeedRankings", JSON.stringify(rankings.slice(0, 50)));

  return rankings.findIndex(item =>
    item.name === record.name &&
    item.time === record.time &&
    item.mistakes === record.mistakes
  ) + 1;
}

function getRankings() {
  try {
    return JSON.parse(localStorage.getItem("angryBirdSpeedRankings")) || [];
  } catch {
    return [];
  }
}

function showRanking() {
  showPage("rankingPage");
  renderRanking();
}

function renderRanking() {
  const filterText = document.getElementById("classFilter").value.trim().toLowerCase();
  let rankings = getRankings();

  if (filterText) {
    rankings = rankings.filter(item => item.className.toLowerCase().includes(filterText));
  }

  const container = document.getElementById("rankingList");
  container.innerHTML = "";

  if (rankings.length === 0) {
    container.innerHTML = "<p style='text-align:center'>Belum ada rekod permainan.</p>";
    return;
  }

  rankings.forEach((item, index) => {
    const row = document.createElement("div");
    row.className = "ranking-item";

    if (index === 0) row.classList.add("top-one");
    if (index === 1) row.classList.add("top-two");
    if (index === 2) row.classList.add("top-three");

    const medal = index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `${index + 1}`;

    row.innerHTML = `
      <span class="rank-medal">${medal}</span>
      <span><strong>${escapeHtml(item.name)}</strong><br>${escapeHtml(item.className)}</span>
      <span>${escapeHtml(item.character)}</span>
      <span>${formatTime(item.time)}</span>
      <span>${item.mistakes} salah<br><small>${escapeHtml(item.date)}</small></span>
    `;

    container.appendChild(row);
  });
}

function clearRankingFilter() {
  document.getElementById("classFilter").value = "";
  renderRanking();
}

function restartGame() {
  startGame();
}

function showTeacherDemo() {
  alert("Panel Guru ialah cadangan pembangunan fasa seterusnya: urus soalan, import Excel, muat turun keputusan dan reset ranking.");
}

function getThreeDigits(number) {
  return String(number).padStart(3, "0").split("");
}

function shuffleArray(array) {
  const copied = [...array];
  for (let i = copied.length - 1; i > 0; i--) {
    const randomIndex = Math.floor(Math.random() * (i + 1));
    [copied[i], copied[randomIndex]] = [copied[randomIndex], copied[i]];
  }
  return copied;
}

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  return `${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
