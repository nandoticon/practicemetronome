(() => {
  "use strict";
  const locale = {
      pageTitle: "Practice Metronome — Find your rhythm",
      appName: "Practice Metronome",
      tagline: "Find your rhythm. Build your pace.",
      homeLabel: "Practice Metronome home",
      language: "Language",
      theme: "Theme",
      themeSystem: "System",
      themeDark: "Dark",
      themeLight: "Light",
      yourPulse: "YOUR PULSE",
      beatIndicator: "Beat indicator",
      beat: "Beat {current} of {total}",
      bar: "Bar {current} of {total}",
      setYourPace: "SET YOUR PACE",
      tempo: "Tempo",
      adjustTempo: "Adjust tempo",
      decrease5: "Decrease 5 BPM",
      decrease1: "Decrease 1 BPM",
      increase1: "Increase 1 BPM",
      increase5: "Increase 5 BPM",
      tempoSlider: "Tempo slider",
      keyboardHint: "↑/↓ adjust · Shift + arrows: ±5 · Space: start/stop · T: tap",
      start: "Start",
      stop: "Stop",
      tapTempo: "Tap tempo",
      mode: "Mode",
      metronome: "Metronome",
      speedLoop: "Speed Loop",
      fixedTempo: "FIXED TEMPO",
      metronomePractice: "Metronome practice",
      metronomeDescription: "Set your tempo above and start a steady beat. Shared meter, sound, count-in, and timer options are below.",
      progressiveTempo: "PROGRESSIVE TEMPO",
      speedLoopSetup: "Speed Loop setup",
      speedLoopDescription: "Build speed in structured phrases. Tempo changes only at the start of each selected bar group.",
      rampSettings: "Ramp settings",
      startBpm: "Start BPM",
      targetBpm: "Target BPM",
      rampDuration: "Ramp duration (min)",
      barsPerChange: "Bars per tempo change",
      rampProgress: "Speed Loop ramp progress",
      rampHint: "Each phrase is {count} {unit} long. Tempo changes at its start.",
      barUnit: "bar",
      barsUnit: "bars",
      makeItYours: "MAKE IT YOURS",
      practiceSettings: "Practice settings",
      stopToChange: "Stop playback to change settings.",
      meterSession: "Meter & session",
      beatsPerBar: "Beats per bar",
      practiceTimer: "Practice timer",
      durationMinutes: "Duration (minutes)",
      countIn: "Count-in",
      countInBeats: "Count-in beats",
      soundDisplay: "Sound & display",
      clickSound: "Click sound",
      toneSoft: "Soft",
      toneClassic: "Classic",
      toneBright: "Bright",
      subdivision: "Subdivision",
      quarterNotes: "Quarter notes",
      eighthNotes: "Eighth notes",
      sixteenthNotes: "Sixteenth notes",
      accentPattern: "Accent pattern",
      downbeat: "First beat only",
      backbeat: "Even beats (2, 4, …)",
      everyBeat: "Every beat",
      noAccents: "No accents",
      volume: "Volume",
      metronomeVolume: "Metronome volume",
      keepScreenAwake: "Keep screen awake",
      recentPractice: "Recent practice",
      historyEmpty: "Completed sessions will appear here on this device.",
      clearHistory: "Clear history",
      historyEntry: "{mode} · {start} → {end} BPM",
      interrupted: "interrupted",
      screenLockUnsupported: "Screen wake lock is not supported by this browser.",
      screenMayDim: "Screen may dim while the metronome continues.",
      screenWillStayAwake: "Screen will stay awake during playback.",
      screenLockFailed: "Could not keep the screen awake. Playback will continue normally.",
      stopPlaybackToChangeMode: "Stop playback to change mode",
      tapResult: "Tap: {bpm} BPM",
      keepTapping: "Keep tapping…",
      audioUnsupported: "Audio is not supported in this browser. Try a current browser with Web Audio support.",
      audioStartFailed: "Audio couldn't start. Check browser audio permissions, then tap Start to try again.",
      countInStatus: "Count-in",
      countInRemaining: "Count-in: {count}",
      sessionInterrupted: "Session paused when the app left the screen. Tap Start to begin again.",
      rampTargetReached: "{bpm} BPM · target reached, holding",
      rampNextPhrase: "{bpm} BPM now · next phrase {next} BPM",
      rampProgressText: "{bpm} BPM now · next phrase {next} BPM · {percent}% · {time} left",
      timeLeft: "Time left {time}",
      elapsed: "Elapsed {time}",
      practiceComplete: "Practice time complete",
      appInitFailed: "Could not initialize the app.",
      bpmAccessible: "{bpm} beats per minute",
  };
  if (typeof module !== "undefined" && module.exports) module.exports = locale;
  if (typeof window !== "undefined") {
    window.MetronomeLocaleMessages ??= {};
    window.MetronomeLocaleMessages['en-US'] = locale;
  }
})();

;
(() => {
  "use strict";
  const locale = {
      pageTitle: "Metrônomo de prática — Encontre seu ritmo",
      appName: "Metrônomo de prática",
      tagline: "Encontre seu ritmo. Desenvolva seu andamento.",
      homeLabel: "Página inicial do metrônomo",
      language: "Idioma",
      theme: "Tema",
      themeSystem: "Sistema",
      themeDark: "Escuro",
      themeLight: "Claro",
      yourPulse: "SEU PULSO",
      beatIndicator: "Indicador de batida",
      beat: "Batida {current} de {total}",
      bar: "Compasso {current} de {total}",
      setYourPace: "DEFINA SEU RITMO",
      tempo: "Andamento",
      adjustTempo: "Ajustar andamento",
      decrease5: "Diminuir 5 BPM",
      decrease1: "Diminuir 1 BPM",
      increase1: "Aumentar 1 BPM",
      increase5: "Aumentar 5 BPM",
      tempoSlider: "Controle deslizante do andamento",
      keyboardHint: "↑/↓ ajustar · Shift + setas: ±5 · Espaço: iniciar/parar · T: marcar tempo",
      start: "Iniciar",
      stop: "Parar",
      tapTempo: "Toque para medir o andamento",
      mode: "Modo",
      metronome: "Metrônomo",
      speedLoop: "Aumento gradual do andamento",
      fixedTempo: "ANDAMENTO FIXO",
      metronomePractice: "Prática com metrônomo",
      metronomeDescription: "Defina o andamento acima e inicie uma batida constante. As opções de compasso, som, contagem e cronômetro ficam abaixo.",
      progressiveTempo: "ANDAMENTO PROGRESSIVO",
      speedLoopSetup: "Configuração do aumento gradual do andamento",
      speedLoopDescription: "Aumente o andamento em frases estruturadas. A mudança acontece somente no início de cada grupo de compassos selecionado.",
      rampSettings: "Configurações do aumento gradual",
      startBpm: "BPM inicial",
      targetBpm: "BPM desejado",
      rampDuration: "Duração do aumento (min)",
      barsPerChange: "Compassos por mudança",
      rampProgress: "Progresso do aumento gradual",
      rampHint: "Cada frase dura {count} {unit}. O andamento muda no início da frase.",
      barUnit: "compasso",
      barsUnit: "compassos",
      makeItYours: "PERSONALIZE",
      practiceSettings: "Configurações de prática",
      stopToChange: "Pare a reprodução para alterar as configurações.",
      meterSession: "Compasso e sessão de prática",
      beatsPerBar: "Batidas por compasso",
      practiceTimer: "Cronômetro de prática",
      durationMinutes: "Duração (minutos)",
      countIn: "Contagem inicial",
      countInBeats: "Batidas da contagem",
      soundDisplay: "Som e exibição",
      clickSound: "Som da batida",
      toneSoft: "Suave",
      toneClassic: "Clássico",
      toneBright: "Brilhante",
      subdivision: "Subdivisão",
      quarterNotes: "Semínimas",
      eighthNotes: "Colcheias",
      sixteenthNotes: "Semicolcheias",
      accentPattern: "Padrão de acentuação",
      downbeat: "Acento no primeiro tempo",
      backbeat: "Acentos nos tempos pares (2, 4…)",
      everyBeat: "Todas as batidas",
      noAccents: "Sem acentos",
      volume: "Volume",
      metronomeVolume: "Volume do metrônomo",
      keepScreenAwake: "Manter tela ativa",
      recentPractice: "Práticas recentes",
      historyEmpty: "As sessões concluídas aparecerão aqui neste dispositivo.",
      clearHistory: "Limpar histórico",
      historyEntry: "{mode} · {start} → {end} BPM",
      interrupted: "interrompida",
      screenLockUnsupported: "Este navegador não oferece suporte para manter a tela ativa.",
      screenMayDim: "A tela pode apagar enquanto o metrônomo continua.",
      screenWillStayAwake: "A tela permanecerá ativa durante a reprodução.",
      screenLockFailed: "Não foi possível manter a tela ativa. A reprodução continuará normalmente.",
      stopPlaybackToChangeMode: "Pare a reprodução para mudar de modo",
      tapResult: "Andamento medido: {bpm} BPM",
      keepTapping: "Continue marcando…",
      audioUnsupported: "Este navegador não oferece suporte a áudio. Experimente um navegador atualizado com Web Audio.",
      audioStartFailed: "Não foi possível iniciar o áudio. Verifique as permissões do navegador e toque em Iniciar novamente.",
      countInStatus: "Contagem inicial",
      countInRemaining: "Contagem: {count}",
      sessionInterrupted: "Sessão pausada ao sair da tela. Toque em Iniciar para começar novamente.",
      rampTargetReached: "{bpm} BPM · meta alcançada, mantendo",
      rampNextPhrase: "{bpm} BPM agora · próxima frase: {next} BPM",
      rampProgressText: "{bpm} BPM agora · próxima frase: {next} BPM · {percent}% · faltam {time}",
      timeLeft: "Tempo restante {time}",
      elapsed: "Decorrido {time}",
      practiceComplete: "Tempo de prática concluído",
      appInitFailed: "Não foi possível iniciar o aplicativo.",
      bpmAccessible: "{bpm} batidas por minuto",
  };
  if (typeof module !== "undefined" && module.exports) module.exports = locale;
  if (typeof window !== "undefined") {
    window.MetronomeLocaleMessages ??= {};
    window.MetronomeLocaleMessages['pt-BR'] = locale;
  }
})();

