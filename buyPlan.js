// buyPlan.js
// v3.7 買い目作成補助

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");
  if (!main) return;

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>⑨ 買い目作成補助</h2>

    <p class="note">
      AI予想A/B/Cを、本命・押さえ・穴狙いとして整理します。
    </p>

    <button id="createBuyPlanBtn">
      買い目候補を作成
    </button>

    <div id="buyPlanResult" class="result-box">
      まだ作成していません
    </div>
  `;

  main.appendChild(section);

  function getPredictions() {

    const cards =
      document.querySelectorAll("#predictionResult .prediction-card");

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

      return {
        title,
        numbers
      };

    });

  }

  document.getElementById("createBuyPlanBtn").addEventListener("click", () => {

    const predictions = getPredictions();

    if (predictions.length === 0) {
      document.getElementById("buyPlanResult").innerHTML =
        "先に「予想開始」を押してください。";
      return;
    }

    let html = "<h3>買い目候補</h3>";

    const labels = [
      {
        name: "本命",
        comment: "AIスコアとバランスを重視した中心候補です。"
      },
      {
        name: "押さえ",
        comment: "直近の勢いを重視した補助候補です。"
      },
      {
        name: "穴狙い",
        comment: "長く出ていない数字を含めた反発候補です。"
      }
    ];

    predictions.forEach((p, index) => {

      const label = labels[index] || {
        name: "候補",
        comment: "AI予想候補です。"
      };

      html += "<div class='prediction-card'>";
      html += "<div class='prediction-title'>" + label.name + "：" + p.title + "</div>";

      html += "<div class='number-line'>";
      p.numbers.forEach(n => {
        html += "<span class='ball'>" + String(n).padStart(2, "0") + "</span>";
      });
      html += "</div>";

      html += "<p class='small'>" + label.comment + "</p>";
      html += "</div>";

    });

    html += "<p class='small'>※購入判断は自己責任でお願いします。的中保証ではありません。</p>";

    document.getElementById("buyPlanResult").innerHTML = html;

  });

});
