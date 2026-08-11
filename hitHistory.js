// hitHistory.js
// v3.4 的中チェック結果保存機能

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");
  if (!main) return;

  const STORAGE_KEY = "loto6HitHistoryV34";

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>⑦ 的中結果履歴</h2>
    <p class="note">
      的中チェック後の結果を保存できます。
    </p>

    <button id="saveHitResultBtn">
      的中結果を保存
    </button>

    <button id="showHitHistoryBtn" class="secondary">
      的中履歴を表示
    </button>

    <button id="clearHitHistoryBtn" class="secondary">
      的中履歴を削除
    </button>

    <div id="hitHistoryResult" class="result-box">
      まだ保存していません
    </div>
  `;

  main.appendChild(section);

  function getHistory() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveHistory(history) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(history));
  }

  document.getElementById("saveHitResultBtn").addEventListener("click", () => {

    const input = document.getElementById("actualNumbers");

    const resultBox = document.getElementById("hitCheckResult");

    if (!input || !resultBox) {
      document.getElementById("hitHistoryResult").innerHTML =
        "先に的中チェックを行ってください。";
      return;
    }

    if (!resultBox.innerHTML.includes("的中チェック結果")) {
      document.getElementById("hitHistoryResult").innerHTML =
        "先に的中チェックを行ってください。";
      return;
    }

    const history = getHistory();

    history.push({
      date: new Date().toLocaleString("ja-JP"),
      actual: input.value,
      result: resultBox.innerHTML
    });

    saveHistory(history);

    document.getElementById("hitHistoryResult").innerHTML =
      "的中結果を保存しました。";

  });

  document.getElementById("showHitHistoryBtn").addEventListener("click", () => {

    const history = getHistory();
    const box = document.getElementById("hitHistoryResult");

    if (history.length === 0) {
      box.innerHTML = "保存された的中履歴はありません。";
      return;
    }

    let html = "<h3>保存済み的中履歴</h3>";

    history
      .slice()
      .reverse()
      .slice(0, 10)
      .forEach(item => {

        html += "<div class='prediction-card'>";
        html += "<div class='prediction-title'>" + item.date + "</div>";
        html += "<p>抽選結果：" + item.actual + "</p>";
        html += item.result;
        html += "</div>";

      });

    box.innerHTML = html;

  });

  document.getElementById("clearHitHistoryBtn").addEventListener("click", () => {

    const ok = confirm("保存した的中履歴を削除しますか？");

    if (!ok) return;

    localStorage.removeItem(STORAGE_KEY);

    document.getElementById("hitHistoryResult").innerHTML =
      "的中履歴を削除しました。";

  });

});
