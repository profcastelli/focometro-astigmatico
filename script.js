/*
 * Focometro Torico v1.0
 * (c) 2026 Francesco Castelli
 * Progetto didattico derivato dal focometro sferico definitivo.
 */

const STEP_H = 12;
const MAX_P = 25;

let score = 0;
let totalLenses = 0;
let currentLensIndex = 1;
let maxErrorsAllowed = 0;
let errorsMadeThisLens = 0;
let shouldClear = false;

let lens = null;
let currentAxis = 0;
let activeFieldId = "rx-sphere";

const INPUT_FIELDS = [
  "l1-power",
  "l1-axis",
  "l2-power",
  "l2-axis",
  "rx-sphere",
  "rx-cylinder",
  "rx-axis",
  "tr-sphere",
  "tr-cylinder",
  "tr-axis",
];

/* ---------------------------------------------------------
   UTILITÀ
--------------------------------------------------------- */

function normalizeAxis(axis) {
  let a = Math.round(axis) % 180;
  if (a < 0) a += 180;
  return a;
}

function snapAxis5(axis) {
  return normalizeAxis(Math.round(axis / 5) * 5);
}

// La ghiera grafica NON usa la normalizzazione ottica 0=180.
// Deve avere due estremi reali: 0° a destra e 180° a sinistra.
function clampDialAxis(axis) {
  const snapped = Math.round(axis / 5) * 5;
  return Math.max(0, Math.min(180, snapped));
}

function displayAxis(axis) {
  const a = normalizeAxis(axis);
  return a === 0 ? 180 : a;
}

function axisDistance(a, b) {
  const aa = normalizeAxis(a);
  const bb = normalizeAxis(b);
  const d = Math.abs(aa - bb);
  return Math.min(d, 180 - d);
}

function roundQuarter(v) {
  return Math.round(v * 4) / 4;
}

function parseField(id) {
  const raw = document.getElementById(id).value.replace(",", ".").trim();
  if (raw === "") return NaN;
  return parseFloat(raw);
}

function formatSigned(v) {
  if (Math.abs(v) < 0.0001) return "0.00";
  return (v > 0 ? "+" : "") + v.toFixed(2);
}

/* ---------------------------------------------------------
   AVVIO / STATO
--------------------------------------------------------- */

function startGame() {
  totalLenses =
    parseInt(document.getElementById("total-lenses-input").value) || 10;

  maxErrorsAllowed =
    parseInt(document.getElementById("max-errors-input").value) || 3;

  score = 0;
  currentLensIndex = 1;

  document.getElementById("total-lenses-display").innerText = totalLenses;
  document.getElementById("setup-panel").classList.add("hidden");
  document.getElementById("game-screen").classList.remove("hidden");

  createScale();
  createAxisScale();
  nextLens();
}

/* ---------------------------------------------------------
   GENERAZIONE LENTE TORICA

   Convenzione di lavoro:
   - la lente viene generata in cilindro negativo;
   - esempio: +2.00 -1.50 ax 40
   - lettura 1: +2.00 con mire nitide orientate a 130°
   - lettura 2: +0.50 con mire nitide orientate a 40°
   - trasposta: +0.50 +1.50 ax 130
--------------------------------------------------------- */

function generateLens() {
  let sphere = (Math.floor(Math.random() * 49) - 24) * 0.25; // -6.00 / +6.00
  let cylAbs = (Math.floor(Math.random() * 12) + 1) * 0.25;   // 0.25 / 3.00
  let cylinder = -cylAbs;

  // Evitiamo letture oltre ±12 D per mantenere esercizi didatticamente gestibili.
  let secondPower = sphere + cylinder;
  if (secondPower < -12) {
    sphere += (-12 - secondPower);
    sphere = roundQuarter(sphere);
  }

  let axis = Math.floor(Math.random() * 36) * 5; // 0..175
  axis = normalizeAxis(axis);

  const L1 = roundQuarter(sphere);
  const L2 = roundQuarter(sphere + cylinder);

  const transpose = {
    sphere: L2,
    cylinder: roundQuarter(-cylinder),
    axis: normalizeAxis(axis + 90),
  };

  lens = {
    sphere: roundQuarter(sphere),
    cylinder: roundQuarter(cylinder),
    axis,
    L1,
    L2,
    sharpAxisL1: normalizeAxis(axis + 90),
    sharpAxisL2: axis,
    transpose,
  };
}

