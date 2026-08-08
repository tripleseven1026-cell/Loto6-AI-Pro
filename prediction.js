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

    const result = [];

    let odd = 0;
    let even = 0;
    let low = 0;
    let high = 0;

    ranking.forEach(item=>{

        if(result.length>=6) return;

        const n=item.number;

        const isOdd=n%2===1;
        const isLow=n<=21;

        if(isOdd && odd>=3) return;
        if(!isOdd && even>=3) return;

        if(isLow && low>=3) return;
        if(!isLow && high>=3) return;

        result.push(n);

        if(isOdd) odd++;
        else even++;

        if(isLow) low++;
        else high++;

    });

    result.sort((a,b)=>a-b);

    document.getElementById("predictionResult").innerHTML=

        "<h3>AI予想番号</h3>" +

        "<h2>"+result.join(" ・ ")+"</h2>";

                }
