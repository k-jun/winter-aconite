export class Word {
  constructor({ text, font }) {
    this.ls = 5;
    this.pr = 30;
    this.ps = 20;
    this.fm = 0.05;
    this.fa = 0.05;
    this.fc = 0.005;

    this.font = font;
    this.words = [text];
    this.head = 0;
    this.x = Math.random() * globalThis.innerWidth;
    this.y = Math.random() * globalThis.innerHeight;
    this.dx = (Math.random() * this.ls) - (this.ls / 2);
    this.dy = (Math.random() * this.ls) - (this.ls / 2);

    this.isCalling = false;
  }
  distance(a, b) {
    return Math.hypot(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  }

  get text() {
    return this.words[this.head];
  }

  async _switch() {
    if (this.isCalling) {
      return;
    }
    this.isCalling = true;
    this.head += 1;
    if (this.head < this.words.length) {
      return;
    }

    const resp = await axios.get("/api/words");
    console.log("api called");
    this.words = resp.data;
    this.head = 0;
    setTimeout(() => this.isCalling = false, 3000);
  }

  _bounce() {
    const margin = -100;
    if (this.x < margin) {
      this._switch();
      this.dx *= -1;
    }
    if (this.y < margin) {
      this.dy *= -1;
      this._switch();
    }
    if (this.x > globalThis.innerWidth - margin) {
      this.dx *= -1;
      this._switch();
    }
    if (this.y > globalThis.innerHeight - margin) {
      this.dy *= -1;
      this._switch();
    }
  }

  _centering(words) {
    let x = 0;
    let y = 0;
    let cnt = 0;

    for (const w of words) {
      if (this.distance(this, w) < this.pr) {
        x += w.x;
        y += w.y;
        cnt += 1;
      }
    }

    if (cnt) {
      x /= cnt;
      y /= cnt;

      this.dx += (x - this.x) * this.fc;
      this.dy += (y - this.y) * this.fc;
    }
  }

  _avoidance(words) {
    let x = 0;
    let y = 0;
    for (const w of words) {
      if (w === this) {
        continue;
      }
      if (this.distance(this, w) < this.ps) {
        x += this.x - w.x;
        y += this.y - w.y;
      }
    }

    this.dx += x * this.fa;
    this.dy += y * this.fa;
  }

  _matching(words) {
    let dx = 0;
    let dy = 0;
    let cnt = 0;

    for (const w of words) {
      if (this.distance(this, w) < this.pr) {
        dx += w.dx;
        dy += w.dy;
        cnt += 1;
      }
    }

    if (cnt) {
      dx /= cnt;
      dy /= cnt;

      this.dx += (dx - this.dx) * this.fm;
      this.dy += (dy - this.dy) * this.fm;
    }
  }

  _speedLimit() {
    const speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    if (speed > this.sl) {
      this.dx = (this.dx / speed) * this.sl;
      this.dy = (this.dy / speed) * this.sl;
    }
  }

  move(words) {
    this._centering(words);
    this._avoidance(words);
    this._matching(words);
    this._speedLimit();
    this.x += this.dx;
    this.y += this.dy;
    this._bounce();
  }

  draw(ctx) {
    ctx.save();
    ctx.font = this.font;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}
