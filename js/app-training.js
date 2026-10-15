(() => {
  "use strict";

  window.createMetronomeTrainingMethods = ({ MODES, t, formatTime, CONFIG }) => ({
    startEndurancePractice(atTime) {
      const continueCountIn = this.scheduler.running && this.phase === "playing";
      this.phase = "playing";
      this.scheduler.setBpm(this.state.bpm);
      if (continueCountIn) {
        this.scheduler.setStopAt(this.enduranceWorkout.phaseEndsAt);
      } else {
        this.scheduler.stop();
        this.visualizer.clear();
        this.scheduler.start(atTime, this.enduranceWorkout.phaseEndsAt);
      }
      this.updateEnduranceDisplay(atTime);
    },

    playEnduranceCue(phase, atTime) {
      this.engine.scheduleCue(atTime, phase === "rest" ? 440 : 880);
    },

    showEnduranceProgress() {
      const progress = this.el.enduranceProgress;
      progress.hidden = false;
      progress.classList.remove("is-entering", "is-exiting");
      progress.classList.add("is-entering");
    },

    hideEnduranceProgress() {
      const progress = this.el.enduranceProgress;
      progress.classList.remove("is-entering");
      progress.classList.add("is-exiting");
    },

    showLoopProgress() {
      const progress = this.el.loopProgress;
      progress.hidden = false;
      progress.classList.remove("is-entering", "is-exiting");
      progress.classList.add("is-entering");
    },

    hideLoopProgress() {
      const progress = this.el.loopProgress;
      progress.classList.remove("is-entering");
      progress.classList.add("is-exiting");
    },

    updateEnduranceDisplay(now) {
      if (!this.enduranceWorkout) return;
      const workout = this.enduranceWorkout;
      const remaining = Math.max(0, workout.phaseEndsAt - now);
      const phaseSeconds = workout.phase === "rest" ? workout.restSeconds : workout.practiceSeconds;
      const phaseElapsed = Math.min(phaseSeconds, Math.max(0, phaseSeconds - remaining));
      const completedSeconds = (workout.currentSession - 1) *
        (workout.practiceSeconds + workout.restSeconds) +
        (workout.phase === "rest" ? workout.practiceSeconds + phaseElapsed : phaseElapsed);
      const totalSeconds = workout.sessions * workout.practiceSeconds +
        (workout.sessions - 1) * workout.restSeconds;
      const percent = Math.round(Math.min(1, completedSeconds / totalSeconds) * 100);
      this.el.enduranceCommand.textContent = t(workout.phase === "rest"
        ? "enduranceRestNow"
        : "endurancePracticeNow");
      this.el.enduranceStage.textContent = t(workout.phase === "rest"
        ? "enduranceRestStatus"
        : "endurancePracticeStatus", {
        current: workout.currentSession,
        total: workout.sessions,
      });
      this.el.enduranceCountdown.textContent = formatTime(remaining);
      this.el.enduranceProgress.dataset.phase = workout.phase;
      this.el.enduranceProgressFill.style.width = `${percent}%`;
      this.el.enduranceProgressTrack.setAttribute("aria-valuenow", String(percent));
    },

    currentBpm() {
      return window.MetronomeTiming.initialBpm(this.state.mode, this.state.bpm, this.state.loopStart);
    },

    handleScheduledBeat(time, beatsPerBar) {
      if (this.state.mode !== MODES.SPEEDLOOP) return;
      if (this.phase === "countin" && time >= this.countInEndTime) {
        this.pendingSpeedLoopBeats.push({ time, beatsPerBar });
        return;
      }
      if (this.phase !== "playing" || time < this.sessionStartTime) return;
      this.advanceSpeedLoop(time, beatsPerBar);
    },

    advanceSpeedLoop(time, beatsPerBar) {
      if (!this.speedLoopCadence.advance(beatsPerBar)) return;
      const { bpm } = this.ramp.sample(time);
      if (bpm !== this.state.bpm) {
        this.state.bpm = bpm;
        this.scheduler.setBpm(bpm);
        this.renderBpm();
        this.pulseCurrentBpm();
      }
    },

    updatePhraseIndicator(beatIndex, time) {
      if (
        this.phase !== "playing" ||
        this.state.mode !== MODES.SPEEDLOOP ||
        time < this.sessionStartTime ||
        beatIndex !== 0
      ) return;
      this.speedLoopBar = this.speedLoopCadence.bar;
      this.el.phraseLabel.textContent = t("bar", {
        current: this.speedLoopBar,
        total: this.state.loopBars,
      });
    },

    nextSpeedLoopBpm(now) {
      if (this.speedLoopCadence.beatCount < 1) return this.ramp.sample(now).bpm;
      const phraseBeats = this.state.beatsPerBar * this.state.loopBars;
      const beatsUntilBoundary = phraseBeats - ((this.speedLoopCadence.beatCount - 1) % phraseBeats);
      const boundaryTime = this.scheduler.nextNoteTime +
        (beatsUntilBoundary - 1) * (60 / Math.max(CONFIG.MIN_BPM, this.state.bpm));
      return this.ramp.sample(Math.max(now, boundaryTime)).bpm;
    },

    updateSpeedLoopFrame(now) {
      const { progress, rampDone } = this.ramp.sample(now);
      const percent = Math.round(progress * 100);
      this.el.progressFill.style.width = `${percent}%`;
      this.el.progressTrack.setAttribute("aria-valuenow", String(percent));
      this.el.progressText.textContent = rampDone
        ? this.state.bpm === this.ramp.target
          ? t("rampTargetReached", { bpm: this.state.bpm })
          : t("rampNextPhrase", { next: this.nextSpeedLoopBpm(now) })
        : t("rampProgressText", { next: this.nextSpeedLoopBpm(now) });
      this.el.progressElapsed.textContent = t("rampProgressDetail", {
        percent,
        remaining: rampDone
          ? t("rampFinished")
          : t("timeLeft", { time: formatTime(this.ramp.durationSec - (now - this.ramp.startedAt)) }),
        time: formatTime(now - this.sessionStartTime),
      });
    },

    updateEnduranceFrame(now) {
      const transition = this.enduranceWorkout.advance(now);
      if (transition === "rest") {
        this.phase = "resting";
        this.scheduler.stop();
        this.visualizer.clear();
        this.playEnduranceCue("rest", now);
      } else if (transition === "practice") {
        const nextStart = now + 0.05;
        this.enduranceWorkout.phaseEndsAt += 0.05;
        this.startEndurancePractice(nextStart);
        this.playEnduranceCue("practice", nextStart);
      } else if (transition === "complete") {
        this.recordSession(false);
        this.alertShown = true;
        this.fireTimerAlert(now, "enduranceComplete");
        this.stop({ preserveReadout: true });
        return;
      }
      this.updateEnduranceDisplay(now);
    },
  });
})();
