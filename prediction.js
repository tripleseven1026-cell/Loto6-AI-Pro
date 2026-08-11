// prediction.js
function predictNumbers(data){
  const history=window.AIEngine.normalizeData(data);
  if(!history||history.length===0){
    document.getElementById("predictionResult").innerHTML="予想するデータがありません。";
    return;
  }
  const predictions=window.AIEngine.makePredictions(history);
  let html="<h3>AI予想 3パターン</h3>";
  const reasons={
  A:"出現回数・直近傾向・コールド傾向を総合的に評価しています。",
  B:"最近よく出ている数字を優先し、勢いを重視しています。",
  C:"長く出ていない数字を優先し、反発候補を重視しています。"
　};
  predictions.forEach(p=>{
    html+="<div class='prediction-card'>";
    html+="<div class='prediction-title'>"+p.name+"： "+p.label+"</div>";
    html+="<div class='small'>理由："+(reasons[p.name]||"AIスコアで選定")+"</div>";
    html+=window.AIEngine.balls(p.numbers);
    html+="<div class='small'>";
    html+="AIスコア目安："+p.confidence+"% ／ ";
    html+="合計："+p.balance.sum+" ／ ";
    html+="奇数"+p.balance.odd+"・偶数"+p.balance.even+" ／ ";
    html+="低"+p.balance.low+"・高"+p.balance.high;
    html+="</div>";
    html+="</div>";
  });
  html+="<p class='small'>※信頼度は内部スコアの目安であり、的中保証ではありません。</p>";
  document.getElementById("predictionResult").innerHTML=html;
}