/* ---------------------------------------------------------
   SCALA POTERE
--------------------------------------------------------- */

function createScale() {
  const drum = document.getElementById("drum");
  drum.innerHTML = "";

  for (let i = MAX_P; i >= -MAX_P; i -= 0.125) {
    const val = Math.round(i * 1000) / 1000;
    const row = document.createElement("div");
    row.className = "tick-row";

    const left = document.createElement("div");
    left.className = "t-left";

    const line = document.createElement("div");

    const isInt = Number.isInteger(val);
    const isHalf = Math.abs(val) % 0.5 === 0;
    const isQuarter = Math.abs(val) % 0.25 === 0;

    let width = "12px";
    let height = "1px";
    let opacity = "0.6";

    if (isInt) {
      width = "45px";
      height = "3px";
      opacity = "1";
    } else if (isHalf) {
      width = "30px";
      height = "2px";
      opacity = "0.9";
    } else if (isQuarter) {
      width = "20px";
      height = "1.5px";
      opacity = "0.8";
    }

    line.style.cssText = `
      position:absolute;
      right:0;
      background:black;
      top:50%;
      transform:translateY(-50%);
      width:${width};
      height:${height};
      opacity:${opacity};
    `;

    left.appendChild(line);

    const right = document.createElement("div");
    right.className = "t-right";

    if (isInt) {
      right.innerText = (val > 0 ? "+" : "") + val.toFixed(0);
      right.style.fontSize = "20px";
      right.style.fontWeight = "900";
    }

    row.append(left, right);
    drum.appendChild(row);
  }
}

function adjustPower(delta) {
  if (!document.getElementById("btn-next").classList.contains("hidden")) return;

  const slider = document.getElementById("power-slider");
  slider.value = Math.max(
    -MAX_P,
    Math.min(MAX_P, parseFloat(slider.value) + delta)
  );

  updateUI();
}

/* ---------------------------------------------------------
   GHIERA ASSE
--------------------------------------------------------- */

function createAxisScale() {
  const svg = document.getElementById("axis-svg");
  svg.innerHTML = "";

  // ViewBox 440x440: centro 220.
  // L'oculare resta al centro; la scala numerica ha ora uno spazio esterno dedicato.
  const cx = 220;
  const cy = 220;

  for (let deg = 0; deg <= 180; deg += 5) {
    const major = deg % 30 === 0;
    const rad = -deg * Math.PI / 180;

    // Tacche: corona vicina al bordo dell'oculare.
    const r1 = major ? 188 : 195;
    const r2 = 204;

    const x1 = cx + Math.cos(rad) * r1;
    const y1 = cy + Math.sin(rad) * r1;
    const x2 = cx + Math.cos(rad) * r2;
    const y2 = cy + Math.sin(rad) * r2;

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", x1);
    line.setAttribute("y1", y1);
    line.setAttribute("x2", x2);
    line.setAttribute("y2", y2);
    line.setAttribute("class", "axis-tick" + (major ? " major" : ""));
    svg.appendChild(line);

    // Numeri SOLO ogni 30°, su una corona esterna distinta dalle tacche.
    if (major) {
      const labelRadius = 218;
      const tx = cx + Math.cos(rad) * labelRadius;
      const ty = cy + Math.sin(rad) * labelRadius;

      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", tx);
      text.setAttribute("y", ty);
      text.setAttribute("class", "axis-text");
      text.textContent = deg;
      svg.appendChild(text);
    }
  }

  // Indice rosso: parte da 0° a destra e ruota verso 180° passando dall'alto.
  const needle = document.createElementNS("http://www.w3.org/2000/svg", "line");
  needle.setAttribute("id", "axis-needle");
  needle.setAttribute("x1", cx + 204);
  needle.setAttribute("y1", cy);
  needle.setAttribute("x2", cx + 178);
  needle.setAttribute("y2", cy);
  needle.setAttribute("class", "axis-needle");
  svg.appendChild(needle);
}

