import React, { useEffect, useRef, useState } from "react";
import video1 from "../assets/headphone-1.mp4";
import video2 from "../assets/headphone-2.mp4";
import video3 from "../assets/headphone-3.mp4";
import video4 from "../assets/headphone-4.mp4";
import gsap from "gsap";
import { SplitText } from "gsap/SplitText";
import "./Hero.css";

gsap.registerPlugin(SplitText);

const videos = [video1, video2, video3, video4];

const Hero = () => {
  const [introDone, setIntroDone] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [nextIndex, setNextIndex] = useState(1);
  const [showNext, setShowNext] = useState(false);
  const [nextReady, setNextReady] = useState(false);

  const overlayRef = useRef(null);
  const svgRef = useRef(null);
  const textRef = useRef(null);

  const activeVideoRef = useRef(null);
  const nextVideoRef = useRef(null);

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

  return (
    <div className="home-page">
      {/* Current Video */}
      {/* Active Video */}
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
      {/* Next Video (preloading hidden layer) */}
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
      {/* Main Homepage Content */}
      {/* Visual Overlays */}
      <div className={`hero-overlay ${introDone ? "active" : ""}`}></div>
      <div className={`hero-radial ${introDone ? "active" : ""}`}></div>
      <div
        className={`hero-bottom-gradient ${introDone ? "active" : ""}`}
      ></div>
      {/* Navbar */}
      <nav className={`hero-navbar ${introDone ? "show" : ""}`}>
        <div className="nav-logo">MUSIC</div>

        <div className="nav-links">
          <a href="#explore">Explore</a>
          <a href="#genres">Genres</a>
          <a href="#about">About</a>
          <button className="sound-btn">Sound On</button>
        </div>
      </nav>
      {/* Main Homepage Content */}
      <div className={`home-content ${introDone ? "show" : ""}`}>
        <h1 className="hero-title">
          Not just music.
          <br />A feeling that moves with you.
        </h1>

        <p className="hero-subtitle">
          A curated space for sound, emotion, and motion.
        </p>

        <div className="hero-actions">
          <button className="hero-cta">
            <span className="cta-text cta-default">Explore Collection</span>
            <span className="cta-text cta-hover">Enter Soundscape</span>
          </button>{" "}
        </div>
      </div>
      {/* Scroll Indicator */}
      <div className={`hero-scroll ${introDone ? "show" : ""}`}>
        <span>Scroll to explore</span>
        <div className="scroll-line"></div>
      </div>{" "}
    </div>
  );
};

export default Hero;
