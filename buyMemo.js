// buyMemo.js
// v3.6 買い目メモ機能

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");
  if (!main) return;

  const STORAGE_KEY = "loto6BuyMemoV36";

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>⑧ 買い目メモ</h2>

    <p class="note">
      実際に購入する番号やメモを保存できます。
    </p>

    <textarea
      id="buyMemoText"
      placeholder="例：A案を購入予定 / 03 08 14 22 31 40"
      style="width:100%;height:120px;padding:12px;border-radius:10px;border:1px solid #ccc;font-size:16px;"
    ></textarea>

    <button id="saveBuyMemoBtn">
      メモ保存
    </button>

    <button id="showBuyMemoBtn" class="secondary">
      メモ表示
    </button>

    <button id="clearBuyMemoBtn" class="secondary">
      メモ削除
    </button>

    <div id="buyMemoResult" class="result-box">
      まだメモはありません
    </div>
  `;

  main.appendChild(section);

  function getMemo() {
    return localStorage.getItem(STORAGE_KEY) || "";
  }

  function showMemo() {
    const memo = getMemo();

    if (!memo) {
      document.getElementById("buyMemoResult").innerHTML =
        "保存されたメモはありません。";
      return;
    }

    document.getElementById("buyMemoResult").innerHTML =
      "<h3>保存メモ</h3><p>" +
      memo.replace(/\n/g, "<br>") +
      "</p>";
  }

  document.getElementById("saveBuyMemoBtn").addEventListener("click", () => {

    const memo = document.getElementById("buyMemoText").value.trim();

    if (!memo) {
      document.getElementById("buyMemoResult").innerHTML =
        "メモを入力してください。";
      return;
    }

    localStorage.setItem(STORAGE_KEY, memo);

    document.getElementById("buyMemoResult").innerHTML =
      "メモを保存しました。";

  });

  document.getElementById("showBuyMemoBtn").addEventListener("click", () => {
    showMemo();
  });

  document.getElementById("clearBuyMemoBtn").addEventListener("click", () => {

    const ok = confirm("保存したメモを削除しますか？");

    if (!ok) return;

    localStorage.removeItem(STORAGE_KEY);

    document.getElementById("buyMemoText").value = "";

    document.getElementById("buyMemoResult").innerHTML =
      "メモを削除しました。";

  });

});
