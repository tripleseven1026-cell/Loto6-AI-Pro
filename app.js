// app.js
document.addEventListener("DOMContentLoaded",()=>{
  const fileInput=document.getElementById("jsonFile");
  const loadBtn=document.getElementById("loadBtn");
  const sampleBtn=document.getElementById("sampleBtn");
  const analysisBtn=document.getElementById("analysisBtn");
  const predictionBtn=document.getElementById("predictionBtn");
  const dataStatus=document.getElementById("dataStatus");
  const latestNumbers=document.getElementById("latestNumbers");

  function showLatest(history,sourceName){
    const latest=window.LotoHistory.getLatestDraw();
    dataStatus.textContent=sourceName+" 読込完了："+history.length+"件";
    if(!latest){
      latestNumbers.textContent="データがありません";
      return;
    }
    let html="";
    html+="<p>最新回："+latest.draw+"</p>";
    if(latest.date)html+="<p>日付："+latest.date+"</p>";
    html+=window.AIEngine.balls(latest.numbers);
    if(latest.bonus)html+="<p>ボーナス："+latest.bonus+"</p>";
    latestNumbers.innerHTML=html;
  }

  function loadRawData(raw,sourceName){
    const history=window.LotoHistory.setHistory(raw);
    if(history.length===0){
      alert("有効なロト6データが見つかりません。");
      return;
    }
    showLatest(history,sourceName);
    document.getElementById("analysisResult").textContent="分析開始ボタンを押してください。";
    document.getElementById("predictionResult").textContent="予想開始ボタンを押してください。";
  }

  loadBtn.addEventListener("click",()=>{
    const file=fileInput.files[0];
    if(!file){
      alert("JSONファイルを選択してください。");
      return;
    }
    const reader=new FileReader();
    reader.onload=e=>{
      try{
        const raw=JSON.parse(e.target.result);
        loadRawData(raw,"JSON");
      }catch(err){
        alert("JSONの読み込みに失敗しました。形式を確認してください。");
      }
    };
    reader.readAsText(file,"UTF-8");
  });

  sampleBtn.addEventListener("click",async()=>{
    try{
      const response = await fetch("sample.json");
      const raw=await response.json();
      loadRawData(raw,"サンプル");
    }catch(err){
      alert("サンプルデータを読み込めませんでした。GitHub Pages上で開いてください。");
    }
  });

  analysisBtn.addEventListener("click",()=>{
    analyzeHistory(window.LotoHistory.getHistory());
  });

  predictionBtn.addEventListener("click",()=>{
    predictNumbers(window.LotoHistory.getHistory());
  });
});
