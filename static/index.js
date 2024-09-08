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
    darkMode: false,
  };

  setInterval(async () => {
    const resp = await axios.get("/api/words");
    state.words = resp.data;
  }, 10 * 1000);

  const canvas = document.getElementById("canvas");
  const splash = document.getElementById("splash");

  canvas.addEventListener("click", () => {
    state.darkMode = !state.darkMode;
  });
  splash.addEventListener("click", () => {
    state.darkMode = !state.darkMode;
  });

  const next = () => {
    return state.words[Math.floor(Math.random() * resp.data.length)];
  };
  for (let i = 0; i < 30; i++) {
    state.layer1.push(
      new Word({
        text: resp.data[i],
        font: `32px ${ff[Math.floor(Math.random() * ff.length)]}`,
        next,
        sl: 3,
        pr: 55,
        ps: 50,
        fm: 0.05,
        fa: 0.05,
        fc: 0.005,
        margin: -200,
      }),
    );
  }
  for (let i = 30; i < 60; i++) {
    state.layer2.push(
      new Word({
        text: resp.data[i],
        font: `24px ${ff[Math.floor(Math.random() * ff.length)]}`,
        next,
        sl: 2,
        pr: 55,
        ps: 50,
        fm: 0.05,
        fa: 0.05,
        fc: 0.005,
        margin: -100,
      }),
    );
  }
  for (let i = 60; i < 90; i++) {
    state.layer3.push(
      new Word({
        text: resp.data[i],
        font: `16px ${ff[Math.floor(Math.random() * ff.length)]}`,
        next,
        sl: 1,
        pr: 30,
        ps: 50,
        fm: 0.05,
        fa: 0.05,
        fc: 0.005,
        margin: 0,
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

  if (state.darkMode) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, globalThis.innerWidth, globalThis.innerHeight);
  }

  for (const w of state.layer1) {
    w.move(state.layer1);
    w.draw(ctx, state.darkMode);
  }
  for (const w of state.layer2) {
    w.move(state.layer2);
    w.draw(ctx, state.darkMode);
  }
  for (const w of state.layer3) {
    w.move(state.layer3);
    w.draw(ctx, state.darkMode);
  }

  globalThis.requestAnimationFrame(draw);
}

init();
