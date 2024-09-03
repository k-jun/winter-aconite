export class Word {
  constructor({ text, font }) {
    this.ls = 10;
    this.pr = 75;
    this.fm = 0.05;
    this.fa = 0.05;
    this.fc = 0.005;

    this.text = text;
    this.font = font;
    this.x = Math.random() * globalThis.innerWidth;
    this.y = Math.random() * globalThis.innerHeight;
    this.dx = (Math.random() * this.ls) - (this.ls / 2);
    this.dy = (Math.random() * this.ls) - (this.ls / 2);
  }
  distance(a, b) {
    return Math.hypot(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  }

  _bounce() {
    const margin = 100;
    if (this.x < margin) {
      this.dx += 1;
    }
    if (this.y < margin) {
      this.dy += 1;
    }
    if (this.x > globalThis.innerWidth - margin) {
      this.dx += -1;
    }
    if (this.y > globalThis.innerHeight - margin) {
      this.dy += -1;
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
    const ps = 20;
    let x = 0;
    let y = 0;
    for (const w of words) {
      if (w === this) {
        continue;
      }
      if (this.distance(this, w) < ps) {
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
    const limit = 10;
    const speed = Math.sqrt(this.dx * this.dx + this.dy * this.dy);
    if (speed > limit) {
      this.dx = (this.dx / speed) * limit;
      this.dy = (this.dy / speed) * limit;
    }
  }

  move(words) {
    this._centering(words);
    this._avoidance(words);
    this._matching(words);
    this._speedLimit();
    this._bounce();
    this.x += this.dx;
    this.y += this.dy;
  }

  draw(ctx) {
    ctx.save();
    ctx.font = this.font;
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}