;
(() => {
  "use strict";
  const locale = {
      pageTitle: "Metrónomo de práctica — Encuentra tu ritmo",
      appName: "Metrónomo de práctica",
      tagline: "Encuentra tu ritmo. Desarrolla tu tempo.",
      homeLabel: "Inicio del metrónomo de práctica",
      language: "Idioma",
      theme: "Tema",
      themeSystem: "Sistema",
      themeDark: "Oscuro",
      themeLight: "Claro",
      yourPulse: "TU PULSO",
      beatIndicator: "Indicador de pulsos",
      beat: "Pulso {current} de {total}",
      bar: "Compás {current} de {total}",
      setYourPace: "MARCA TU RITMO",
      tempo: "Tempo",
      adjustTempo: "Ajustar tempo",
      decrease5: "Reducir 5 BPM",
      decrease1: "Reducir 1 BPM",
      increase1: "Aumentar 1 BPM",
      increase5: "Aumentar 5 BPM",
      tempoSlider: "Control deslizante del tempo",
      keyboardHint: "↑/↓ ajustar · Shift + flechas: ±5 · Espacio: iniciar/parar · T: marcar tempo",
      start: "Iniciar",
      stop: "Parar",
      tapTempo: "Toca para medir el tempo",
      mode: "Modo",
      metronome: "Metrónomo",
      speedLoop: "Subida gradual del tempo",
      fixedTempo: "TEMPO FIJO",
      metronomePractice: "Práctica con metrónomo",
      metronomeDescription: "Ajusta el tempo arriba e inicia un pulso constante. Abajo están las opciones de compás, sonido, cuenta inicial y temporizador.",
      progressiveTempo: "TEMPO PROGRESIVO",
      speedLoopSetup: "Configurar la subida gradual del tempo",
      speedLoopDescription: "Aumenta el tempo en frases estructuradas. Solo cambia al comienzo de cada grupo de compases seleccionado.",
      rampSettings: "Ajustes de subida gradual",
      startBpm: "BPM inicial",
      targetBpm: "BPM objetivo",
      rampDuration: "Duración de progresión (min)",
      barsPerChange: "Compases por cambio",
      rampProgress: "Progreso de aceleración gradual",
      rampHint: "Cada frase dura {count} {unit}. El tempo cambia al comienzo de la frase.",
      barUnit: "compás",
      barsUnit: "compases",
      makeItYours: "PERSONALÍZALO",
      practiceSettings: "Ajustes de práctica",
      stopToChange: "Detén la reproducción para cambiar los ajustes.",
      meterSession: "Compás y sesión de práctica",
      beatsPerBar: "Pulsos por compás",
      practiceTimer: "Temporizador de práctica",
      durationMinutes: "Duración (minutos)",
      countIn: "Cuenta previa",
      countInBeats: "Pulsos de la cuenta previa",
      soundDisplay: "Sonido y pantalla",
      clickSound: "Sonido del pulso",
      toneSoft: "Suave",
      toneClassic: "Clásico",
      toneBright: "Brillante",
      subdivision: "Subdivisión",
      quarterNotes: "Negras",
      eighthNotes: "Corcheas",
      sixteenthNotes: "Semicorcheas",
      accentPattern: "Patrón de acentos",
      downbeat: "Acento en el primer pulso",
      backbeat: "Acentos en los pulsos pares (2, 4…)",
      everyBeat: "Cada pulso",
      noAccents: "Sin acentos",
      volume: "Volumen",
      metronomeVolume: "Volumen del metrónomo",
      keepScreenAwake: "Mantener pantalla activa",
      recentPractice: "Prácticas recientes",
      historyEmpty: "Las sesiones completadas aparecerán aquí en este dispositivo.",
      clearHistory: "Borrar historial",
      historyEntry: "{mode} · {start} → {end} BPM",
      interrupted: "interrumpida",
      screenLockUnsupported: "Este navegador no permite mantener la pantalla activa.",
      screenMayDim: "La pantalla puede atenuarse mientras continúa el metrónomo.",
      screenWillStayAwake: "La pantalla permanecerá activa durante la reproducción.",
      screenLockFailed: "No se pudo mantener activa la pantalla. La reproducción continuará normalmente.",
      stopPlaybackToChangeMode: "Detén la reproducción para cambiar de modo",
      tapResult: "Tempo medido: {bpm} BPM",
      keepTapping: "Sigue marcando…",
      audioUnsupported: "Este navegador no admite audio. Prueba un navegador actualizado compatible con Web Audio.",
      audioStartFailed: "No se pudo iniciar el audio. Revisa los permisos del navegador y vuelve a tocar Iniciar.",
      countInStatus: "Cuenta inicial",
      countInRemaining: "Cuenta: {count}",
      sessionInterrupted: "La sesión se pausó al salir de la pantalla. Toca Iniciar para comenzar de nuevo.",
      rampTargetReached: "{bpm} BPM · objetivo alcanzado, manteniendo",
      rampNextPhrase: "{bpm} BPM ahora · siguiente frase {next} BPM",
      rampProgressText: "{bpm} BPM ahora · siguiente frase {next} BPM · {percent}% · quedan {time}",
      timeLeft: "Tiempo restante {time}",
      elapsed: "Transcurrido {time}",
      practiceComplete: "Práctica completada",
      appInitFailed: "No se pudo iniciar la aplicación.",
      bpmAccessible: "{bpm} pulsos por minuto",
  };
  if (typeof module !== "undefined" && module.exports) module.exports = locale;
  if (typeof window !== "undefined") {
    window.MetronomeLocaleMessages ??= {};
    window.MetronomeLocaleMessages['es'] = locale;
  }
})();

;
(() => {
  "use strict";
  const locale = {
      pageTitle: "Metronomo per esercitarsi — Trova il tuo ritmo",
      appName: "Metronomo per esercitarsi",
      tagline: "Trova il tuo ritmo. Costruisci il tuo tempo.",
      homeLabel: "Pagina iniziale del metronomo",
      language: "Lingua",
      theme: "Tema",
      themeSystem: "Sistema",
      themeDark: "Scuro",
      themeLight: "Chiaro",
      yourPulse: "IL TUO RITMO",
      beatIndicator: "Indicatore delle battute",
      beat: "Battuta {current} di {total}",
      bar: "Battuta {current} di {total}",
      setYourPace: "IMPOSTA IL TUO TEMPO",
      tempo: "Tempo",
      adjustTempo: "Regola il tempo",
      decrease5: "Riduci di 5 BPM",
      decrease1: "Riduci di 1 BPM",
      increase1: "Aumenta di 1 BPM",
      increase5: "Aumenta di 5 BPM",
      tempoSlider: "Cursore del tempo",
      keyboardHint: "↑/↓ regola · Shift + frecce: ±5 · Spazio: avvia/ferma · T: tocca",
      start: "Avvia",
      stop: "Ferma",
      tapTempo: "Tocca per misurare il tempo",
      mode: "Modalità",
      metronome: "Metronomo",
      speedLoop: "Aumento graduale del tempo",
      fixedTempo: "TEMPO FISSO",
      metronomePractice: "Esercizio con metronomo",
      metronomeDescription: "Imposta il tempo sopra e avvia un battito regolare. Sotto trovi le opzioni di misura, suono, conteggio iniziale e timer.",
      progressiveTempo: "TEMPO PROGRESSIVO",
      speedLoopSetup: "Impostazioni dell'aumento graduale del tempo",
      speedLoopDescription: "Aumenta il tempo con frasi strutturate. Il cambio avviene solo all'inizio di ogni gruppo di battute selezionato.",
      rampSettings: "Impostazioni dell'aumento graduale",
      startBpm: "BPM iniziali",
      targetBpm: "BPM obiettivo",
      rampDuration: "Durata progressione (min)",
      barsPerChange: "Battute prima di cambiare tempo",
      rampProgress: "Avanzamento accelerazione graduale",
      rampHint: "Ogni frase dura {count} {unit}. Il tempo cambia all'inizio della frase.",
      barUnit: "battuta",
      barsUnit: "battute",
      makeItYours: "PERSONALIZZA",
      practiceSettings: "Impostazioni esercizio",
      stopToChange: "Ferma la riproduzione per modificare le impostazioni.",
      meterSession: "Metro e sessione di esercizio",
      beatsPerBar: "Battiti per battuta",
      practiceTimer: "Timer esercizio",
      durationMinutes: "Durata (minuti)",
      countIn: "Conteggio iniziale",
      countInBeats: "Battiti del conteggio iniziale",
      soundDisplay: "Suono e visualizzazione",
      clickSound: "Suono del clic",
      toneSoft: "Morbido",
      toneClassic: "Classico",
      toneBright: "Brillante",
      subdivision: "Suddivisione",
      quarterNotes: "Semiminime",
      eighthNotes: "Crome",
      sixteenthNotes: "Semicrome",
      accentPattern: "Schema degli accenti",
      downbeat: "Accento sul primo battito",
      backbeat: "Accenti sui battiti pari (2, 4…)",
      everyBeat: "Ogni battito",
      noAccents: "Senza accenti",
      volume: "Volume",
      metronomeVolume: "Volume del metronomo",
      keepScreenAwake: "Mantieni schermo attivo",
      recentPractice: "Esercizi recenti",
      historyEmpty: "Le sessioni completate appariranno qui su questo dispositivo.",
      clearHistory: "Cancella cronologia",
      historyEntry: "{mode} · {start} → {end} BPM",
      interrupted: "interrotta",
      screenLockUnsupported: "Questo browser non supporta il blocco dello schermo attivo.",
      screenMayDim: "Lo schermo potrebbe oscurarsi mentre il metronomo continua.",
      screenWillStayAwake: "Lo schermo resterà attivo durante la riproduzione.",
      screenLockFailed: "Impossibile mantenere lo schermo attivo. La riproduzione continuerà normalmente.",
      stopPlaybackToChangeMode: "Ferma la riproduzione per cambiare modalità",
      tapResult: "Tempo rilevato: {bpm} BPM",
      keepTapping: "Continua a toccare…",
      audioUnsupported: "L'audio non è supportato da questo browser. Prova un browser aggiornato con Web Audio.",
      audioStartFailed: "Impossibile avviare l'audio. Controlla i permessi del browser e tocca di nuovo Avvia.",
      countInStatus: "Conteggio iniziale",
      countInRemaining: "Conteggio: {count}",
      sessionInterrupted: "Sessione sospesa quando l'app è uscita dallo schermo. Tocca Avvia per ricominciare.",
      rampTargetReached: "{bpm} BPM · obiettivo raggiunto, mantenimento",
      rampNextPhrase: "{bpm} BPM ora · prossima frase {next} BPM",
      rampProgressText: "{bpm} BPM ora · prossima frase {next} BPM · {percent}% · restano {time}",
      timeLeft: "Tempo rimanente {time}",
      elapsed: "Trascorso {time}",
      practiceComplete: "Esercizio completato",
      appInitFailed: "Impossibile inizializzare l'applicazione.",
      bpmAccessible: "{bpm} battiti al minuto",
  };
  if (typeof module !== "undefined" && module.exports) module.exports = locale;
  if (typeof window !== "undefined") {
    window.MetronomeLocaleMessages ??= {};
    window.MetronomeLocaleMessages['it'] = locale;
  }
})();

