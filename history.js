function analyzeHistory(data) {

    if (!data || data.length === 0) {
        document.getElementById("analysisResult").innerHTML =
            "データがありません。";
        return;
    }

    const count = {};

    data.forEach(draw => {
        if (draw.numbers) {
            draw.numbers.forEach(num => {
                count[num] = (count[num] || 0) + 1;
            });
        }
    });

    const ranking = Object.entries(count)
        .sort((a, b) => b[1] - a[1]);

    let html = "<h3>出現回数ランキング</h3>";

    ranking.forEach(item => {
        html += `${item[0]} ： ${item[1]}回<br>`;
    });

    document.getElementById("analysisResult").innerHTML = html;
}
