function calculateAIScore(data){

    if(!data || data.length===0){
        return [];
    }

    const score = Array(44).fill(0);

    data.forEach((draw,index)=>{

        if(!draw.numbers) return;

        draw.numbers.forEach(n=>{

            score[n]+=5;

            score[n]+=index;

        });

    });

    const result=[];

    for(let i=1;i<=43;i++){

        result.push({

            number:i,
            score:score[i]

        });

    }

    result.sort((a,b)=>b.score-a.score);

    return result;

}