function adjustAxis(delta) {
  if (!document.getElementById("btn-next").classList.contains("hidden")) return;

  currentAxis = clampDialAxis(currentAxis + delta);
  updateUI();
}

/* ---------------------------------------------------------
   COMPORTAMENTO MIRE

   Regola richiesta:
   Esempio +2.00 -1.50 ax 40
   L1 = +2.00 -> mire nitide a 130°
   L2 = +0.50 -> mire nitide a 40°

   Le due triplette sono sempre ortogonali.
   La ghiera ruota l'intero reticolo.
--------------------------------------------------------- */

function updateUI() {
  if (!lens) return;

  const val = parseFloat(document.getElementById("power-slider").value);

  // Potere
  const blurPowerL1 = Math.abs(val - lens.L1);
  const blurPowerL2 = Math.abs(val - lens.L2);

  // Asse: confronto dell'orientamento della tripletta A e B
  // con l'orientamento che deve risultare nitido.
  //
  // Mira A nasce orizzontale a 0° e viene ruotata di currentAxis.
  // Mira B nasce verticale e quindi è sempre A + 90°.
  const orientationA = normalizeAxis(currentAxis);
  const orientationB = normalizeAxis(currentAxis + 90);

  const axisErrA_L1 = axisDistance(orientationA, lens.sharpAxisL1);
  const axisErrB_L1 = axisDistance(orientationB, lens.sharpAxisL1);

  const axisErrA_L2 = axisDistance(orientationA, lens.sharpAxisL2);
  const axisErrB_L2 = axisDistance(orientationB, lens.sharpAxisL2);

  // Ogni tripletta viene associata al fuoco/orientamento che le è più vicino.
  // Il termine angolare è volutamente morbido, così la ricerca dell'asse
  // è progressiva e non "a scatto".
  const scoreA1 = blurPowerL1 * 5 + axisErrA_L1 / 8;
  const scoreA2 = blurPowerL2 * 5 + axisErrA_L2 / 8;
  const scoreB1 = blurPowerL1 * 5 + axisErrB_L1 / 8;
  const scoreB2 = blurPowerL2 * 5 + axisErrB_L2 / 8;

  const blurA = Math.min(Math.min(scoreA1, scoreA2), 25);
  const blurB = Math.min(Math.min(scoreB1, scoreB2), 25);

  document.getElementById("blur-a-node").setAttribute("stdDeviation", blurA * 0.16);
  document.getElementById("blur-b-node").setAttribute("stdDeviation", blurB * 0.16);

  const mireA = document.getElementById("mire-a");
  const mireB = document.getElementById("mire-b");

  // L'asse cresce in senso antiorario:
  // 0° = destra/orizzontale, 90° = verticale, 180° = sinistra.
  // In SVG gli angoli positivi ruotano visivamente in senso orario,
  // quindi usiamo il segno negativo.
  mireA.setAttribute("transform", `rotate(${-currentAxis} 50 50)`);
  mireB.setAttribute("transform", `rotate(${-currentAxis} 50 50)`);

  // Allineamento preciso della tacca del potere con la linea rossa.
  // Calcoliamo il centro reale della finestra, così bordi e box-sizing
  // non possono introdurre uno scostamento verticale.
  const readingWindow = document.querySelector(".reading-window");
  const rowIndex = (MAX_P - val) / 0.125;
  const windowCenter = readingWindow.clientHeight / 2;
  const selectedRowCenter = rowIndex * STEP_H + STEP_H / 2;
  const offset = windowCenter - selectedRowCenter;

  document.getElementById("drum").style.transform =
    `translateY(${offset}px)`;

  const needle = document.getElementById("axis-needle");
  if (needle) {
    needle.setAttribute("transform", `rotate(${-currentAxis} 220 220)`);
  }
}

