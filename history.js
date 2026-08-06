// history.js
// Loto6 AI Pro

let historyData = [];

function setHistory(data) {
    historyData = data;
}

function getHistory() {
    return historyData;
}

function getLatestDraw() {
    if (historyData.length === 0) {
        return null;
    }
    return historyData[historyData.length - 1];
}

function getDrawCount() {
    return historyData.length;
}

function clearHistory() {
    historyData = [];
}
