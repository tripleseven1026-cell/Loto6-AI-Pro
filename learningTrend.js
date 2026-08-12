// learningTrend.js
// v5.3 学習傾向分析

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");
  if (!main) return;

  const STORAGE_KEY = "loto6LearningDataV52";

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>📊 学習傾向分析</h2>

    <p class="note">
      保存したAI学習データから、A/B/Cのどの予想型が強いか分析します。
    </p>

    <button id="analyzeLearningTrendBtn">
      学習傾向を分析
    </button>

    <div id="learningTrendResult" class="result-box">
      まだ分析していません
    </div>
  `;

  const learningResult = document.getElementById("learningDataResult");
  const learningSection = learningResult ? learningResult.closest(".card") : null;

  if (learningSection && learningSection.nextSibling) {
    main.insertBefore(section, learningSection.nextSibling);
  } else {
    main.appendChild(section);
  }

  function getLearningData() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function getTypeName(type) {
    if (type.includes("A")) return "A 総合バランス型";
    if (type.includes("B")) return "B ホット重視型";
    if (type.includes("C")) return "C コールド重視型";
    return type || "候補";
  }

  function analyzeTrend() {
    const result = document.getElementById("learningTrendResult");
    const list = getLearningData();

    if (!list || list.length === 0) {
      result.innerHTML =
        "学習データがありません。先に実際の当選番号を入力して、AI学習データを保存してください。";
      return;
    }

    const summary = {};

    list.forEach(item => {
      if (!item.predictions) return;

      item.predictions.forEach(p => {

        const type = getTypeName(p.type || p.title || "候補");

        if (!summary[type]) {
          summary[type] = {
            count: 0,
            totalHit: 0,
            maxHit: 0,
            hit3plus: 0,
            hit4plus: 0
          };
        }

        const hit = Number(p.hitCount) || 0;

        summary[type].count++;
        summary[type].totalHit += hit;
        summary[type].maxHit = Math.max(summary[type].maxHit, hit);

        if (hit >= 3) summary[type].hit3plus++;
        if (hit >= 4) summary[type].hit4plus++;

      });
    });

    const rows = Object.keys(summary).map(type => {
      const s = summary[type];
      const average = s.count > 0 ? s.totalHit / s.count : 0;
      const hit3Rate = s.count > 0 ? s.hit3plus / s.count : 0;

      const score =
        average * 50 +
        s.maxHit * 10 +
        hit3Rate * 30;

      return {
        type: type,
        count: s.count,
        average: average,
        maxHit: s.maxHit,
        hit3plus: s.hit3plus,
        hit4plus: s.hit4plus,
        score: score
      };
    });

    rows.sort((a, b) => b.score - a.score);

    const best = rows[0];

    let html = "";

    html += "<h3>学習傾向分析結果</h3>";
    html += "<p>学習保存回数：" + list.length + "回</p>";

    if (list.length < 3) {
      html += "<p class='small'>";
      html += "※まだ学習データが少ないため、判断は仮です。3回以上保存すると傾向が見えやすくなります。";
      html += "</p>";
    }

    html += "<hr>";

    rows.forEach((row, index) => {

      html += "<div class='prediction-card'>";

      html += "<div class='prediction-title'>";
      html += (index + 1) + "位　" + row.type;
      html += "</div>";

      html += "<p>平均一致数：" + row.average.toFixed(2) + "個</p>";
      html += "<p>最高一致数：" + row.maxHit + "個</p>";
      html += "<p>3個以上一致：" + row.hit3plus + "回</p>";
      html += "<p>4個以上一致：" + row.hit4plus + "回</p>";
      html += "<p>学習スコア：" + row.score.toFixed(1) + "</p>";

      html += "</div>";

    });

    html += "<hr>";

    html += "<h3>おすすめ強化型</h3>";

    if (best) {
      html += "<p><strong>" + best.type + "</strong></p>";
      html += "<p>";
      html += "現時点では、この型を次回AI予想で少し強める候補にします。";
      html += "</p>";
    }

    html += "<p class='small'>";
    html += "このv5.3では傾向分析までです。次のv5.4で、この学習結果をAI予想の重みに反映します。";
    html += "</p>";

    result.innerHTML = html;
  }

  document.getElementById("analyzeLearningTrendBtn").addEventListener("click", () => {
    analyzeTrend();
  });

});
