export class Word {
  constructor({ text, font, next, sl, pr, ps, fm, fa, fc, margin }) {
    this.sl = sl;
    this.pr = pr;
    this.ps = ps;
    this.fm = fm;
    this.fa = fa;
    this.fc = fc;

    this.font = font;
    this.text = text;
    this.next = next;
    this.margin = margin;
    this.x = Math.random() * globalThis.innerWidth;
    this.y = Math.random() * globalThis.innerHeight;
    this.dx = (Math.random() * this.sl) - (this.sl / 2);
    this.dy = (Math.random() * this.sl) - (this.sl / 2);
    this.isTimeout = false;
  }

  distance(a, b) {
    return Math.hypot(Math.abs(a.x - b.x), Math.abs(a.y - b.y));
  }

  _switch() {
    if (this.isTimeout) {
      return;
    }
    this.isTimeout = true;
    this.text = this.next();

    setTimeout(() => this.isTimeout = false, 3000);
  }

  _bounce() {
    if (this.x < this.margin) {
      this.dx *= -1;
      this._switch();
    }
    if (this.y < this.margin) {
      this.dy *= -1;
      this._switch();
    }
    if (this.x > globalThis.innerWidth - this.margin) {
      this.dx *= -1;
      this._switch();
    }
    if (this.y > globalThis.innerHeight - this.margin) {
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
    this._bounce();
    this.x += this.dx;
    this.y += this.dy;
  }

  draw(ctx, darkModeFlag) {
    ctx.save();
    ctx.font = this.font;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    if (darkModeFlag) {
      ctx.fillStyle = "white";
    }
    ctx.fillText(this.text, this.x, this.y);
    ctx.restore();
  }
}
