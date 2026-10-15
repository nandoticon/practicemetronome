(() => {
  "use strict";

  window.createMetronomeAppUiMethods = ({ MODES, CONFIG, t, formatTime }) => ({
    applyStateToUI() {
      const state = this.state;
      this.el.beatsPerBar.value = String(state.beatsPerBar);
      this.el.timerEnabled.checked = state.timerEnabled;
      this.el.timerFields.hidden = !state.timerEnabled;
      this.el.timerMinutes.value = state.timerMinutes;
      this.el.clickTone.value = state.clickTone;
      this.el.subdivisions.value = String(state.subdivisions);
      this.el.accentPattern.value = state.accentPattern;
      this.el.volume.value = String(state.volume);
      this.el.volumeValue.value = `${Math.round(state.volume * 100)}%`;
      this.engine.setClickTone(state.clickTone);
      this.engine.setVolume(state.volume);
      this.el.countdownEnabled.checked = state.countdownEnabled;
      this.el.countdownFields.hidden = !state.countdownEnabled;
      this.el.countdownBeats.value = String(state.countdownBeats);
      this.el.wakeLockEnabled.checked = state.wakeLockEnabled;
      this.el.wakeLockEnabled.disabled = this.running || !("wakeLock" in navigator);
      if (!("wakeLock" in navigator)) this.setWakeLockStatus("screenLockUnsupported");
      this.el.loopStart.value = state.loopStart;
      this.el.loopTarget.value = state.loopTarget;
      this.el.loopMinutes.value = state.loopMinutes;
      this.el.loopBars.value = state.loopBars;
      this.el.endurancePracticeSeconds.value = state.endurancePracticeSeconds;
      this.el.enduranceRestSeconds.value = state.enduranceRestSeconds;
      this.el.enduranceSessions.value = state.enduranceSessions;
      this.updateLoopPhraseText();

      this.scheduler.setBpm(state.bpm);
      this.scheduler.setBeatsPerBar(state.beatsPerBar);
      this.scheduler.setSubdivisions(state.subdivisions);
      this.scheduler.setAccentPattern(state.accentPattern);
      this.renderBpm();
      this.setMode(state.mode, { persistChange: false });
    },

    applyTheme(theme) {
      const value = ["system", "light", "dark"].includes(theme) ? theme : "system";
      this.el.themeSelect.value = value;
      if (value === "system") delete document.documentElement.dataset.theme;
      else document.documentElement.dataset.theme = value;
      const systemLight = window.matchMedia?.("(prefers-color-scheme: light)").matches ?? false;
      document.querySelector('meta[name="theme-color"]')?.setAttribute(
        "content",
        (value === "light" || (value === "system" && systemLight)) ? "#f3f5f8" : "#101114"
      );
    },

    applyLanguage(language) {
      this.state.language = window.MetronomeI18n.setLanguage(language);
      this.el.languageSelect.value = this.state.language;
      this.el.playLabel.textContent = t(this.running ? "stop" : "start");
      this.setStatus(this.statusMessageKey, this.statusMessageParams);
      this.setWakeLockStatus(this.wakeLockMessageKey);
      this.updateTempoControlAvailability();
      this.el.tempoTitle.textContent = t(this.state.mode === MODES.SPEEDLOOP ? "manualTempo" : "tempo");
      this.updateLoopTempoContext();
      this.updateLoopPhraseText();
      this.renderBpm();
      this.renderHistory();
      if (this.el.readout.classList.contains("alert")) {
        this.el.readout.textContent = t(this.state.mode === MODES.ENDURANCE
          ? "enduranceComplete"
          : "practiceComplete");
        if (this.state.mode === MODES.ENDURANCE) {
          this.el.enduranceCommand.textContent = "";
          this.el.enduranceStage.textContent = t("enduranceComplete");
        }
      }
    },

    bindColorScheme() {
      const query = window.matchMedia?.("(prefers-color-scheme: light)");
      if (!query) return;
      const update = () => {
        if (this.state.theme === "system") this.applyTheme("system");
      };
      if (query.addEventListener) query.addEventListener("change", update);
      else query.addListener(update);
    },

    renderBpm() {
      const bpm = this.state.bpm;
      this.el.bpmValue.textContent = String(bpm);
      this.el.slider.value = String(bpm);
      const fill = ((bpm - CONFIG.MIN_BPM) / (CONFIG.MAX_BPM - CONFIG.MIN_BPM)) * 100;
      this.el.slider.style.setProperty("--fill", `${fill}%`);
      this.el.slider.setAttribute("aria-valuetext", t("bpmAccessible", { bpm }));
    },

    pulseCurrentBpm() {
      const display = this.el.bpmDisplay;
      display.classList.remove("tempo-changed");
      void display.offsetWidth;
      display.classList.add("tempo-changed");
    },

    updateTempoControlAvailability() {
      const locked = this.running && this.state.mode === MODES.SPEEDLOOP;
      [this.el.slider, this.el.minus5, this.el.minus1, this.el.plus1, this.el.plus5, this.el.tapBtn]
        .forEach((control) => { control.disabled = locked; });
      [
        this.el.beatsPerBar, this.el.timerEnabled, this.el.timerMinutes,
        this.el.clickTone, this.el.volume, this.el.countdownEnabled,
        this.el.countdownBeats, this.el.wakeLockEnabled, this.el.subdivisions,
        this.el.accentPattern, this.el.loopStart,
        this.el.loopTarget, this.el.loopMinutes, this.el.loopBars,
        this.el.endurancePracticeSeconds, this.el.enduranceRestSeconds, this.el.enduranceSessions,
      ].forEach((control) => { control.disabled = this.running; });
      this.el.wakeLockEnabled.disabled = this.running || !("wakeLock" in navigator);
      this.el.tabs.forEach((tab) => {
        tab.disabled = this.running;
        tab.title = this.running ? t("stopPlaybackToChangeMode") : "";
      });
      this.el.stickyPlayLabel.textContent = t(this.running ? "stop" : "start");
      this.el.stickyPlayBtn.classList.toggle("running", this.running);
      this.el.stickyPlayBtn.setAttribute("aria-pressed", String(this.running));
      this.el.stickyTapBtn.disabled = this.el.tapBtn.disabled;
      this.el.settingsHint.hidden = !this.running;
    },

    observePlaybackControls() {
      if (!("IntersectionObserver" in window) || !this.el.consoleActions) return;
      const mobile = window.matchMedia("(max-width: 759px)");
      let actionsVisible = true;
      const update = () => {
        const visible = mobile.matches && !actionsVisible;
        this.el.stickyPlayback.hidden = !visible;
        document.body.classList.toggle("has-sticky-playback", visible);
      };
      const observer = new IntersectionObserver(([entry]) => {
        actionsVisible = entry.isIntersecting && entry.intersectionRatio >= 0.25;
        update();
      }, { threshold: [0, 0.25] });
      observer.observe(this.el.consoleActions);
      if (mobile.addEventListener) mobile.addEventListener("change", update);
      else mobile.addListener(update);
      update();
    },

    updateLoopTempoContext() {
      this.el.tempoTitle.textContent = t(this.state.mode === MODES.SPEEDLOOP ? "manualTempo" : "tempo");
      this.el.loopTempoContext.textContent = t("speedLoopTempoContext", {
        start: this.state.loopStart,
        target: this.state.loopTarget,
      });
      this.el.loopTempoContext.hidden = this.state.mode !== MODES.SPEEDLOOP;
    },

    updateBeatCounter() {
      this.el.meterLabel.textContent = `${this.state.beatsPerBar}/4`;
    },

    renderHistory(sessions = window.MetronomeStorage.loadSessions()) {
      this.el.historyList.textContent = "";
      this.el.historyEmpty.hidden = sessions.length > 0;
      this.el.historyClear.hidden = sessions.length === 0;
      sessions.forEach((session) => {
        const item = document.createElement("li");
        const title = document.createElement("strong");
        const details = document.createElement("span");
        const date = new Date(session.startedAt);
        const duration = formatTime(session.durationSec);
        const mode = t(session.mode === MODES.SPEEDLOOP
          ? "speedLoop"
          : session.mode === MODES.ENDURANCE ? "enduranceTraining" : "metronome");
        title.textContent = t("historyEntry", { mode, start: session.startBpm, end: session.endBpm });
        details.textContent = `${date.toLocaleString(this.state.language)} · ${duration}${session.interrupted ? ` · ${t("interrupted")}` : ""}`;
        item.append(title, details);
        this.el.historyList.appendChild(item);
      });
    },

    setWakeLockStatus(key) {
      this.wakeLockMessageKey = key;
      this.el.wakeLockStatus.textContent = key ? t(key) : "";
    },

    setStatus(key, params = {}) {
      this.statusMessageKey = key;
      this.statusMessageParams = params;
      this.el.statusLine.textContent = key ? t(key, params) : "";
    },

    updateLoopPhraseText() {
      this.el.loopHint.textContent = t("rampHint", {
        count: this.state.loopBars,
        unit: t(this.state.loopBars === 1 ? "barUnit" : "barsUnit"),
      });
      if (this.state.mode === MODES.SPEEDLOOP && this.phase === "playing") {
        this.el.phraseLabel.textContent = t("bar", {
          current: Math.min(this.speedLoopBar || 1, this.state.loopBars),
          total: this.state.loopBars,
        });
      }
    },
  });
})();
