import { useEffect, useRef, useState } from "react";

const STORAGE_KEY = "haus-labs-motion-desk";

const DEFAULTS = {
  speed: 1,
  reveal: 1,
  stagger: 1,
  ui: 1,
  parallax: 1,
};

function loadMotion() {
  let motion = DEFAULTS;
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "null");
    if (saved && typeof saved === "object") {
      motion = {
        speed: Number(saved.speed) || DEFAULTS.speed,
        reveal: Number(saved.reveal) || DEFAULTS.reveal,
        stagger: Number.isFinite(Number(saved.stagger)) ? Number(saved.stagger) : DEFAULTS.stagger,
        ui: Number(saved.ui) || DEFAULTS.ui,
        parallax: Number.isFinite(Number(saved.parallax)) ? Number(saved.parallax) : DEFAULTS.parallax,
      };
    }
  } catch {
    motion = DEFAULTS;
  }
  applyVars(motion);
  return motion;
}

function applyVars(motion) {
  const root = document.documentElement;
  root.style.setProperty("--speed", String(motion.speed));
  root.style.setProperty("--reveal", String(motion.reveal));
  root.style.setProperty("--stagger", String(motion.stagger));
  root.style.setProperty("--ui", String(motion.ui));
  root.style.setProperty("--parallax", String(motion.parallax));
}

function formatX(value) {
  return `${value.toFixed(2)}×`;
}

function Dial({ label, min, max, step, value, onChange, format = formatX }) {
  const valueRef = useRef(value);
  const drag = useRef(null);
  const span = max - min;
  const t = span === 0 ? 0 : (value - min) / span;
  const angle = -135 + t * 270;
  valueRef.current = value;

  useEffect(() => {
    const onMove = (event) => {
      if (!drag.current) return;
      event.preventDefault();
      const point = event.touches ? event.touches[0] : event;
      const dy = drag.current.startY - point.clientY;
      const raw = drag.current.startValue + (dy / 140) * span;
      const stepped = Math.round(raw / step) * step;
      onChange(Math.min(max, Math.max(min, Number(stepped.toFixed(2)))));
    };
    const onUp = () => {
      drag.current = null;
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
    return () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    };
  }, [max, min, onChange, span, step]);

  return (
    <label className="dial">
      <button
        type="button"
        className="dial-knob"
        aria-label={label}
        onPointerDown={(event) => {
          drag.current = { startY: event.clientY, startValue: valueRef.current };
          event.currentTarget.setPointerCapture(event.pointerId);
        }}
      >
        <span className="dial-ticks" aria-hidden="true" />
        <span className="dial-face">
          <span className="dial-needle" style={{ transform: `rotate(${angle}deg)` }} />
        </span>
      </button>
      <span className="dial-value">{format(value)}</span>
      <span className="dial-label">{label}</span>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(event) => onChange(Number(event.target.value))}
      />
    </label>
  );
}

export default function DevStage({ children }) {
  const [motion, setMotion] = useState(loadMotion);
  const [open, setOpen] = useState(true);

  useEffect(() => {
    applyVars(motion);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(motion));
  }, [motion]);

  const set = (key) => (value) => setMotion((prev) => ({ ...prev, [key]: value }));

  const replay = () => {
    const screen = document.querySelector(".phone-screen") || window;
    if (screen.scrollTo) screen.scrollTo({ top: 0, behavior: "auto" });
    else window.scrollTo(0, 0);

    const nodes = document.querySelectorAll(".reveal");
    nodes.forEach((node) => node.classList.remove("is-in"));

    requestAnimationFrame(() => {
      const root = document.querySelector(".phone-screen");
      const rootBox = root
        ? root.getBoundingClientRect()
        : { top: 0, bottom: window.innerHeight };
      nodes.forEach((node) => {
        const box = node.getBoundingClientRect();
        if (box.bottom > rootBox.top && box.top < rootBox.bottom) {
          node.classList.add("is-in");
        }
      });
    });
  };

  return (
    <div className="studio">
      <div className="phone-screen">{children}</div>

      <aside className={`dev-panel${open ? " is-open" : ""}`}>
        <div className="dev-panel-head">
          <div>
            <p className="dev-kicker">Development</p>
            <h2>Motion desk</h2>
          </div>
          <button type="button" className="dev-toggle" onClick={() => setOpen((v) => !v)}>
            {open ? "Hide" : "Dials"}
          </button>
        </div>

        {open ? (
          <>
            <p className="dev-note">1.00× is the designed timing. Higher values play faster.</p>
            <div className="dial-grid">
              <Dial label="Speed" min={0.25} max={4} step={0.05} value={motion.speed} onChange={set("speed")} />
              <Dial label="Reveal" min={0.25} max={4} step={0.05} value={motion.reveal} onChange={set("reveal")} />
              <Dial label="Stagger" min={0} max={3} step={0.05} value={motion.stagger} onChange={set("stagger")} />
              <Dial label="UI" min={0.25} max={4} step={0.05} value={motion.ui} onChange={set("ui")} />
              <Dial label="Parallax" min={0} max={2.5} step={0.05} value={motion.parallax} onChange={set("parallax")} />
            </div>
            <div className="dev-actions">
              <button type="button" className="dev-btn" onClick={replay}>
                Replay
              </button>
              <button type="button" className="dev-btn ghost" onClick={() => setMotion(DEFAULTS)}>
                Default
              </button>
            </div>
          </>
        ) : null}
      </aside>
    </div>
  );
}
