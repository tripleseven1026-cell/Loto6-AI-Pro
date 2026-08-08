function getHotNumbers(data, limit = 10) {

    if (!data || data.length === 0) {
        return [];
    }

    const count = Array(44).fill(0);

    data.forEach(draw => {

        if (!draw.numbers) return;

        draw.numbers.forEach(num => {

            count[num]++;

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

    return ranking.slice(0,limit);

}
