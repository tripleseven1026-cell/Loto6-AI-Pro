function analyzeHistory(data) {

    if (!data || data.length === 0) {
        document.getElementById("analysisResult").innerHTML =
            "分析するデータがありません。";
        return;
    }

    let total = data.length;

    let message = `
        <h3>AI分析結果</h3>
        <p>抽選データ数：${total}件</p>
        <p>分析完了しました。</p>
        <p>次は予想ボタンを押してください。</p>
    `;

    document.getElementById("analysisResult").innerHTML = message;
}
