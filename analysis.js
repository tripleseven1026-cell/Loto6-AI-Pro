function analyzeHistory(data) {

    if (!data || data.length === 0) {
        document.getElementById("analysisResult").textContent =
        "データがありません";
        return;
    }

    document.getElementById("analysisResult").textContent =
    "分析完了（" + data.length + "件）";
}
