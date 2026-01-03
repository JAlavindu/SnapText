import React from "react";
import { createRoot } from "react-dom/client";
import OverlayApp from "./OverlayApp";
import "./overlay.css";

let rootEl: HTMLElement | null = null;

export function mountOverlay(imageUrl: string) {
  if (rootEl) return;

  rootEl = document.createElement("div");
  const shadow = rootEl.attachShadow({ mode: "open" });
  document.body.appendChild(rootEl);

  const container = document.createElement("div");
  shadow.appendChild(container);

  createRoot(container).render(
    <OverlayApp imageUrl={imageUrl} onClose={unmount} />
  );
}

function unmount() {
  rootEl?.remove();
  rootEl = null;
}
