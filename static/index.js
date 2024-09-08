let state;

import { Word } from "./word.js";

const ff = [
  "serif",
  // "sans-serif",
  // "monospace",
  // "cursive",
  // "fantasy",
  // "system-ui",
];

async function init() {
  const resp = await axios.get("/api/words");

  state = {
    layer1: [],
    layer2: [],
    layer3: [],
    words: resp.data,
  };

  setInterval(async () => {
    const resp = await axios.get("/api/words");
    state.words = resp.data;
  }, 10 * 1000);

  const next = () => {
    return state.words[Math.floor(Math.random() * resp.data.length)];
  };
  for (let i = 0; i < 20; i++) {
    state.layer1.push(
      new Word({
        text: resp.data[i],
        font: `20px ${ff[Math.floor(Math.random() * ff.length)]}`,
        next,
        sl: 3,
        pr: 65,
        ps: 50,
        fm: 0.005,
        fa: 0.05,
        fc: 0.005,
      }),
    );
  }
  for (let i = 20; i < 50; i++) {
    state.layer2.push(
      new Word({
        text: resp.data[i],
        font: `15px ${ff[Math.floor(Math.random() * ff.length)]}`,
        next,
        sl: 2,
        pr: 75,
        ps: 60,
        fm: 0.005,
        fa: 0.05,
        fc: 0.005,
      }),
    );
  }
  for (let i = 50; i < 90; i++) {
    state.layer3.push(
      new Word({
        text: resp.data[i],
        font: `10px ${ff[Math.floor(Math.random() * ff.length)]}`,
        next,
        sl: 1,
        pr: 75,
        ps: 100,
        fm: 0,
        fa: 0.5,
        fc: 0,
      }),
    );
  }
  globalThis.requestAnimationFrame(draw);
}

function draw() {
  const canvas = document.getElementById("canvas");
  canvas.height = globalThis.innerHeight;
  canvas.width = globalThis.innerWidth;

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, globalThis.innerWidth, globalThis.innerHeight);

  for (const w of state.layer1) {
    w.move(state.layer1);
    w.draw(ctx);
  }
  for (const w of state.layer2) {
    w.move(state.layer2);
    w.draw(ctx);
  }
  for (const w of state.layer3) {
    w.move(state.layer3);
    w.draw(ctx);
  }

  globalThis.requestAnimationFrame(draw);
}

init();
