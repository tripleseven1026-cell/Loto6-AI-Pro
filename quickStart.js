// quickStart.js
// v4.1 一括実行ボタン

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");
  if (!main) return;

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>⑫ 一括実行</h2>

    <p class="note">
      本番データ読込・AI分析・AI予想をまとめて実行します。
    </p>

    <button id="quickStartBtn">
      一括実行する
    </button>

    <div id="quickStartResult" class="result-box">
      まだ実行していません
    </div>
  `;

  main.appendChild(section);

  document.getElementById("quickStartBtn").addEventListener("click", async () => {

    const result = document.getElementById("quickStartResult");

    result.innerHTML = "本番データを読み込み中です...";

    try {

      const response = await fetch("loto6-data-full.json");
      const raw = await response.json();

      const history = window.LotoHistory.setHistory(raw);

      if (!history || history.length === 0) {
        result.innerHTML = "有効なデータが見つかりません。";
        return;
      }

      const latest = history[history.length - 1];

      const dataStatus = document.getElementById("dataStatus");
      if (dataStatus) {
        dataStatus.textContent = "本番データ 読込完了：" + history.length + "件";
      }

      const latestNumbers = document.getElementById("latestNumbers");
      if (latestNumbers) {
        let html = "";
        html += "<p>最新回：" + latest.draw + "</p>";

        if (latest.date) {
          html += "<p>日付：" + latest.date + "</p>";
        }

        if (window.AIEngine && window.AIEngine.balls) {
          html += window.AIEngine.balls(latest.numbers);
        }

        if (latest.bonus) {
          html += "<p>ボーナス：" + latest.bonus + "</p>";
        }

        latestNumbers.innerHTML = html;
      }

      if (typeof analyzeHistory === "function") {
        analyzeHistory(history);
      }

      if (typeof predictNumbers === "function") {
        predictNumbers(history);
      }

      result.innerHTML =
        "一括実行が完了しました。AI分析とAI予想を確認してください。";

    } catch (e) {

      result.innerHTML =
        "一括実行に失敗しました。GitHub Pagesで開いているか確認してください。";

    }

  });

});
