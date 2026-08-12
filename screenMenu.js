// screenMenu.js
// v4.8 画面整理メニュー

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");
  if (!main) return;

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>🧭 画面整理メニュー</h2>

    <p class="note">
      使いたい機能へすぐ移動できます。
    </p>

    <button id="menuPredictionBtn">
      AI予想へ
    </button>

    <button id="menuBuyBtn" class="secondary">
      買い目へ
    </button>

    <button id="menuSaveBtn" class="secondary">
      保存へ
    </button>

    <button id="menuCheckBtn" class="secondary">
      チェックへ
    </button>

    <button id="menuUpdateBtn" class="secondary">
      更新案内へ
    </button>

    <div id="screenMenuResult" class="result-box">
      移動したい場所を選んでください。
    </div>
  `;

  const topQuick = document.getElementById("topQuickStartBtn");
  const topQuickSection = topQuick ? topQuick.closest(".card") : null;

  if (topQuickSection && topQuickSection.nextSibling) {
    main.insertBefore(section, topQuickSection.nextSibling);
  } else {
    const firstCard = main.querySelector(".card");
    if (firstCard) {
      main.insertBefore(section, firstCard);
    } else {
      main.appendChild(section);
    }
  }

  function jump(targetId, message) {
    const target = document.getElementById(targetId);
    const result = document.getElementById("screenMenuResult");

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

  document.getElementById("menuPredictionBtn").addEventListener("click", () => {
    jump("predictionResult", "AI予想へ移動しました。");
  });

  document.getElementById("menuBuyBtn").addEventListener("click", () => {
    jump("buyPlanResult", "買い目作成へ移動しました。");
  });

  document.getElementById("menuSaveBtn").addEventListener("click", () => {
    jump("oneTapSaveResult", "ワンタップ保存へ移動しました。");
  });

  document.getElementById("menuCheckBtn").addEventListener("click", () => {
    jump("finalCheckResult", "最終確認チェックへ移動しました。");
  });

  document.getElementById("menuUpdateBtn").addEventListener("click", () => {
    jump("updateGuideResult", "データ更新案内へ移動しました。");
  });

});
