// checkResult.js
// v3.2 的中チェック機能

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");

  if (!main) return;

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>⑤ 的中チェック</h2>
    <p class="note">
      抽選結果の本数字6個を入力してください。例：1 5 8 22 31 40
    </p>

    <input
      type="text"
      id="actualNumbers"
      placeholder="本数字6個を入力">

    <button id="checkHitBtn">
      的中チェック
    </button>

    <div id="hitCheckResult" class="result-box">
      まだチェックしていません
    </div>
  `;

  main.appendChild(section);

  const checkBtn = document.getElementById("checkHitBtn");

  checkBtn.addEventListener("click", () => {

    const input = document.getElementById("actualNumbers").value;

    const actual = input
      .replace(/,/g, " ")
      .replace(/　/g, " ")
      .split(" ")
      .map(n => Number(n.trim()))
      .filter(n => Number.isInteger(n) && n >= 1 && n <= 43);

    const uniqueActual = [...new Set(actual)];

    if (uniqueActual.length !== 6) {
      document.getElementById("hitCheckResult").innerHTML =
        "本数字を6個入力してください。";
      return;
    }

    const predictionCards =
      document.querySelectorAll(".prediction-card");

    if (!predictionCards || predictionCards.length === 0) {
      document.getElementById("hitCheckResult").innerHTML =
        "先に「予想開始」を押してください。";
      return;
    }

    let html = "<h3>的中チェック結果</h3>";

    predictionCards.forEach(card => {

      const title =
        card.querySelector(".prediction-title")?.textContent || "予想";

      const balls =
        Array.from(card.querySelectorAll(".ball"))
          .map(el => Number(el.textContent));

      const hits =
        balls.filter(n => uniqueActual.includes(n));

      html += "<div class='prediction-card'>";
      html += "<div class='prediction-title'>" + title + "</div>";
      html += "<p>一致数：" + hits.length + "個</p>";

      if (hits.length > 0) {
        html += "<p>一致数字：" + hits.join(" ・ ") + "</p>";
      } else {
        html += "<p>一致数字：なし</p>";
      }

      if (hits.length >= 3) {
        html += "<p>判定：当たり候補</p>";
      } else {
        html += "<p>判定：不的中</p>";
      }

      html += "</div>";

    });

    document.getElementById("hitCheckResult").innerHTML = html;

  });

});
