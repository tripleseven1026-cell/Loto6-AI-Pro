// app.js
let history = [];

const loadBtn = document.getElementById("loadBtn");
const analysisBtn = document.getElementById("analysisBtn");
const predictionBtn = document.getElementById("predictionBtn");

const jsonFile = document.getElementById("jsonFile");
const latestNumbers = document.getElementById("latestNumbers");
const analysisResult = document.getElementById("analysisResult");
const predictionResult = document.getElementById("predictionResult");
loadBtn.addEventListener("click", () => {

  if (jsonFile.files.length === 0) {
    alert("JSONファイルを選択してください。");
    return;
  }

  const reader = new FileReader();
    reader.onload = function(e) {

 history = JSON.parse(e.target.result);   　　
                         
      setHistory(history);

    latestNumbers.textContent =
      "読込完了：" + getDrawCount() + "件";

  };

  reader.readAsText(jsonFile.files[0]);

});
