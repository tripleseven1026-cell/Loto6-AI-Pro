// dataUpdateGuide.js
// v4.0 データ更新案内

document.addEventListener("DOMContentLoaded", () => {

  const main = document.querySelector("main");
  if (!main) return;

  const section = document.createElement("section");
  section.className = "card";

  section.innerHTML = `
    <h2>⑪ データ更新案内</h2>

    <p class="note">
      新しいロト6抽選結果が出たら、次の手順で本番データを更新します。
    </p>

    <button id="showUpdateGuideBtn">
      更新手順を表示
    </button>

    <div id="updateGuideResult" class="result-box">
      まだ表示していません
    </div>
  `;

  main.appendChild(section);

  document.getElementById("showUpdateGuideBtn").addEventListener("click", () => {

    let html = "";

    html += "<h3>最新データ更新手順</h3>";

    html += "<p>① ロト6の最新CSVをダウンロードします。</p>";

    html += "<p>② そのCSVファイルをChatGPTに送ります。</p>";

    html += "<p>③ ChatGPTで loto6-data-full.json に変換します。</p>";

    html += "<p>④ GitHubで古い loto6-data-full.json を新しいものに置き換えます。</p>";

    html += "<p>⑤ GitHub Pagesを開き直します。</p>";

    html += "<p>⑥ 本番データ読込を押します。</p>";

    html += "<hr>";

    html += "<h3>確認すること</h3>";

    html += "<p>最新データ確認で、最新回が増えていれば更新成功です。</p>";

    html += "<p class='small'>";
    html += "例：第2126回まで入っていた場合、次回更新後に第2127回が表示されれば成功です。";
    html += "</p>";

    document.getElementById("updateGuideResult").innerHTML = html;

  });

});