;
(() => {
  "use strict";
  const locale = {
      pageTitle: "Métronome d’entraînement — Trouvez votre rythme",
      appName: "Métronome d’entraînement",
      tagline: "Trouvez votre rythme. Développez votre tempo.",
      homeLabel: "Accueil du métronome",
      language: "Langue",
      theme: "Thème",
      themeSystem: "Système",
      themeDark: "Sombre",
      themeLight: "Clair",
      yourPulse: "VOTRE RYTHME",
      beatIndicator: "Indicateur de temps",
      beat: "Temps {current} sur {total}",
      bar: "Mesure {current} sur {total}",
      setYourPace: "RÉGLEZ VOTRE TEMPO",
      tempo: "Tempo",
      adjustTempo: "Régler le tempo",
      decrease5: "Diminuer de 5 BPM",
      decrease1: "Diminuer de 1 BPM",
      increase1: "Augmenter de 1 BPM",
      increase5: "Augmenter de 5 BPM",
      tempoSlider: "Curseur de tempo",
      keyboardHint: "↑/↓ régler · Maj + flèches : ±5 · Espace : démarrer/arrêter · T : taper",
      start: "Démarrer",
      stop: "Arrêter",
      tapTempo: "Taper le tempo",
      mode: "Mode",
      metronome: "Métronome",
      speedLoop: "Augmentation progressive du tempo",
      fixedTempo: "TEMPO FIXE",
      metronomePractice: "Exercice au métronome",
      metronomeDescription: "Réglez le tempo ci-dessus et lancez un battement régulier. Les options de mesure, de son, de décompte et de minuterie sont ci-dessous.",
      progressiveTempo: "TEMPO PROGRESSIF",
      speedLoopSetup: "Réglages de l’augmentation progressive du tempo",
      speedLoopDescription: "Augmentez le tempo par phrases structurées. Il change uniquement au début de chaque groupe de mesures sélectionné.",
      rampSettings: "Réglages de la progression",
      startBpm: "BPM de départ",
      targetBpm: "BPM cible",
      rampDuration: "Durée de progression (min)",
      barsPerChange: "Mesures avant le changement de tempo",
      rampProgress: "Progression de l’accélération",
      rampHint: "Chaque phrase dure {count} {unit}. Le tempo change au début de la phrase.",
      barUnit: "mesure",
      barsUnit: "mesures",
      makeItYours: "PERSONNALISEZ",
      practiceSettings: "Réglages d’entraînement",
      stopToChange: "Arrêtez la lecture pour modifier les réglages.",
      meterSession: "Mesure et session d’entraînement",
      beatsPerBar: "Temps par mesure",
      practiceTimer: "Minuterie d’entraînement",
      durationMinutes: "Durée (minutes)",
      countIn: "Décompte",
      countInBeats: "Temps du décompte initial",
      soundDisplay: "Son et affichage",
      clickSound: "Son du clic",
      toneSoft: "Doux",
      toneClassic: "Classique",
      toneBright: "Vif",
      subdivision: "Subdivision",
      quarterNotes: "Noires",
      eighthNotes: "Croches",
      sixteenthNotes: "Doubles croches",
      accentPattern: "Motif d’accentuation",
      downbeat: "Accent sur le premier temps",
      backbeat: "Accents sur les temps pairs (2, 4…)",
      everyBeat: "Chaque temps",
      noAccents: "Sans accents",
      volume: "Volume",
      metronomeVolume: "Volume du métronome",
      keepScreenAwake: "Garder l’écran allumé",
      recentPractice: "Entraînements récents",
      historyEmpty: "Les sessions terminées apparaîtront ici sur cet appareil.",
      clearHistory: "Effacer l’historique",
      historyEntry: "{mode} · {start} → {end} BPM",
      interrupted: "interrompue",
      screenLockUnsupported: "Ce navigateur ne permet pas de garder l’écran allumé.",
      screenMayDim: "L’écran peut s’éteindre pendant que le métronome continue.",
      screenWillStayAwake: "L’écran restera allumé pendant la lecture.",
      screenLockFailed: "Impossible de garder l’écran allumé. La lecture continuera normalement.",
      stopPlaybackToChangeMode: "Arrêtez la lecture pour changer de mode",
      tapResult: "Tempo mesuré : {bpm} BPM",
      keepTapping: "Continuez à taper…",
      audioUnsupported: "Le son n’est pas pris en charge par ce navigateur. Essayez un navigateur récent compatible avec Web Audio.",
      audioStartFailed: "Impossible de démarrer le son. Vérifiez les autorisations du navigateur, puis appuyez de nouveau sur Démarrer.",
      countInStatus: "Décompte",
      countInRemaining: "Décompte : {count}",
      sessionInterrupted: "Session mise en pause lorsque l’application a quitté l’écran. Appuyez sur Démarrer pour recommencer.",
      rampTargetReached: "{bpm} BPM · objectif atteint, maintien",
      rampNextPhrase: "{bpm} BPM maintenant · prochaine phrase : {next} BPM",
      rampProgressText: "{bpm} BPM maintenant · prochaine phrase : {next} BPM · {percent}% · reste {time}",
      timeLeft: "Temps restant {time}",
      elapsed: "Écoulé {time}",
      practiceComplete: "Entraînement terminé",
      appInitFailed: "Impossible d’initialiser l’application.",
      bpmAccessible: "{bpm} battements par minute",
  };
  if (typeof module !== "undefined" && module.exports) module.exports = locale;
  if (typeof window !== "undefined") {
    window.MetronomeLocaleMessages ??= {};
    window.MetronomeLocaleMessages['fr'] = locale;
  }
})();

;
(() => {
  "use strict";
  const locale = {
      pageTitle: "Übungsmetronom — Finde deinen Rhythmus",
      appName: "Übungsmetronom",
      tagline: "Finde deinen Rhythmus. Entwickle dein Tempo.",
      homeLabel: "Startseite des Übungsmetronoms",
      language: "Sprache",
      theme: "Design",
      themeSystem: "System",
      themeDark: "Dunkel",
      themeLight: "Hell",
      yourPulse: "DEIN PULS",
      beatIndicator: "Taktschlaganzeige",
      beat: "Schlag {current} von {total}",
      bar: "Takt {current} von {total}",
      setYourPace: "TEMPO FESTLEGEN",
      tempo: "Tempo",
      adjustTempo: "Tempo anpassen",
      decrease5: "5 BPM verringern",
      decrease1: "1 BPM verringern",
      increase1: "1 BPM erhöhen",
      increase5: "5 BPM erhöhen",
      tempoSlider: "Tempo-Schieberegler",
      keyboardHint: "↑/↓ anpassen · Umschalt + Pfeile: ±5 · Leertaste: Start/Stopp · T: tippen",
      start: "Start",
      stop: "Stopp",
      tapTempo: "Tippen, um das Tempo zu messen",
      mode: "Modus",
      metronome: "Metronom",
      speedLoop: "Tempo schrittweise steigern",
      fixedTempo: "FESTES TEMPO",
      metronomePractice: "Metronom-Übung",
      metronomeDescription: "Stelle oben das Tempo ein und starte einen gleichmäßigen Takt. Taktart, Klang, Einzählen und Timer findest du unten.",
      progressiveTempo: "STEIGENDES TEMPO",
      speedLoopSetup: "Einstellungen zur schrittweisen Temposteigerung",
      speedLoopDescription: "Steigere das Tempo in klar gegliederten Phrasen. Es ändert sich nur am Anfang der ausgewählten Taktgruppe.",
      rampSettings: "Temposteigerung",
      startBpm: "Start-BPM",
      targetBpm: "Ziel-BPM",
      rampDuration: "Dauer des Aufbaus (Min.)",
      barsPerChange: "Takte pro Tempowechsel",
      rampProgress: "Fortschritt des Tempoaufbaus",
      rampHint: "Jede Phrase dauert {count} {unit}. Das Tempo ändert sich am Anfang der Phrase.",
      barUnit: "Takt",
      barsUnit: "Takte",
      makeItYours: "ANPASSEN",
      practiceSettings: "Übungseinstellungen",
      stopToChange: "Stoppe die Wiedergabe, um Einstellungen zu ändern.",
      meterSession: "Taktart & Übungseinheit",
      beatsPerBar: "Schläge pro Takt",
      practiceTimer: "Übungstimer",
      durationMinutes: "Dauer (Minuten)",
      countIn: "Einzählen",
      countInBeats: "Einzähl-Schläge",
      soundDisplay: "Klang & Anzeige",
      clickSound: "Klickklang",
      toneSoft: "Sanft",
      toneClassic: "Klassisch",
      toneBright: "Hell",
      subdivision: "Unterteilung",
      quarterNotes: "Viertelnoten",
      eighthNotes: "Achtelnoten",
      sixteenthNotes: "Sechzehntelnoten",
      accentPattern: "Betonungsmuster",
      downbeat: "Betonung auf Schlag 1",
      backbeat: "Betonung auf den geraden Schlägen (2, 4 …)",
      everyBeat: "Jeder Schlag",
      noAccents: "Keine Betonung",
      volume: "Lautstärke",
      metronomeVolume: "Metronomlautstärke",
      keepScreenAwake: "Bildschirm eingeschaltet lassen",
      recentPractice: "Letzte Übungen",
      historyEmpty: "Abgeschlossene Sitzungen erscheinen hier auf diesem Gerät.",
      clearHistory: "Verlauf löschen",
      historyEntry: "{mode} · {start} → {end} BPM",
      interrupted: "unterbrochen",
      screenLockUnsupported: "Dieser Browser unterstützt das Aktivhalten des Bildschirms nicht.",
      screenMayDim: "Der Bildschirm kann dunkel werden, während das Metronom weiterläuft.",
      screenWillStayAwake: "Der Bildschirm bleibt während der Wiedergabe eingeschaltet.",
      screenLockFailed: "Der Bildschirm konnte nicht aktiv gehalten werden. Die Wiedergabe läuft normal weiter.",
      stopPlaybackToChangeMode: "Stoppe die Wiedergabe, um den Modus zu wechseln",
      tapResult: "Ermitteltes Tempo: {bpm} BPM",
      keepTapping: "Weiter tippen…",
      audioUnsupported: "Dieser Browser unterstützt keine Audiowiedergabe. Verwende einen aktuellen Browser mit Web Audio.",
      audioStartFailed: "Audio konnte nicht gestartet werden. Prüfe die Browserberechtigungen und tippe erneut auf Start.",
      countInStatus: "Einzählen",
      countInRemaining: "Einzählen: {count}",
      sessionInterrupted: "Sitzung pausiert, als die App nicht mehr angezeigt wurde. Tippe auf Start, um neu zu beginnen.",
      rampTargetReached: "{bpm} BPM · Ziel erreicht, Tempo wird gehalten",
      rampNextPhrase: "Jetzt {bpm} BPM · nächste Phrase {next} BPM",
      rampProgressText: "Jetzt {bpm} BPM · nächste Phrase {next} BPM · {percent}% · noch {time}",
      timeLeft: "Verbleibend {time}",
      elapsed: "Vergangen {time}",
      practiceComplete: "Übungszeit beendet",
      appInitFailed: "Die App konnte nicht gestartet werden.",
      bpmAccessible: "{bpm} Schläge pro Minute",
  };
  if (typeof module !== "undefined" && module.exports) module.exports = locale;
  if (typeof window !== "undefined") {
    window.MetronomeLocaleMessages ??= {};
    window.MetronomeLocaleMessages['de'] = locale;
  }
})();

