import { useEffect, useLayoutEffect, useRef, useState } from "react";

const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;

const CLOSED_BOX = asset("gift-who.png");

function openBox(path) {
  return asset(path === "find" ? "gift-match-know.png" : "gift-match-find.png");
}

function reducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

function localRect(el, root) {
  const a = el.getBoundingClientRect();
  const b = root.getBoundingClientRect();
  return {
    x: a.left - b.left,
    y: a.top - b.top,
    w: a.width,
    h: a.height,
  };
}

function motionMs(base) {
  const root = getComputedStyle(document.documentElement);
  const speed = Number.parseFloat(root.getPropertyValue("--speed")) || 1;
  const ui = Number.parseFloat(root.getPropertyValue("--ui")) || 1;
  return base / speed / ui;
}

const FAMILIES = [
  { id: "deep", name: "Deep", color: "#5e3316", gradient: "linear-gradient(90deg, #9c5a2e, #361f10)" },
  { id: "medium-deep", name: "Medium Deep", color: "#955b2d", gradient: "linear-gradient(90deg, #df904f, #794e2b)" },
  { id: "medium", name: "Medium", color: "#c1885e", gradient: "linear-gradient(90deg, #dca38a, #b77d64)" },
  { id: "light-medium", name: "Light Medium", color: "#c2a192", gradient: "linear-gradient(90deg, #e0a784, #dfba93)" },
  { id: "light", name: "Light", color: "#e8c9c3", gradient: "linear-gradient(90deg, #f2c8b6, #eab78c)" },
  { id: "fair", name: "Fair", color: "#f1cdbc", gradient: "linear-gradient(90deg, #f3eeea, #e5c5b6)" },
];

const LIGHT_SHADES = [
  { id: "100", hex: "#f2c8b6" },
  { id: "110", hex: "#f2c8b6" },
  { id: "120", hex: "#e7bca5" },
  { id: "130", hex: "#eab78c" },
  { id: "140", hex: "#f7c7ab" },
  { id: "150", hex: "#f7c7ab" },
  { id: "160", hex: "#f7c7ab" },
  { id: "170", hex: "#f7c7ab" },
];

function Icon({ src, alt = "", className }) {
  return (
    <span className={className}>
      <img src={src} alt={alt} />
    </span>
  );
}

function FlowHeader({ onHome, bagCount }) {
  return (
    <header className="topbar">
      <div className="announcement">
        <p>Shop our latest innovations</p>
      </div>
      <nav className="nav" aria-label="Primary">
        <div className="nav-left">
          <button type="button" aria-label="Open menu" onClick={onHome}>
            <Icon className="icon-menu" src={asset("icon-menu.svg")} />
          </button>
          <button type="button" aria-label="Search">
            <Icon className="icon-search" src={asset("icon-search.svg")} />
          </button>
        </div>
        <button className="logo" type="button" onClick={onHome} aria-label="Haus Labs by Lady Gaga">
          <span className="logo-name">HAUS LABS</span>
          <span className="logo-sub">BY LADY GAGA</span>
        </button>
        <button className="nav-right" type="button" aria-label={`Bag, ${bagCount} items`}>
          <Icon className="icon-bag" src={asset("icon-account.svg")} />
          <span className="bag-label">Bag</span>
          <span className="bag-count">{bagCount}</span>
        </button>
      </nav>
      <div className="progress" aria-hidden="true">
        <div className="progress-fill" />
      </div>
    </header>
  );
}

