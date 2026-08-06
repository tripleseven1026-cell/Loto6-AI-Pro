// prediction.js
// Loto6 AI Pro

function predictNumbers(history) {

  if (!history || history.length === 0) {
    return {
      numbers: [],
      message: "データがありません"
    };
  }

  const pool = [];

  for (let i = 1; i <= 43; i++) {
    pool.push(i);
  }

  pool.sort(() => Math.random() - 0.5);

  return {
    numbers: pool.slice(0, 6).sort((a, b) => a - b),
    message: "予想完了"
  };

}