/* ---------------------------------------------------------
   NUOVA LENTE
--------------------------------------------------------- */

function nextLens() {
  if (currentLensIndex > totalLenses) {
    alert("Sessione terminata!");
    location.reload();
    return;
  }

  generateLens();

  errorsMadeThisLens = 0;
  shouldClear = false;
  currentAxis = 0;

  document.getElementById("power-slider").value = 0;

  INPUT_FIELDS.forEach((id) => {
    document.getElementById(id).value = "";
  });

  document.getElementById("btn-verify").disabled = false;
  document.getElementById("btn-next").classList.add("hidden");
  document.getElementById("feedback").innerText = "";

  selectField("rx-sphere");
  updateStatus();
  updateUI();
}

/* ---------------------------------------------------------
   CAMPI RISPOSTA
--------------------------------------------------------- */

function selectField(id) {
  if (!INPUT_FIELDS.includes(id)) return;

  activeFieldId = id;

  document.querySelectorAll(".rx-field input").forEach((el) => {
    el.classList.remove("active-input");
  });

  document.getElementById(activeFieldId).classList.add("active-input");

  // La casella attiva è indicata direttamente dal bordo evidenziato.
}

function appendNum(c) {
  if (document.getElementById("btn-verify").disabled) return;

  const input = document.getElementById(activeFieldId);

  if (shouldClear) {
    input.value = "";
    shouldClear = false;
    document.getElementById("feedback").innerText = "";
  }

  // Normalizza la virgola al punto nel tastierino.
  if (c === ",") c = ".";

  // L'asse non deve accettare segno o decimali.
  if (activeFieldId.endsWith("axis") && (c === "-" || c === ".")) return;

  // Evita doppi segni meno e consente il segno solo all'inizio.
  if (c === "-") {
    if (input.value.includes("-") || input.value.length > 0) return;
    input.value = "-";
    return;
  }

  // Un solo separatore decimale.
  if (c === "." && (input.value.includes(".") || input.value.includes(","))) return;

  // Massimo 3 cifre complessive; segno e separatore non contano.
  const digitCount = (input.value.match(/\d/g) || []).length;
  if (/\d/.test(c) && digitCount >= 3) return;

  input.value += c;
}

function backspaceInput() {
  if (document.getElementById("btn-verify").disabled) return;

  const input = document.getElementById(activeFieldId);
  input.value = input.value.slice(0, -1);
}

/* ---------------------------------------------------------
   VERIFICA RICETTA + TRASPOSTA
--------------------------------------------------------- */

