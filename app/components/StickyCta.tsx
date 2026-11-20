"use client";

import { useEffect, useState } from "react";
import { ArrowRight } from "lucide-react";

/** Phones only: a slim "Book a call" bar after the hero, hidden again once the contact form is on screen. */
export default function StickyCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const contact = document.getElementById("contact");
    let contactVisible = false;
    const update = () => setShow(window.scrollY > window.innerHeight * 0.9 && !contactVisible);
    const observer = contact ? new IntersectionObserver(([entry]) => { contactVisible = entry.isIntersecting; update(); }) : null;
    if (contact && observer) observer.observe(contact);
    const first = requestAnimationFrame(update);
    window.addEventListener("scroll", update, { passive: true });
    return () => {
      cancelAnimationFrame(first);
      observer?.disconnect();
      window.removeEventListener("scroll", update);
    };
  }, []);

  return (
    <a className={`sticky-cta${show ? " is-shown" : ""}`} href="#contact" aria-hidden={!show} tabIndex={show ? 0 : -1}>
      Book a 30-minute call <ArrowRight size={17} />
    </a>
  );
}
