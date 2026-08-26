import { useEffect, useRef, useState } from "react";
import DevStage from "./DevStage.jsx";

const asset = (file) => `${import.meta.env.BASE_URL}assets/${file}`;

const FAQS = [
  {
    q: "HOW DOES IT WORK?",
    a: (
      <ol>
        <li>
          Select your Discovery Set shade family and place the order for your Set. Each Set will include five mini samples of our commonly purchased shades within that selected Shade Family.
        </li>
        <li>
          Once your Set arrives, you can experience the five shades included in the Set and choose your best match.
        </li>
        <li>
          Purchase your full-size Foundation on hauslabs.com, within 21 days of your Discovery Set order date, with the same email address used when purchasing your Set. No further action is required, nor will you be charged for anything additional.
        </li>
        <li>
          If a full-size Foundation is not purchased within your trial period, you will be charged $12 + tax for the Discovery Set.
        </li>
      </ol>
    ),
  },
  {
    q: "HOW DO I CHOOSE THE RIGHT SHADE FAMILY FOR MY DISCOVERY SET?",
    a: "You can browse photos of all our six Shade Families. Choose the one that looks closest to your skin tone.",
  },
  {
    q: "WHAT IF NONE OF THE SHADES ARE THE RIGHT MATCH?",
    a: (
      <>
        Not to worry! In addition to the three shades in your Discovery Set, we also include a helpful Shade Finder card for your selected Shade Family, which will provide additional steps to help you find your ideal shade. If you’re still unsure, feel free to reach out to us at{" "}
        <a href="mailto:support@hauslabs.com">support@hauslabs.com</a> and our Haus Care Team would be happy to help further.
      </>
    ),
  },
  {
    q: "CAN I ORDER MULTIPLE DISCOVERY SETS?",
    a: "Only 1 Discovery Set may be purchased per order. If you would like to purchase another Discovery Set, it must be placed as a separate order and will begin its own trial period. Please note: each Discovery Set order requires its own qualifying full-size foundation purchase within that trial period to not incur a charge for the Discovery Set.",
  },
  {
    q: "CAN I CHOOSE WHICH SHADES WITHIN THE SHADE FAMILY COME IN MY DISCOVERY SET?",
    a: "The five shades included in each Discovery Set are pre-selected based on our most commonly purchased shades within that Shade Family and cannot be customized.",
  },
  {
    q: "CAN I RETURN THE DISCOVERY SET IF I CHANGED MY MIND OR DECIDED NOT TO PURCHASE?",
    a: "All purchases of the Discovery Set are final, and shipping cost is also non-refundable.",
  },
  {
    q: "IS THE DISCOVERY SET AVAILABLE FOR CUSTOMERS OUTSIDE OF THE US?",
    a: "Due to technical limitations, we are currently unable to offer the Discovery Set program to international customers. We apologize for any inconvenience.",
  },
];

function SplitCta() {
  return (
    <div className="split-cta">
      <button className="know" type="button">
        I know their shade
      </button>
      <button className="find" type="button">
        They’ll find it
      </button>
    </div>
  );
}

function Icon({ src, alt = "", className }) {
  return (
    <span className={className}>
      <img src={src} alt={alt} />
    </span>
  );
}

