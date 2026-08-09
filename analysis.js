// analysis.js
function analyzeHistory(data){
  const history=window.AIEngine.normalizeData(data);
  if(!history||history.length===0){
    document.getElementById("analysisResult").innerHTML="分析するデータがありません。";
    return;
  }
  const stats=window.AIEngine.buildStats(history);
  let html="";
  html+="<h3>AI分析結果</h3>";
  html+="<p>抽選データ数："+stats.total+"件</p>";
  if(stats.latest){
    html+="<p>最新回："+stats.latest.draw+"</p>";
    if(stats.latest.date)html+="<p>日付："+stats.latest.date+"</p>";
    html+=window.AIEngine.balls(stats.latest.numbers);
    if(stats.latest.bonus)html+="<p>ボーナス："+stats.latest.bonus+"</p>";
  }
  html+="<h3>出現回数 TOP10</h3>";
  stats.hot.slice(0,10).forEach((x,i)=>{
    html+=(i+1)+"位　"+x.number+"（"+x.count+"回）<br>";
  });
  html+="<h3>直近ホット TOP6</h3>";
  html+=window.AIEngine.balls(stats.recentHot.slice(0,6).map(x=>x.number));
  html+="<h3>コールド TOP6</h3>";
  html+=window.AIEngine.balls(stats.cold.slice(0,6).map(x=>x.number));
  html+="<p class='small'>平均合計値："+stats.averageSum+"</p>";
  document.getElementById("analysisResult").innerHTML=html;
}
