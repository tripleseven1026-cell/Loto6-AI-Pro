// predictionHistory.js
// v3.3 予想履歴保存機能

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");
  if (!main) return;

  const STORAGE_KEY = "loto6PredictionHistoryV33";

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>⑥ 予想履歴</h2>
    <p class="note">
      今回のAI予想A/B/Cを保存できます。保存した履歴はこの端末のChromeに残ります。
    </p>

    <button id="savePredictionBtn">
      今回の予想を保存
    </button>

    <button id="showPredictionHistoryBtn" class="secondary">
      保存履歴を表示
    </button>

    <button id="clearPredictionHistoryBtn" class="secondary">
      履歴を削除
    </button>

    <div id="predictionHistoryResult" class="result-box">
      まだ保存していません
    </div>
  `;

  main.appendChild(section);

  function getSavedHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(history) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }

  function getCurrentPredictions() {
    const cards = document.querySelectorAll("#predictionResult .prediction-card");

    if (!cards || cards.length === 0) {
      return [];
    }

    return Array.from(cards).map(card => {

      const title =
        card.querySelector(".prediction-title")?.textContent || "AI予想";

      const numbers =
        Array.from(card.querySelectorAll(".ball"))
          .map(el => Number(el.textContent))
          .filter(n => Number.isInteger(n));

      const details =
        Array.from(card.querySelectorAll(".small"))
          .map(el => el.textContent.trim())
          .join(" / ");

      return {
        title,
        numbers,
        details
      };

    });
  }

  function showHistory() {
    const history = getSavedHistory();
    const result = document.getElementById("predictionHistoryResult");

    if (history.length === 0) {
      result.innerHTML = "保存履歴はありません。";
      return;
    }

    let html = "<h3>保存済み予想履歴</h3>";

    history
      .slice()
      .reverse()
      .slice(0, 10)
      .forEach(item => {

        html += "<div class='prediction-card'>";
        html += "<div class='prediction-title'>" + item.date + "</div>";

        item.predictions.forEach(p => {
          html += "<p><strong>" + p.title + "</strong></p>";

          html += "<div class='number-line'>";
          p.numbers.forEach(n => {
            html += "<span class='ball'>" + String(n).padStart(2, "0") + "</span>";
          });
          html += "</div>";

          if (p.details) {
            html += "<p class='small'>" + p.details + "</p>";
          }
        });

        html += "</div>";

      });

    result.innerHTML = html;
  }

  document.getElementById("savePredictionBtn").addEventListener("click", () => {

    const predictions = getCurrentPredictions();

    if (predictions.length === 0) {
      document.getElementById("predictionHistoryResult").innerHTML =
        "先に「予想開始」を押してください。";
      return;
    }

    const history = getSavedHistory();

    history.push({
      date: new Date().toLocaleString("ja-JP"),
      predictions
    });

    saveHistory(history);

    document.getElementById("predictionHistoryResult").innerHTML =
      "今回の予想を保存しました。";

  });

  document.getElementById("showPredictionHistoryBtn").addEventListener("click", () => {
    showHistory();
  });

  document.getElementById("clearPredictionHistoryBtn").addEventListener("click", () => {

    const ok = confirm("保存した予想履歴を削除しますか？");

    if (!ok) return;

    localStorage.removeItem(STORAGE_KEY);

    document.getElementById("predictionHistoryResult").innerHTML =
      "予想履歴を削除しました。";

  });

});
