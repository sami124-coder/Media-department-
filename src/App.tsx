import { useEffect, useRef, useState } from "react";
import type { CSSProperties, ReactNode } from "react";
import {
  ArrowDown,
  ArrowDownRight,
  ArrowRight,
  ArrowUpRight,
  Camera,
  Check,
  Download,
  Globe2,
  Heart,
  Lightbulb,
  Menu,
  MoveUpRight,
  Pause,
  PenTool,
  Play,
  Plus,
  Sparkles,
  Users,
  Video,
  X,
} from "lucide-react";
import { activities, members, phases, values } from "./content";
import type { Activity, Member, Phase } from "./content";

type ModalContent =
  | { kind: "activity"; item: Activity }
  | { kind: "member"; item: Member }
  | { kind: "phase"; item: Phase }
  | { kind: "join" };
const sections = [
  { id: "home", label: "Home" },
  { id: "about", label: "Our world" },
  { id: "activities", label: "Activities" },
  { id: "people", label: "The people" },
  { id: "plan", label: "Our plan" },
  { id: "vision", label: "Our vision" },
];

function Flower({ className = "" }: { className?: string }) {
  return (
    <svg
      className={`flower ${className}`}
      viewBox="0 0 100 100"
      fill="currentColor"
      aria-hidden="true"
    >
      <path d="M43 3h14l3 26 20-17 10 10-17 20 24 1v14l-24 3 17 20-10 10-20-17-3 24H43l-3-24-20 17-10-10 17-20-24-3V43l24-3-17-20 10-10 20 17z" />
    </svg>
  );
}

function SectionLabel({
  number,
  children,
  light = false,
}: {
  number: string;
  children: ReactNode;
  light?: boolean;
}) {
  return (
    <p className={`section-label ${light ? "light" : ""}`}>
      <span>{number}</span>
      {children}
    </p>
  );
}