function checkAnswer() {
  const l1Power = parseField("l1-power");
  const l1Axis = parseField("l1-axis");
  const l2Power = parseField("l2-power");
  const l2Axis = parseField("l2-axis");

  const rxSphere = parseField("rx-sphere");
  const rxCylinder = parseField("rx-cylinder");
  const rxAxis = parseField("rx-axis");

  const trSphere = parseField("tr-sphere");
  const trCylinder = parseField("tr-cylinder");
  const trAxis = parseField("tr-axis");

  const fb = document.getElementById("feedback");
  const values = [
    l1Power, l1Axis, l2Power, l2Axis,
    rxSphere, rxCylinder, rxAxis,
    trSphere, trCylinder, trAxis
  ];

  if (values.some((v) => Number.isNaN(v))) {
    fb.className = "f-retry";
    fb.innerText = "COMPILA TUTTI I CAMPI";
    return;
  }

  const l1MatchesFirst =
    Math.abs(l1Power - lens.L1) < 0.01 &&
    Number.isInteger(l1Axis / 5) &&
    axisDistance(l1Axis, lens.sharpAxisL1) <= 0.5;

  const l1MatchesSecond =
    Math.abs(l1Power - lens.L2) < 0.01 &&
    Number.isInteger(l1Axis / 5) &&
    axisDistance(l1Axis, lens.sharpAxisL2) <= 0.5;

  const l2MatchesFirst =
    Math.abs(l2Power - lens.L1) < 0.01 &&
    Number.isInteger(l2Axis / 5) &&
    axisDistance(l2Axis, lens.sharpAxisL1) <= 0.5;

  const l2MatchesSecond =
    Math.abs(l2Power - lens.L2) < 0.01 &&
    Number.isInteger(l2Axis / 5) &&
    axisDistance(l2Axis, lens.sharpAxisL2) <= 0.5;

  // Le due letture possono essere inserite in qualunque ordine:
  // L1=prima/L2=seconda oppure L1=seconda/L2=prima.
  const readingsOk =
    (l1MatchesFirst && l2MatchesSecond) ||
    (l1MatchesSecond && l2MatchesFirst);

  // Le due forme equivalenti della stessa lente:
  // A = forma generata (attualmente cilindro negativo)
  // B = sua trasposta (cilindro positivo)
  const formA = {
    sphere: lens.sphere,
    cylinder: lens.cylinder,
    axis: lens.axis
  };

  const formB = {
    sphere: lens.transpose.sphere,
    cylinder: lens.transpose.cylinder,
    axis: lens.transpose.axis
  };

  function prescriptionMatches(sphere, cylinder, axis, form) {
    return (
      Math.abs(sphere - form.sphere) < 0.01 &&
      Math.abs(cylinder - form.cylinder) < 0.01 &&
      Number.isInteger(axis / 5) &&
      axisDistance(axis, form.axis) <= 0.5
    );
  }

  const rxIsA = prescriptionMatches(rxSphere, rxCylinder, rxAxis, formA);
  const rxIsB = prescriptionMatches(rxSphere, rxCylinder, rxAxis, formB);
  const trIsA = prescriptionMatches(trSphere, trCylinder, trAxis, formA);
  const trIsB = prescriptionMatches(trSphere, trCylinder, trAxis, formB);

  // Sono valide entrambe le direzioni:
  // RICETTA=A e TRASPOSTA=B
  // oppure RICETTA=B e TRASPOSTA=A
  const prescriptionPairOk =
    (rxIsA && trIsB) ||
    (rxIsB && trIsA);

  fb.className = "";

  if (readingsOk && prescriptionPairOk) {
    fb.innerText = "CORRETTO";
    fb.classList.add("f-success");
    score++;
    endTurn();
  } else {
    errorsMadeThisLens++;

    if (errorsMadeThisLens >= maxErrorsAllowed) {
      fb.innerText =
        "ERRORE — LETTURE: " +
        `L1 ${formatSigned(lens.L1)} D / asse nitido ${displayAxis(lens.sharpAxisL1)}°; ` +
        `L2 ${formatSigned(lens.L2)} D / asse nitido ${displayAxis(lens.sharpAxisL2)}°` +
        " | FORME EQUIVALENTI: " +
        `${formatSigned(formA.sphere)} ${formatSigned(formA.cylinder)} ax ${displayAxis(formA.axis)}°` +
        " ↔ " +
        `${formatSigned(formB.sphere)} ${formatSigned(formB.cylinder)} ax ${displayAxis(formB.axis)}°`;
      fb.classList.add("f-error");
      endTurn();
    } else {
      const wrong = [];
      if (!readingsOk) wrong.push("letture");
      if (!prescriptionPairOk) wrong.push("ricetta/trasposta");
      fb.innerText = "RIPROVA: " + wrong.join(", ");
      fb.classList.add("f-retry");
      shouldClear = false;
    }
  }

  updateStatus();
}

