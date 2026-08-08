function getColdNumbers(data, limit = 10) {

    if (!data || data.length === 0) {
        return [];
    }

    const last = Array(44).fill(-1);

    data.forEach((draw,index)=>{

        if(!draw.numbers) return;

        draw.numbers.forEach(num=>{

            last[num]=index;

        });

    });

    const ranking=[];

    for(let i=1;i<=43;i++){

        ranking.push({

            number:i,

            score:last[i]

        });

    }

    ranking.sort((a,b)=>a.score-b.score);

    return ranking.slice(0,limit);

}