;
(() => {
  "use strict";
  const locale = {
      pageTitle: "練習用メトロノーム — リズムを見つけよう",
      appName: "練習用メトロノーム",
      tagline: "リズムを見つけて、テンポを磨こう。",
      homeLabel: "メトロノームのホーム",
      language: "言語",
      theme: "テーマ",
      themeSystem: "システム",
      themeDark: "ダーク",
      themeLight: "ライト",
      yourPulse: "あなたのリズム",
      beatIndicator: "拍インジケーター",
      beat: "{total}拍中 {current}拍目",
      bar: "{total}小節中 {current}小節目",
      setYourPace: "テンポを設定",
      tempo: "テンポ",
      adjustTempo: "テンポを調整",
      decrease5: "テンポを5 BPM下げる",
      decrease1: "テンポを1 BPM下げる",
      increase1: "テンポを1 BPM上げる",
      increase5: "テンポを5 BPM上げる",
      tempoSlider: "テンポスライダー",
      keyboardHint: "↑/↓ 調整 · Shift + 矢印: ±5 · Space: 開始/停止 · T: タップ",
      start: "開始",
      stop: "停止",
      tapTempo: "タップしてテンポを測定",
      mode: "モード",
      metronome: "メトロノーム",
      speedLoop: "段階的なテンポアップ",
      fixedTempo: "一定のテンポ",
      metronomePractice: "メトロノーム練習",
      metronomeDescription: "上でテンポを設定して、一定の拍を開始します。拍子、音、カウントイン、タイマーは下で設定できます。",
      progressiveTempo: "段階的なテンポ",
      speedLoopSetup: "段階的なテンポアップの設定",
      speedLoopDescription: "決めたフレーズごとにテンポを上げます。テンポが変わるのは、選択した小節数のまとまりの先頭だけです。",
      rampSettings: "テンポアップの設定",
      startBpm: "開始 BPM",
      targetBpm: "目標 BPM",
      rampDuration: "加速時間（分）",
      barsPerChange: "何小節ごとにテンポを変更するか",
      rampProgress: "加速の進行状況",
      rampHint: "1フレーズは{count}{unit}です。テンポは各フレーズの最初に変わります。",
      barUnit: "小節",
      barsUnit: "小節",
      makeItYours: "カスタマイズ",
      practiceSettings: "練習設定",
      stopToChange: "設定を変更するには再生を停止してください。",
      meterSession: "拍子と練習セッション",
      beatsPerBar: "1小節の拍数",
      practiceTimer: "練習タイマー",
      durationMinutes: "時間（分）",
      countIn: "開始前のカウント",
      countInBeats: "開始前に数える拍数",
      soundDisplay: "音と表示",
      clickSound: "クリック音",
      toneSoft: "ソフト",
      toneClassic: "クラシック",
      toneBright: "明るい",
      subdivision: "音符の細分化",
      quarterNotes: "4分音符",
      eighthNotes: "8分音符",
      sixteenthNotes: "16分音符",
      accentPattern: "アクセントパターン",
      downbeat: "1拍目を強調",
      backbeat: "偶数拍を強調（2、4…）",
      everyBeat: "すべての拍",
      noAccents: "アクセントなし",
      volume: "音量",
      metronomeVolume: "メトロノーム音量",
      keepScreenAwake: "画面をスリープさせない",
      recentPractice: "最近の練習",
      historyEmpty: "完了したセッションがこの端末に表示されます。",
      clearHistory: "履歴を消去",
      historyEntry: "{mode} · {start} → {end} BPM",
      interrupted: "中断",
      screenLockUnsupported: "このブラウザーは画面のスリープ防止に対応していません。",
      screenMayDim: "メトロノームの再生中に画面が暗くなる場合があります。",
      screenWillStayAwake: "再生中は画面がスリープしません。",
      screenLockFailed: "画面をスリープさせない設定にできませんでした。再生は通常どおり続きます。",
      stopPlaybackToChangeMode: "モードを変更するには再生を停止してください",
      tapResult: "計測テンポ: {bpm} BPM",
      keepTapping: "続けてタップしてください…",
      audioUnsupported: "このブラウザーはオーディオに対応していません。Web Audio対応の最新ブラウザーをお試しください。",
      audioStartFailed: "音声を開始できませんでした。ブラウザーの音声権限を確認して、もう一度開始してください。",
      countInStatus: "カウントイン",
      countInRemaining: "カウントイン: {count}",
      sessionInterrupted: "画面を離れたためセッションを一時停止しました。再開するには「開始」をタップしてください。",
      rampTargetReached: "{bpm} BPM · 目標に到達、維持中",
      rampNextPhrase: "現在 {bpm} BPM · 次のフレーズ {next} BPM",
      rampProgressText: "現在 {bpm} BPM · 次のフレーズ {next} BPM · {percent}% · 残り {time}",
      timeLeft: "残り時間 {time}",
      elapsed: "経過時間 {time}",
      practiceComplete: "練習時間が終了しました",
      appInitFailed: "アプリを起動できませんでした。",
      bpmAccessible: "毎分{bpm}拍",
  };
  if (typeof module !== "undefined" && module.exports) module.exports = locale;
  if (typeof window !== "undefined") {
    window.MetronomeLocaleMessages ??= {};
    window.MetronomeLocaleMessages['ja'] = locale;
  }
})();

;
(() => {
  "use strict";
  const locale = {
      pageTitle: "练习节拍器 — 找到你的节奏",
      appName: "练习节拍器",
      tagline: "找到节奏，稳步提升。",
      homeLabel: "节拍器主页",
      language: "语言",
      theme: "主题",
      themeSystem: "跟随系统",
      themeDark: "深色",
      themeLight: "浅色",
      yourPulse: "你的节拍",
      beatIndicator: "节拍指示器",
      beat: "第 {current} 拍，共 {total} 拍",
      bar: "第 {current} 小节，共 {total} 小节",
      setYourPace: "设置速度",
      tempo: "速度",
      adjustTempo: "调整速度",
      decrease5: "降低 5 BPM",
      decrease1: "降低 1 BPM",
      increase1: "提高 1 BPM",
      increase5: "提高 5 BPM",
      tempoSlider: "速度滑块",
      keyboardHint: "↑/↓ 调整 · Shift + 方向键：±5 · 空格：开始/停止 · T：敲击测速",
      start: "开始",
      stop: "停止",
      tapTempo: "敲击测量节拍速度",
      mode: "模式",
      metronome: "节拍器",
      speedLoop: "逐步加快速度",
      fixedTempo: "固定速度",
      metronomePractice: "节拍器练习",
      metronomeDescription: "在上方设置速度并开始稳定的节拍。拍号、声音、预备拍和计时器选项在下方。",
      progressiveTempo: "渐进速度",
      speedLoopSetup: "逐步加快速度设置",
      speedLoopDescription: "按固定乐句逐步加快速度。只有到达所选小节组的开头时才会改变速度。",
      rampSettings: "速度递增设置",
      startBpm: "起始 BPM",
      targetBpm: "目标 BPM",
      rampDuration: "提速时长（分钟）",
      barsPerChange: "每隔多少小节改变速度",
      rampProgress: "渐进提速进度",
      rampHint: "每个乐句为 {count} {unit}。速度在每个乐句开始时改变。",
      barUnit: "小节",
      barsUnit: "小节",
      makeItYours: "自定义",
      practiceSettings: "练习设置",
      stopToChange: "请停止播放后再更改设置。",
      meterSession: "拍号与练习时段",
      beatsPerBar: "每小节拍数",
      practiceTimer: "练习计时器",
      durationMinutes: "时长（分钟）",
      countIn: "开始前倒数",
      countInBeats: "倒数拍数",
      soundDisplay: "声音与显示",
      clickSound: "节拍音色",
      toneSoft: "柔和",
      toneClassic: "经典",
      toneBright: "明亮",
      subdivision: "细分节拍",
      quarterNotes: "四分音符",
      eighthNotes: "八分音符",
      sixteenthNotes: "十六分音符",
      accentPattern: "重音模式",
      downbeat: "只强调第一拍",
      backbeat: "强调偶数拍（第 2、4 拍等）",
      everyBeat: "每一拍",
      noAccents: "无重音",
      volume: "音量",
      metronomeVolume: "节拍器音量",
      keepScreenAwake: "保持屏幕常亮",
      recentPractice: "最近练习",
      historyEmpty: "已完成的练习会显示在此设备上。",
      clearHistory: "清除记录",
      historyEntry: "{mode} · {start} → {end} BPM",
      interrupted: "已中断",
      screenLockUnsupported: "此浏览器不支持保持屏幕常亮。",
      screenMayDim: "节拍器继续播放时，屏幕可能变暗。",
      screenWillStayAwake: "播放期间屏幕将保持常亮。",
      screenLockFailed: "无法保持屏幕常亮。播放仍会正常继续。",
      stopPlaybackToChangeMode: "请停止播放后再切换模式",
      tapResult: "测得速度：{bpm} BPM",
      keepTapping: "请继续敲击…",
      audioUnsupported: "此浏览器不支持音频。请尝试使用支持 Web Audio 的新版浏览器。",
      audioStartFailed: "无法启动音频。请检查浏览器音频权限，然后再次点击开始。",
      countInStatus: "预备拍",
      countInRemaining: "预备拍：{count}",
      sessionInterrupted: "应用离开屏幕后练习已暂停。点击“开始”即可重新开始。",
      rampTargetReached: "{bpm} BPM · 已达到目标并保持",
      rampNextPhrase: "当前 {bpm} BPM · 下一乐句 {next} BPM",
      rampProgressText: "当前 {bpm} BPM · 下一乐句 {next} BPM · {percent}% · 剩余 {time}",
      timeLeft: "剩余时间 {time}",
      elapsed: "已用时间 {time}",
      practiceComplete: "练习时间结束",
      appInitFailed: "无法初始化应用。",
      bpmAccessible: "每分钟 {bpm} 拍",
  };
  if (typeof module !== "undefined" && module.exports) module.exports = locale;
  if (typeof window !== "undefined") {
    window.MetronomeLocaleMessages ??= {};
    window.MetronomeLocaleMessages['zh-CN'] = locale;
  }
})();

;
(() => {
  "use strict";
  const locale = {
      pageTitle: "연습용 메트로놈 — 나만의 리듬 찾기",
      appName: "연습용 메트로놈",
      tagline: "리듬을 찾고 템포를 만들어 보세요.",
      homeLabel: "메트로놈 홈",
      language: "언어",
      theme: "테마",
      themeSystem: "시스템",
      themeDark: "어둡게",
      themeLight: "밝게",
      yourPulse: "나의 박자",
      beatIndicator: "박자 표시기",
      beat: "전체 {total}박 중 {current}박",
      bar: "전체 {total}마디 중 {current}마디",
      setYourPace: "템포 설정",
      tempo: "템포",
      adjustTempo: "템포 조절",
      decrease5: "5 BPM 낮추기",
      decrease1: "1 BPM 낮추기",
      increase1: "1 BPM 높이기",
      increase5: "5 BPM 높이기",
      tempoSlider: "템포 슬라이더",
      keyboardHint: "↑/↓ 조절 · Shift + 화살표: ±5 · Space: 시작/정지 · T: 탭 템포",
      start: "시작",
      stop: "정지",
      tapTempo: "박자를 탭해 템포 측정",
      mode: "모드",
      metronome: "메트로놈",
      speedLoop: "템포 단계적으로 높이기",
      fixedTempo: "고정 템포",
      metronomePractice: "메트로놈 연습",
      metronomeDescription: "위에서 템포를 설정하고 일정한 박자를 시작하세요. 박자표, 소리, 카운트인, 타이머는 아래에서 설정할 수 있습니다.",
      progressiveTempo: "점진적 템포",
      speedLoopSetup: "템포 단계 높이기 설정",
      speedLoopDescription: "정해진 프레이즈에 맞춰 템포를 높입니다. 선택한 마디 묶음이 시작될 때만 템포가 바뀝니다.",
      rampSettings: "템포 높이기 설정",
      startBpm: "시작 BPM",
      targetBpm: "목표 BPM",
      rampDuration: "향상 시간(분)",
      barsPerChange: "몇 마디마다 템포를 변경할지",
      rampProgress: "점진적 템포 진행률",
      rampHint: "프레이즈는 {count}{unit}로 구성됩니다. 각 프레이즈가 시작될 때 템포가 바뀝니다.",
      barUnit: "마디",
      barsUnit: "마디",
      makeItYours: "맞춤 설정",
      practiceSettings: "연습 설정",
      stopToChange: "설정을 변경하려면 재생을 중지하세요.",
      meterSession: "박자표 및 연습 세션",
      beatsPerBar: "한 마디 박자 수",
      practiceTimer: "연습 타이머",
      durationMinutes: "시간(분)",
      countIn: "카운트인",
      countInBeats: "카운트인 박자 수",
      soundDisplay: "소리 및 화면",
      clickSound: "클릭 소리",
      toneSoft: "부드럽게",
      toneClassic: "클래식",
      toneBright: "선명하게",
      subdivision: "박자 세분화",
      quarterNotes: "4분음표",
      eighthNotes: "8분음표",
      sixteenthNotes: "16분음표",
      accentPattern: "강세 패턴",
      downbeat: "첫 박만 강조",
      backbeat: "짝수 박 강조(2박, 4박 등)",
      everyBeat: "매 박",
      noAccents: "강세 없음",
      volume: "음량",
      metronomeVolume: "메트로놈 음량",
      keepScreenAwake: "화면 켜짐 유지",
      recentPractice: "최근 연습",
      historyEmpty: "완료된 세션이 이 기기에 표시됩니다.",
      clearHistory: "기록 지우기",
      historyEntry: "{mode} · {start} → {end} BPM",
      interrupted: "중단됨",
      screenLockUnsupported: "이 브라우저는 화면 켜짐 유지를 지원하지 않습니다.",
      screenMayDim: "메트로놈이 계속 재생되는 동안 화면이 어두워질 수 있습니다.",
      screenWillStayAwake: "재생 중에는 화면이 켜진 상태로 유지됩니다.",
      screenLockFailed: "화면 켜짐을 유지할 수 없습니다. 재생은 정상적으로 계속됩니다.",
      stopPlaybackToChangeMode: "모드를 변경하려면 재생을 중지하세요",
      tapResult: "측정된 템포: {bpm} BPM",
      keepTapping: "계속 탭하세요…",
      audioUnsupported: "이 브라우저는 오디오를 지원하지 않습니다. Web Audio를 지원하는 최신 브라우저를 사용하세요.",
      audioStartFailed: "오디오를 시작할 수 없습니다. 브라우저 오디오 권한을 확인한 후 다시 시작을 누르세요.",
      countInStatus: "카운트인",
      countInRemaining: "카운트인: {count}",
      sessionInterrupted: "앱이 화면에서 사라져 세션이 일시 중지되었습니다. 시작을 눌러 다시 시작하세요.",
      rampTargetReached: "{bpm} BPM · 목표 도달, 유지 중",
      rampNextPhrase: "현재 {bpm} BPM · 다음 프레이즈 {next} BPM",
      rampProgressText: "현재 {bpm} BPM · 다음 프레이즈 {next} BPM · {percent}% · 남은 시간 {time}",
      timeLeft: "남은 시간 {time}",
      elapsed: "경과 시간 {time}",
      practiceComplete: "연습 시간이 끝났습니다",
      appInitFailed: "앱을 초기화할 수 없습니다.",
      bpmAccessible: "분당 {bpm}박",
  };
  if (typeof module !== "undefined" && module.exports) module.exports = locale;
  if (typeof window !== "undefined") {
    window.MetronomeLocaleMessages ??= {};
    window.MetronomeLocaleMessages['ko'] = locale;
  }
})();

