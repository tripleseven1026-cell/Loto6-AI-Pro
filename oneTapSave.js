// oneTapSave.js
// v4.5 予想結果ワンタップ保存

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");
  if (!main) return;

  const STORAGE_KEY = "loto6OneTapSaveV45";

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>⑭ ワンタップ保存</h2>

    <p class="note">
      AI予想A/B/C、本命・押さえ・穴狙い、次回予想対象回をまとめて保存します。
    </p>

    <button id="oneTapSaveBtn">
      予想結果をまとめて保存
    </button>

    <button id="showOneTapSaveBtn" class="secondary">
      保存一覧を表示
    </button>

    <button id="clearOneTapSaveBtn" class="secondary">
      保存一覧を削除
    </button>

    <div id="oneTapSaveResult" class="result-box">
      まだ保存していません
    </div>
  `;

  const copyResult = document.getElementById("copyToMemoResult");
  const copySection = copyResult ? copyResult.closest(".card") : null;

  if (copySection && copySection.nextSibling) {
    main.insertBefore(section, copySection.nextSibling);
  } else {
    main.appendChild(section);
  }

  function getSavedList() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
    } catch (e) {
      return [];
    }
  }

  function saveList(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  }

  function getNextDrawInfo() {
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

  function getPredictions() {
    const cards = document.querySelectorAll("#predictionResult .prediction-card");

    if (!cards || cards.length === 0) {
      return [];
    }

    const planNames = ["本命", "押さえ", "穴狙い"];

    return Array.from(cards).map((card, index) => {

      const title =
        card.querySelector(".prediction-title")?.textContent.trim()
        || "AI予想";

      const numbers =
        Array.from(card.querySelectorAll(".ball"))
          .map(el => el.textContent.trim())
          .filter(Boolean);

      const detail =
        Array.from(card.querySelectorAll(".small"))
          .map(el => el.textContent.trim())
          .join(" / ");

      return {
        plan: planNames[index] || "候補",
        title: title,
        numbers: numbers,
        detail: detail
      };

    });
  }

  function showSavedList() {
    const result = document.getElementById("oneTapSaveResult");
    const list = getSavedList();

    if (list.length === 0) {
      result.innerHTML = "保存一覧はありません。";
      return;
    }

    let html = "<h3>保存済み予想一覧</h3>";

    list.slice().reverse().slice(0, 10).forEach(item => {

      html += "<div class='prediction-card'>";

      html += "<div class='prediction-title'>";
      html += item.date;
      html += "</div>";

      if (item.nextDraw) {
        html += "<p>予想対象：第" + item.nextDraw + "回</p>";
      }

      item.predictions.forEach(p => {

        html += "<p><strong>" + p.plan + "：" + p.title + "</strong></p>";

        html += "<div class='number-line'>";
        p.numbers.forEach(n => {
          html += "<span class='ball'>" + n + "</span>";
        });
        html += "</div>";

        if (p.detail) {
          html += "<p class='small'>" + p.detail + "</p>";
        }

      });

      html += "</div>";

    });

    result.innerHTML = html;
  }

  document.getElementById("oneTapSaveBtn").addEventListener("click", () => {

    const predictions = getPredictions();
    const result = document.getElementById("oneTapSaveResult");

    if (predictions.length === 0) {
      result.innerHTML =
        "先に「今すぐ一括実行」または「予想開始」を押してください。";
      return;
    }

    const info = getNextDrawInfo();

    const list = getSavedList();

    list.push({
      date: new Date().toLocaleString("ja-JP"),
      latestDraw: info.latestDraw,
      nextDraw: info.nextDraw,
      predictions: predictions
    });

    saveList(list);

    result.innerHTML =
      "予想結果をまとめて保存しました。";
  });

  document.getElementById("showOneTapSaveBtn").addEventListener("click", () => {
    showSavedList();
  });

  document.getElementById("clearOneTapSaveBtn").addEventListener("click", () => {

    const ok = confirm("保存一覧を削除しますか？");
    if (!ok) return;

    localStorage.removeItem(STORAGE_KEY);

    document.getElementById("oneTapSaveResult").innerHTML =
      "保存一覧を削除しました。";

  });

});
