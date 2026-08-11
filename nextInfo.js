// nextInfo.js
// v3.9 最新回・次回予想対象表示

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");
  if (!main) return;

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>⑩ 最新データ確認</h2>

    <p class="note">
      読み込んだデータの最新回と、次に予想する回を確認できます。
    </p>

    <button id="showNextInfoBtn">
      最新データ確認
    </button>

    <div id="nextInfoResult" class="result-box">
      まだ確認していません
    </div>
  `;

  main.appendChild(section);

  document.getElementById("showNextInfoBtn").addEventListener("click", () => {

    const history =
      window.LotoHistory && window.LotoHistory.getHistory
        ? window.LotoHistory.getHistory()
        : [];

    const result = document.getElementById("nextInfoResult");

    if (!history || history.length === 0) {
      result.innerHTML =
        "先に「本番データ読込」を押してください。";
      return;
    }

    const latest = history[history.length - 1];

    const latestDraw = Number(latest.draw);
    const nextDraw = latestDraw + 1;

    let html = "";

    html += "<h3>最新データ情報</h3>";

    html += "<p>読込件数：" + history.length + "件</p>";

    html += "<p>最新回：第" + latestDraw + "回</p>";

    if (latest.date) {
      html += "<p>最新抽選日：" + latest.date + "</p>";
    }

    if (window.AIEngine && window.AIEngine.balls) {
      html += window.AIEngine.balls(latest.numbers);
    } else {
      html += "<p>最新数字：" + latest.numbers.join(" ・ ") + "</p>";
    }

    if (latest.bonus) {
      html += "<p>ボーナス：" + latest.bonus + "</p>";
    }

    html += "<hr>";

    html += "<h3>次回予想対象</h3>";
    html += "<p>次に予想する回：第" + nextDraw + "回</p>";

    html += "<p class='small'>";
    html += "この表示は、現在読み込まれている loto6-data-full.json の最新回を基準にしています。";
    html += "</p>";

    result.innerHTML = html;

  });

});
