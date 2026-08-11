// copyToMemo.js
// v4.4 AI予想を買い目メモにコピー

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");
  if (!main) return;

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>⑬ メモへコピー</h2>

    <p class="note">
      AI予想や買い目候補を、買い目メモ欄へコピーできます。
    </p>

    <button id="copyPredictionToMemoBtn">
      AI予想A/B/Cをメモへコピー
    </button>

    <button id="copyBuyPlanToMemoBtn" class="secondary">
      本命・押さえ・穴狙いをメモへコピー
    </button>

    <div id="copyToMemoResult" class="result-box">
      まだコピーしていません
    </div>
  `;

  const jumpNav = document.getElementById("jumpNavResult");
  const jumpSection = jumpNav ? jumpNav.closest(".card") : null;

  if (jumpSection && jumpSection.nextSibling) {
    main.insertBefore(section, jumpSection.nextSibling);
  } else {
    main.appendChild(section);
  }

  function getNumbersFromCard(card) {
    return Array.from(card.querySelectorAll(".ball"))
      .map(el => el.textContent.trim())
      .filter(Boolean)
      .join(" ");
  }

  function copyCardsToMemo(selector, titleText, emptyMessage) {

    const cards = document.querySelectorAll(selector);
    const memo = document.getElementById("buyMemoText");
    const result = document.getElementById("copyToMemoResult");

    if (!memo) {
      result.innerHTML =
        "買い目メモ欄が見つかりません。ページを再読み込みしてください。";
      return;
    }

    if (!cards || cards.length === 0) {
      result.innerHTML = emptyMessage;
      return;
    }

    let text = "";
    text += titleText + "\n";
    text += "作成日時：" + new Date().toLocaleString("ja-JP") + "\n\n";

    cards.forEach(card => {
      const title =
        card.querySelector(".prediction-title")?.textContent.trim()
        || "候補";

      const numbers = getNumbersFromCard(card);

      text += title + "\n";
      text += numbers + "\n\n";
    });

    memo.value = text.trim();

    memo.scrollIntoView({
      behavior: "smooth",
      block: "center"
    });

    result.innerHTML =
      "買い目メモ欄へコピーしました。必要なら「メモ保存」を押してください。";
  }

  document.getElementById("copyPredictionToMemoBtn").addEventListener("click", () => {
    copyCardsToMemo(
      "#predictionResult .prediction-card",
      "AI予想A/B/C",
      "先に「今すぐ一括実行」または「予想開始」を押してください。"
    );
  });

  document.getElementById("copyBuyPlanToMemoBtn").addEventListener("click", () => {
    copyCardsToMemo(
      "#buyPlanResult .prediction-card",
      "買い目候補",
      "先に「買い目候補を作成」を押してください。"
    );
  });

});
