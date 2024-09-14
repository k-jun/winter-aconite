let state;

import { Word } from "./word.js";

const add = ({ cnt1, cnt2, cnt3 }) => {
  const next = () => {
    return state.words[Math.floor(Math.random() * state.words.length)];
  };
  state.layer1.push(
    ...newWords({
      cnt: cnt1,
      words: state.words,
      sl: 3,
      size: 32,
      margin: -200,
      next,
    }),
  );
  state.layer2.push(
    ...newWords({
      cnt: cnt2,
      words: state.words,
      sl: 2,
      size: 24,
      margin: -100,
      next,
    }),
  );
  state.layer3.push(
    ...newWords({
      cnt: cnt3,
      words: state.words,
      sl: 1,
      size: 16,
      margin: 0,
      next,
    }),
  );
  return;
};

const del = ({ idxs1, idxs2, idxs3 }) => {
  state.layer1 = state.layer1.filter((_, i) => !idxs1.includes(i));
  state.layer2 = state.layer2.filter((_, i) => !idxs2.includes(i));
  state.layer3 = state.layer3.filter((_, i) => !idxs3.includes(i));
};

const newWords = (
  {
    cnt,
    words = [],
    sl = 3,
    margin = -200,
    size = 32,
    next,
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
  }, 60 * 1000);

  const canvas = document.getElementById("canvas");
  const splash = document.getElementById("splash");

  canvas.addEventListener("click", () => {
    state.darkMode = !state.darkMode;
  });
  splash.addEventListener("click", () => {
    state.darkMode = !state.darkMode;
  });

  const h = globalThis.innerHeight;
  const w = globalThis.innerWidth;
  const cnt = Math.floor((h * w) / 35000);

  state.words = resp.data;
  add({ cnt1: cnt, cnt2: cnt, cnt3: cnt });
  globalThis.requestAnimationFrame(draw);
}

function draw() {
  const canvas = document.getElementById("canvas");
  canvas.height = globalThis.innerHeight;
  canvas.width = globalThis.innerWidth;
  const cnt = Math.floor(
    (globalThis.innerHeight * globalThis.innerWidth) / 35000,
  );

  const ctx = canvas.getContext("2d");
  ctx.clearRect(0, 0, globalThis.innerWidth, globalThis.innerHeight);

  if (state.darkMode) {
    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, globalThis.innerWidth, globalThis.innerHeight);
  }

  add({
    cnt1: Math.max(0, cnt - state.layer1.length),
    cnt2: Math.max(0, cnt - state.layer2.length),
    cnt3: Math.max(0, cnt - state.layer3.length),
  });

  const idxs1 = [];
  const idxs2 = [];
  const idxs3 = [];
  for (let i = 0; i < state.layer1.length; i++) {
    const w = state.layer1[i];
    w.move(state.layer1);
    w.draw(ctx, state.darkMode);
    if (cnt < state.layer1.length && w.isEdge()) {
      idxs1.push(i);
    }
  }
  for (let i = 0; i < state.layer2.length; i++) {
    const w = state.layer2[i];
    w.move(state.layer2);
    w.draw(ctx, state.darkMode);
    if (cnt < state.layer2.length && w.isEdge()) {
      idxs2.push(i);
    }
  }
  for (let i = 0; i < state.layer3.length; i++) {
    const w = state.layer3[i];
    w.move(state.layer3);
    w.draw(ctx, state.darkMode);
    if (cnt < state.layer3.length && w.isEdge()) {
      idxs3.push(i);
    }
  }
  del({ idxs1, idxs2, idxs3 });
  globalThis.requestAnimationFrame(draw);
}

init();