function App() {
  const [active, setActive] = useState("home");
  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState("All activities");
  const [team, setTeam] = useState("Everyone");
  const [modal, setModal] = useState<ModalContent | null>(null);
  const [motion, setMotion] = useState(() => {
    try {
      return (
        localStorage.getItem("hsiyc-motion") !== "off" &&
        !window.matchMedia("(prefers-reduced-motion: reduce)").matches
      );
    } catch {
      return false;
    }
  });
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.documentElement.dataset.motion = motion ? "on" : "off";
    try {
      localStorage.setItem("hsiyc-motion", motion ? "on" : "off");
    } catch {
      /* Motion still works when storage is unavailable. */
    }
  }, [motion]);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const change = () => {
      if (media.matches) setMotion(false);
    };
    media.addEventListener("change", change);
    return () => media.removeEventListener("change", change);
  }, []);

  useEffect(() => {
    const reveal = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            reveal.unobserve(entry.target);
          }
        }),
      { threshold: 0.08 },
    );
    document.querySelectorAll(".reveal").forEach((el) => reveal.observe(el));
    const navigation = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id);
        }),
      { rootMargin: "-15% 0px -65% 0px" },
    );
    sections.forEach((section) => {
      const el = document.getElementById(section.id);
      if (el) navigation.observe(el);
    });
    return () => {
      reveal.disconnect();
      navigation.disconnect();
    };
  }, []);

  useEffect(() => {
    if (!menuOpen) return;
    const close = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false);
    };
    window.addEventListener("keydown", close);
    return () => window.removeEventListener("keydown", close);
  }, [menuOpen]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) =>
          entry.target.classList.toggle("is-in-view", entry.isIntersecting),
        );
      },
      { threshold: 0.08 },
    );
    document
      .querySelectorAll(".activity-image, .vision-art, .hero-art")
      .forEach((element) => observer.observe(element));
    return () => observer.disconnect();
  }, [category]);

  const filteredActivities = activities.filter(
    (item) => category === "All activities" || item.category === category,
  );
  const filteredMembers = members.filter(
    (member) => team === "Everyone" || member.team === team,
  );

  return (
    <>
      <a href="#main" className="skip-link">
        Skip to content
      </a>
      <header className="site-header">
        <div className="header-inner">
          <a
            className="brand"
            href="#home"
            aria-label="HSIYC Media & Publicity Department home"
            onClick={() => setMenuOpen(false)}
          >
            <img className="department-header-logo" src="/identity/department-logo.png" alt="" width="64" height="64" />
            <span className="brand-copy">
              <strong>
                HSIYC
              </strong>
              <span>MEDIA &amp; PUBLICITY<br />DEPARTMENT</span>
            </span>
          </a>
          <nav
            className={`desktop-nav ${menuOpen ? "is-open" : ""}`}
            id="main-navigation"
            aria-label="Main navigation"
          >
            {sections.map((section) => (
              <a
                key={section.id}
                className={active === section.id ? "active" : ""}
                href={`#${section.id}`}
                onClick={() => {
                  setMenuOpen(false);
                  setActive(section.id);
                }}
              >
                {section.label}
              </a>
            ))}
            <button
              className="mobile-join"
              onClick={() => {
                setModal({ kind: "join" });
                setMenuOpen(false);
              }}
            >
              Find your place <ArrowUpRight size={16} />
            </button>
          </nav>
          <div className="header-actions">
            <button
              className="header-motion icon-button"
              aria-label={motion ? "Pause animations" : "Resume animations"}
              aria-pressed={motion}
              onClick={() => setMotion(!motion)}
            >
              {motion ? <Pause size={15} /> : <Play size={15} />}
            </button>
            <button
              className="button button-navy header-join"
              onClick={() => setModal({ kind: "join" })}
            >
              Find your place <ArrowUpRight size={16} />
            </button>
            <button
              className="menu-toggle icon-button"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
              aria-expanded={menuOpen}
              aria-controls="main-navigation"
              onClick={() => setMenuOpen(!menuOpen)}
            >
              {menuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>
      </header>

      <main id="main">
        <section id="home" className="hero section-shell">
          <div className="hero-copy">
            <div className="eyebrow">
              <span className="status-dot" /> THE CREATIVE SIDE OF HSIYC / 01
            </div>
            <h1>
              BIG IDEAS.
              <br />
              REAL PEOPLE.
              <br />
              <span>OUR WORLD.</span>
            </h1>
            <p className="hero-description">
              A home for curious minds and creative hearts.
              <br className="desktop-break" /> We’re the people behind the
              stories that bring
              <br className="desktop-break" /> HSIYC to life.
            </p>
            <div className="hero-buttons">
              <a className="button button-blue" href="#activities">
                Explore our world <ArrowUpRight size={18} />
              </a>
              <a className="text-link" href="#people">
                <span className="small-play">
                  <Users size={16} />
                </span>{" "}
                Meet the makers
              </a>
            </div>
            <div className="hero-footnote">
              <span className="tiny-avatars">
                <i>H</i>
                <i>S</i>
                <i>I</i>
                <i>Y</i>
                <i>C</i>
              </span>
              <span>
                Different perspectives.
                <br />
                <strong>One creative community.</strong>
              </span>
              <ArrowDownRight size={26} strokeWidth={1.3} />
            </div>
          </div>
          <div
            className="hero-art"
            ref={heroRef}
            onPointerMove={(event) => {
              if (!motion || event.pointerType !== "mouse" || !heroRef.current)
                return;
              const bounds = heroRef.current.getBoundingClientRect();
              heroRef.current.style.setProperty(
                "--tilt-x",
                `${((event.clientY - bounds.top) / bounds.height - 0.5) * -5}deg`,
              );
              heroRef.current.style.setProperty(
                "--tilt-y",
                `${((event.clientX - bounds.left) / bounds.width - 0.5) * 5}deg`,
              );
            }}
            onPointerLeave={() => {
              heroRef.current?.style.setProperty("--tilt-x", "0deg");
              heroRef.current?.style.setProperty("--tilt-y", "0deg");
            }}
          >
            <img
              className="hero-scene"
              src="/identity/creative-world.png"
              alt="A cinematic world of creativity with the teal HSIYC mascot, a globe, a camera and floating paper planes"
              fetchPriority="high"
            />
            <div className="scene-shade" />
            <span className="floating-orb orb-one" aria-hidden="true" />
            <span className="floating-orb orb-two" aria-hidden="true" />
            <span className="floating-spark" aria-hidden="true">
              <Sparkles size={30} />
            </span>
            <div className="scene-caption">
              <span className="status-dot" /> IMAGINATION HAS NO BORDERS{" "}
              <ArrowUpRight size={15} />
            </div>
          </div>
          <a className="scroll-hint" href="#about">
            <ArrowDown size={13} /> KEEP EXPLORING
          </a>
          <span className="hero-coordinate">SHENZHEN, CHINA ↗ THE WORLD</span>
        </section>

        <div className="marquee" aria-label="Connect. Create. Contribute.">
          <div className="marquee-track" aria-hidden="true">
            {Array.from({ length: 4 }, (_, i) => (
              <div className="marquee-unit" key={i}>
                <span>CONNECT</span>
                <Flower />
                <span className="outlined">CREATE</span>
                <Flower />
                <span>CONTRIBUTE</span>
                <Flower />
              </div>
            ))}
          </div>
        </div>

        <section id="about" className="about section-shell section-space">
          <div className="about-intro reveal">
            <SectionLabel number="01">A COLLECTIVE WITH A PURPOSE</SectionLabel>
            <h2>
              MORE THAN MEDIA.
              <br />
              <span className="text-blue">MORE CONNECTION.</span>
            </h2>
            <p>
              We bring campus stories to life through photography, design, and
              shared ideas. Everyone has a place to create.
            </p>
            <a className="underlined-link" href="#vision">
              The bigger picture <ArrowUpRight size={17} />
            </a>
          </div>
          <div className="about-cards reveal">
            <article className="purpose-card purpose-create">
              <div className="purpose-icon">
                <PenTool size={22} />
              </div>
              <span className="card-index">01 /</span>
              <h3>
                Make something
                <br />
                that matters.
              </h3>
              <p>
                Design, words, photos, film.
                <br />
                Different tools. Shared purpose.
              </p>
              <span className="small-pill">
                CREATIVITY, WITH HEART <Heart size={11} />
              </span>
            </article>
            <article className="purpose-card purpose-connect">
              <div className="purpose-icon">
                <Globe2 size={22} />
              </div>
              <span className="card-index">02 /</span>
              <h3>
                A world of
                <br />
                perspectives.
              </h3>
              <p>
                Across cultures and disciplines,
                <br />
                there’s more that connects us.
              </p>
              <span className="small-pill">
                MANY VOICES. ONE HSIYC. <Sparkles size={12} />
              </span>
            </article>
          </div>
          <div className="department-identity reveal">
            <img src="/identity/department-logo.png" alt="HSIYC — HITSZ International Youth Club, Media & Publicity Department" width="1254" height="1254" loading="lazy" />
            <div>
              <span className="eyebrow">HITSZ INTERNATIONAL YOUTH CLUB</span>
              <h3>Media &amp; Publicity Department</h3>
              <p>Our people. Our stories. Our shared world.</p>
            </div>
          </div>
        </section>

        <section id="activities" className="activities-section section-space">
          <div className="section-shell">
            <div className="section-heading reveal">
              <div>
                <SectionLabel number="02">
                  OUT OF THE GROUP CHAT. INTO THE WORLD.
                </SectionLabel>
                <h2>
                  OUR WORLD,
                  <br />
                  <span className="text-blue">IN FULL COLOR.</span>
                  <Flower className="heading-flower" />
                </h2>
              </div>
              <div className="section-heading-aside">
                <p>
                  Big ideas. Small moments. A little creative chaos.
                  <br />
                  Here’s what we could make happen together.
                </p>
                <span className="sample-note">
                  <span /> PROPOSED ACTIVITIES
                </span>
              </div>
            </div>
            <div className="filter-toolbar">
              <div
                className="filter-list"
                role="group"
                aria-label="Filter activities"
              >
                {[
                  "All activities",
                  "Campus life",
                  "Workshops",
                  "Our creations",
                ].map((filter) => (
                  <button
                    key={filter}
                    className={`filter-button ${category === filter ? "selected" : ""}`}
                    aria-pressed={category === filter}
                    onClick={() => {
                      setCategory(filter);
                    }}
                  >
                    {filter}
                    {category === filter && (
                      <span className="filter-count">
                        {filter === "All activities"
                          ? activities.length
                          : activities.filter((a) => a.category === filter)
                              .length}
                      </span>
                    )}
                  </button>
                ))}
              </div>
              <span className="results-label" aria-live="polite">
                {filteredActivities.length} ideas to explore{" "}
                <ArrowDownRight size={17} />
              </span>
            </div>
            <div className="activity-grid" aria-live="polite">
              {filteredActivities.map((activity, index) => (
                <button
                  key={activity.id}
                  className={`activity-card activity-${activity.color}`}
                  onClick={() => setModal({ kind: "activity", item: activity })}
                  style={{ "--card-delay": `${index * 80}ms` } as CSSProperties}
                >
                  <div className={`activity-image image-${activity.id}`}>
                    <img src={activity.image} alt="" loading="lazy" />
                    <span className="activity-category">
                      {activity.category}
                    </span>
                    <span className="activity-open">
                      <ArrowUpRight size={22} />
                    </span>
                  </div>
                  <div className="activity-card-copy">
                    <span className="eyebrow">{activity.label}</span>
                    <h3>{activity.title}</h3>
                    <p>{activity.subtitle}</p>
                    <div className="activity-meta">
                      <span>{activity.meta}</span>
                      <ArrowUpRight size={17} />
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </section>

        <section
          id="people"
          className="people-section section-shell section-space"
        >
          <div className="section-heading reveal">
            <div>
              <SectionLabel number="03">
                THE HEART OF THE DEPARTMENT
              </SectionLabel>
              <h2>
                MEET THE <span className="text-blue">MAKERS.</span>
              </h2>
            </div>
            <p>
              Many talents. One team.
              <br />A place for the people behind the pixels.
            </p>
          </div>
          <div className="people-toolbar">
            <div
              className="filter-list"
              role="group"
              aria-label="Filter members"
            >
              {["Everyone", "Leadership", "Members"].map((filter) => (
                <button
                  className={`filter-button ${team === filter ? "selected" : ""}`}
                  key={filter}
                  aria-pressed={team === filter}
                  onClick={() => setTeam(filter)}
                >
                  {filter}
                </button>
              ))}
            </div>
            <span className="sample-note">
              <span /> MEMBER NAMES COMING SOON
            </span>
          </div>
          <div className="member-grid" aria-live="polite">
            {filteredMembers.map((member, i) => (
              <button
                className={`member-card member-${member.color}`}
                key={member.id}
                onClick={() => setModal({ kind: "member", item: member })}
              >
                <div className="member-portrait">
                  <span className="portrait-grid" />
                  <span className="member-doodle">
                    {i % 2 === 0 ? <Flower /> : <Globe2 strokeWidth={0.75} />}
                  </span>
                  <span className="member-initials">{member.initials}</span>
                  <span className="portrait-sticker">
                    {member.role === "Leader" ? (
                      <PenTool size={26} />
                    ) : member.role === "Consular" ? (
                      <Lightbulb size={26} />
                    ) : (
                      <Camera size={26} />
                    )}
                  </span>
                  <span className="member-team">{member.team}</span>
                </div>
                <div className="member-info">
                  <div>
                    <h3>{member.role}</h3>
                    <p>{member.name}</p>
                  </div>
                  <span className="member-arrow">
                    <ArrowUpRight size={19} />
                  </span>
                </div>
              </button>
            ))}
          </div>
          <div className="people-note">
            <span>
              <Heart size={15} /> Every good story starts with someone like you.
            </span>
            <button
              className="underlined-link"
              onClick={() => setModal({ kind: "join" })}
            >
              There’s room for your perspective <ArrowUpRight size={17} />
            </button>
          </div>
        </section>

        <section id="plan" className="plan-section section-space">
          <div className="section-shell">
            <div className="section-heading reveal">
              <div>
                <SectionLabel number="04" light>
                  A LITTLE DIRECTION. A LOT OF POSSIBILITY.
                </SectionLabel>
                <h2>
                  FROM “WHAT IF”
                  <br />
                  TO <span>“WE MADE IT.”</span>
                </h2>
              </div>
              <div className="section-heading-aside">
                <p>
                  Our proposed roadmap for a creative term.
                  <br />
                  One step, one story, one shared win at a time.
                </p>
                <span className="plan-label">
                  THE NEXT CHAPTER <ArrowDownRight size={17} />
                </span>
              </div>
            </div>
            <div className="roadmap">
              {phases.map((phase, i) => (
                <button
                  className={`phase-card phase-${i} reveal`}
                  key={phase.id}
                  onClick={() => setModal({ kind: "phase", item: phase })}
                >
                  <div className="phase-top">
                    <span className="phase-number">0{i + 1}</span>
                    <span>{phase.period}</span>
                    <ArrowUpRight size={19} />
                  </div>
                  <div className="phase-track">
                    <span />
                  </div>
                  <h3>{phase.title}</h3>
                  <p>{phase.description}</p>
                  <span className="phase-details">
                    Explore the plan <Plus size={15} />
                  </span>
                </button>
              ))}
            </div>
            <p className="roadmap-note">
              <Sparkles size={15} /> A living plan, shaped by the people who
              make it happen. Dates and milestones to be confirmed.
            </p>
          </div>
        </section>

        <section
          id="vision"
          className="vision-section section-shell section-space"
        >
          <div className="vision-art reveal">
            <div className="vision-paper">
              <img
                src="/identity/scene-vision.png"
                alt="Two HSIYC mascots connecting around a glowing globe and a paper airplane"
                loading="lazy"
              />
              <span>ROOTED IN CAMPUS. OPEN TO THE WORLD.</span>
            </div>
          </div>
          <div className="vision-copy reveal">
            <SectionLabel number="05">
              THE VISION WE’RE BUILDING TOWARD
            </SectionLabel>
            <h2>
              A CAMPUS WHERE
              <br />
              <span className="text-blue">EVERY VOICE BELONGS.</span>
            </h2>
            <p className="vision-description">
              To make creativity a shared language—connecting people,
              celebrating our differences, and turning everyday campus life into
              something we remember together.
            </p>
            <div className="value-list">
              {values.map((value, i) => (
                <div key={value.title}>
                  <span>0{i + 1}</span>
                  <div>
                    <h3>{value.title}</h3>
                    <p>{value.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <span className="sample-note">
              <span /> PROPOSED DEPARTMENT VISION
            </span>
          </div>
        </section>

        <section className="join-section section-shell">
          <div className="join-card reveal">
            <Flower className="join-flower" />
            <span className="eyebrow">
              YOU DON’T NEED TO HAVE IT ALL FIGURED OUT.
            </span>
            <h2>
              BRING YOUR CURIOSITY.
              <br />
              WE’LL BRING THE <span>POSSIBILITIES.</span>
            </h2>
            <p>
              A camera, a sketchbook, an idea—or just you.
              <br />
              There’s a place for your kind of creative here.
            </p>
            <button
              className="button button-ivory"
              onClick={() => setModal({ kind: "join" })}
            >
              Let’s make something together <ArrowUpRight size={18} />
            </button>
            <span className="join-scribble" aria-hidden="true">
              your next chapter
              <br />
              starts here ↗
            </span>
          </div>
        </section>
      </main>

      <footer className="footer section-shell">
        <div className="footer-top">
          <a className="footer-brand department-footer-brand" href="#home" aria-label="HSIYC Media & Publicity Department home">
            <img src="/identity/department-logo.png" alt="" width="100" height="100" loading="lazy" />
            <span className="department-footer-name">HSIYC<span>MEDIA &amp; PUBLICITY DEPARTMENT</span></span>
          </a>
          <p>
            Connect. Create. Contribute.
            <br />
            <span>One campus. Many stories.</span>
          </p>
          <a className="back-top" href="#home" aria-label="Back to top">
            <MoveUpRight size={24} />
          </a>
        </div>
        <div className="footer-bottom">
          <span>
            © {new Date().getFullYear()} HSIYC · HITSZ International Youth Club
          </span>
          <span>
            Made with a little imagination <Heart size={12} />
          </span>
          <button
            className="motion-toggle"
            aria-pressed={motion}
            onClick={() => setMotion(!motion)}
          >
            {motion ? <Pause size={12} /> : <Play size={12} />} Motion{" "}
            {motion ? "on" : "off"}
          </button>
        </div>
        <p className="content-note">
          Website concept · Member names and details are placeholders.
          Activities, roadmap, and vision are proposed content, ready for your
          department’s details.
        </p>
      </footer>
      {modal && <DetailModal content={modal} onClose={() => setModal(null)} />}
    </>
  );
}

function DetailModal({
  content,
  onClose,
}: {
  content: ModalContent;
  onClose: () => void;
}) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  useEffect(() => {
    const dialog = dialogRef.current;
    dialog?.showModal();
    const oldOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = oldOverflow;
      dialog?.close();
    };
  }, []);
  return (
    <dialog
      ref={dialogRef}
      className={`detail-modal modal-${content.kind}`}
      aria-labelledby="modal-title"
      onClose={(event) => {
        // StrictMode may queue a close event before immediately reopening the dialog.
        if (!event.currentTarget.open) onClose();
      }}
      onClick={(event) => {
        if (event.target === event.currentTarget) dialogRef.current?.close();
      }}
    >
      <div className="modal-inner">
        <button
          className="modal-close icon-button"
          aria-label="Close dialog"
          onClick={() => dialogRef.current?.close()}
        >
          <X size={21} />
        </button>
        {content.kind === "activity" && (
          <>
            <div className="modal-art">
              <img
                src={content.item.image}
                alt={`${content.item.title} — HSIYC creative scene`}
              />
            </div>
            <div className="modal-copy">
              <span className="eyebrow">
                PROPOSED ACTIVITY · {content.item.category}
              </span>
              <h2 id="modal-title">{content.item.title}</h2>
              <p>{content.item.description}</p>
              <h3>What we could create</h3>
              <ul className="check-list">
                {content.item.takeaways.map((takeaway) => (
                  <li key={takeaway}>
                    <Check size={16} />
                    {takeaway}
                  </li>
                ))}
              </ul>
              <div className="modal-note">
                <Lightbulb size={18} />
                <span>
                  This is an activity concept. The team will confirm dates,
                  venues, and participation details.
                </span>
              </div>
            </div>
          </>
        )}
        {content.kind === "member" && (
          <div className="modal-copy">
            <div className={`profile-avatar member-${content.item.color}`}>
              {content.item.initials}
              <Flower />
            </div>
            <span className="eyebrow">
              DEPARTMENT ROLE · {content.item.team}
            </span>
            <h2 id="modal-title">{content.item.role}</h2>
            <p className="profile-role">{content.item.name}</p>
            <p>{content.item.bio}</p>
            <h3>Role focus</h3>
            <div className="skill-tags">
              {content.item.skills.map((skill) => (
                <span key={skill}>{skill}</span>
              ))}
            </div>
            <div className="modal-note">
              <Users size={18} />
              <span>
                This role is part of your department structure. The member’s
                name and confirmed responsibilities can be added here.
              </span>
            </div>
          </div>
        )}
        {content.kind === "phase" && (
          <div className="modal-copy">
            <span className="eyebrow">
              PROPOSED ROADMAP · {content.item.period}
            </span>
            <h2 id="modal-title">{content.item.title}</h2>
            <p>{content.item.description}</p>
            <h3>The small steps</h3>
            <ul className="check-list">
              {content.item.tasks.map((task) => (
                <li key={task}>
                  <Check size={16} />
                  {task}
                </li>
              ))}
            </ul>
            <div className="phase-output">
              <Sparkles size={20} />
              <div>
                <strong>What we’re working toward</strong>
                <p>{content.item.output}</p>
              </div>
            </div>
            <p className="modal-fine-print">
              This roadmap is a starting point. The department will set the
              final schedule.
            </p>
          </div>
        )}
        {content.kind === "join" && <JoinContent />}
      </div>
    </dialog>
  );
}

function JoinContent() {
  const [interest, setInterest] = useState("Design");
  const [name, setName] = useState("");
  const [note, setNote] = useState("");
  const [downloaded, setDownloaded] = useState(false);
  const roles = [
    { name: "Design", icon: PenTool, text: "Give good ideas a visual voice." },
    {
      name: "Photography",
      icon: Camera,
      text: "Find the story in a single frame.",
    },
    {
      name: "Writing",
      icon: Lightbulb,
      text: "Turn thoughts into connections.",
    },
    { name: "Film", icon: Video, text: "Bring campus stories to life." },
  ];
  return (
    <div className="modal-copy join-modal-copy">
      <span className="eyebrow">YOUR KIND OF CREATIVE BELONGS HERE.</span>
      <h2 id="modal-title">FIND YOUR PLACE.</h2>
      <p>
        Choose what sparks your curiosity and make a little introduction to
        share with your department coordinator.
      </p>
      <div
        className="interest-grid"
        role="group"
        aria-label="Creative interest"
      >
        {roles.map((role) => (
          <button
            className={interest === role.name ? "selected" : ""}
            aria-pressed={interest === role.name}
            key={role.name}
            onClick={() => {
              setInterest(role.name);
              setDownloaded(false);
            }}
          >
            <role.icon size={21} />
            <strong>{role.name}</strong>
            <span>{role.text}</span>
            {interest === role.name && (
              <Check className="interest-check" size={16} />
            )}
          </button>
        ))}
      </div>
      <form
        onSubmit={(event) => {
          event.preventDefault();
          const text = `Hi HSIYC Media & Publicity Department!\n\nMy name is ${name.trim()}. I’m interested in ${interest.toLowerCase()}.\n\n${note.trim() || "I would love to learn more about getting involved and creating with the team."}\n\nLooking forward to connecting!\n${name.trim()}\n`;
          const url = URL.createObjectURL(
            new Blob([text], { type: "text/plain;charset=utf-8" }),
          );
          const a = document.createElement("a");
          a.href = url;
          a.download = "my-hsiyc-introduction.txt";
          a.click();
          setTimeout(() => URL.revokeObjectURL(url), 1000);
          setDownloaded(true);
        }}
      >
        <label htmlFor="join-name">
          Your name <span>(required)</span>
        </label>
        <input
          id="join-name"
          name="name"
          autoComplete="name"
          placeholder="What should we call you?"
          value={name}
          onChange={(event) => {
            setName(event.target.value);
            setDownloaded(false);
          }}
          required
          maxLength={100}
          pattern=".*\S.*"
        />
        <label htmlFor="join-note">
          A little about you <span>(optional)</span>
        </label>
        <textarea
          id="join-note"
          name="note"
          placeholder="An idea, a skill, or something you’d love to learn…"
          value={note}
          onChange={(event) => {
            setNote(event.target.value);
            setDownloaded(false);
          }}
          maxLength={1500}
          rows={3}
        />
        <button className="button button-blue" type="submit">
          <Download size={17} /> Download my introduction{" "}
          <ArrowRight size={16} />
        </button>
        <p className="form-status" role="status">
          {downloaded
            ? "Your introduction is downloaded. Share it with your department coordinator to take the next step."
            : "Your introduction stays on your device. This form downloads a draft; it does not submit an application."}
        </p>
      </form>
    </div>
  );
}

export default App;
