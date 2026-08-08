function predictNumbers(data) {

    if (!data || data.length === 0) {
        document.getElementById("predictionResult").textContent =
            "データがありません";
        return;
    }

    const score = Array(44).fill(0);
    const lastSeen = Array(44).fill(-1);

    data.forEach((draw, index) => {

        if (!draw.numbers) return;

        draw.numbers.forEach(num => {

            score[num] += 3;
            lastSeen[num] = index;

        });

    });

    for (let i = 1; i <= 43; i++) {

        if (lastSeen[i] === -1) {

            score[i] += 20;

        } else {

            score[i] += data.length - lastSeen[i];

        }

    }

    const ranking = [];

    for (let i = 1; i <= 43; i++) {

        ranking.push({

            number: i,
            score: score[i]

        });

    }

    ranking.sort((a,b)=>b.score-a.score);

    const result =
        ranking
        .slice(0,6)
        .map(x=>x.number)
        .sort((a,b)=>a-b);

    document.getElementById("predictionResult").innerHTML =

        "<h3>AI予想番号</h3>" +

        "<h2>" +

        result.join(" ・ ") +

        "</h2>";

}
