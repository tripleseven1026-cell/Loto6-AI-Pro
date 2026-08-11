// finalCheckMemo.js
// v4.7 最終確認チェック

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");
  if (!main) return;

  const STORAGE_KEY = "loto6FinalCheckMemoV47";

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>⑯ 最終確認チェック</h2>

    <p class="note">
      購入前に、データ・予想対象回・保存・購入状況を確認します。
    </p>

    <label>
      <input type="checkbox" class="final-check" value="最新データを読み込んだ">
      最新データを読み込んだ
    </label><br>

    <label>
      <input type="checkbox" class="final-check" value="次回予想対象回を確認した">
      次回予想対象回を確認した
    </label><br>

    <label>
      <input type="checkbox" class="final-check" value="AI予想を確認した">
      AI予想を確認した
    </label><br>

    <label>
      <input type="checkbox" class="final-check" value="買い目を保存した">
      買い目を保存した
    </label><br>

    <label>
      <input type="checkbox" class="final-check" value="購入チェックを完了した">
      購入チェックを完了した
    </label><br>

    <textarea
      id="finalCheckMemoText"
      placeholder="最終メモ：例 本命のみ購入 / 押さえも追加 / 今回は見送り"
      style="width:100%;height:100px;margin-top:12px;padding:12px;border-radius:10px;border:1px solid #ccc;font-size:16px;"
    ></textarea>

    <button id="saveFinalCheckBtn">
      最終確認を保存
    </button>

    <button id="showFinalCheckBtn" class="secondary">
      保存内容を表示
    </button>

    <button id="clearFinalCheckBtn" class="secondary">
      最終確認をリセット
    </button>

    <div id="finalCheckResult" class="result-box">
      まだ保存していません
    </div>
  `;

  const purchaseResult = document.getElementById("purchaseCheckResult");
  const purchaseSection = purchaseResult ? purchaseResult.closest(".card") : null;

  if (purchaseSection && purchaseSection.nextSibling) {
    main.insertBefore(section, purchaseSection.nextSibling);
  } else {
    main.appendChild(section);
  }

  function getChecks() {
    return Array.from(document.querySelectorAll(".final-check"));
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

  function saveFinalCheck() {
    const checks = getChecks().map(check => {
      return {
        name: check.value,
        checked: check.checked
      };
    });

    const memo = document.getElementById("finalCheckMemoText").value.trim();
    const drawInfo = getDrawInfo();

    const data = {
      date: new Date().toLocaleString("ja-JP"),
      latestDraw: drawInfo.latestDraw,
      nextDraw: drawInfo.nextDraw,
      checks: checks,
      memo: memo
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));

    document.getElementById("finalCheckResult").innerHTML =
      "最終確認を保存しました。";
  }

  function showFinalCheck() {
    const result = document.getElementById("finalCheckResult");

    let saved = null;

    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      saved = null;
    }

    if (!saved) {
      result.innerHTML = "保存内容はありません。";
      return;
    }

    let html = "<h3>保存済み最終確認</h3>";

    html += "<p>保存日時：" + saved.date + "</p>";

    if (saved.latestDraw) {
      html += "<p>最新回：第" + saved.latestDraw + "回</p>";
    }

    if (saved.nextDraw) {
      html += "<p>予想対象：第" + saved.nextDraw + "回</p>";
    }

    saved.checks.forEach(item => {
      html += "<p>";
      html += item.checked ? "✅ " : "⬜ ";
      html += item.name;
      html += "</p>";
    });

    if (saved.memo) {
      html += "<hr>";
      html += "<p style='white-space:pre-wrap;'>" + saved.memo + "</p>";
    }

    result.innerHTML = html;
  }

  function restoreFinalCheck() {
    let saved = null;

    try {
      saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    } catch (e) {
      saved = null;
    }

    if (!saved) return;

    getChecks().forEach(check => {
      const found = saved.checks.find(item => item.name === check.value);
      if (found) {
        check.checked = found.checked;
      }
    });

    if (saved.memo) {
      document.getElementById("finalCheckMemoText").value = saved.memo;
    }
  }

  document.getElementById("saveFinalCheckBtn").addEventListener("click", () => {
    saveFinalCheck();
  });

  document.getElementById("showFinalCheckBtn").addEventListener("click", () => {
    showFinalCheck();
  });

  document.getElementById("clearFinalCheckBtn").addEventListener("click", () => {

    const ok = confirm("最終確認をリセットしますか？");
    if (!ok) return;

    localStorage.removeItem(STORAGE_KEY);

    getChecks().forEach(check => {
      check.checked = false;
    });

    document.getElementById("finalCheckMemoText").value = "";

    document.getElementById("finalCheckResult").innerHTML =
      "最終確認をリセットしました。";

  });

  restoreFinalCheck();

});