;
(() => {
  "use strict";

  const KEY = "metronome.settings.v1";
  const HISTORY_KEY = "metronome.sessions.v1";
  const WAIT_MS = 250;
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const defaults = Object.freeze({
    bpm: 120,
    beatsPerBar: 4,
    mode: "metronome",
    timerEnabled: false,
    timerMinutes: 5,
    countdownEnabled: false,
    countdownBeats: 4,
    loopStart: 60,
    loopTarget: 120,
    loopMinutes: 10,
    loopBars: 4,
    volume: 0.65,
    clickTone: "classic",
    wakeLockEnabled: false,
    theme: "dark",
    language: "en-US",
    subdivisions: 1,
    accentPattern: "downbeat",
  });
  const validTones = new Set(["soft", "classic", "bright"]);
  const validAccents = new Set(["downbeat", "backbeat", "every", "none"]);
  const validLanguages = new Set(["en-US", "pt-BR", "es", "it", "fr", "de", "ja", "zh-CN", "ko"]);
  let saveTimer = 0;

  const load = () => {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { ...defaults };
      const parsed = JSON.parse(raw);
      if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return { ...defaults };
      const number = (key, min, max) => {
        if (parsed[key] === undefined || parsed[key] === null || parsed[key] === "") return defaults[key];
        const value = Number(parsed[key]);
        return Number.isFinite(value) ? clamp(value, min, max) : defaults[key];
      };
      return {
        bpm: Math.round(number("bpm", 30, 300)),
        beatsPerBar: [2, 3, 4, 5, 6, 7, 8].includes(Number(parsed.beatsPerBar)) ? Number(parsed.beatsPerBar) : defaults.beatsPerBar,
        mode: ["metronome", "speedloop"].includes(parsed.mode) ? parsed.mode : defaults.mode,
        timerEnabled: typeof parsed.timerEnabled === "boolean" ? parsed.timerEnabled : defaults.timerEnabled,
        timerMinutes: Math.round(number("timerMinutes", 1, 180)),
        countdownEnabled: typeof parsed.countdownEnabled === "boolean" ? parsed.countdownEnabled : defaults.countdownEnabled,
        countdownBeats: [4, 8].includes(Number(parsed.countdownBeats)) ? Number(parsed.countdownBeats) : defaults.countdownBeats,
        loopStart: Math.round(number("loopStart", 30, 300)),
        loopTarget: Math.round(number("loopTarget", 30, 300)),
        loopMinutes: Math.round(number("loopMinutes", 1, 120)),
        loopBars: Math.round(number("loopBars", 1, 32)),
        volume: number("volume", 0, 1),
        clickTone: validTones.has(parsed.clickTone) ? parsed.clickTone : defaults.clickTone,
        wakeLockEnabled: typeof parsed.wakeLockEnabled === "boolean" ? parsed.wakeLockEnabled : defaults.wakeLockEnabled,
        theme: ["system", "dark", "light"].includes(parsed.theme) ? parsed.theme : defaults.theme,
        language: validLanguages.has(parsed.language) ? parsed.language : defaults.language,
        subdivisions: [1, 2, 4].includes(Number(parsed.subdivisions)) ? Number(parsed.subdivisions) : defaults.subdivisions,
        accentPattern: validAccents.has(parsed.accentPattern) ? parsed.accentPattern : defaults.accentPattern,
      };
    } catch {
      return { ...defaults };
    }
  };

  const save = (state) => {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(() => {
      try {
        localStorage.setItem(KEY, JSON.stringify(state));
      } catch {
        /* Storage may be unavailable or full. */
      }
    }, WAIT_MS);
  };

  const loadSessions = () => {
    try {
      const sessions = JSON.parse(localStorage.getItem(HISTORY_KEY) || "[]");
      if (!Array.isArray(sessions)) return [];
      return sessions.filter((session) =>
        session &&
        Number.isFinite(session.startedAt) &&
        Number.isFinite(session.durationSec) &&
        Number.isFinite(session.startBpm) &&
        Number.isFinite(session.endBpm) &&
        typeof session.mode === "string"
      ).slice(0, 10);
    } catch {
      return [];
    }
  };

  const saveSession = (session) => {
    try {
      const sessions = [session, ...loadSessions()].slice(0, 10);
      localStorage.setItem(HISTORY_KEY, JSON.stringify(sessions));
      return sessions;
    } catch {
      return loadSessions();
    }
  };

  const clearSessions = () => {
    try {
      localStorage.removeItem(HISTORY_KEY);
    } catch {
      return false;
    }
    return true;
  };

  const api = { load, save, loadSessions, saveSession, clearSessions };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.MetronomeStorage = Object.freeze(api);
})();

;
(() => {
  "use strict";

  const createMetronomeAudio = ({ CONFIG, clamp }) => {
    const tones = Object.freeze({
      soft: { type: "sine", down: 950, up: 650 },
      classic: { type: "sine", down: CONFIG.CLICK_FREQ_DOWN, up: CONFIG.CLICK_FREQ_UP },
      bright: { type: "triangle", down: 2200, up: 1450 },
    });

    class AudioEngine {
      constructor() {
        this.ctx = null;
        this.master = null;
        this.volume = 0.65;
        this.clickTone = tones.classic;
      }

      setVolume(volume) {
        this.volume = clamp(volume, 0, 1);
        if (this.master) this.master.gain.setTargetAtTime(this.volume, this.now, 0.01);
      }

      setClickTone(tone) {
        this.clickTone = tones[tone] ?? tones.classic;
      }

      ensure() {
        if (!this.ctx) {
          const Ctx = window.AudioContext || window.webkitAudioContext;
          if (!Ctx) throw new Error("Web Audio API is not supported in this browser.");
          this.ctx = new Ctx({ latencyHint: "interactive" });
          this.master = this.ctx.createGain();
          this.master.gain.value = this.volume;
          this.master.connect(this.ctx.destination);
        }
        return this.ctx;
      }

      async resume() {
        const ctx = this.ensure();
        if (ctx.state === "suspended") await ctx.resume();
        return ctx;
      }

      get now() {
        return this.ctx ? this.ctx.currentTime : 0;
      }

      scheduleClick(time, accent, isSubdivision = false) {
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = this.clickTone.type;
        osc.frequency.setValueAtTime(accent ? this.clickTone.down : this.clickTone.up, time);

        const peak = isSubdivision ? CONFIG.CLICK_PEAK_SUB : accent ? CONFIG.CLICK_PEAK : CONFIG.CLICK_PEAK_UP;
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.exponentialRampToValueAtTime(peak, time + 0.002);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + CONFIG.CLICK_DURATION);
        osc.connect(gain);
        gain.connect(this.master);
        osc.start(time);
        osc.stop(time + CONFIG.CLICK_DURATION + 0.01);
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
        };
      }

      scheduleAlert(time, freq = 880, duration = 0.25) {
        const ctx = this.ctx;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = "triangle";
        osc.frequency.setValueAtTime(freq, time);
        gain.gain.setValueAtTime(0.0001, time);
        gain.gain.exponentialRampToValueAtTime(0.7, time + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);
        osc.connect(gain);
        gain.connect(this.master);
        osc.start(time);
        osc.stop(time + duration + 0.02);
        osc.onended = () => {
          osc.disconnect();
          gain.disconnect();
        };
      }
    }

    class Scheduler {
      constructor(engine, onBeat) {
        this.engine = engine;
        this.onBeat = onBeat;
        this.bpm = CONFIG.DEFAULT_BPM;
        this.beatsPerBar = CONFIG.DEFAULT_BEATS;
        this.nextNoteTime = 0;
        this.beatIndex = 0;
        this.timerId = null;
        this.running = false;
        this.subdivisions = 1;
        this.accentPattern = "downbeat";
      }

      get secondsPerBeat() {
        return 60 / this.bpm;
      }

      setBpm(bpm) {
        this.bpm = clamp(bpm, CONFIG.MIN_BPM, CONFIG.MAX_BPM);
      }

      setBeatsPerBar(n) {
        this.beatsPerBar = n;
        if (this.beatIndex >= n) this.beatIndex = 0;
      }

      setSubdivisions(count) {
        this.subdivisions = count;
      }

      setAccentPattern(pattern) {
        this.accentPattern = pattern;
      }

      isAccented(beatIndex) {
        if (this.accentPattern === "every") return true;
        if (this.accentPattern === "backbeat") return beatIndex % 2 === 1;
        if (this.accentPattern === "none") return false;
        return beatIndex === 0;
      }

      start(startTime) {
        if (this.running) return;
        this.running = true;
        this.beatIndex = 0;
        this.nextNoteTime = startTime ?? this.engine.now + 0.05;
        this.tick();
        this.timerId = setInterval(() => this.tick(), CONFIG.SCHEDULER_INTERVAL);
      }

      stop() {
        this.running = false;
        if (this.timerId) {
          clearInterval(this.timerId);
          this.timerId = null;
        }
      }

      tick() {
        if (!this.running) return;
        const horizon = this.engine.now + CONFIG.SCHEDULE_AHEAD;
        while (this.nextNoteTime < horizon) {
          const accent = this.isAccented(this.beatIndex);
          for (let subdivision = 0; subdivision < this.subdivisions; subdivision++) {
            const time = this.nextNoteTime + subdivision * this.secondsPerBeat / this.subdivisions;
            this.engine.scheduleClick(time, subdivision === 0 && accent, subdivision > 0);
          }
          this.onBeat(this.beatIndex, this.nextNoteTime, this.beatsPerBar);
          this.nextNoteTime += this.secondsPerBeat;
          this.beatIndex = (this.beatIndex + 1) % this.beatsPerBar;
        }
      }
    }

    return { AudioEngine, Scheduler };
  };
  if (typeof window !== "undefined") window.createMetronomeAudio = createMetronomeAudio;
  if (typeof module !== "undefined" && module.exports) module.exports = createMetronomeAudio;
})();