function DualAtb({ variant, onBack, onNext, nextDisabled, nextLabel, stepIndex, isGift }) {
  if (variant === "3") {
    if (isGift) {
      return (
        <footer className="gift-atb gift-atb-cart">
          <button className="gift-arrow" type="button" aria-label="Back" onClick={onBack}>
            <img src={asset("gift-arrow-left.svg")} alt="" width="55" height="55" />
          </button>
          <button className="gift-cart-pill" type="button" onClick={onNext}>
            Add to cart - $92
          </button>
        </footer>
      );
    }
    return (
      <footer className="gift-atb gift-atb-arrows">
        <button className="gift-arrow" type="button" aria-label="Back" onClick={onBack}>
          <img src={asset("gift-arrow-left.svg")} alt="" width="55" height="55" />
        </button>
        <p className="gift-step-count">{stepIndex} / 4</p>
        <button
          className={`gift-arrow${nextDisabled ? " is-off" : ""}`}
          type="button"
          aria-label="Next"
          disabled={nextDisabled}
          onClick={onNext}
        >
          <img src={asset("gift-arrow-right.svg")} alt="" width="55" height="55" />
        </button>
      </footer>
    );
  }
  if (variant === "2") {
    return (
      <footer className="gift-atb gift-atb-v2">
        <button className="gift-back-round" type="button" aria-label="Back" onClick={onBack}>
          <img src={asset("gift-back-round.svg")} alt="" width="55" height="55" />
        </button>
        <button
          className={`gift-continue${nextDisabled ? " is-off" : ""}`}
          type="button"
          disabled={nextDisabled}
          onClick={onNext}
        >
          {nextLabel}
        </button>
      </footer>
    );
  }
  return (
    <footer className="gift-atb">
      <button className="gift-back" type="button" onClick={onBack}>
        Back
      </button>
      <button className="gift-next" type="button" onClick={onNext}>
        Next
      </button>
    </footer>
  );
}

