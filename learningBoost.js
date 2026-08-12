// learningBoost.js
// v5.4 学習結果をAI予想に反映

document.addEventListener("DOMContentLoaded", function () {

  var main = document.querySelector("main");
  if (!main) return;

  var STORAGE_KEY = "loto6LearningDataV52";

  var section = document.createElement("section");
  section.className = "card";

  section.innerHTML =
    '<h2>🧠 学習反映AI予想</h2>' +
    '<p class="note">保存した学習データをもとに、強かった予想型を少し強めた予想を作ります。</p>' +
    '<button id="learningBoostPredictBtn">学習反映AI予想を作成</button>' +
    '<div id="learningBoostResult" class="result-box">まだ作成していません</div>';

  main.appendChild(section);

  function getLearningData() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function getHistory() {
    if (window.LotoHistory && window.LotoHistory.getHistory) {
      return window.LotoHistory.getHistory();
    }
    return [];
  }

  function getTypeCode(text) {
    text = String(text || "");

    if (text.indexOf("A") !== -1) return "A";
    if (text.indexOf("B") !== -1) return "B";
    if (text.indexOf("C") !== -1) return "C";

    return "A";
  }

  function getTypeLabel(code) {
    if (code === "A") return "A 総合バランス型";
    if (code === "B") return "B ホット重視型";
    if (code === "C") return "C コールド重視型";
    return "A 総合バランス型";
  }

  function getMode(code) {
    if (code === "B") return "hot";
    if (code === "C") return "cold";
    return "balance";
  }

  function analyzeBestType(list) {
    var summary = {};

    list.forEach(function (item) {
      if (!item.predictions) return;

      item.predictions.forEach(function (p) {
        var code = getTypeCode(p.type || p.title);
        var hit = Number(p.hitCount) || 0;

        if (!summary[code]) {
          summary[code] = {
            count: 0,
            totalHit: 0,
            maxHit: 0,
            hit3plus: 0
          };
        }

        summary[code].count++;
        summary[code].totalHit += hit;

        if (hit > summary[code].maxHit) {
          summary[code].maxHit = hit;
        }

        if (hit >= 3) {
          summary[code].hit3plus++;
        }
      });
    });

    var rows = Object.keys(summary).map(function (code) {
      var s = summary[code];
      var average = s.count > 0 ? s.totalHit / s.count : 0;
      var score = average * 50 + s.maxHit * 10 + s.hit3plus * 8;

      return {
        code: code,
        label: getTypeLabel(code),
        count: s.count,
        average: average,
        maxHit: s.maxHit,
        hit3plus: s.hit3plus,
        score: score
      };
    });

    rows.sort(function (a, b) {
      return b.score - a.score;
    });

    return rows;
  }

  function getLearningHitBoost(list) {
    var boost = {};

    for (var i = 1; i <= 43; i++) {
      boost[i] = 0;
    }

    list.forEach(function (item) {
      if (!item.predictions) return;

      item.predictions.forEach(function (p) {
        if (!p.hitNumbers) return;

        p.hitNumbers.forEach(function (n) {
          n = Number(n);
          if (n >= 1 && n <= 43) {
            boost[n] += 2;
          }
        });
      });
    });

    return boost;
  }

  function makeBalancedSet(scored, latest) {
    var selected = [];

    scored.forEach(function (item) {
      if (selected.length >= 6) return;

      var n = item.number;
      if (selected.indexOf(n) !== -1) return;

      var test = selected.concat([n]);

      var odd = test.filter(function (x) {
        return x % 2 === 1;
      }).length;

      var low = test.filter(function (x) {
        return x <= 21;
      }).length;

      if (test.length < 6) {
        if (odd > 4) return;
        if (low > 4) return;
      }

      selected.push(n);
    });

    if (selected.length < 6) {
      scored.forEach(function (item) {
        if (selected.length >= 6) return;
        if (selected.indexOf(item.number) === -1) {
          selected.push(item.number);
        }
      });
    }

    selected.sort(function (a, b) {
      return a - b;
    });

    return selected.slice(0, 6);
  }

  function makeBalls(numbers) {
    if (window.AIEngine && window.AIEngine.balls) {
      return window.AIEngine.balls(numbers);
    }

    var html = "<div class='number-line'>";
    numbers.forEach(function (n) {
      html += "<span class='ball'>" + String(n).padStart(2, "0") + "</span>";
    });
    html += "</div>";
    return html;
  }

  function makeLearningBoostPrediction() {
    var result = document.getElementById("learningBoostResult");
    var history = getHistory();

    if (!history || history.length === 0) {
      result.innerHTML =
        "先に「今すぐ一括実行」または「本番データ読込」を押してください。";
      return;
    }

    if (!window.AIEngine || !window.AIEngine.scoreNumbers) {
      result.innerHTML =
        "AIEngineが見つかりません。ページを再読み込みしてください。";
      return;
    }

    var learningList = getLearningData();

    if (!learningList || learningList.length === 0) {
      result.innerHTML =
        "学習データがありません。先にAI学習データを保存してください。";
      return;
    }

    var rows = analyzeBestType(learningList);
    var best = rows[0];

    if (!best) {
      result.innerHTML =
        "学習傾向を判定できませんでした。";
      return;
    }

    var mode = getMode(best.code);
    var scored = window.AIEngine.scoreNumbers(history, mode);
    var boost = getLearningHitBoost(learningList);

    scored = scored.map(function (item) {
      var learnedBoost = boost[item.number] || 0;

      return {
        number: item.number,
        score: item.score + learnedBoost
      };
    });

    scored.sort(function (a, b) {
      return b.score - a.score || a.number - b.number;
    });

    var latest = history[history.length - 1];
    var numbers = makeBalancedSet(scored, latest);

    var sum = numbers.reduce(function (a, b) {
      return a + b;
    }, 0);

    var odd = numbers.filter(function (n) {
      return n % 2 === 1;
    }).length;

    var low = numbers.filter(function (n) {
      return n <= 21;
    }).length;

    var latestDraw = Number(latest.draw) || "";
    var nextDraw = latestDraw ? latestDraw + 1 : "";

    var html = "";

    html += "<h3>学習反映AI予想</h3>";

    if (nextDraw) {
      html += "<p>予想対象：第" + nextDraw + "回</p>";
    }

    html += "<p>強化型：<strong>" + best.label + "</strong></p>";
    html += "<p>学習保存回数：" + learningList.length + "回</p>";

    if (learningList.length < 3) {
      html += "<p class='small'>※まだ学習データが少ないため、反映は仮です。本物の結果を3回以上保存すると精度判断しやすくなります。</p>";
    }

    html += "<div class='prediction-card'>";
    html += "<div class='prediction-title'>学習強化予想</div>";
    html += makeBalls(numbers);
    html += "<p class='small'>合計：" + sum + " ／ 奇数" + odd + "・偶数" + (6 - odd) + " ／ 低" + low + "・高" + (6 - low) + "</p>";
    html += "</div>";

    html += "<hr>";
    html += "<h3>学習型の判断</h3>";
    html += "<p>現在は、過去に一致数が良かった型を少し強めています。</p>";
    html += "<p class='small'>ロト6は偶然性が強いため、的中保証ではありません。学習結果は候補選びの補助として使ってください。</p>";

    result.innerHTML = html;
  }

  document.getElementById("learningBoostPredictBtn").addEventListener("click", function () {
    makeLearningBoostPrediction();
  });

});
