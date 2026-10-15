(() => {
  "use strict";

  window.createMetronomeAppControls = ({ CONFIG, t }) => {
    class BeatVisualizer {
      constructor(container, onBeatDraw = () => {}) {
        this.container = container;
        this.onBeatDraw = onBeatDraw;
        this.dots = [];
        this.queue = [];
        this.rafId = null;
        this.engine = null;
      }

      attach(engine) {
        this.engine = engine;
      }

      rebuild(count) {
        this.container.textContent = "";
        this.container.style.setProperty("--beat-count", String(count));
        this.dots = [];
        for (let i = 0; i < count; i++) {
          const dot = document.createElement("div");
          dot.className = "beat-dot" + (i === 0 ? " downbeat" : "");
          this.container.appendChild(dot);
          this.dots.push(dot);
        }
        this.queue.length = 0;
      }

      enqueue(beatIndex, time, count) {
        if (this.dots.length !== count) this.rebuild(count);
        this.queue.push({ beatIndex, time });
        if (!this.rafId) this.loop();
      }

      loop = () => {
        const now = this.engine.now;
        let latest = null;
        while (this.queue.length && this.queue[0].time <= now) {
          latest = this.queue.shift();
        }
        if (latest) {
          this.draw(latest.beatIndex);
          this.onBeatDraw(latest.beatIndex, latest.time);
        }
        if (this.queue.length || latest) {
          this.rafId = requestAnimationFrame(this.loop);
        } else {
          this.rafId = null;
        }
      };

      draw(index) {
        this.dots.forEach((dot, i) => dot.classList.toggle("active", i === index));
        this.container.setAttribute("aria-label", t("beat", { current: index + 1, total: this.dots.length }));
      }

      clear() {
        this.queue.length = 0;
        if (this.rafId) cancelAnimationFrame(this.rafId);
        this.rafId = null;
        this.dots.forEach((dot) => dot.classList.remove("active"));
      }
    }

    class TapTempo {
      constructor(onTempo) {
        this.onTempo = onTempo;
        this.taps = [];
      }

      tap(now = performance.now()) {
        if (this.taps.length && now - this.taps[this.taps.length - 1] > CONFIG.TAP_WINDOW_MS) {
          this.taps = [];
        }
        this.taps.push(now);
        if (this.taps.length > CONFIG.TAP_MAX_SAMPLES + 1) this.taps.shift();
        if (this.taps.length < CONFIG.TAP_MIN_SAMPLES + 1) return null;

        const intervals = [];
        for (let i = 1; i < this.taps.length; i++) intervals.push(this.taps[i] - this.taps[i - 1]);
        const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
        const bpm = Math.round(60000 / avgMs);
        const clamped = Math.min(CONFIG.MAX_BPM, Math.max(CONFIG.MIN_BPM, bpm));
        this.onTempo(clamped);
        return clamped;
      }

      reset() {
        this.taps = [];
      }
    }

    return { BeatVisualizer, TapTempo };
  };
})();
