let state;

import { Word } from "./word.js";

function init() {
  state = { words: [] };
  for (let i = 0; i < 100; i++) {
    state.words.push(new Word({ text: "くノ一", font: "20px serif" }));
  }
  globalThis.requestAnimationFrame(draw);
}

function draw() {
  const canvas = document.getElementById("canvas");
  canvas.height = globalThis.innerHeight;
  canvas.width = globalThis.innerWidth;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, globalThis.innerWidth, globalThis.innerHeight);

  for (const w of state.words) {
    w.move(state.words);
    w.draw(ctx);
  }

  globalThis.requestAnimationFrame(draw);
}

for (const v of ["fm", "fa", "fa", "pr", "sl"]) {
  document.getElementById(v).addEventListener("change", (e) => {
    for (const w of state.words) {
      w[v] = e.target.value;
    }
  });
}
// const fa = document.getElementById("fa");
// const fc = document.getElementById("fc");
// const pr = document.getElementById("pr");
// const sl = document.getElementById("sl");
init();
