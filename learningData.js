// learningData.js
// v5.2 AI学習データ保存

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");
  if (!main) return;

  const STORAGE_KEY = "loto6LearningDataV52";

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>🧠 AI学習データ</h2>

    <p class="note">
      AI予想と実際の当選番号を保存し、どの予想型が当たりやすいか学習用に記録します。
    </p>

    <button id="saveLearningDataBtn">
      今回の結果を学習保存
    </button>

    <button id="showLearningDataBtn" class="secondary">
      学習データを見る
    </button>

    <button id="clearLearningDataBtn" class="secondary">
      学習データを削除
    </button>

    <div id="learningDataResult" class="result-box">
      まだ学習データはありません
    </div>
  `;

  const statusResult = document.getElementById("statusLampResult");
  const statusSection = statusResult ? statusResult.closest(".card") : null;

  if (statusSection && statusSection.nextSibling) {
    main.insertBefore(section, statusSection.nextSibling);
  } else {
    main.appendChild(section);
  }

  function getSavedData() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveData(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function getActualNumbers() {
    const input = document.getElementById("actualNumbers");
    if (!input) return [];

    return [...new Set(
      input.value
        .replace(/,/g, " ")
        .replace(/　/g, " ")
        .split(" ")
        .map(n => Number(n.trim()))
        .filter(n => Number.isInteger(n) && n >= 1 && n <= 43)
    )];
  }

  function getCurrentPredictions() {
    const cards = document.querySelectorAll("#predictionResult .prediction-card");

    if (!cards || cards.length === 0) {
      return [];
    }

    return Array.from(cards).map(card => {

      const title =
        card.querySelector(".prediction-title")?.textContent.trim()
        || "AI予想";

      const numbers =
        Array.from(card.querySelectorAll(".ball"))
          .map(el => Number(el.textContent))
          .filter(n => Number.isInteger(n));

      let type = "候補";

      if (title.includes("A")) type = "A 総合バランス型";
      if (title.includes("B")) type = "B ホット重視型";
      if (title.includes("C")) type = "C コールド重視型";

      return {
        type: type,
        title: title,
        numbers: numbers
      };

    });
  }

  function getDrawInfo() {
    const history =
      window.LotoHistory && window.LotoHistory.getHistory
        ? window.LotoHistory.getHistory()
        : [];

    if (!history || history.length === 0) {
      return {
        latestDraw: "",
        nextDraw: ""
      };
    }

    const latest = history[history.length - 1];
    const latestDraw = Number(latest.draw);

    return {
      latestDraw: latestDraw,
      nextDraw: latestDraw + 1
    };
  }

  function saveLearningData() {
    const result = document.getElementById("learningDataResult");

    const actual = getActualNumbers();

    if (actual.length !== 6) {
      result.innerHTML =
        "先に「的中チェック」に実際の本数字6個を入力してください。";
      return;
    }

    const predictions = getCurrentPredictions();

    if (predictions.length === 0) {
      result.innerHTML =
        "先に「今すぐ一括実行」または「予想開始」を押してください。";
      return;
    }

    const drawInfo = getDrawInfo();

    const learnedPredictions = predictions.map(p => {

      const hits = p.numbers.filter(n => actual.includes(n));

      return {
        type: p.type,
        title: p.title,
        numbers: p.numbers,
        hitCount: hits.length,
        hitNumbers: hits
      };

    });

    const list = getSavedData();

    list.push({
      date: new Date().toLocaleString("ja-JP"),
      latestDraw: drawInfo.latestDraw,
      targetDraw: drawInfo.nextDraw,
      actualNumbers: actual,
      predictions: learnedPredictions
    });

    saveData(list);

    result.innerHTML =
      "AI学習データを保存しました。次回以降の学習分析に使えます。";
  }

  function showLearningData() {
    const result = document.getElementById("learningDataResult");
    const list = getSavedData();

    if (list.length === 0) {
      result.innerHTML = "学習データはありません。";
      return;
    }

    const summary = {};

    list.forEach(item => {
      item.predictions.forEach(p => {
        if (!summary[p.type]) {
          summary[p.type] = {
            count: 0,
            totalHit: 0,
            maxHit: 0
          };
        }

        summary[p.type].count++;
        summary[p.type].totalHit += p.hitCount;
        summary[p.type].maxHit = Math.max(summary[p.type].maxHit, p.hitCount);
      });
    });

    let html = "<h3>AI学習データ集計</h3>";
    html += "<p>保存回数：" + list.length + "回</p>";

    Object.keys(summary).forEach(type => {
      const s = summary[type];
      const average = (s.totalHit / s.count).toFixed(2);

      html += "<div class='prediction-card'>";
      html += "<div class='prediction-title'>" + type + "</div>";
      html += "<p>平均一致数：" + average + "個</p>";
      html += "<p>最高一致数：" + s.maxHit + "個</p>";
      html += "</div>";
    });

    html += "<hr>";
    html += "<h3>直近の学習履歴</h3>";

    list.slice().reverse().slice(0, 5).forEach(item => {

      html += "<div class='prediction-card'>";

      html += "<div class='prediction-title'>";
      html += item.date;
      html += "</div>";

      if (item.targetDraw) {
        html += "<p>対象回：第" + item.targetDraw + "回</p>";
      }

      html += "<p>実際の本数字：" + item.actualNumbers.join(" ・ ") + "</p>";

      item.predictions.forEach(p => {
        html += "<p><strong>" + p.type + "</strong></p>";
        html += "<p>一致数：" + p.hitCount + "個</p>";
        html += "<p>一致数字：" + (p.hitNumbers.length ? p.hitNumbers.join(" ・ ") : "なし") + "</p>";
      });

      html += "</div>";

    });

    html += "<p class='small'>";
    html += "この段階では学習データの保存と集計までです。次の段階で、この結果をAI予想の重みに反映します。";
    html += "</p>";

    result.innerHTML = html;
  }

  document.getElementById("saveLearningDataBtn").addEventListener("click", () => {
    saveLearningData();
  });

  document.getElementById("showLearningDataBtn").addEventListener("click", () => {
    showLearningData();
  });

  document.getElementById("clearLearningDataBtn").addEventListener("click", () => {

    const ok = confirm("AI学習データを削除しますか？");
    if (!ok) return;

    localStorage.removeItem(STORAGE_KEY);

    document.getElementById("learningDataResult").innerHTML =
      "AI学習データを削除しました。";

  });

});