function endTurn() {
  document.getElementById("btn-verify").disabled = true;
  document.getElementById("btn-next").classList.remove("hidden");
  currentLensIndex++;
}

function updateStatus() {
  document.getElementById("current-lens-num").innerText = currentLensIndex;
  document.getElementById("score").innerText = score;
  document.getElementById("errors-left").innerText =
    maxErrorsAllowed - errorsMadeThisLens;
}

function backToMenu() {
  location.reload();
}

/* ---------------------------------------------------------
   CONTROLLI MOUSE
   - rotellina sul tamburo / pagina: potere
   - SHIFT + rotellina: asse
   - rotellina direttamente sulla ghiera: asse a scatti di 5°
--------------------------------------------------------- */

let wheelPowerAccumulator = 0;
let wheelAxisAccumulator = 0;

// Soglia più alta = rotellina meno sensibile.
// I passi restano 0.125 D per il potere e 5° per l'asse.
const WHEEL_THRESHOLD_POWER = 80;
const WHEEL_THRESHOLD_AXIS = 80;

window.addEventListener(
  "wheel",
  (e) => {
    const gameScreen = document.getElementById("game-screen");
    const nextBtn = document.getElementById("btn-next");

    if (
      gameScreen.classList.contains("hidden") ||
      !nextBtn.classList.contains("hidden")
    ) {
      return;
    }

    e.preventDefault();

    const ring = document.getElementById("axis-ring");
    const overAxis = ring && ring.contains(e.target);

    if (overAxis || e.shiftKey) {
      wheelAxisAccumulator += e.deltaY;

      if (Math.abs(wheelAxisAccumulator) >= WHEEL_THRESHOLD_AXIS) {
        adjustAxis(wheelAxisAccumulator > 0 ? -5 : 5);
        wheelAxisAccumulator = 0;
      }
    } else {
      wheelPowerAccumulator += e.deltaY;

      if (Math.abs(wheelPowerAccumulator) >= WHEEL_THRESHOLD_POWER) {
        adjustPower(wheelPowerAccumulator > 0 ? -0.125 : 0.125);
        wheelPowerAccumulator = 0;
      }
    }
  },
  { passive: false }
);

/* ---------------------------------------------------------
   TASTIERA FISICA
--------------------------------------------------------- */

window.addEventListener("keydown", (e) => {
  if (document.getElementById("game-screen").classList.contains("hidden")) return;

  if (e.key === "ArrowLeft") {
    e.preventDefault();
    adjustAxis(5);
    return;
  }

  if (e.key === "ArrowRight") {
    e.preventDefault();
    adjustAxis(-5);
    return;
  }

  if (e.key === "ArrowUp") {
    e.preventDefault();
    adjustPower(0.125);
    return;
  }

  if (e.key === "ArrowDown") {
    e.preventDefault();
    adjustPower(-0.125);
    return;
  }

  if (e.key === "Tab") {
    e.preventDefault();
    const idx = INPUT_FIELDS.indexOf(activeFieldId);
    selectField(INPUT_FIELDS[(idx + 1) % INPUT_FIELDS.length]);
    return;
  }

  if (
    (e.key >= "0" && e.key <= "9") ||
    e.key === "." ||
    e.key === "," ||
    e.key === "-"
  ) {
    const carattere = e.key === "," ? "." : e.key;
    appendNum(carattere);
    return;
  }

  if (e.key === "Backspace") {
    backspaceInput();
    return;
  }

  if (e.key === "Enter") {
    const nextBtn = document.getElementById("btn-next");

    if (nextBtn && !nextBtn.classList.contains("hidden")) {
      nextLens();
    } else {
      checkAnswer();
    }
  }
});

const PROJECT_ID = "FC-2026-FOCO-TORIC-001";