export default function App() {
  const [openFaq, setOpenFaq] = useState(2);
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pageRef = useRef(null);

  useEffect(() => {
    const screen = document.querySelector(".phone-screen");
    const nodes = document.querySelectorAll(".reveal");
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-in");
        });
      },
      {
        root: screen || null,
        threshold: 0.18,
        rootMargin: "0px 0px -8% 0px",
      }
    );
    nodes.forEach((n) => io.observe(n));

    const readParallax = () =>
      Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--parallax")) || 1;

    const onScroll = () => {
      const top = screen ? screen.scrollTop : document.documentElement.scrollTop;
      const max = screen
        ? Math.max(1, screen.scrollHeight - screen.clientHeight)
        : Math.max(1, document.documentElement.scrollHeight - document.documentElement.clientHeight);
      document.documentElement.style.setProperty("--progress", String(Math.min(1, top / max)));
      setScrolled(top > 4);

      const strength = readParallax();
      const hero = document.querySelector(".hero");
      const arnica = document.querySelector(".ingredients");
      const rootBox = screen ? screen.getBoundingClientRect() : { top: 0, height: window.innerHeight };

      if (hero) {
        const localTop = hero.getBoundingClientRect().top - rootBox.top;
        hero.style.setProperty("--hero-shift", `${Math.round(localTop * -0.12 * strength)}px`);
      }
      if (arnica) {
        const localTop = arnica.getBoundingClientRect().top - rootBox.top;
        arnica.style.setProperty(
          "--arnica-shift",
          `${Math.round((localTop - rootBox.height * 0.35) * 0.14 * strength)}px`
        );
      }
    };

    onScroll();
    const target = screen || window;
    target.addEventListener("scroll", onScroll, { passive: true });
    requestAnimationFrame(() => {
      document.querySelectorAll(".hero .reveal").forEach((n) => n.classList.add("is-in"));
    });

    return () => {
      io.disconnect();
      target.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    const screen = document.querySelector(".phone-screen");
    if (screen && window.matchMedia("(min-width: 901px)").matches) {
      screen.style.overflow = menuOpen || searchOpen ? "hidden" : "auto";
      document.body.style.overflow = "";
    } else {
      document.body.style.overflow = menuOpen || searchOpen ? "hidden" : "";
    }
  }, [menuOpen, searchOpen]);

  return (
    <DevStage>
    <div className="page" ref={pageRef}>
      <header className={`topbar${scrolled ? " is-scrolled" : ""}`}>
        <div className="announcement">
          <p>Shop our latest innovations</p>
        </div>
        <nav className="nav" aria-label="Primary">
          <div className="nav-left">
            <button type="button" aria-label="Open menu" onClick={() => setMenuOpen(true)}>
              <Icon className="icon-menu" src={asset("icon-menu.svg")} />
            </button>
            <button type="button" aria-label="Search" onClick={() => setSearchOpen(true)}>
              <Icon className="icon-search" src={asset("icon-search.svg")} />
            </button>
          </div>
          <a className="logo" href="#top" aria-label="Haus Labs by Lady Gaga">
            <span className="logo-name">HAUS LABS</span>
            <span className="logo-sub">BY LADY GAGA</span>
          </a>
          <button className="nav-right" type="button" aria-label="Bag, 0 items">
            <Icon className="icon-bag" src={asset("icon-account.svg")} />
            <span className="bag-label">Bag</span>
            <span className="bag-count">0</span>
          </button>
        </nav>
        <div className="progress" aria-hidden="true">
          <div className="progress-fill" />
        </div>
      </header>

      <section className="hero" id="top">
        <div className="hero-copy">
          <p className="eyebrow reveal d1">‘tis the season</p>
          <h1 className="hero-title reveal d2">Gift the perfect match</h1>
          <p className="hero-body reveal d3">
            This holiday, send your favorite foundation in an elegant and exclusive gift box.
          </p>
          <div className="perk-list reveal d4">
            <div className="perk-col">
              <div className="perk">
                <img src={asset("icon-check.svg")} alt="" />
                <span className="w141">Exclusive mini brush</span>
              </div>
              <div className="perk">
                <img src={asset("icon-check.svg")} alt="" />
                <span className="w141">Holiday gift box</span>
              </div>
              <div className="perk">
                <img src={asset("icon-check.svg")} alt="" />
                <span className="w164">Shade match guranteed</span>
              </div>
            </div>
          </div>
        </div>

        <div className="hero-product reveal">
          <img src={asset("hero-gift.png")} alt="Foundation & Brush Discovery Set gift box" />
        </div>

        <div className="hero-cta reveal d5">
          <p className="price">$92 - SHIPPED IN A GIFT BOX</p>
          <SplitCta />
        </div>
      </section>

      <section className="included">
        <h2 className="included-title reveal">What’s included</h2>
        <div className="included-stack">
          <div className="foundation-block">
            <div className="foundation-stage reveal">
              <div className="foundation-oval">
                <div className="foundation-media">
                  <img className="tubes" src={asset("foundation-set.png")} alt="Five Triclone Skin Tech Foundation deluxe samples" />
                  <article className="redeem-card">
                    <div className="redeem-inner">
                      <div className="redeem-row">
                        <div className="qr">
                          <img src={asset("icon-qr.svg")} alt="" />
                        </div>
                        <p className="redeem-copy">Includes code to redeem full bottle</p>
                      </div>
                      <div className="redeem-logo">
                        <img src={asset("card-logo.png")} alt="HAUS LABS" />
                      </div>
                    </div>
                  </article>
                </div>
              </div>
            </div>
            <div className="product-copy reveal">
              <p className="product-kicker">Triclone™&nbsp;Skin Tech Foundation </p>
              <p className="product-desc">
                Choose a full bottle if you know their shade or a discovery set for them to try before redeeming their perfect match.
              </p>
            </div>
            <div className="reveal">
              <SplitCta />
            </div>
          </div>

          <div className="brush-block">
            <div className="brush-stage reveal">
              <div className="brush-oval">
                <div className="brush-photo">
                  <img src={asset("brush.png")} alt="Mini foundation brush with foundation" />
                </div>
                <div className="ribbon">
                  <img src={asset("ribbon.png")} alt="Exclusive" />
                </div>
              </div>
            </div>
            <div className="brush-copy reveal">
              <p className="brush-kicker">mini Foundation Brush</p>
              <p className="brush-desc">
                A luxe, custom foundation brush designed to seamlessly build, buff and blend with control and ease.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="howto">
        <h2 className="howto-title reveal">How to build the perfect gift</h2>

        <article className="step reveal">
          <p className="step-label">step 1</p>
          <h3 className="step-heading">Tell us who the gift is for</h3>
          <p className="step-body">Gift with love this season, for your friends, family or yourself.</p>
        </article>

        <article className="step reveal">
          <p className="step-label">step 2</p>
          <h3 className="step-heading multi">Choose how they’ll match</h3>
          <p className="step-body">
            Two ways to give: a Full Bottle if you know the shade, or the Discovery Set to let them try 5 shades before they redeem their full bottle.
          </p>
        </article>

        <article className="step reveal">
          <p className="step-label">step 3</p>
          <h3 className="step-heading">Make it theirs</h3>
          <p className="step-body">Find their shade or ‘try-on’ shades using a photo or browsing similar model images</p>
        </article>

        <article className="step reveal">
          <p className="step-label">step 4</p>
          <h3 className="step-heading multi">Free and easy redemption</h3>
          <div className="perk-detail w211">
            <strong>Ships in 2–4 business days</strong>
            <span>Standard domestic shipping included.</span>
          </div>
          <div className="perk-detail w197">
            <strong>Gift price applied at checkout</strong>
            <span>Your code covers the full retail cost.</span>
          </div>
          <div className="perk-detail w221">
            <strong>No account required</strong>
            <span>Redeem directly — no sign-up, no catch.</span>
          </div>
        </article>
      </section>

      <section className="ingredients">
        <div className="ingredients-copy reveal">
          <p className="ingredients-eyebrow">give the gift of</p>
          <h2 className="ingredients-title">Skin loving ingredients</h2>
          <p className="ingredients-body">
            Our products are made with patent-pending complexes and proprietary ingredients that deliver skincare benefits without compromising performance.
          </p>
          <a className="ingredients-link" href="https://www.hauslabs.com/" target="_blank" rel="noreferrer">
            Learn more
          </a>
        </div>
        <div className="arnica">
          <img src={asset("arnica.png")} alt="Fermented arnica flowers" />
        </div>
      </section>

      <section className="faqs">
        <h2 className="faqs-title reveal">Gift Set FAQs</h2>
        <div className="faq-list">
          {FAQS.map((item, i) => {
            const open = openFaq === i;
            return (
              <article className={`faq-item${open ? " is-open" : ""}`} key={item.q}>
                <div className="faq-rule" />
                <button
                  className="faq-trigger"
                  type="button"
                  aria-expanded={open}
                  onClick={() => setOpenFaq(open ? -1 : i)}
                >
                  <span className="faq-q">{item.q}</span>
                  <span className="faq-chevron">
                    <img src={asset("icon-arrow.svg")} alt="" />
                  </span>
                </button>
                <div className="faq-answer">
                  <div className="faq-answer-inner">
                    <div className="faq-a">{item.a}</div>
                  </div>
                </div>
                {i === FAQS.length - 1 ? <div className="faq-rule" /> : null}
              </article>
            );
          })}
        </div>
      </section>

      <div className={`overlay${menuOpen ? " is-open" : ""}`} onClick={() => setMenuOpen(false)}>
        <div className="drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Menu">
          <div className="drawer-head">
            <h2>Menu</h2>
            <button className="drawer-close" type="button" aria-label="Close menu" onClick={() => setMenuOpen(false)}>
              ×
            </button>
          </div>
          <nav className="drawer-links">
            <a href="#top" onClick={() => setMenuOpen(false)}>Gift the match</a>
            <a href="#top" onClick={() => setMenuOpen(false)}>Foundation</a>
            <a href="#top" onClick={() => setMenuOpen(false)}>Discovery Set</a>
            <a href="#top" onClick={() => setMenuOpen(false)}>Shade Finder</a>
            <a href="#top" onClick={() => setMenuOpen(false)}>Ingredients</a>
          </nav>
        </div>
      </div>

      <div className={`overlay${searchOpen ? " is-open" : ""}`} onClick={() => setSearchOpen(false)}>
        <div className="drawer" onClick={(e) => e.stopPropagation()} role="dialog" aria-label="Search">
          <div className="drawer-head">
            <h2>Search</h2>
            <button className="drawer-close" type="button" aria-label="Close search" onClick={() => setSearchOpen(false)}>
              ×
            </button>
          </div>
          <input className="search-field" autoFocus={searchOpen} placeholder="Search Haus Labs" />
        </div>
      </div>
    </div>
    </DevStage>
  );
}