function ChoiceToggle({ options, value, onChange }) {
  return (
    <div className="gift-choice">
      {options.map((option) => (
        <button
          key={option.id}
          className={value === option.id ? "is-on" : ""}
          type="button"
          aria-pressed={value === option.id}
          onClick={() => onChange(option.id)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
}

function WhoStep({ onPick, heroRef, selected, onSelect, desktop, variant }) {
  if (desktop) {
    return (
      <div className="gift-step gift-step-desk">
        <h1 className="gift-title">Who is the gift for?</h1>
        <div className="gift-pills">
          <button
            className={`gift-pill${selected === "self" ? " is-on" : ""}`}
            type="button"
            onClick={() => onSelect("self")}
          >
            Get for myself
          </button>
          <button
            className={`gift-pill${selected === "loved" ? " is-on" : ""}`}
            type="button"
            onClick={() => onSelect("loved")}
          >
            Gift to Someone I Love
          </button>
        </div>
      </div>
    );
  }
  const isV3 = variant === "3";
  if (isV3) {
    return (
      <div className="gift-v3">
        <div className="gift-v3-stage">
          <div ref={heroRef} className="gift-hero">
            <img src={CLOSED_BOX} alt="Haus Labs gift packaging" width="300" height="368" />
          </div>
        </div>
        <div className="gift-v3-panel">
          <h1 className="gift-v3-title">Who is the gift for?</h1>
          <ChoiceToggle
            value={selected}
            onChange={onSelect}
            options={[
              { id: "self", label: "For Me" },
              { id: "loved", label: "Someone Else" },
            ]}
          />
        </div>
      </div>
    );
  }
  return (
    <div className="gift-step">
      <h1 className="gift-title">Who is the gift for?</h1>
      <img
        ref={heroRef}
        className="gift-hero"
        src={CLOSED_BOX}
        alt="Haus Labs gift packaging"
        width="314"
        height="372"
      />
      <div className="gift-pills">
        <button className="gift-pill" type="button" onClick={() => onPick("loved")}>
          Gift to Someone I Love
        </button>
        <button className="gift-pill" type="button" onClick={() => onPick("self")}>
          Get for myself
        </button>
      </div>
    </div>
  );
}

function MatchStep({ variant, path, onPath, heroRef, desktop }) {
  if (desktop) {
    const find = path !== "know";
    return (
      <div className="gift-step gift-step-desk">
        <h1 className="gift-title">Choose how they’ll get to their match</h1>
        <div className="gift-pills">
          <button
            className={`gift-pill${find ? " is-on" : ""}`}
            type="button"
            aria-pressed={find}
            onClick={() => onPath("find")}
          >
            With the discovery set
          </button>
          <button
            className={`gift-pill${path === "know" ? " is-on" : ""}`}
            type="button"
            aria-pressed={path === "know"}
            onClick={() => onPath("know")}
          >
            I know their shade
          </button>
        </div>
      </div>
    );
  }
  if (variant === "2") {
    return (
      <div className="gift-step gift-step-cards">
        <h1 className="gift-title left">Choose how they’ll get to their match</h1>
        <div className="gift-cards">
          <button
            className={`gift-card${path === "find" ? " is-on" : ""}`}
            type="button"
            aria-pressed={path === "find"}
            onClick={() => onPath("find")}
          >
            <img src={asset("gift-card-find.png")} alt="" width="172" height="188" />
            <span className="gift-card-copy">
              <strong>Discovery set</strong>
              <em>Try 5 minis to try at home, plus a gift card to redeem a full-size bottle of their favorite.</em>
            </span>
          </button>
          <button
            className={`gift-card${path === "know" ? " is-on" : ""}`}
            type="button"
            aria-pressed={path === "know"}
            onClick={() => onPath("know")}
          >
            <img src={asset("gift-card-know.png")} alt="" width="166" height="184" />
            <span className="gift-card-copy">
              <strong>I know the shade</strong>
              <em>Skip ahead and pick the bottle directly.</em>
            </span>
          </button>
        </div>
      </div>
    );
  }
  if (variant === "3") {
    const find = path === "find";
    return (
      <div className="gift-v3">
        <div className="gift-v3-stage">
          <div ref={heroRef} className="gift-hero gift-hero-swap">
            <img
              className={find ? "" : "is-on"}
              src={openBox("know")}
              alt="Mini foundation brush with foundation"
              width="300"
              height="368"
              aria-hidden={find}
            />
            <img
              className={find ? "is-on" : ""}
              src={openBox("find")}
              alt="Discovery set with five shades and a brush"
              width="300"
              height="368"
              aria-hidden={!find}
            />
          </div>
        </div>
        <div className="gift-v3-panel">
          <h1 className="gift-v3-title">Choose how they’ll get to their match</h1>
          <ChoiceToggle
            value={path}
            onChange={onPath}
            options={[
              { id: "know", label: "I’ll Pick" },
              { id: "find", label: "They’ll Pick" },
            ]}
          />
        </div>
      </div>
    );
  }
  const find = path === "find";
  return (
    <div className="gift-step gift-step-match">
      <h1 className="gift-title left">Choose how they’ll get to their match</h1>
      <div className="gift-toggle" role="tablist" aria-label="Gift type">
        <button
          className={`know${find ? "" : " is-on"}`}
          type="button"
          role="tab"
          aria-selected={!find}
          onClick={() => onPath("know")}
        >
          I know their shade
        </button>
        <button
          className={`find${find ? " is-on" : ""}`}
          type="button"
          role="tab"
          aria-selected={find}
          onClick={() => onPath("find")}
        >
          They’ll find it
        </button>
      </div>
      <div ref={heroRef} className="gift-hero gift-hero-swap">
        <img
          className={find ? "" : "is-on"}
          src={openBox("know")}
          alt="Mini foundation brush with foundation"
          width="314"
          height="372"
          aria-hidden={find}
        />
        <img
          className={find ? "is-on" : ""}
          src={openBox("find")}
          alt="Discovery set with five shades and a brush"
          width="314"
          height="372"
          aria-hidden={!find}
        />
      </div>
      <div className="gift-match-copy">
        <h2>{find ? "Discovery set" : "I know the shade"}</h2>
        <p>
          {find
            ? "Try 5 minis to try at home, plus a gift card to redeem a full-size bottle of their favorite."
            : "Skip ahead and pick the bottle directly."}
        </p>
      </div>
    </div>
  );
}

function FamilyStep({ family, onFamily, compact, variant }) {
  if (variant === "3" && !compact) {
    return (
      <div className="gift-v3">
        <div className="gift-v3-stage">
          <div className="gift-v3-faces">
            <img src={asset("gift-family-wide.png")} alt="" />
          </div>
          <p className="gift-v3-family-name">{family.name}</p>
        </div>
        <div className="gift-v3-panel">
          <h1 className="gift-v3-title">Which shade family is more like them?</h1>
          <div className="gift-choice-dots">
            {FAMILIES.map((item) => (
              <button
                key={item.id}
                className={`gift-choice-dot${item.id === family.id ? " is-on" : ""}`}
                type="button"
                style={{ background: item.color }}
                aria-label={item.name}
                aria-pressed={item.id === family.id}
                onClick={() => onFamily(item)}
              />
            ))}
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`gift-family${compact ? " is-compact" : ""}`}>
      <h1 className="gift-title">Which shade family is more like them?</h1>
      {compact ? null : (
        <img
          className="gift-family-photo"
          src={asset("gift-family.png")}
          alt={`${family.name} shade family`}
          width="340"
          height="189"
        />
      )}
      <p className="gift-family-name">{family.name}</p>
      <div className="gift-swatches">
        {FAMILIES.map((item) => (
          <button
            key={item.id}
            className={`gift-swatch${item.id === family.id ? " is-on" : ""}`}
            type="button"
            style={{ background: item.color }}
            aria-label={item.name}
            aria-pressed={item.id === family.id}
            onClick={() => onFamily(item)}
          />
        ))}
      </div>
    </div>
  );
}

function ShadeStep({ openId, shadeId, onOpen, onShade }) {
  return (
    <div className="gift-shade">
      <h1>What is their shade?</h1>
      <h2>Pick a shade</h2>
      {FAMILIES.map((family) => {
        const open = openId === family.id;
        return (
          <div className={`gift-acc${open ? " is-open" : ""}`} key={family.id}>
            <button className="gift-acc-head" type="button" onClick={() => onOpen(open ? "" : family.id)}>
              <span>{family.name}</span>
              <span className="gift-acc-meta">
                {open ? null : <span className="gift-grad" style={{ background: family.gradient }} />}
                <span className="gift-chevron">
                  <img src={asset("icon-chevron.svg")} alt="" width="12" height="12" />
                </span>
              </span>
            </button>
            {open ? (
              <div className="gift-dots">
                {LIGHT_SHADES.map((shade) => (
                  <button
                    key={shade.id}
                    className={`gift-dot${shadeId === shade.id ? " is-on" : ""}`}
                    type="button"
                    onClick={() => onShade(shade.id)}
                  >
                    <i style={{ background: shade.hex }} />
                    <em>{shade.id}</em>
                  </button>
                ))}
              </div>
            ) : null}
          </div>
        );
      })}
    </div>
  );
}

function MessageStep({ message, from, onMessage, onFrom, compact, variant, path }) {
  if (variant === "3" && !compact) {
    return (
      <div className="gift-v3">
        <div className="gift-v3-stage is-short">
          <img
            className="gift-v3-message-hero"
            src={openBox(path === "find" ? "find" : "know")}
            alt=""
            width="265"
            height="325"
          />
        </div>
        <div className="gift-v3-panel is-form">
          <h1 className="gift-v3-title">Finishing touches</h1>
          <div className="gift-fields">
            <label className="gift-field">
              <span>From:</span>
              <input value={from} onChange={(event) => onFrom(event.target.value)} placeholder="Your name" />
            </label>
            <label className="gift-field">
              <span>Add a gift message (optional):</span>
              <textarea
                value={message}
                onChange={(event) => onMessage(event.target.value)}
                placeholder="Write something heartfelt..."
              />
            </label>
          </div>
        </div>
      </div>
    );
  }
  return (
    <div className={`gift-message${compact ? " is-compact" : ""}`}>
      {compact ? null : (
        <img className="gift-message-bg" src={asset("gift-message-bg.png")} alt="" width="361" height="684" />
      )}
      <h1>Add a message</h1>
      <div className="gift-fields">
        <label className="gift-field">
          <span>Add a gift message (optional):</span>
          <textarea
            value={message}
            onChange={(event) => onMessage(event.target.value)}
            placeholder="Write something heartfelt..."
          />
        </label>
        <label className="gift-field">
          <span>From:</span>
          <input value={from} onChange={(event) => onFrom(event.target.value)} placeholder="Your name" />
        </label>
      </div>
    </div>
  );
}

function FinalStep({ variant }) {
  if (variant === "3") {
    return (
      <div className="gift-v3">
        <div className="gift-v3-stage">
          <img
            className="gift-v3-final-hero"
            src={asset("gift-final-ribbon.png")}
            alt="Haus Labs gift box with ribbon"
            width="365"
            height="392"
          />
        </div>
        <div className="gift-v3-panel">
          <h1 className="gift-v3-title">Final gift name</h1>
          <p className="gift-v3-copy">Includes a gift card to redeem a full-size bottle of their favorite.</p>
        </div>
      </div>
    );
  }
  return (
    <div className="gift-final">
      <h1>The Gift</h1>
      <p>Includes a gift card to redeem a full-size bottle of their favorite.</p>
      <img src={asset("gift-card.png")} alt="Haus Labs gift card" width="223" height="348" />
    </div>
  );
}

function DeskNav({ showBack, onBack, onNext, nextDisabled, nextLabel }) {
  return (
    <div className={`gift-desk-nav${showBack ? "" : " is-next-only"}`}>
      {showBack ? (
        <button className="gift-back" type="button" onClick={onBack}>
          Back
        </button>
      ) : null}
      <button className="gift-next" type="button" disabled={nextDisabled} onClick={onNext}>
        {nextLabel}
      </button>
    </div>
  );
}

function DeskVisual({ step, path, family }) {
  if (step === "who") {
    return <img className="gift-desk-box" src={asset("gift-card.png")} alt="Haus Labs gift packaging" />;
  }
  if (step === "match") {
    const find = path !== "know";
    return (
      <div className="gift-desk-match">
        <img src={openBox(find ? "find" : "know")} alt="" />
        <p>
          {find
            ? "Try 5 minis to try at home, plus a gift card to redeem a full-size bottle of their favorite."
            : "Skip ahead and pick the bottle directly."}
        </p>
      </div>
    );
  }
  if (step === "family") {
    return (
      <img className="gift-desk-family" src={asset("gift-family.png")} alt={`${family.name} shade family`} />
    );
  }
  if (step === "shade") {
    return <img className="gift-desk-box" src={openBox("know")} alt="Foundation and brush" />;
  }
  if (step === "message") {
    return <img className="gift-desk-smear" src={asset("gift-message-bg.png")} alt="" />;
  }
  return null;
}

export default function GiftFlow({ onExit, variant = "1", viewport = "mobile" }) {
  const desktop = viewport === "desktop";
  const [step, setStep] = useState("who");
  const [path, setPath] = useState(desktop ? "find" : variant === "2" ? "" : "know");
  const [whoFor, setWhoFor] = useState(variant === "3" ? "loved" : "");
  const [family, setFamily] = useState(FAMILIES[5]);
  const [openId, setOpenId] = useState("light");
  const [shadeId, setShadeId] = useState("130");
  const [message, setMessage] = useState("");
  const [from, setFrom] = useState("");
  const [morph, setMorph] = useState(null);
  const [pageAnim, setPageAnim] = useState(null);
  const [fromHome, setFromHome] = useState(() => !reducedMotion());
  const [fromHomePlay, setFromHomePlay] = useState(false);
  const [flowOut, setFlowOut] = useState(false);
  const flowRef = useRef(null);
  const heroRef = useRef(null);

  const progress = { who: 0.2, match: 0.4, family: 0.6, shade: 0.6, message: 0.8, gift: 1 }[step];
  const showAtb = !desktop && (variant === "3" || step !== "who");
  const v3Index = { who: 1, match: 2, family: 3, shade: 3, message: 4 }[step];

  useEffect(() => {
    document.querySelector(".gift-body")?.scrollTo(0, 0);
  }, [step]);

  useLayoutEffect(() => {
    if (!morph || morph.playing) return;

    if (!morph.to) {
      if (!heroRef.current || !flowRef.current) return;
      const to = localRect(heroRef.current, flowRef.current);
      setMorph((current) => (current && !current.to ? { ...current, to } : current));
      return;
    }

    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setMorph((current) => (current && !current.playing ? { ...current, playing: true } : current));
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [morph, step]);

  useEffect(() => {
    if (!morph?.playing) return;
    const showUi = setTimeout(() => {
      setMorph((current) => (current?.playing ? { ...current, uiIn: true } : current));
    }, motionMs(700));
    const finishBox = setTimeout(() => {
      setMorph((current) => (current?.playing ? { ...current, boxDone: true } : current));
    }, motionMs(900));
    return () => {
      clearTimeout(showUi);
      clearTimeout(finishBox);
    };
  }, [morph?.playing]);

  useEffect(() => {
    if (!morph?.uiIn) return;
    const timer = setTimeout(() => setMorph(null), motionMs(550) + 200);
    return () => clearTimeout(timer);
  }, [morph]);

  useEffect(() => {
    if (pageAnim?.phase !== "out") return;
    const timer = setTimeout(() => {
      setStep(pageAnim.next);
      setPageAnim({ phase: "in", dir: pageAnim.dir, next: pageAnim.next, play: false });
    }, motionMs(280));
    return () => clearTimeout(timer);
  }, [pageAnim]);

  useLayoutEffect(() => {
    if (pageAnim?.phase !== "in" || pageAnim.play) return;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setPageAnim((current) =>
          current?.phase === "in" && !current.play ? { ...current, play: true } : current
        );
      });
    });
    return () => cancelAnimationFrame(frame);
  }, [pageAnim, step]);

  useEffect(() => {
    if (!pageAnim?.play) return;
    const timer = setTimeout(() => setPageAnim(null), motionMs(400) + 40);
    return () => clearTimeout(timer);
  }, [pageAnim]);

  useLayoutEffect(() => {
    if (!fromHome || fromHomePlay) return;
    const frame = requestAnimationFrame(() => {
      requestAnimationFrame(() => setFromHomePlay(true));
    });
    return () => cancelAnimationFrame(frame);
  }, [fromHome, fromHomePlay]);

  useEffect(() => {
    if (!fromHomePlay) return;
    const timer = setTimeout(() => {
      setFromHome(false);
      setFromHomePlay(false);
    }, motionMs(500) + 80);
    return () => clearTimeout(timer);
  }, [fromHomePlay]);

  useEffect(() => {
    if (!flowOut) return;
    const timer = setTimeout(() => onExit(), motionMs(320));
    return () => clearTimeout(timer);
  }, [flowOut]);

  const requestExit = () => {
    if (flowOut) return;
    if (reducedMotion()) {
      onExit();
      return;
    }
    setFlowOut(true);
  };

  const startBoxMorph = (nextStep, dir) => {
    if (desktop) {
      goTo(nextStep, dir);
      return;
    }
    if (!reducedMotion() && heroRef.current && flowRef.current) {
      setMorph({
        from: localRect(heroRef.current, flowRef.current),
        to: null,
        playing: false,
        uiIn: false,
        boxDone: false,
        dir,
      });
    }
    setStep(nextStep);
  };

  const goTo = (next, dir) => {
    if (morph || pageAnim) return;
    if (reducedMotion()) {
      setStep(next);
      return;
    }
    setPageAnim({ phase: "out", dir, next });
  };

  const goNext = () => {
    if (morph || pageAnim || flowOut) return;
    if (step === "who") {
      if (!whoFor) return;
      if (!desktop && variant !== "2") startBoxMorph("match", "forward");
      else goTo("match", "forward");
    } else if (step === "match") {
      if (!path) return;
      goTo(path === "know" ? "shade" : "family", "forward");
    } else if (step === "family" || step === "shade") goTo("message", "forward");
    else if (step === "message") goTo("gift", "forward");
    else if (step === "gift") requestExit();
  };

  const goBack = () => {
    if (morph || pageAnim || flowOut) return;
    if (step === "match") {
      if (desktop || variant === "2") goTo("who", "back");
      else startBoxMorph("who", "back");
    } else if (step === "family" || step === "shade") goTo("match", "back");
    else if (step === "message") goTo(path === "know" ? "shade" : "family", "back");
    else if (step === "gift") goTo("message", "back");
    else requestExit();
  };

  const morphStyle =
    morph?.from &&
    (morph.playing && morph.to
      ? {
          left: morph.from.x,
          top: morph.from.y,
          width: morph.from.w,
          height: morph.from.h,
          transform: `translate(${morph.to.x - morph.from.x}px, ${morph.to.y - morph.from.y}px)`,
        }
      : {
          left: morph.from.x,
          top: morph.from.y,
          width: morph.from.w,
          height: morph.from.h,
          transform: "translate(0, 0)",
        });

  const flowClass = [
    "gift-flow",
    desktop ? "is-desktop" : "",
    variant === "2" ? "is-v2" : "",
    variant === "3" ? "is-v3" : "",
    showAtb ? "has-atb" : "",
    morph ? "is-morphing" : "",
    morph?.dir === "forward" ? "is-morphing-forward" : "",
    morph?.dir === "back" ? "is-morphing-back" : "",
    morph?.playing ? "is-morph-play" : "",
    morph?.uiIn ? "is-ui-in" : "",
    morph?.boxDone ? "is-box-done" : "",
    fromHome ? "is-from-home" : "",
    fromHomePlay ? "is-from-home-play" : "",
    flowOut ? "is-flow-out" : "",
    pageAnim ? "is-paging" : "",
    pageAnim?.phase === "out" ? "is-page-out" : "",
    pageAnim?.phase === "in" ? "is-page-in" : "",
    pageAnim?.play ? "is-page-play" : "",
    pageAnim?.dir === "forward" ? "is-page-forward" : "",
    pageAnim?.dir === "back" ? "is-page-back" : "",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div ref={flowRef} className={flowClass} style={{ "--progress": String(progress) }}>
      <FlowHeader onHome={requestExit} bagCount={0} />
      <div className="gift-body">
        {desktop ? (
          step === "gift" ? (
            <div className="gift-desk-final">
              <FinalStep />
              <DeskNav showBack onBack={goBack} onNext={goNext} nextLabel="Add to cart - $92" />
            </div>
          ) : (
            <div className="gift-desk">
              <div className="gift-desk-visual">
                <DeskVisual step={step} path={path} family={family} />
              </div>
              <div className="gift-desk-panel">
                {step === "who" ? (
                  <WhoStep desktop variant={variant} selected={whoFor} onSelect={setWhoFor} />
                ) : null}
                {step === "match" ? (
                  <MatchStep desktop variant={variant} path={path} onPath={setPath} />
                ) : null}
                {step === "family" ? (
                  <FamilyStep compact variant={variant} family={family} onFamily={setFamily} />
                ) : null}
                {step === "shade" ? (
                  <ShadeStep openId={openId} shadeId={shadeId} onOpen={setOpenId} onShade={setShadeId} />
                ) : null}
                {step === "message" ? (
                  <MessageStep
                    compact
                    message={message}
                    from={from}
                    onMessage={setMessage}
                    onFrom={setFrom}
                  />
                ) : null}
                <DeskNav
                  showBack={step !== "who"}
                  onBack={goBack}
                  onNext={goNext}
                  nextDisabled={
                    (step === "who" && !whoFor) || (step === "match" && !path)
                  }
                  nextLabel="Next"
                />
              </div>
            </div>
          )
        ) : (
          <>
        {step === "who" ? (
          <WhoStep
            variant={variant}
            heroRef={heroRef}
            selected={whoFor}
            onSelect={setWhoFor}
            onPick={() => (variant === "2" ? goTo("match", "forward") : startBoxMorph("match", "forward"))}
          />
        ) : null}
        {step === "match" ? <MatchStep variant={variant} path={path} onPath={setPath} heroRef={heroRef} /> : null}
        {step === "family" ? <FamilyStep variant={variant} family={family} onFamily={setFamily} /> : null}
        {step === "shade" ? (
          <ShadeStep openId={openId} shadeId={shadeId} onOpen={setOpenId} onShade={setShadeId} />
        ) : null}
        {step === "message" ? (
          <MessageStep
            variant={variant}
            path={path}
            message={message}
            from={from}
            onMessage={setMessage}
            onFrom={setFrom}
          />
        ) : null}
        {step === "gift" ? <FinalStep variant={variant} /> : null}
          </>
        )}
      </div>
      {showAtb ? (
        <DualAtb
          variant={variant}
          onBack={goBack}
          onNext={goNext}
          nextDisabled={
            (step === "who" && !whoFor) ||
            ((variant === "2" || variant === "3") && step === "match" && !path)
          }
          nextLabel={variant === "2" ? (step === "gift" ? "Add to cart - $92" : "Continue") : "Next"}
          stepIndex={v3Index}
          isGift={variant === "3" && step === "gift"}
        />
      ) : null}
      {morph?.from && !morph.boxDone ? (
        <div
          className={`gift-morph${morph.playing ? " is-play" : ""}${morph.dir === "back" ? " is-back" : ""}`}
          style={morphStyle}
          aria-hidden="true"
        >
          <img className="gift-morph-base" src={openBox(path)} alt="" />
          <div className="gift-morph-lid">
            <img src={CLOSED_BOX} alt="" />
          </div>
        </div>
      ) : null}
    </div>
  );
}
