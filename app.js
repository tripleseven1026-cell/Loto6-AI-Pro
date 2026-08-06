document.addEventListener("DOMContentLoaded", () => {

  const fileInput = document.getElementById("jsonFile");
  const loadBtn = document.getElementById("loadBtn");
  const analysisBtn = document.getElementById("analysisBtn");
  const predictionBtn = document.getElementById("predictionBtn");

  let lotoData = [];

  loadBtn.addEventListener("click", () => {
    const file = fileInput.files[0];

    if (!file) {
      alert("JSONファイルを選択してください。");
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        lotoData = JSON.parse(e.target.result);

        document.getElementById("latestNumbers").innerHTML =
          "読込件数：" + lotoData.length + "件";

      } catch (err) {
        alert("JSONの読込に失敗しました。");
      }
    };

    reader.readAsText(file);
  });

  analysisBtn.addEventListener("click", () => {

    if (typeof analyzeHistory === "function") {
      analyzeHistory(lotoData);
    }

  });

  predictionBtn.addEventListener("click", () => {

    if (typeof predictNumbers === "function") {
      predictNumbers(lotoData);
    }

  });

});