;
(() => {
  "use strict";

  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));

  class SpeedRamp {
    constructor() {
      this.start = 120;
      this.target = 120;
      this.durationSec = 600;
      this.startedAt = 0;
    }

    configure({ start, target, minutes }) {
      this.start = clamp(start, 30, 300);
      this.target = clamp(target, 30, 300);
      this.durationSec = Math.max(1, minutes) * 60;
    }

    begin(atTime) {
      this.startedAt = atTime;
    }

    sample(atTime) {
      const elapsed = Math.max(0, atTime - this.startedAt);
      const progress = clamp(elapsed / this.durationSec, 0, 1);
      const bpm = this.start + (this.target - this.start) * progress;
      return { bpm: Math.round(bpm), progress, rampDone: progress >= 1 };
    }
  }

  class SpeedLoopCadence {
    constructor(bars = 4) {
      this.bars = bars;
      this.beatCount = 0;
      this.beatsPerBar = 4;
    }

    reset(bars = this.bars) {
      this.bars = bars;
      this.beatCount = 0;
    }

    advance(beatsPerBar) {
      this.beatsPerBar = beatsPerBar;
      this.beatCount += 1;
      const phraseBeats = beatsPerBar * this.bars;
      return this.beatCount > 1 && (this.beatCount - 1) % phraseBeats === 0;
    }

    get bar() {
      if (this.beatCount === 0) return 1;
      return Math.floor((this.beatCount - 1) / this.beatsPerBar) % this.bars + 1;
    }
  }

  const initialBpm = (mode, bpm, loopStart) =>
    mode === "speedloop" ? clamp(loopStart, 30, 300) : bpm;

  const practiceTimerEnd = (atTime, enabled, minutes) =>
    enabled ? atTime + Math.max(1, minutes) * 60 : null;

  const api = { SpeedRamp, SpeedLoopCadence, initialBpm, practiceTimerEnd };
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.MetronomeTiming = api;
})();

;
(() => {
  "use strict";

  const supported = ["en-US", "pt-BR", "es", "it", "fr", "de", "ja", "zh-CN", "ko"];
  const messages = typeof window !== "undefined"
    ? window.MetronomeLocaleMessages
    : Object.fromEntries(supported.map((language) => [language, require(`./locales/${language}.js`)]));
  const keys = Object.keys(messages["en-US"]);
  Object.values(messages).forEach((locale) => {
    keys.forEach((key) => {
      if (typeof locale[key] !== "string") throw new Error(`Missing translation: ${key}`);
    });
  });
  let current = "en-US";
  const translate = (key, params = {}) => {
    const template = messages[current][key] ?? messages["en-US"][key] ?? key;
    return template.replace(/\{(\w+)\}/g, (_, name) => String(params[name] ?? `{${name}}`));
  };
  const setLanguage = (language) => {
    current = supported.includes(language) ? language : "en-US";
    document.documentElement.lang = current;
    document.querySelectorAll("[data-i18n]").forEach((element) => {
      const key = element.dataset.i18n;
      element.textContent = translate(key);
    });
    document.querySelectorAll("[data-i18n-aria-label]").forEach((element) => {
      element.setAttribute("aria-label", translate(element.dataset.i18nAriaLabel));
    });
    document.title = translate("pageTitle");
    return current;
  };
  const api = Object.freeze({ translate, setLanguage, get language() { return current; }, supported, keys });
  if (typeof module !== "undefined" && module.exports) module.exports = api;
  if (typeof window !== "undefined") window.MetronomeI18n = api;
})();

;
/**
 * Practice Metronome
 *
 * Timing model:
 *  - A lookahead scheduler (timer fires every ~25ms) queues clicks on the
 *    AudioContext timeline up to ~120ms ahead. Each click is an OscillatorNode
 *    started/stopped at an exact AudioContext time, so timing is sample-accurate
 *    and independent of JS timer jitter.
 *  - The visual beat indicator is driven from a queue of {time, beat} events
 *    that are drawn when the audio clock reaches them.
 */

