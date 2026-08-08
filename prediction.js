function predictNumbers(data) {

    if (!data || data.length === 0) {

        document.getElementById("predictionResult").textContent =
            "データがありません";

        return;

    }

    const count = Array(44).fill(0);

    data.forEach(draw => {

        draw.numbers.forEach(num => {

            if (num >= 1 && num <= 43) {

                count[num]++;

            }

        });

    });

    const ranking = [];

    for (let i = 1; i <= 43; i++) {

        ranking.push({

            number: i,
            count: count[i]

        });

    }

    ranking.sort((a,b)=>b.count-a.count);

    const result = ranking
        .slice(0,6)
        .map(x=>x.number)
        .sort((a,b)=>a-b);

    document.getElementById("predictionResult").innerHTML=

        "<h3>AI予測番号</h3>" +

        "<h2>"+result.join(" ・ ")+"</h2>";

}
