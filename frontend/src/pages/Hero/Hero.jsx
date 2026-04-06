import React, { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import usePlayer from "../../hooks/usePlayer";

import "./HeroExperience.css";
import "./Hero.css";

import video1 from "../../assets/headphone-1.mp4";
import video2 from "../../assets/headphone-2.mp4";
import video3 from "../../assets/headphone-3.mp4";
import video4 from "../../assets/headphone-4.mp4";

import chillPreview from "../../assets/genres/chill.mp3";
import hiphopPreview from "../../assets/genres/hiphop.mp3";
import classicalPreview from "../../assets/genres/classical.mp3";
import edmPreview from "../../assets/genres/edm.mp3";
import lofiPreview from "../../assets/genres/lofi.mp3";
import indiePreview from "../../assets/genres/indie.mp3";
import main from "../../assets/genres/main.mp3";
import { Link } from "react-router-dom";

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
  const { pauseSong } = usePlayer();

  // Stop the global player to prevent clashing with Hero ambient sounds
  useEffect(() => {
    if (pauseSong) pauseSong();
  }, [pauseSong]);

  const [introDone, setIntroDone] = useState(false);
  const [videoLoaded, setVideoLoaded] = useState(false);
  const [activePlayer, setActivePlayer] = useState(0); // 0 = A, 1 = B
  const [videoAIndex, setVideoAIndex] = useState(0);
  const [videoBIndex, setVideoBIndex] = useState(1);
  const [audioUnlocked, setAudioUnlocked] = useState(false);
  const [isSoundOn, setIsSoundOn] = useState(true);
  const isSoundOnRef = useRef(isSoundOn);
  
  // Sync state to ref for GSAP closures
  useEffect(() => {
    isSoundOnRef.current = isSoundOn;
  }, [isSoundOn]);

  const overlayRef = useRef(null);
  const svgRef = useRef(null);
  const textRef = useRef(null);
  const activeVideoRef = useRef(null);
  const nextVideoRef = useRef(null);
  const sectionRef = useRef(null);
  const horizontalRef = useRef(null);
  const horizontalTrackRef = useRef(null);
  const featureRefs = useRef([]);
  const [activeGenre, setActiveGenre] = useState(null);
  const genreAudioRef = useRef(null);
  const hoverTimeoutRef = useRef(null);
  const genreRefs = useRef([]);
  const bgMusicRef = useRef(null);

  // Ensure page starts at the absolute top on every refresh
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo(0, 0);
  }, []);

  // Check if video is already loaded
  useEffect(() => {
    if (activeVideoRef.current && activeVideoRef.current.readyState >= 3) {
      setVideoLoaded(true);
    }
  }, []);

  // Intro Mask
  useEffect(() => {
    document.body.style.overflow = "hidden";
    
    if (textRef.current && !videoLoaded) {
      gsap.set(textRef.current, { opacity: 0, filter: "blur(10px)" });
    }

    if (!videoLoaded) return;

    const tl = gsap.timeline({
      onComplete: () => {
        setIntroDone(true);
        document.body.style.overflow = "auto";
      },
    });

    tl.fromTo(
      textRef.current,
      { opacity: 0, filter: "blur(10px)" },
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
      .to(overlayRef.current, { display: "none", pointerEvents: "none" });

    return () => {
      document.body.style.overflow = "auto";
    };
  }, [videoLoaded]);
  // Video switching logic (smooth ping-pong fade)
  useEffect(() => {
    const interval = setInterval(() => {
      setActivePlayer((p) => (p === 0 ? 1 : 0));
    }, 4500);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    // PRE-LOAD NEXT VIDEO in background after fade animation completes
    const timeout = setTimeout(() => {
      if (activePlayer === 0) {
        setVideoBIndex((prev) => (videoAIndex + 1) % videos.length);
      } else {
        setVideoAIndex((prev) => (videoBIndex + 1) % videos.length);
      }
    }, 1200);

    return () => clearTimeout(timeout);
  }, [activePlayer, videoAIndex, videoBIndex]);

  // GSAP Scroll Animations
  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.from(".exp-transition-line", {
        opacity: 0,
        y: 40,
        duration: 1.2,
        ease: "power3.out",
        scrollTrigger: { trigger: ".exp-transition-line", start: "top 85%" },
      });
      gsap.from(".exp-intro-title span", {
        opacity: 0,
        y: 100,
        stagger: 0.12,
        duration: 1.3,
        ease: "power4.out",
        scrollTrigger: { trigger: ".exp-intro", start: "top 75%" },
      });

      featureRefs.current.forEach((el) => {
        if (!el) return;
        gsap.fromTo(
          el,
          { opacity: 0.25, y: 80, scale: 0.96 },
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

      gsap.from(".exp-big-line", {
        opacity: 0,
        y: 80,
        duration: 1.3,
        ease: "power4.out",
        scrollTrigger: { trigger: ".exp-big-statement", start: "top 75%" },
      });

      // Horizontal Scroll
      const track = horizontalTrackRef.current;
      const section = horizontalRef.current;
      if (track && section) {
        const scrollAmount = Math.max(track.scrollWidth - window.innerWidth, 0);
        gsap.to(track, {
          x: -scrollAmount,
          ease: "power1.out",
          scrollTrigger: {
            trigger: section,
            start: "top top",
            end: () => `+=${scrollAmount * 0.45}`,
            scrub: 0.8,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }

      // Audio ScrollTrigger
      ScrollTrigger.create({
        trigger: ".music-horizontal-section",
        start: "top center",
        onEnter: () => {
          if (bgMusicRef.current) {
            bgMusicRef.current.pause();
          }
        },
        onLeaveBack: () => {
          if (bgMusicRef.current && isSoundOnRef.current) {
            bgMusicRef.current.play().catch(() => {});
          }
        }
      });
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  // Start Background Music when user taps
  const unlockAudio = () => {
    setAudioUnlocked(true);
    setIsSoundOn(true);
    // Start ambient background music
    if (!bgMusicRef.current) {
      // TODO: ADD YOUR MAIN BACKGROUND MUSIC HERE!
      // Replace 'chillPreview' with your imported main audio file (e.g. 'mainThemeAudio')
      const bgMusic = new Audio(main); 
      bgMusic.loop = true;
      bgMusic.volume = 0.4;
      bgMusicRef.current = bgMusic;
    }
    bgMusicRef.current.play().catch((err) => console.log("Audio play failed:"));
  };

  const toggleGlobalSound = () => {
    if (!audioUnlocked) {
      unlockAudio();
      return;
    }
    if (isSoundOn) {
      if (bgMusicRef.current) bgMusicRef.current.pause();
      setIsSoundOn(false);
    } else {
      if (bgMusicRef.current) bgMusicRef.current.play().catch(() => {});
      setIsSoundOn(true);
    }
  };

  // Genre Handlers (Improved Magnetic Bubble)
  const handleGenreEnter = (genre) => {
    if (!audioUnlocked) return;
    setActiveGenre(genre.className);

    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);

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
    }, 280);
  };

  const handleGenreLeave = () => {
    setActiveGenre(null);
    if (hoverTimeoutRef.current) clearTimeout(hoverTimeoutRef.current);
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
    const dx = e.clientX - centerX;
    const dy = e.clientY - centerY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    const moveX = Math.max(Math.min(dx * 0.08, 18), -18);
    const moveY = Math.max(Math.min(dy * 0.08, 14), -14);
    const stretch = Math.min(distance / 90, 0.55);

    const scaleX =
      1 + (Math.abs(dx) / (Math.abs(dx) + Math.abs(dy) + 1)) * stretch;
    const scaleY =
      1 + (Math.abs(dy) / (Math.abs(dx) + Math.abs(dy) + 1)) * stretch;

    gsap.to(bubble, {
      x: moveX,
      y: moveY,
      scaleX,
      scaleY: scaleY * 0.72,
      duration: 0.16,
      ease: "power3.out",
    });
    gsap.to(titleWrap, {
      x: moveX * 0.1,
      y: moveY * 0.1,
      duration: 0.16,
      ease: "power3.out",
    });
  };

  const handleGenreHover = (e, genre, index) => {
    const item = genreRefs.current[index];
    if (!item) return;
    const titleWrap = item.querySelector(".genre-title-wrap");
    if (!titleWrap) return;

    const rect = titleWrap.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = e.clientX - cx;
    const dy = e.clientY - cy;
    const dist = Math.sqrt(dx * dx + dy * dy);

    if (dist < 95) {
      if (activeGenre !== genre.className) handleGenreEnter(genre);
      handleGenreMove(e, index);
    } else if (activeGenre === genre.className) {
      handleGenreLeave();
      resetGenreBubble(index);
    }
  };

  const resetGenreBubble = (index) => {
    const item = genreRefs.current[index];
    if (!item) return;
    const bubble = item.querySelector(".genre-bubble-shape");
    const titleWrap = item.querySelector(".genre-title-wrap");

    if (bubble)
      gsap.to(bubble, {
        x: 0,
        y: 0,
        scaleX: 1,
        scaleY: 1,
        duration: 0.65,
        ease: "elastic.out(1, 0.35)",
      });
    if (titleWrap)
      gsap.to(titleWrap, { x: 0, y: 0, duration: 0.5, ease: "power3.out" });
  };

  return (
    <>
      <section className="hero-wrapper">
        <div className={`hero-media ${introDone ? "framed" : ""}`}>
          <video
            ref={activeVideoRef}
            className={`bg-video`}
            style={{ opacity: activePlayer === 0 ? 1 : 0 }}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            src={videos[videoAIndex]}
            onCanPlay={() => setVideoLoaded(true)}
            onLoadedData={() => setVideoLoaded(true)}
          />
          <video
            ref={nextVideoRef}
            className={`bg-video`}
            style={{ opacity: activePlayer === 1 ? 1 : 0 }}
            autoPlay
            muted
            loop
            playsInline
            preload="auto"
            src={videos[videoBIndex]}
          />

          <div className={`hero-overlay ${introDone ? "active" : ""}`}></div>
          <div className={`hero-radial ${introDone ? "active" : ""}`}></div>
          <div
            className={`hero-bottom-gradient ${introDone ? "active" : ""}`}
          ></div>

        </div>

        {/* Full Screen Unlock Overlay */}
        {!audioUnlocked && introDone && (
          <button className="fullscreen-unlock-overlay" onClick={unlockAudio}>
            <div className="unlock-content">
              <p>Tap to unlock sound</p>
              <span>Click anywhere to start the immersive experience</span>
            </div>
          </button>
        )}

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

        <nav className={`hero-navbar ${introDone ? "show" : ""}`}>
          <button className="nav-logo">
            <span>MUSIC</span>
          </button>
          <div className="nav-links">
            {/* <a href="#explore">Explore</a> */}
            <a href="#genres">Genres</a>
            <a href="#about">About</a>
            <button className={`sound-btn ${isSoundOn && audioUnlocked ? "sound-active" : ""}`} onClick={toggleGlobalSound}>
              {isSoundOn && audioUnlocked ? "Sound On" : "Sound Off"}
            </button>
          </div>
        </nav>

        <div className={`home-content ${introDone ? "show" : ""}`}>
          <h1 className="hero-title">
            <span className="line-one">Not just music.</span>
            <span className="line-two">A feeling that moves with you.</span>
          </h1>
        </div>

        <div className={`hero-frame ${introDone ? "show" : ""}`}>
          <Link
            to="/explore"
            className="hero-cta"
            onClick={() => {
              if (bgMusicRef.current) {
                bgMusicRef.current?.pause();
                bgMusicRef.current.currentTime = 0;
              }
            }}
          >
            <span className="cta-text cta-default">Explore Collection</span>
            <span className="cta-text cta-hover">Enter Soundscape</span>
          </Link>
          <div className="frame-meta">
            <span className="scroll-text">Scroll to Explore</span>
            <div className="scroll-line"></div>
          </div>
        </div>
      </section>

      <section className="experience-wrapper" ref={sectionRef} id="about">
        <div className="exp-transition" id="explore">
          <p className="exp-transition-line">Built to be more than playback.</p>
        </div>

        <div className="exp-intro" id="explore">
          <h2 className="exp-intro-title">
            <span>This isn’t a playlist library</span>
            <span>It’s a space shaped by sound.</span>
          </h2>
        </div>

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

        <div className="exp-big-statement">
          <h2 className="exp-big-line">
            Music should match your state<br />
            not interrupt it.
          </h2>
        </div>

        <section className="music-horizontal-section" ref={horizontalRef}>
          <div className="music-horizontal-track" ref={horizontalTrackRef}>
            {["M", "U", "S", "I", "C"].map((letter, i) => (
              <div className="music-letter-panel" key={i}>
                <h2>{letter}</h2>
              </div>
            ))}
          </div>
        </section>

        <section
          className={`genres-playground ${activeGenre || ""}`}
          id="genres"
        >
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

      <footer className="hero-attribution">
        <p>
          Background audio tracks are sourced from <strong>Pixabay</strong>. 
          Imagery and assets are inspired by <strong>Colour Splash</strong> constraints.
          <br />
          All rights reserved to the respective owners.
          <br />
          This is just a project and not a real music streaming platform.
        </p>
      </footer>
    </>
  );
};

export default Hero;
