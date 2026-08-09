// aiEngine.js
(function(){
  function normalizeData(raw){
    let list=raw;
    if(!Array.isArray(list)&&raw&&Array.isArray(raw.data))list=raw.data;
    if(!Array.isArray(list)&&raw&&Array.isArray(raw.draws))list=raw.draws;
    if(!Array.isArray(list)&&raw&&Array.isArray(raw.history))list=raw.history;
    if(!Array.isArray(list))return [];
    return list.map((draw,index)=>{
      let numbers=[];
      if(Array.isArray(draw.numbers))numbers=draw.numbers;
      else if(Array.isArray(draw.main))numbers=draw.main;
      else numbers=[draw.n1,draw.n2,draw.n3,draw.n4,draw.n5,draw.n6];
      numbers=numbers.map(Number).filter(n=>Number.isInteger(n)&&n>=1&&n<=43);
      numbers=[...new Set(numbers)].slice(0,6).sort((a,b)=>a-b);
      return {draw:draw.draw||draw.round||index+1,date:draw.date||draw.drawDate||"",numbers:numbers,bonus:Number(draw.bonus)||null};
    }).filter(draw=>draw.numbers.length===6);
  }
  function buildStats(data){
    const history=normalizeData(data);
    const total=history.length;
    const count=Array(44).fill(0);
    const recentCount=Array(44).fill(0);
    const lastSeen=Array(44).fill(-1);
    const recentStart=Math.max(0,total-20);
    history.forEach((draw,index)=>{
      draw.numbers.forEach(n=>{
        count[n]++;
        lastSeen[n]=index;
        if(index>=recentStart)recentCount[n]++;
      });
    });
    const ranking=[];
    for(let n=1;n<=43;n++){
      const gap=lastSeen[n]===-1?total+10:total-1-lastSeen[n];
      ranking.push({number:n,count:count[n],recent:recentCount[n],gap:gap});
    }
    const hot=[...ranking].sort((a,b)=>b.count-a.count||a.number-b.number);
    const recentHot=[...ranking].sort((a,b)=>b.recent-a.recent||b.count-a.count);
    const cold=[...ranking].sort((a,b)=>b.gap-a.gap||a.count-b.count);
    const sums=history.map(d=>d.numbers.reduce((a,b)=>a+b,0));
    const averageSum=sums.length?Math.round(sums.reduce((a,b)=>a+b,0)/sums.length):0;
    return {total,count,recentCount,lastSeen,ranking,hot,recentHot,cold,averageSum,latest:history[history.length-1]||null};
  }
  function scoreNumbers(data,mode){
    const stats=buildStats(data);
    const maxCount=Math.max(1,...stats.count);
    const maxRecent=Math.max(1,...stats.recentCount);
    const maxGap=Math.max(1,...stats.ranking.map(x=>x.gap));
    const scores=[];
    for(let n=1;n<=43;n++){
      const frequencyScore=(stats.count[n]/maxCount)*35;
      const recentScore=(stats.recentCount[n]/maxRecent)*25;
      const coldScore=((stats.ranking[n-1].gap||0)/maxGap)*25;
      let score=0;
      if(mode==="hot")score=frequencyScore*1.2+recentScore+coldScore*.3;
      else if(mode==="cold")score=frequencyScore*.6+recentScore*.3+coldScore*1.4;
      else score=frequencyScore+recentScore*.8+coldScore*.8;
      score+=1/(1+Math.abs(22-n));
      scores.push({number:n,score:Math.round(score*10)/10});
    }
    scores.sort((a,b)=>b.score-a.score||a.number-b.number);
    return scores;
  }
  function isBalanced(numbers,latest){
    const sum=numbers.reduce((a,b)=>a+b,0);
    const odd=numbers.filter(n=>n%2===1).length;
    const low=numbers.filter(n=>n<=21).length;
    const overlap=latest?numbers.filter(n=>latest.numbers.includes(n)).length:0;
    return {sum:sum,odd:odd,even:6-odd,low:low,high:6-low,overlap:overlap,ok:sum>=85&&sum<=175&&odd>=2&&odd<=4&&low>=2&&low<=4&&overlap<=2};
  }
  function chooseSet(scored,latest,offset){
    const selected=[];
    const rotated=scored.slice(offset).concat(scored.slice(0,offset));
    rotated.forEach(item=>{
      if(selected.length>=6)return;
      const candidate=[...selected,item.number].sort((a,b)=>a-b);
      const b=isBalanced(candidate,latest);
      if(candidate.length<6){
        if(b.odd>4)return;
        if(b.low>4)return;
      }
      if(!selected.includes(item.number))selected.push(item.number);
    });
    if(selected.length<6){
      scored.forEach(item=>{
        if(selected.length>=6)return;
        if(!selected.includes(item.number))selected.push(item.number);
      });
    }
    selected.sort((a,b)=>a-b);
    return selected.slice(0,6);
  }
  function makePredictions(data){
    const history=normalizeData(data);
    const stats=buildStats(history);
    if(history.length===0)return [];
    const modes=[
      {name:"A",label:"総合バランス型",mode:"balance",offset:0},
      {name:"B",label:"ホット重視型",mode:"hot",offset:2},
      {name:"C",label:"コールド重視型",mode:"cold",offset:4}
    ];
    return modes.map(item=>{
      const scored=scoreNumbers(history,item.mode);
      const numbers=chooseSet(scored,stats.latest,item.offset);
      const balance=isBalanced(numbers,stats.latest);
      const avgScore=numbers.reduce((sum,n)=>{
        const found=scored.find(x=>x.number===n);
        return sum+(found?found.score:0);
      },0)/6;
      let confidence=Math.round(Math.min(92,45+avgScore+history.length*.4));
      if(balance.ok)confidence+=3;
      confidence=Math.min(95,confidence);
      return {name:item.name,label:item.label,numbers:numbers,confidence:confidence,balance:balance};
    });
  }
  function balls(numbers){
    return '<div class="number-line">'+numbers.map(n=>'<span class="ball">'+String(n).padStart(2,"0")+'</span>').join("")+'</div>';
  }
  window.AIEngine={normalizeData,buildStats,scoreNumbers,makePredictions,balls};
})();
