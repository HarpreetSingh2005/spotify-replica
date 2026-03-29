import React, { use, useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";

import "./HeroExperience.css";
import "./Hero.css";
import video1 from "../assets/headphone-1.mp4";
import video2 from "../assets/headphone-2.mp4";
import video3 from "../assets/headphone-3.mp4";
import video4 from "../assets/headphone-4.mp4";
import chillPreview from "../assets/genres/chill.mp3";
import hiphopPreview from "../assets/genres/hiphop.mp3";
import classicalPreview from "../assets/genres/classical.mp3";
import edmPreview from "../assets/genres/edm.mp3";
import lofiPreview from "../assets/genres/lofi.mp3";
import indiePreview from "../assets/genres/indie.mp3";

gsap.registerPlugin(SplitText);
gsap.registerPlugin(ScrollTrigger);

const videos = [video1, video2, video3, video4];

const features = [
  {
    title: "Curated with intention",
    text: "No endless clutter. No dead moments. Only music selected to match pace, mood, and presence.",
  },
  {
    title: "Designed to be immersive",
    text: "Every transition, visual, and interaction is crafted to make listening feel like entering a world.",
  },
  {
    title: "Made to be felt",
    text: "Some tracks don’t just play. They stay with you — long after the sound fades.",
  },
];

const genres = [
  {
    name: "Chill",
    className: "genre-chill",
    preview: chillPreview,
    desc: "Slow down. Let it breathe.",
  },
  {
    name: "Hip-Hop",
    className: "genre-hiphop",
    preview: hiphopPreview,
    desc: "Rhythm with weight.",
  },
  {
    name: "Classical",
    className: "genre-classical",
    preview: classicalPreview,
    desc: "Timeless, precise, alive.",
  },
  {
    name: "EDM",
    className: "genre-edm",
    preview: edmPreview,
    desc: "Pulse, motion, release.",
  },
  {
    name: "Lo-fi",
    className: "genre-lofi",
    preview: lofiPreview,
    desc: "For quiet hours and drifting thoughts.",
  },
  {
    name: "Indie",
    className: "genre-indie",
    preview: indiePreview,
    desc: "Raw, textured, personal.",
  },
];
const Hero = () => {
  const [introDone, setIntroDone] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [showNext, setShowNext] = useState(false);
  const [nextReady, setNextReady] = useState(false);

  // Overlay
  const overlayRef = useRef(null);
  const svgRef = useRef(null);
  const textRef = useRef(null);
  // Video
  const activeVideoRef = useRef(null);
  const nextVideoRef = useRef(null);
  //
  const sectionRef = useRef(null);
  const horizontalRef = useRef(null);
  const horizontalTrackRef = useRef(null);
  const featureRefs = useRef([]);

  //Genres music
  const [activeGenre, setActiveGenre] = useState(null);
  const genreAudioRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const genreRefs = useRef([]);

  //Masking effect
  useEffect(() => {
    document.body.style.overflow = "hidden";

    const tl = gsap.timeline({
      onComplete: () => {
        setIntroDone(true);
        document.body.style.overflow = "auto";
      },
    });

    tl.fromTo(
      textRef.current,
      {
        opacity: 0,
        // scale: 0.8,
        filter: "blur(10px)",
      },
      {
        opacity: 1,
        scale: 1,
        filter: "blur(0px)",
        duration: 3,
        ease: "power3.out",
      },
    )
      .to({}, { duration: 0.3 })
      .to(".cutout-text", {
        letterSpacing: 4,
        duration: 0.5,
        ease: "power2.out",
      })
      .to(svgRef.current, {
        scale: 35,
        duration: 2,
        x: "-=150%",
        y: "+=150%",
        ease: "power4.inOut",
        transformOrigin: "center center",
      })
      .to(overlayRef.current, {
        display: "none",
        pointerEvents: "none",
      });

    return () => {
      document.body.style.overflow = "auto";
    };
  }, []);

  //Video switch
  useEffect(() => {
    const interval = setInterval(() => {
      if (!nextReady) return;

      setShowNext(true);

      setTimeout(() => {
        setActiveIndex(nextIndex);
        setNextIndex((nextIndex + 1) % videos.length);
        setShowNext(false);
        setNextReady(false);
      }, 1000); // match fade duration
    }, 5000);

    return () => clearInterval(interval);
  }, [nextReady, nextIndex]);

  // Try autoplay after source changes
  useEffect(() => {
    if (activeVideoRef.current) {
      activeVideoRef.current.play().catch(() => {});
    }
    if (nextVideoRef.current) {
      nextVideoRef.current.load();
    }
  }, [activeIndex, nextIndex]);

  // The horizontal scroll and rest of stuff
  useEffect(() => {
    const ctx = gsap.context(() => {
      // Intro reveal
      gsap.from(".exp-transition-line", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: {
          trigger: ".exp-transition-line",
          start: "top 85%",
        },
      });

      gsap.from(".exp-intro-title span", {
        opacity: 0,
        y: 100,
        stagger: 0.12,
        duration: 1.3,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".exp-intro",
          start: "top 75%",
        },
      });

      // Feature blocks reveal
      featureRefs.current.forEach((el) => {
        if (!el) return;

        gsap.fromTo(
          el,
          {
            opacity: 0.25,
            y: 80,
            scale: 0.96,
          },
          {
            opacity: 1,
            y: 0,
            scale: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 80%",
              end: "top 40%",
              scrub: 1,
            },
          },
        );
      });

      // Big statement reveal
      gsap.from(".exp-big-line", {
        opacity: 0,
        y: 80,
        duration: 1.3,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".exp-big-statement",
          start: "top 75%",
        },
      });

      // Horizontal MUSIC scroll
      const track = horizontalTrackRef.current;
      const horizontalSection = horizontalRef.current;

      if (track && horizontalSection) {
        const scrollAmount = Math.max(track.scrollWidth - window.innerWidth, 0);

        gsap.to(track, {
          x: -scrollAmount,
          ease: "power1.out",
          scrollTrigger: {
            trigger: horizontalSection,
            start: "top top",
            end: () => `+=${scrollAmount * 0.5}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      // Genres intro reveal
      gsap.from(".genre-word", {
        opacity: 0,
        y: 60,
        stagger: 0.12,
        duration: 1,
        ease: "power4.out",
        scrollTrigger: {
          trigger: ".genres-playground",
          start: "top 80%",
        },
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  //Genre Music
  const handleGenreEnter = (genre) => {
    setActiveGenre(genre.className);

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    hoverTimeoutRef.current = setTimeout(() => {
      if (genreAudioRef.current) {
        genreAudioRef.current.pause();
        genreAudioRef.current.currentTime = 0;
      }

      const audio = new Audio(genre.preview);
      audio.volume = 0.35;
      audio.loop = true;
      audio.play().catch(() => {});
      genreAudioRef.current = audio;
    }, 280); // <-- delay here
  };

  const handleGenreLeave = () => {
    setActiveGenre(null);

    if (hoverTimeoutRef.current) {
      clearTimeout(hoverTimeoutRef.current);
    }

    if (genreAudioRef.current) {
      genreAudioRef.current.pause();
      genreAudioRef.current.currentTime = 0;
    }
  };

  const handleGenreMove = (e, index) => {
    const item = genreRefs.current[index];
    if (!item) return;

    const bubble = item.querySelector(".genre-bubble-shape");
    const titleWrap = item.querySelector(".genre-title-wrap");
    if (!bubble || !titleWrap) return;

    const rect = titleWrap.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;

    // 👉 VERY SMALL movement (strong stick)
    const moveX = Math.max(Math.min(distanceX * 0.06, 12), -12);
    const moveY = Math.max(Math.min(distanceY * 0.06, 10), -10);

    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // 👉 THIS IS THE IMPORTANT PART (strong stretch)
    const stretchFactor = Math.min(distance / 120, 0.45);

    const scaleX =
      1 +
      (Math.abs(distanceX) / (Math.abs(distanceX) + Math.abs(distanceY) + 1)) *
        stretchFactor;

    const scaleY =
      1 +
      (Math.abs(distanceY) / (Math.abs(distanceX) + Math.abs(distanceY) + 1)) *
        stretchFactor;

    gsap.to(bubble, {
      x: moveX,
      y: moveY,
      scaleX: scaleX,
      scaleY: scaleY * 0.75,
      duration: 0.18,
      ease: "power3.out",
      transformOrigin: "center center",
    });

    gsap.to(titleWrap, {
      x: moveX * 0.08,
      y: moveY * 0.08,
      duration: 0.18,
      ease: "power3.out",
    });
  };
  const handleGenreHover = (e, genre, index) => {
    const item = genreRefs.current[index];
    if (!item) return;

    const titleWrap = item.querySelector(".genre-title-wrap");
    if (!titleWrap) return;

    const rect = titleWrap.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const distanceX = e.clientX - centerX;
    const distanceY = e.clientY - centerY;
    const distance = Math.sqrt(distanceX * distanceX + distanceY * distanceY);

    // only activate if cursor is actually close enough
    const activationRadius = 95;

    if (distance < activationRadius) {
      if (activeGenre !== genre.className) {
        handleGenreEnter(genre);
      }

      handleGenreMove(e, index);
    } else {
      if (activeGenre === genre.className) {
        handleGenreLeave();
        resetGenreBubble(index);
      }
    }
  };

  const resetGenreBubble = (index) => {
    const item = genreRefs.current[index];
    if (!item) return;

    const bubble = item.querySelector(".genre-bubble-shape");
    const titleWrap = item.querySelector(".genre-title-wrap");

    if (bubble) {
      gsap.to(bubble, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.65,
        ease: "elastic.out(1, 0.35)",
      });
    }

    if (titleWrap) {
      gsap.to(titleWrap, {
        x: 0,
        y: 0,
        duration: 0.5,
        ease: "power3.out",
      });
    }
  };

  return (
    <>
      <section className="hero-wrapper">
        {/* Video Layer */}
        <div className={`hero-media ${introDone ? "framed" : ""}`}>
          {/* Current Video */}
          <video
            ref={activeVideoRef}
            key={`active-${videos[activeIndex]}`}
            className={`bg-video ${showNext ? "fade-out" : "active"}`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
          >
            <source src={videos[activeIndex]} type="video/mp4" />
          </video>

          {/* Next Video */}
          <video
            ref={nextVideoRef}
            key={`next-${videos[nextIndex]}`}
            className={`bg-video next-layer ${showNext ? "fade-in" : ""}`}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            onCanPlayThrough={() => setNextReady(true)}
          >
            <source src={videos[nextIndex]} type="video/mp4" />
          </video>

          {/* Overlays */}
          <div className={`hero-overlay ${introDone ? "active" : ""}`}></div>
          <div className={`hero-radial ${introDone ? "active" : ""}`}></div>
          <div
            className={`hero-bottom-gradient ${introDone ? "active" : ""}`}
          ></div>
        </div>

        {/* Intro Mask Overlay */}
        {!introDone && (
          <div className="intro-overlay" ref={overlayRef}>
            <svg
              className="text-cutout"
              viewBox="0 0 1000 500"
              preserveAspectRatio="xMidYMid slice"
              ref={svgRef}
            >
              <defs>
                <mask id="cutout-mask">
                  <rect width="100%" height="100%" fill="white" />
                  <text
                    x="50%"
                    y="50%"
                    textAnchor="middle"
                    dominantBaseline="middle"
                    className="cutout-text"
                    ref={textRef}
                  >
                    MUSIC
                  </text>
                </mask>
              </defs>

              <rect
                width="100%"
                height="100%"
                fill="black"
                mask="url(#cutout-mask)"
              />
            </svg>
          </div>
        )}

        {/* Navbar */}
        <nav className={`hero-navbar ${introDone ? "show" : ""}`}>
          <button className="nav-logo">
            <span>MUSIC</span>
          </button>

          <div className="nav-links">
            <a href="#explore">Explore</a>
            <a href="#genres">Genres</a>
            <a href="#about">About</a>
            <button className="sound-btn">Sound On</button>
          </div>
        </nav>

        {/* Main Content */}
        <div className={`home-content ${introDone ? "show" : ""}`}>
          <h1 className="hero-title">
            <span className="line-one">Not just music.</span>
            <span className="line-two">A feeling that moves with you.</span>
          </h1>
        </div>

        {/* Bottom Frame / CTA Row */}
        <div className={`hero-frame ${introDone ? "show" : ""}`}>
          <button className="hero-cta">
            <span className="cta-text cta-default">Explore Collection</span>
            <span className="cta-text cta-hover">Enter Soundscape</span>
          </button>

          <div className="frame-meta">
            <span className="scroll-text">Scroll to Explore</span>
            <div className="scroll-line"></div>
          </div>
        </div>
      </section>

      <section className="experience-wrapper" ref={sectionRef}>
        {/* Ambient background */}
        <div className="exp-bg-glow glow-1"></div>
        <div className="exp-bg-glow glow-2"></div>
        <div className="exp-noise"></div>

        {/* Transition */}
        <div className="exp-transition">
          <p className="exp-transition-line">Built to be more than playback.</p>
        </div>

        {/* Intro */}
        <div className="exp-intro">
          <h2 className="exp-intro-title">
            <span>This isn’t a playlist library</span>
            <span>It’s a space shaped by sound.</span>
          </h2>
        </div>

        {/* Features */}
        <div className="exp-features">
          {features.map((item, index) => (
            <div
              className="exp-feature-block"
              key={index}
              ref={(el) => (featureRefs.current[index] = el)}
            >
              <div className="exp-feature-content">
                <p className="exp-feature-index">0{index + 1}</p>
                <h3>{item.title}</h3>
                <p>{item.text}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Big Statement */}
        <div className="exp-big-statement">
          <h2 className="exp-big-line">
            Music should match your state —
            <br />
            not interrupt it.
          </h2>
        </div>

        {/* Horizontal MUSIC Scroll */}
        <section className="music-horizontal-section" ref={horizontalRef}>
          <div className="music-horizontal-track" ref={horizontalTrackRef}>
            {["M", "U", "S", "I", "C"].map((letter, i) => (
              <div className="music-letter-panel" key={i}>
                <h2>{letter}</h2>
              </div>
            ))}
          </div>
        </section>

        {/* Transition to Genres */}
        <section className={`genres-playground ${activeGenre || ""}`}>
          <div className="genres-bg-shift"></div>

          <div className="genres-header">
            <p className="genres-kicker">Pick what you want to feel.</p>
            <h2>Every genre moves differently.</h2>
          </div>

          <div className="genres-grid-screen">
            {genres.map((genre, index) => (
              <div
                key={index}
                className={`genre-word ${genre.className}`}
                ref={(el) => (genreRefs.current[index] = el)}
              >
                <div className="genre-word-content">
                  <span className="genre-word-index">0{index + 1}</span>

                  <div
                    className="genre-title-wrap"
                    onMouseMove={(e) => handleGenreHover(e, genre, index)}
                    onMouseLeave={() => {
                      handleGenreLeave();
                      resetGenreBubble(index);
                    }}
                  >
                    <div className="genre-bubble-shape"></div>
                    <h3>{genre.name}</h3>
                  </div>
                  <p>{genre.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </section>
    </>
  );
};

export default Hero;
