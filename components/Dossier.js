"use client";

import { useEffect, useRef } from "react";
import { DOSSIER_BODY } from "../lib/dossierBody";
import { initDossier } from "../lib/initDossier";

export default function Dossier() {
  const ref = useRef(null);
  const done = useRef(false);

  useEffect(() => {
    if (done.current) return;
    done.current = true;
    try { initDossier(); } catch (e) { console.error("initDossier:", e); }

    // Link extra nella sidebar: preventivo pubblico + logout
    const nav = document.getElementById("nav");
    if (nav && !nav.querySelector(".ec-extra")) {
      const grp = document.createElement("div");
      grp.className = "group ec-extra"; grp.textContent = "Collegamenti";
      const prev = document.createElement("a");
      prev.href = "/preventivo"; prev.className = "ec-extra";
      prev.innerHTML = '<span class="ic">🔗</span> Preventivo a schermo intero';
      const out = document.createElement("a");
      out.href = "/api/logout"; out.className = "ec-extra";
      out.innerHTML = '<span class="ic">🔒</span> Esci';
      nav.appendChild(grp); nav.appendChild(prev); nav.appendChild(out);
    }

    // Menu hamburger + off-canvas su mobile
    const sidebar = document.querySelector(".sidebar");
    const topbar = document.querySelector(".topbar");
    if (topbar && sidebar && !topbar.querySelector(".hamb")) {
      const hamb = document.createElement("button");
      hamb.className = "hamb"; hamb.setAttribute("aria-label", "Apri menu"); hamb.textContent = "☰";
      topbar.insertBefore(hamb, topbar.firstChild);
      const backdrop = document.createElement("div");
      backdrop.className = "backdrop"; document.body.appendChild(backdrop);
      const close = () => { sidebar.classList.remove("open"); backdrop.classList.remove("show"); };
      hamb.addEventListener("click", () => { sidebar.classList.toggle("open"); backdrop.classList.toggle("show"); });
      backdrop.addEventListener("click", close);
      sidebar.querySelectorAll(".nav a").forEach((a) =>
        a.addEventListener("click", () => { if (window.innerWidth <= 900) close(); }));
    }
  }, []);

  return <div ref={ref} dangerouslySetInnerHTML={{ __html: DOSSIER_BODY }} />;
}