(() => {
  "use strict";

  /* ============================================================
   * Constants & configuration
   * ============================================================ */
  const CONFIG = Object.freeze({
    MIN_BPM: 30,
    MAX_BPM: 300,
    DEFAULT_BPM: 120,
    DEFAULT_BEATS: 4,
    SCHEDULE_AHEAD: 0.12,      // seconds of audio queued in advance
    SCHEDULER_INTERVAL: 25,    // ms between scheduler wakeups
    CLICK_DURATION: 0.045,     // seconds
    CLICK_FREQ_DOWN: 1600,     // Hz, accented downbeat
    CLICK_FREQ_UP: 1000,       // Hz, other beats
    CLICK_PEAK: 0.9,
    CLICK_PEAK_UP: 0.55,
    CLICK_PEAK_SUB: 0.28,
    TAP_WINDOW_MS: 2000,       // taps older than this reset the sequence
    TAP_MAX_SAMPLES: 6,
    TAP_MIN_SAMPLES: 2,
    COUNTIN_LABEL_MS: 0,
  });

  const MODES = Object.freeze({ METRONOME: "metronome", SPEEDLOOP: "speedloop" });

  /* ============================================================
   * Utilities
   * ============================================================ */
  const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
  const toInt = (value, fallback) => {
    const n = Number.parseInt(value, 10);
    return Number.isFinite(n) ? n : fallback;
  };
  const formatTime = (totalSeconds) => {
    const s = Math.max(0, Math.ceil(totalSeconds));
    const m = Math.floor(s / 60);
    const r = s % 60;
    const format = new Intl.NumberFormat(window.MetronomeI18n?.language || "en-US", {
      minimumIntegerDigits: 2,
      useGrouping: false,
    });
    return `${format.format(m)}:${format.format(r)}`;
  };
  const t = (key, params) => window.MetronomeI18n.translate(key, params);
  const { SpeedRamp, SpeedLoopCadence, initialBpm, practiceTimerEnd } = window.MetronomeTiming;
  const { AudioEngine, Scheduler } = window.createMetronomeAudio({ CONFIG, clamp });

  /* ============================================================
   * Visual sync: plays beat events at the moment the audio sounds
   * ============================================================ */
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

    /** Queue a beat event to be drawn when audio time reaches it. */
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
      this.dots.forEach((d) => d.classList.remove("active"));
    }
  }

  /* ============================================================
   * Tap tempo
   * ============================================================ */
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
      if (this.taps.length > CONFIG.TAP_MAX_SAMPLES + 1) {
        this.taps.shift();
      }
      if (this.taps.length < CONFIG.TAP_MIN_SAMPLES + 1) return null;

      const intervals = [];
      for (let i = 1; i < this.taps.length; i++) {
        intervals.push(this.taps[i] - this.taps[i - 1]);
      }
      const avgMs = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const bpm = Math.round(60000 / avgMs);
      const clamped = clamp(bpm, CONFIG.MIN_BPM, CONFIG.MAX_BPM);
      this.onTempo(clamped);
      return clamped;
    }

    reset() {
      this.taps = [];
    }
  }

  /* ============================================================
   * Application controller
   * ============================================================ */
  class MetronomeApp {
    constructor() {
      this.state = window.MetronomeStorage.load();
      this.engine = new AudioEngine();

      // DOM refs
      this.el = {
        bpmValue: document.getElementById("bpmValue"),
        slider: document.getElementById("tempoSlider"),
        minus5: document.getElementById("minus5"),
        minus1: document.getElementById("minus1"),
        plus1: document.getElementById("plus1"),
        plus5: document.getElementById("plus5"),
        playBtn: document.getElementById("playBtn"),
        playLabel: document.getElementById("playLabel"),
        tapBtn: document.getElementById("tapBtn"),
        beatRow: document.getElementById("beatRow"),
        meterLabel: document.getElementById("meterLabel"),
        statusLine: document.getElementById("statusLine"),
        readout: document.getElementById("readout"),
        beatsPerBar: document.getElementById("beatsPerBar"),
        timerEnabled: document.getElementById("timerEnabled"),
        timerFields: document.getElementById("timerFields"),
        timerMinutes: document.getElementById("timerMinutes"),
        clickTone: document.getElementById("clickTone"),
        subdivisions: document.getElementById("subdivisions"),
        accentPattern: document.getElementById("accentPattern"),
        volume: document.getElementById("volume"),
        volumeValue: document.getElementById("volumeValue"),
        countdownEnabled: document.getElementById("countdownEnabled"),
        countdownFields: document.getElementById("countdownFields"),
        countdownBeats: document.getElementById("countdownBeats"),
        speedloopFields: document.getElementById("speedloopFields"),
        loopStart: document.getElementById("loopStart"),
        loopTarget: document.getElementById("loopTarget"),
        loopMinutes: document.getElementById("loopMinutes"),
        loopBars: document.getElementById("loopBars"),
        loopHint: document.getElementById("loopHint"),
        loopProgress: document.getElementById("loopProgress"),
        progressFill: document.getElementById("progressFill"),
        progressTrack: document.getElementById("progressTrack"),
        progressText: document.getElementById("progressText"),
        phraseLabel: document.getElementById("phraseLabel"),
        metronomePanel: document.getElementById("metronomePanel"),
        wakeLockEnabled: document.getElementById("wakeLockEnabled"),
        wakeLockStatus: document.getElementById("wakeLockStatus"),
        settingsHint: document.getElementById("settingsHint"),
        themeSelect: document.getElementById("themeSelect"),
        languageSelect: document.getElementById("languageSelect"),
        historyList: document.getElementById("historyList"),
        historyEmpty: document.getElementById("historyEmpty"),
        historyClear: document.getElementById("historyClear"),
        tabs: Array.from(document.querySelectorAll(".tab")),
      };

      this.visualizer = new BeatVisualizer(this.el.beatRow, (beatIndex, time) => {
        this.updatePhraseIndicator(beatIndex, time);
      });
      this.visualizer.attach(this.engine);

      this.scheduler = new Scheduler(this.engine, (beatIndex, time, count) => {
        this.visualizer.enqueue(beatIndex, time, count);
        this.handleScheduledBeat(time, count);
      });

      this.tap = new TapTempo((bpm) => this.setBpm(bpm, { fromTap: true }));
      this.ramp = new SpeedRamp();
      this.speedLoopCadence = new SpeedLoopCadence(this.state.loopBars);

      this.running = false;
      this.phase = "idle";          // idle | countin | playing
      this.sessionStartTime = 0;    // audio-clock time main session started
      this.speedLoopBar = 0;
      this.pendingSpeedLoopBeats = [];
      this.timerEndTime = null;     // audio-clock time when timer expires
      this.countInEndTime = null;
      this.wakeLock = null;
      this.wakeLockPending = false;
      this.wakeLockMessageKey = "";
      this.statusMessageKey = "";
      this.statusMessageParams = {};
      this.rafId = null;
      this.alertShown = false;
      this.sessionLogged = false;
      this.bindEvents();
      this.applyStateToUI();
      this.applyTheme(this.state.theme);
      this.applyLanguage(this.state.language);
      this.bindColorScheme();
      this.visualizer.rebuild(this.state.beatsPerBar);
      this.updateBeatCounter();
      this.renderHistory();
    }

    /* -------------------- State & persistence -------------------- */
    persist() {
      window.MetronomeStorage.save(this.state);
    }

    /* -------------------- Event binding -------------------- */
    bindEvents() {
      const e = this.el;

      e.playBtn.addEventListener("click", () => this.toggle());
      e.tapBtn.addEventListener("click", () => this.handleTap());
      e.themeSelect.addEventListener("change", () => {
        this.state.theme = e.themeSelect.value;
        this.applyTheme(this.state.theme);
        this.persist();
      });
      e.languageSelect.addEventListener("change", () => {
        this.state.language = e.languageSelect.value;
        this.applyLanguage(this.state.language);
        this.persist();
      });
      e.historyClear.addEventListener("click", () => {
        window.MetronomeStorage.clearSessions();
        this.renderHistory();
      });

      e.minus5.addEventListener("click", () => this.nudge(-5));
      e.minus1.addEventListener("click", () => this.nudge(-1));
      e.plus1.addEventListener("click", () => this.nudge(1));
      e.plus5.addEventListener("click", () => this.nudge(5));

      e.slider.addEventListener("input", () => {
        this.setBpm(toInt(e.slider.value, this.state.bpm));
      });

      e.beatsPerBar.addEventListener("change", () => {
        if (this.running) return;
        this.state.beatsPerBar = toInt(e.beatsPerBar.value, CONFIG.DEFAULT_BEATS);
        this.scheduler.setBeatsPerBar(this.state.beatsPerBar);
        this.visualizer.rebuild(this.state.beatsPerBar);
        this.updateBeatCounter();
        this.persist();
      });

      e.timerEnabled.addEventListener("change", () => {
        this.state.timerEnabled = e.timerEnabled.checked;
        e.timerFields.hidden = !this.state.timerEnabled;
        this.persist();
      });

      e.timerMinutes.addEventListener("change", () => {
        this.state.timerMinutes = clamp(toInt(e.timerMinutes.value, 5), 1, 180);
        e.timerMinutes.value = this.state.timerMinutes;
        this.persist();
      });

      e.clickTone.addEventListener("change", () => {
        this.state.clickTone = e.clickTone.value;
        this.engine.setClickTone(this.state.clickTone);
        this.persist();
      });

      e.subdivisions.addEventListener("change", () => {
        this.state.subdivisions = Number(e.subdivisions.value);
        this.scheduler.setSubdivisions(this.state.subdivisions);
        this.persist();
      });

      e.accentPattern.addEventListener("change", () => {
        this.state.accentPattern = e.accentPattern.value;
        this.scheduler.setAccentPattern(this.state.accentPattern);
        this.persist();
      });

      e.volume.addEventListener("input", () => {
        this.state.volume = Number(e.volume.value);
        this.el.volumeValue.value = `${Math.round(this.state.volume * 100)}%`;
        this.engine.setVolume(this.state.volume);
        this.persist();
      });

      e.countdownEnabled.addEventListener("change", () => {
        this.state.countdownEnabled = e.countdownEnabled.checked;
        e.countdownFields.hidden = !this.state.countdownEnabled;
        this.persist();
      });

      e.countdownBeats.addEventListener("change", () => {
        this.state.countdownBeats = toInt(e.countdownBeats.value, 4);
        this.persist();
      });

      e.wakeLockEnabled.addEventListener("change", () => {
        this.state.wakeLockEnabled = e.wakeLockEnabled.checked;
        this.persist();
        if (!this.state.wakeLockEnabled) this.releaseWakeLock();
        else if (this.running) this.acquireWakeLock();
      });

      const loopInputs = [
        [e.loopStart, "loopStart", 30, 300],
        [e.loopTarget, "loopTarget", 30, 300],
        [e.loopMinutes, "loopMinutes", 1, 120],
        [e.loopBars, "loopBars", 1, 32],
      ];
      loopInputs.forEach(([input, key, min, max]) => {
        input.addEventListener("change", () => {
          this.state[key] = clamp(toInt(input.value, this.state[key]), min, max);
          input.value = this.state[key];
          if (key === "loopBars") this.updateLoopPhraseText();
          this.persist();
        });
      });

      e.tabs.forEach((tab) => {
        tab.addEventListener("click", () => this.setMode(tab.dataset.mode));
      });
      e.tabs.forEach((tab, index) => {
        tab.addEventListener("keydown", (ev) => {
          let nextIndex;
          if (ev.key === "ArrowRight" || ev.key === "ArrowDown") nextIndex = (index + 1) % e.tabs.length;
          else if (ev.key === "ArrowLeft" || ev.key === "ArrowUp") nextIndex = (index - 1 + e.tabs.length) % e.tabs.length;
          else if (ev.key === "Home") nextIndex = 0;
          else if (ev.key === "End") nextIndex = e.tabs.length - 1;
          else return;
          ev.preventDefault();
          e.tabs[nextIndex].focus();
          e.tabs[nextIndex].click();
        });
      });

      // Keyboard: space toggles, arrows nudge, T taps.
      document.addEventListener("keydown", (ev) => {
        if (ev.repeat && (ev.code === "Space" || ev.key.toLowerCase() === "t")) return;
        if (ev.target instanceof HTMLElement && ev.target.closest("button, input, select, textarea, [contenteditable='true']")) return;
        if (ev.code === "Space") {
          ev.preventDefault();
          this.toggle();
        } else if (ev.code === "ArrowUp") {
          ev.preventDefault();
          this.nudge(ev.shiftKey ? 5 : 1);
        } else if (ev.code === "ArrowDown") {
          ev.preventDefault();
          this.nudge(ev.shiftKey ? -5 : -1);
        } else if (ev.key.toLowerCase() === "t") {
          this.handleTap();
        }
      });

      // Resume audio context if the page was backgrounded/suspended by the OS.
      document.addEventListener("visibilitychange", () => {
        if (document.hidden) this.handlePlaybackInterruption();
      });
      window.addEventListener("pagehide", () => this.handlePlaybackInterruption());
    }

    /* -------------------- UI application -------------------- */
    applyStateToUI() {
      const s = this.state;
      this.el.beatsPerBar.value = String(s.beatsPerBar);
      this.el.timerEnabled.checked = s.timerEnabled;
      this.el.timerFields.hidden = !s.timerEnabled;
      this.el.timerMinutes.value = s.timerMinutes;
      this.el.clickTone.value = s.clickTone;
      this.el.subdivisions.value = String(s.subdivisions);
      this.el.accentPattern.value = s.accentPattern;
      this.el.volume.value = String(s.volume);
      this.el.volumeValue.value = `${Math.round(s.volume * 100)}%`;
      this.engine.setClickTone(s.clickTone);
      this.engine.setVolume(s.volume);
      this.el.countdownEnabled.checked = s.countdownEnabled;
      this.el.countdownFields.hidden = !s.countdownEnabled;
      this.el.countdownBeats.value = String(s.countdownBeats);
      this.el.wakeLockEnabled.checked = s.wakeLockEnabled;
      this.el.wakeLockEnabled.disabled = this.running || !("wakeLock" in navigator);
      if (!("wakeLock" in navigator)) this.setWakeLockStatus("screenLockUnsupported");
      this.el.loopStart.value = s.loopStart;
      this.el.loopTarget.value = s.loopTarget;
      this.el.loopMinutes.value = s.loopMinutes;
      this.el.loopBars.value = s.loopBars;
      this.updateLoopPhraseText();

      this.scheduler.setBpm(s.bpm);
      this.scheduler.setBeatsPerBar(s.beatsPerBar);
      this.scheduler.setSubdivisions(s.subdivisions);
      this.scheduler.setAccentPattern(s.accentPattern);
      this.renderBpm();
      this.setMode(s.mode, { persistChange: false });
    }

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
    }

    applyLanguage(language) {
      this.state.language = window.MetronomeI18n.setLanguage(language);
      this.el.languageSelect.value = this.state.language;
      this.el.playLabel.textContent = t(this.running ? "stop" : "start");
      this.setStatus(this.statusMessageKey, this.statusMessageParams);
      this.setWakeLockStatus(this.wakeLockMessageKey);
      this.updateTempoControlAvailability();
      this.updateLoopPhraseText();
      this.renderBpm();
      this.renderHistory();
      if (this.el.readout.classList.contains("alert")) {
        this.el.readout.textContent = t("practiceComplete");
      }
    }

    bindColorScheme() {
      const query = window.matchMedia?.("(prefers-color-scheme: light)");
      if (!query) return;
      const update = () => {
        if (this.state.theme === "system") this.applyTheme("system");
      };
      if (query.addEventListener) query.addEventListener("change", update);
      else query.addListener(update);
    }

    renderBpm() {
      const bpm = this.state.bpm;
      this.el.bpmValue.textContent = String(bpm);
      this.el.slider.value = String(bpm);
      const fill = ((bpm - CONFIG.MIN_BPM) / (CONFIG.MAX_BPM - CONFIG.MIN_BPM)) * 100;
      this.el.slider.style.setProperty("--fill", `${fill}%`);
      this.el.slider.setAttribute("aria-valuetext", t("bpmAccessible", { bpm }));
    }

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
      ].forEach((control) => { control.disabled = this.running; });
      this.el.wakeLockEnabled.disabled = this.running || !("wakeLock" in navigator);
      this.el.tabs.forEach((tab) => {
        tab.disabled = this.running;
        tab.title = this.running ? t("stopPlaybackToChangeMode") : "";
      });
      this.el.settingsHint.hidden = !this.running;
    }

    updateBeatCounter() {
      this.el.meterLabel.textContent = `${this.state.beatsPerBar}/4`;
    }

    setMode(mode, { persistChange = true } = {}) {
      if (!Object.values(MODES).includes(mode)) return;
      this.state.mode = mode;
      this.el.tabs.forEach((t) => {
        const active = t.dataset.mode === mode;
        t.classList.toggle("active", active);
        t.setAttribute("aria-selected", String(active));
        t.tabIndex = active ? 0 : -1;
      });
      this.el.speedloopFields.hidden = mode !== MODES.SPEEDLOOP;
      this.el.metronomePanel.hidden = mode !== MODES.METRONOME;
      this.updateTempoControlAvailability();
      if (persistChange) this.persist();
    }

    /* -------------------- Tempo -------------------- */
    setBpm(bpm, { fromTap = false } = {}) {
      if (this.running && this.state.mode === MODES.SPEEDLOOP) return;
      const value = clamp(Math.round(bpm), CONFIG.MIN_BPM, CONFIG.MAX_BPM);
      this.state.bpm = value;
      this.scheduler.setBpm(value); // takes effect on next scheduled beat
      this.renderBpm();
      this.persist();
      if (fromTap) this.flashTap();
    }

    nudge(delta) {
      if (this.state.mode === MODES.SPEEDLOOP && this.running) return; // ramp owns tempo
      this.setBpm(this.state.bpm + delta);
      this.pulsePlay();
    }

    handleTap() {
      if (this.running && this.state.mode === MODES.SPEEDLOOP) return;
      const bpm = this.tap.tap(performance.now());
      if (bpm !== null) this.flashTap();
      this.setStatus(bpm !== null ? "tapResult" : "keepTapping", bpm === null ? {} : { bpm });
    }

    flashTap() {
      this.el.tapBtn.classList.add("flash");
      setTimeout(() => this.el.tapBtn.classList.remove("flash"), 90);
    }

    pulsePlay() {
      const btn = this.el.playBtn;
      btn.classList.remove("pulse");
      void btn.offsetWidth; // restart animation
      btn.classList.add("pulse");
    }

    /* -------------------- Transport -------------------- */
    async toggle() {
      if (this.running) {
        this.stop();
      } else {
        await this.start();
      }
    }

    async start() {
      try {
        await this.engine.resume(); // satisfies autoplay policy on user gesture
      } catch (err) {
        console.warn("Audio could not start.", err);
        this.setStatus(err instanceof Error && err.message.includes("not supported")
          ? "audioUnsupported"
          : "audioStartFailed");
        return;
      }

      this.running = true;
      this.updateTempoControlAvailability();
      if (this.state.wakeLockEnabled) this.acquireWakeLock();
      this.alertShown = false;
      this.el.playBtn.setAttribute("aria-pressed", "true");
      this.el.playBtn.classList.add("running");
      this.tap.reset();

      const now = this.engine.now;
      const leadIn = 0.08;
      const useCountIn = this.state.countdownEnabled;

      this.scheduler.setBeatsPerBar(this.state.beatsPerBar);
      this.scheduler.setSubdivisions(this.state.subdivisions);
      this.scheduler.setAccentPattern(this.state.accentPattern);
      this.state.bpm = initialBpm(this.state.mode, this.state.bpm, this.state.loopStart);
      this.scheduler.setBpm(this.state.bpm);
      this.renderBpm();

      if (useCountIn) {
        this.phase = "countin";
        const beats = this.state.countdownBeats;
        const spb = 60 / this.currentBpm();
        this.countInEndTime = now + leadIn + beats * spb;
        this.setStatus("countInStatus");
        this.el.playLabel.textContent = t("stop");
        this.scheduler.start(now + leadIn);
        this.scheduleCountInTicks(now + leadIn, beats, spb);
      } else {
        this.beginMainSession(now + leadIn);
      }

      this.startFrameLoop();
    }

    /** Beat-by-beat count-in readout (no-op audio beyond the metronome clicks). */
    scheduleCountInTicks(startTime, beats, spb) {
      this.countInRemaining = beats;
      const update = () => {
        if (!this.running || this.phase !== "countin") return;
        const remaining = Math.ceil((this.countInEndTime - this.engine.now) / spb);
        if (remaining <= 0) {
          this.beginMainSession(this.countInEndTime);
          return;
        }
        this.setStatus("countInRemaining", { count: remaining });
        setTimeout(update, 40);
      };
      update();
    }

    beginMainSession(atTime) {
      this.phase = "playing";
      this.sessionStartTime = atTime;
      this.sessionStartedBpm = this.state.bpm;
      this.sessionLogged = false;
      this.setStatus("");
      this.el.playLabel.textContent = t("stop");

      const mode = this.state.mode;
      if (mode === MODES.SPEEDLOOP) {
        this.speedLoopCadence.reset(this.state.loopBars);
        this.speedLoopBar = 0;
        this.el.phraseLabel.hidden = false;
        this.el.phraseLabel.textContent = t("bar", { current: 1, total: this.state.loopBars });
        this.ramp.configure({
          start: this.state.loopStart,
          target: this.state.loopTarget,
          minutes: this.state.loopMinutes,
        });
        this.ramp.begin(atTime);
        this.updateLoopPhraseText();
        this.state.bpm = this.ramp.start;
        this.scheduler.setBpm(this.ramp.start);
        this.renderBpm();
        this.el.loopProgress.hidden = false;
        const pendingBeats = this.pendingSpeedLoopBeats;
        this.pendingSpeedLoopBeats = [];
        pendingBeats.forEach(({ time, beatsPerBar }) => this.advanceSpeedLoop(time, beatsPerBar));
      } else {
        this.pendingSpeedLoopBeats = [];
        this.el.phraseLabel.hidden = true;
        this.el.loopProgress.hidden = true;
      }

      this.timerEndTime = practiceTimerEnd(atTime, this.state.timerEnabled, this.state.timerMinutes);

      if (!this.scheduler.running) {
        this.scheduler.start(atTime);
      }
    }

    currentBpm() {
      return initialBpm(this.state.mode, this.state.bpm, this.state.loopStart);
    }

    handleScheduledBeat(time, beatsPerBar) {
      if (this.state.mode !== MODES.SPEEDLOOP) return;

      if (this.phase === "countin" && time >= this.countInEndTime) {
        this.pendingSpeedLoopBeats.push({ time, beatsPerBar });
        return;
      }
      if (this.phase !== "playing" || time < this.sessionStartTime) return;

      this.advanceSpeedLoop(time, beatsPerBar);
    }

    advanceSpeedLoop(time, beatsPerBar) {
      if (!this.speedLoopCadence.advance(beatsPerBar)) return;

      const { bpm } = this.ramp.sample(time);
      if (bpm !== this.state.bpm) {
        this.state.bpm = bpm;
        this.scheduler.setBpm(bpm);
        this.renderBpm();
      }
    }

    updatePhraseIndicator(beatIndex, time) {
      if (
        this.phase !== "playing" ||
        this.state.mode !== MODES.SPEEDLOOP ||
        time < this.sessionStartTime ||
        beatIndex !== 0
      ) return;
      this.speedLoopBar = this.speedLoopCadence.bar;
      this.el.phraseLabel.textContent = t("bar", { current: this.speedLoopBar, total: this.state.loopBars });
    }

    nextSpeedLoopBpm(now) {
      if (this.speedLoopCadence.beatCount < 1) return this.ramp.sample(now).bpm;
      const phraseBeats = this.state.beatsPerBar * this.state.loopBars;
      const beatsUntilBoundary = phraseBeats - ((this.speedLoopCadence.beatCount - 1) % phraseBeats);
      const boundaryTime = this.scheduler.nextNoteTime +
        (beatsUntilBoundary - 1) * (60 / Math.max(CONFIG.MIN_BPM, this.state.bpm));
      return this.ramp.sample(Math.max(now, boundaryTime)).bpm;
    }

    stop({ preserveReadout = false } = {}) {
      this.recordSession(false);
      this.running = false;
      this.updateTempoControlAvailability();
      this.releaseWakeLock();
      this.phase = "idle";
      this.pendingSpeedLoopBeats = [];
      this.el.phraseLabel.hidden = true;
      this.scheduler.stop();
      this.visualizer.clear();
      this.el.playBtn.classList.remove("running");
      this.el.playBtn.setAttribute("aria-pressed", "false");
      this.el.playLabel.textContent = t("start");
      this.el.loopProgress.hidden = true;
      this.el.progressFill.style.width = "0%";
      this.el.progressTrack.setAttribute("aria-valuenow", "0");
      this.el.progressText.textContent = "0%";
      if (!preserveReadout) {
        this.el.readout.classList.remove("alert");
        this.el.readout.textContent = "";
      }
      this.setStatus("");
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.timerEndTime = null;
      this.countInEndTime = null;
      this.persist();
    }

    handlePlaybackInterruption() {
      if (!this.running) return;
      this.recordSession(true);
      this.running = false;
      this.phase = "idle";
      this.scheduler.stop();
      this.visualizer.clear();
      this.pendingSpeedLoopBeats = [];
      this.releaseWakeLock();
      if (this.rafId) cancelAnimationFrame(this.rafId);
      this.rafId = null;
      this.el.playBtn.classList.remove("running");
      this.el.playBtn.setAttribute("aria-pressed", "false");
      this.el.playLabel.textContent = t("start");
      this.el.phraseLabel.hidden = true;
      this.el.loopProgress.hidden = true;
      this.countInEndTime = null;
      this.timerEndTime = null;
      this.updateTempoControlAvailability();
      this.setStatus("sessionInterrupted");
      this.persist();
      if (this.engine.ctx?.state === "running") {
        this.engine.ctx.suspend().catch((error) => {
          console.warn("Audio could not suspend after the app was hidden.", error);
        });
      }
    }

    recordSession(interrupted) {
      if (this.phase !== "playing" || this.sessionLogged) return;
      const endedAt = this.engine.now;
      const sessions = window.MetronomeStorage.saveSession({
        startedAt: Date.now() - Math.max(0, endedAt - this.sessionStartTime) * 1000,
        durationSec: Math.max(0, endedAt - this.sessionStartTime),
        mode: this.state.mode,
        startBpm: this.sessionStartedBpm,
        endBpm: this.state.bpm,
        interrupted,
      });
      this.sessionLogged = true;
      this.renderHistory(sessions);
    }

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
        const mode = t(session.mode === MODES.SPEEDLOOP ? "speedLoop" : "metronome");
        title.textContent = t("historyEntry", { mode, start: session.startBpm, end: session.endBpm });
        details.textContent = `${date.toLocaleString(this.state.language)} · ${duration}${session.interrupted ? ` · ${t("interrupted")}` : ""}`;
        item.append(title, details);
        this.el.historyList.appendChild(item);
      });
    }

    /* -------------------- Frame loop (UI sync only) -------------------- */
    startFrameLoop() {
      if (this.rafId) return;
      const frame = () => {
        if (!this.running) {
          this.rafId = null;
          return;
        }
        this.updateFrame();
        this.rafId = requestAnimationFrame(frame);
      };
      this.rafId = requestAnimationFrame(frame);
    }

    updateFrame() {
      const now = this.engine.now;

      // Speed loop: drive tempo from the audio clock.
      if (this.phase === "playing" && this.state.mode === MODES.SPEEDLOOP) {
        const { progress, rampDone } = this.ramp.sample(now);
        const pct = Math.round(progress * 100);
        this.el.progressFill.style.width = `${pct}%`;
        this.el.progressTrack.setAttribute("aria-valuenow", String(pct));
        this.el.progressText.textContent = rampDone
          ? this.state.bpm === this.ramp.target
            ? t("rampTargetReached", { bpm: this.state.bpm })
            : t("rampNextPhrase", { bpm: this.state.bpm, next: this.nextSpeedLoopBpm(now) })
          : t("rampProgressText", {
            bpm: this.state.bpm,
            next: this.nextSpeedLoopBpm(now),
            percent: pct,
            time: formatTime(this.ramp.durationSec - (now - this.ramp.startedAt)),
          });
        // Ramp finishes and holds at target indefinitely; no stop.
      }

      // Practice timer.
      if (this.phase === "playing" && this.timerEndTime !== null) {
        const remaining = this.timerEndTime - now;
        this.el.readout.textContent = t("timeLeft", { time: formatTime(remaining) });
        if (remaining <= 0 && !this.alertShown) {
          this.alertShown = true;
          this.fireTimerAlert(now);
          this.stop({ preserveReadout: true });
        }
      } else if (this.phase === "playing" && this.state.mode === MODES.SPEEDLOOP) {
        // Show elapsed time in speed loop mode.
        const elapsed = now - this.sessionStartTime;
        this.el.readout.textContent = t("elapsed", { time: formatTime(elapsed) });
      } else {
        this.el.readout.textContent = "";
      }
    }

    fireTimerAlert(now) {
      // Audio alert: three tones scheduled on the audio clock.
      this.engine.scheduleAlert(now + 0.0, 880, 0.3);
      this.engine.scheduleAlert(now + 0.4, 880, 0.3);
      this.engine.scheduleAlert(now + 0.8, 1100, 0.5);
      this.el.readout.textContent = t("practiceComplete");
      this.el.readout.classList.add("alert");
      this.setStatus("");
      if (navigator.vibrate) navigator.vibrate([200, 100, 200]);
    }

    async acquireWakeLock() {
      if (!this.state.wakeLockEnabled || !this.running || !("wakeLock" in navigator) || this.wakeLock || this.wakeLockPending) return;
      this.wakeLockPending = true;
      try {
        this.wakeLock = await navigator.wakeLock.request("screen");
        this.wakeLockPending = false;
        if (!this.running || !this.state.wakeLockEnabled) {
          this.releaseWakeLock();
          return;
        }
        this.wakeLock.addEventListener("release", () => {
          this.wakeLock = null;
          if (this.running && this.state.wakeLockEnabled && !document.hidden) {
            this.setWakeLockStatus("screenMayDim");
          }
        }, { once: true });
        this.setWakeLockStatus("screenWillStayAwake");
      } catch (error) {
        this.wakeLockPending = false;
        console.warn("Screen wake lock could not be acquired.", error);
        this.setWakeLockStatus("screenLockFailed");
      }
    }

    releaseWakeLock() {
      if (!this.wakeLock) return;
      const wakeLock = this.wakeLock;
      this.wakeLock = null;
      wakeLock.release().catch((error) => console.warn("Screen wake lock could not be released.", error));
      this.setWakeLockStatus("");
    }

    setWakeLockStatus(key) {
      this.wakeLockMessageKey = key;
      this.el.wakeLockStatus.textContent = key ? t(key) : "";
    }

    setStatus(key, params = {}) {
      this.statusMessageKey = key;
      this.statusMessageParams = params;
      this.el.statusLine.textContent = key ? t(key, params) : "";
    }

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
    }
  }

  /* ============================================================
   * Boot
   * ============================================================ */
  const boot = () => {
    try {
      window.metronome = new MetronomeApp();
    } catch (err) {
      console.error(err);
      const line = document.getElementById("statusLine");
      if (line) line.textContent = window.MetronomeI18n.translate("appInitFailed");
    }
  };

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})();

;
if (
  "serviceWorker" in navigator &&
  (location.protocol === "https:" || location.hostname === "localhost" || location.hostname === "127.0.0.1")
) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("./service-worker.js")
      .catch((error) => console.warn("Offline support could not start.", error));
  });
}
