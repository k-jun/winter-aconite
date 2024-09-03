let state;

import { Word } from "./word.js";

function init() {
  state = { words: [] };
  for (let i = 0; i < 100; i++) {
    state.words.push(new Word({ text: "鳥", font: "20px serif" }));
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

init();
