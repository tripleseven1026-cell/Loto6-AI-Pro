// jumpNav.js
// v4.3 AI予想結果へジャンプ

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");
  if (!main) return;

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>📍 すぐ移動</h2>

    <p class="note">
      一括実行後、見たい場所へすぐ移動できます。
    </p>

    <button id="jumpPredictionBtn">
      AI予想を見る
    </button>

    <button id="jumpNextInfoBtn" class="secondary">
      最新データ確認へ移動
    </button>

    <button id="jumpBuyPlanBtn" class="secondary">
      買い目作成へ移動
    </button>

    <div id="jumpNavResult" class="result-box">
      移動したい場所を選んでください。
    </div>
  `;

  const topBtn = document.getElementById("topQuickStartBtn");
  const topSection = topBtn ? topBtn.closest(".card") : null;

  if (topSection && topSection.nextSibling) {
    main.insertBefore(section, topSection.nextSibling);
  } else {
    const firstCard = main.querySelector(".card");
    if (firstCard) {
      main.insertBefore(section, firstCard);
    } else {
      main.appendChild(section);
    }
  }

  function jumpTo(targetId, message) {
    const target = document.getElementById(targetId);
    const result = document.getElementById("jumpNavResult");

    if (!target) {
      result.innerHTML =
        "移動先が見つかりません。ページを再読み込みしてください。";
      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "start"
    });

    result.innerHTML = message;
  }

  document.getElementById("jumpPredictionBtn").addEventListener("click", () => {
    jumpTo("predictionResult", "AI予想へ移動しました。");
  });

  document.getElementById("jumpNextInfoBtn").addEventListener("click", () => {
    jumpTo("nextInfoResult", "最新データ確認へ移動しました。");
  });

  document.getElementById("jumpBuyPlanBtn").addEventListener("click", () => {
    jumpTo("buyPlanResult", "買い目作成へ移動しました。");
  });

});
