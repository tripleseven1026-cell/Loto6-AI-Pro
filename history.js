// history.js
(function(){
  let historyData=[];
  function setHistory(data){
    if(window.AIEngine&&typeof window.AIEngine.normalizeData==="function"){
      historyData=window.AIEngine.normalizeData(data);
    }else{
      historyData=Array.isArray(data)?data:[];
    }
    return historyData;
  }
  function getHistory(){return historyData;}
  function clearHistory(){historyData=[];}
  function getLatestDraw(){
    if(historyData.length===0)return null;
    return historyData[historyData.length-1];
  }
  window.LotoHistory={setHistory,getHistory,clearHistory,getLatestDraw};
  window.setHistory=setHistory;
  window.getHistory=getHistory;
})();
