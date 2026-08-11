// topQuickStart.js
// v4.2 上部一括実行ボタン

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");
  if (!main) return;

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>🚀 すぐに予想する</h2>

    <p class="note">
      本番データ読込・AI分析・AI予想をまとめて実行します。
    </p>

    <button id="topQuickStartBtn">
      今すぐ一括実行
    </button>

    <div id="topQuickStartResult" class="result-box">
      上のボタンからすぐに予想できます。
    </div>
  `;

  const firstCard = main.querySelector(".card");

  if (firstCard) {
    main.insertBefore(section, firstCard);
  } else {
    main.appendChild(section);
  }

  document.getElementById("topQuickStartBtn").addEventListener("click", () => {

    const bottomQuickStartBtn = document.getElementById("quickStartBtn");
    const result = document.getElementById("topQuickStartResult");

    if (!bottomQuickStartBtn) {
      result.innerHTML =
        "一括実行ボタンが見つかりません。quickStart.jsを確認してください。";
      return;
    }

    bottomQuickStartBtn.click();

    result.innerHTML =
      "一括実行しました。AI分析とAI予想を確認してください。";

  });

});
