// purchaseChecklist.js
// v4.6 購入チェックリスト

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");
  if (!main) return;

  const STORAGE_KEY = "loto6PurchaseChecklistV46";

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>⑮ 購入チェックリスト</h2>

    <p class="note">
      買い忘れ防止用のチェックリストです。
    </p>

    <label>
      <input type="checkbox" class="purchase-check" value="本命を買う">
      本命を買う
    </label><br>

    <label>
      <input type="checkbox" class="purchase-check" value="押さえを買う">
      押さえを買う
    </label><br>

    <label>
      <input type="checkbox" class="purchase-check" value="穴狙いを買う">
      穴狙いを買う
    </label><br>

    <label>
      <input type="checkbox" class="purchase-check" value="購入完了">
      購入完了
    </label><br>

    <button id="savePurchaseCheckBtn">
      チェック保存
    </button>

    <button id="showPurchaseCheckBtn" class="secondary">
      保存内容を表示
    </button>

    <button id="clearPurchaseCheckBtn" class="secondary">
      チェックをリセット
    </button>

    <div id="purchaseCheckResult" class="result-box">
      まだ保存していません
    </div>
  `;

  const oneTapResult = document.getElementById("oneTapSaveResult");
  const oneTapSection = oneTapResult ? oneTapResult.closest(".card") : null;

  if (oneTapSection && oneTapSection.nextSibling) {
    main.insertBefore(section, oneTapSection.nextSibling);
  } else {
    main.appendChild(section);
  }

  function getChecks() {
    return Array.from(document.querySelectorAll(".purchase-check"));
  }

  function saveChecks() {
    const checks = getChecks().map(check => {
      return {
        name: check.value,
        checked: check.checked
      };
    });

    localStorage.setItem(STORAGE_KEY, JSON.stringify({
      date: new Date().toLocaleString("ja-JP"),
      checks: checks
    }));

    document.getElementById("purchaseCheckResult").innerHTML =
      "購入チェックリストを保存しました。";
  }

  function showChecks() {
    const result = document.getElementById("purchaseCheckResult");

    let saved = null;

    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      saved = null;
    }

    if (!saved || !saved.checks) {
      result.innerHTML = "保存内容はありません。";
      return;
    }

    let html = "<h3>保存済みチェック</h3>";
    html += "<p>保存日時：" + saved.date + "</p>";

    saved.checks.forEach(item => {
      html += "<p>";
      html += item.checked ? "✅ " : "⬜ ";
      html += item.name;
      html += "</p>";
    });

    result.innerHTML = html;
  }

  function restoreChecks() {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
      if (!saved || !saved.checks) return;

      const checks = getChecks();

      checks.forEach(check => {
        const found = saved.checks.find(item => item.name === check.value);
        if (found) {
          check.checked = found.checked;
        }
      });

    } catch (e) {
      return;
    }
  }

  document.getElementById("savePurchaseCheckBtn").addEventListener("click", () => {
    saveChecks();
  });

  document.getElementById("showPurchaseCheckBtn").addEventListener("click", () => {
    showChecks();
  });

  document.getElementById("clearPurchaseCheckBtn").addEventListener("click", () => {

    const ok = confirm("購入チェックをリセットしますか？");
    if (!ok) return;

    localStorage.removeItem(STORAGE_KEY);

    getChecks().forEach(check => {
      check.checked = false;
    });

    document.getElementById("purchaseCheckResult").innerHTML =
      "購入チェックをリセットしました。";

  });

  restoreChecks();

});
