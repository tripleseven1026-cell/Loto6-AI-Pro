// learningTrend.js
// v5.3 修正版 学習傾向分析

document.addEventListener("DOMContentLoaded", function () {

  var main = document.querySelector("main");
  if (!main) {
    return;
  }

  var STORAGE_KEY = "loto6LearningDataV52";

  var section = document.createElement("section");
  section.className = "card";

  section.innerHTML =
    '<h2>📊 学習傾向分析</h2>' +
    '<p class="note">保存したAI学習データから、A/B/Cのどの予想型が強いか分析します。</p>' +
    '<button id="analyzeLearningTrendBtn">学習傾向を分析</button>' +
    '<div id="learningTrendResult" class="result-box">まだ分析していません</div>';

  main.appendChild(section);

  function getLearningData() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function getTypeName(text) {
    text = String(text || "");

    if (text.indexOf("A") !== -1) {
      return "A 総合バランス型";
    }

    if (text.indexOf("B") !== -1) {
      return "B ホット重視型";
    }

    if (text.indexOf("C") !== -1) {
      return "C コールド重視型";
    }

    return "候補";
  }

  function analyzeLearningTrend() {
    var result = document.getElementById("learningTrendResult");
    var list = getLearningData();

    if (!list || list.length === 0) {
      result.innerHTML =
        "学習データがありません。先にAI学習データを保存してください。";
      return;
    }

    var summary = {};

    list.forEach(function (item) {
      if (!item.predictions) {
        return;
      }

      item.predictions.forEach(function (p) {
        var type = getTypeName(p.type || p.title);
        var hit = Number(p.hitCount) || 0;

        if (!summary[type]) {
          summary[type] = {
            count: 0,
            totalHit: 0,
            maxHit: 0,
            hit3plus: 0,
            hit4plus: 0
          };
        }

        summary[type].count++;
        summary[type].totalHit += hit;

        if (hit > summary[type].maxHit) {
          summary[type].maxHit = hit;
        }

        if (hit >= 3) {
          summary[type].hit3plus++;
        }

        if (hit >= 4) {
          summary[type].hit4plus++;
        }
      });
    });

    var rows = [];

    Object.keys(summary).forEach(function (type) {
      var s = summary[type];
      var average = s.count > 0 ? s.totalHit / s.count : 0;
      var score = average * 50 + s.maxHit * 10 + s.hit3plus * 5 + s.hit4plus * 10;

      rows.push({
        type: type,
        count: s.count,
        average: average,
        maxHit: s.maxHit,
        hit3plus: s.hit3plus,
        hit4plus: s.hit4plus,
        score: score
      });
    });

    rows.sort(function (a, b) {
      return b.score - a.score;
    });

    var html = "";

    html += "<h3>学習傾向分析結果</h3>";
    html += "<p>学習保存回数：" + list.length + "回</p>";

    if (list.length < 3) {
      html += "<p class='small'>※まだ学習データが少ないため、判断は仮です。</p>";
    }

    rows.forEach(function (row, index) {
      html += "<div class='prediction-card'>";
      html += "<div class='prediction-title'>" + (index + 1) + "位　" + row.type + "</div>";
      html += "<p>平均一致数：" + row.average.toFixed(2) + "個</p>";
      html += "<p>最高一致数：" + row.maxHit + "個</p>";
      html += "<p>3個以上一致：" + row.hit3plus + "回</p>";
      html += "<p>4個以上一致：" + row.hit4plus + "回</p>";
      html += "<p>学習スコア：" + row.score.toFixed(1) + "</p>";
      html += "</div>";
    });

    if (rows.length > 0) {
      html += "<hr>";
      html += "<h3>おすすめ強化型</h3>";
      html += "<p><strong>" + rows[0].type + "</strong></p>";
      html += "<p>現時点では、この型を次回AI予想で少し強める候補にします。</p>";
    }

    html += "<p class='small'>次のv5.4で、この学習結果をAI予想の重みに反映します。</p>";

    result.innerHTML = html;
  }

  document.getElementById("analyzeLearningTrendBtn").addEventListener("click", function () {
    analyzeLearningTrend();
  });

});
