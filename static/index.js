let state;

import { Word } from "./word.js";

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
  const shuffle = (
    {
      cnt,
      words = [],
      sl = 3,
      margin = -200,
      size = 32,
    },
  ) => {
    const a = [];
    for (let i = 0; i < cnt; i++) {
      a.push(
        new Word({
          text: words[Math.floor(Math.random() * words.length)],
          font: `${size}px serif`,
          next,
          sl,
          pr: 55,
          ps: 50,
          fm: 0.05,
          fa: 0.05,
          fc: 0.005,
          margin,
        }),
      );
    }
    return a;
  };
  const h = globalThis.innerHeight;
  const w = globalThis.innerWidth;
  const cnt = Math.floor((h * w) / 37000);
  console.log(`cnt ${cnt}`);

  const words = resp.data;
  state.layer1.push(...shuffle({ cnt, words, sl: 3, size: 32, margin: -200 }));
  state.layer2.push(...shuffle({ cnt, words, sl: 2, size: 24, margin: -100 }));
  state.layer3.push(...shuffle({ cnt, words, sl: 1, size: 16, margin: 0 }));
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
