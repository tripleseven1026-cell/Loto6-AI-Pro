// statusLamp.js
// v4.9 状態確認ランプ

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");
  if (!main) return;

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>🚦 状態確認ランプ</h2>

    <p class="note">
      データ読込・AI予想・買い目作成・保存・最終確認の状態を確認できます。
    </p>

    <button id="refreshStatusLampBtn">
      状態を更新
    </button>

    <div id="statusLampResult" class="result-box">
      まだ確認していません
    </div>
  `;

  const menuResult = document.getElementById("screenMenuResult");
  const menuSection = menuResult ? menuResult.closest(".card") : null;

  if (menuSection && menuSection.nextSibling) {
    main.insertBefore(section, menuSection.nextSibling);
  } else {
    main.appendChild(section);
  }

  function hasSavedOneTap() {
    try {
      const list = JSON.parse(localStorage.getItem("loto6OneTapSaveV45")) || [];
      return list.length > 0;
    } catch (e) {
      return false;
    }
  }

  function hasFinalCheck() {
    try {
      const saved = JSON.parse(localStorage.getItem("loto6FinalCheckMemoV47"));
      return !!saved;
    } catch (e) {
      return false;
    }
  }

  function lamp(ok, text) {
    return "<p>" + (ok ? "🟢 OK　" : "🔴 未完了　") + text + "</p>";
  }

  function updateStatusLamp() {

    const history =
      window.LotoHistory && window.LotoHistory.getHistory
        ? window.LotoHistory.getHistory()
        : [];

    const dataOk = history && history.length > 0;

    const predictionOk =
      document.querySelectorAll("#predictionResult .prediction-card").length > 0;

    const buyPlanOk =
      document.querySelectorAll("#buyPlanResult .prediction-card").length > 0;

    const saveOk = hasSavedOneTap();

    const finalCheckOk = hasFinalCheck();

    let html = "";

    html += "<h3>現在の状態</h3>";

    html += lamp(dataOk, "データ読込");

    html += lamp(predictionOk, "AI予想");

    html += lamp(buyPlanOk, "買い目作成");

    html += lamp(saveOk, "ワンタップ保存");

    html += lamp(finalCheckOk, "最終確認");

    html += "<hr>";

    if (dataOk && predictionOk && buyPlanOk && saveOk && finalCheckOk) {
      html += "<p><strong>✅ 準備完了です。</strong></p>";
    } else {
      html += "<p><strong>未完了の項目があります。</strong></p>";
    }

    html += "<p class='small'>";
    html += "ボタン操作後に「状態を更新」を押すと、最新状態になります。";
    html += "</p>";

    document.getElementById("statusLampResult").innerHTML = html;
  }

  document.getElementById("refreshStatusLampBtn").addEventListener("click", () => {
    updateStatusLamp();
  });

  setTimeout(updateStatusLamp, 500);

});
