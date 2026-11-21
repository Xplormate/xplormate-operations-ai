"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";
import { track } from "@vercel/analytics";

/** Phones only: a slim "Book a call" bar after the hero, hidden from the contact form down. */
export default function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    // Show after the hero, and stay hidden once the contact form comes into view (and below it).
    const update = () => {
      const top = contact?.getBoundingClientRect().top;
      setShow(window.scrollY > window.innerHeight * 0.9 && (top === undefined || top > window.innerHeight));
    };
    const first = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    window.addEventListener("resize", update);
    return () => {
      cancelAnimationFrame(first);
      window.removeEventListener("scroll", update);
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <a className={`sticky-cta${show ? " is-shown" : ""}`} href="#contact" aria-hidden={!show} tabIndex={show ? 0 : -1} onClick={() => track("cta_click", { location: "phone_bar" })}>
      Book a 30-minute call <ArrowRight size={17} />
    </a>
  );
}
