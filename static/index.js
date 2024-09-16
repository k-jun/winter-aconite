let state;

import { Word } from "./word.js";

async function init() {
  state = {
    layer1: [],
    layer2: [],
    layer3: [],
    words: [],
    darkMode: false,
    config: {
      enable: false,
      velocity: 0.1,
      density: 0.6,
    },
  };

  const resp = await axios.get("/api/words");
  state.words = resp.data;
  setInterval(async () => {
    const resp = await axios.get("/api/words");
    state.words = resp.data;
  }, 60 * 1000);

  const canvas = document.getElementById("canvas");
  const splash = document.getElementById("splash");
  const reset = document.getElementById("config-reset");
  const form = document.getElementById("form");
  const config = document.getElementById("config");

  canvas.addEventListener("click", () => {
    state.darkMode = !state.darkMode;
    config.style.color = state.darkMode ? "white" : "black";
    if (state.config.enable) {
      form.classList.add("opacity1to0_10");
      state.config.enable = false;
    }
  });
  splash.addEventListener("animationend", () => {
    splash.style.display = "none";
  });
  config.addEventListener("click", () => {
    if (!state.config.enable) {
      form.classList.remove("opacity1to0_10");
      form.classList.add("opacity0to1_10");
      state.config.enable = true;
    }
  });

  const velocity = document.getElementById("velocity");
  const labelv = document.getElementById("label-v");
  velocity.addEventListener("input", (e) => {
    const v = parseFloat(e.target.value);
    labelv.textContent = v.toFixed(1);
    state.config.velocity = v.toFixed(1) / 100.0;
  });
  const density = document.getElementById("density");
  const labeld = document.getElementById("label-d");
  density.addEventListener("input", (e) => {
    const v = parseFloat(e.target.value);
    labeld.textContent = v.toFixed(1);
    state.config.density = v.toFixed(1) / 100.0;
  });
  reset.addEventListener("click", () => {
    labelv.textContent = "10.0";
    state.config.velocity = 0.1;
    labeld.textContent = "60.0";
    state.config.density = 0.6;
    form.reset();
  });

  globalThis.requestAnimationFrame(draw);
}

function draw() {
  const canvas = document.getElementById("canvas");
  canvas.height = globalThis.innerHeight;
  canvas.width = globalThis.innerWidth;
  const cnt = Math.floor(
    (globalThis.innerHeight * globalThis.innerWidth) /
      (10000 + (40000 * (1 - state.config.density))),
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

  const v = 10 * state.config.velocity;
  for (let i = 0; i < state.layer1.length; i++) {
    const w = state.layer1[i];
    w.sl = v * 3;
    w.move(state.layer1);
    w.draw(ctx, state.darkMode);
    if ((state.layer1.length - idxs1.length > cnt) && w.isEdge()) {
      idxs1.push(i);
    }
  }
  for (let i = 0; i < state.layer2.length; i++) {
    const w = state.layer2[i];
    w.sl = v * 2;
    w.move(state.layer2);
    w.draw(ctx, state.darkMode);
    if ((state.layer2.length - idxs2.length > cnt) && w.isEdge()) {
      idxs2.push(i);
    }
  }
  for (let i = 0; i < state.layer3.length; i++) {
    const w = state.layer3[i];
    w.sl = v * 1;
    w.move(state.layer3);
    w.draw(ctx, state.darkMode);
    if ((state.layer3.length - idxs3.length > cnt) && w.isEdge()) {
      idxs3.push(i);
    }
  }

  if (idxs1.length > 0 || idxs2.length > 0 || idxs3.length > 0) {
    del({ idxs1, idxs2, idxs3 });
  }

  globalThis.requestAnimationFrame(draw);
}

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
      margin: -300,
      next,
    }),
  );
  state.layer2.push(
    ...newWords({
      cnt: cnt2,
      words: state.words,
      sl: 2,
      size: 24,
      margin: -200,
      next,
    }),
  );
  state.layer3.push(
    ...newWords({
      cnt: cnt3,
      words: state.words,
      sl: 1,
      size: 16,
      margin: -100,
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

init();
