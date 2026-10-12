import { Link } from "@tanstack/react-router";
import { ArrowUpRight } from "lucide-react";
import { useEffect, useRef, useState } from "react";

import { cn } from "@/lib/utils";

// One menu entry. Give it `to` for a page on this site, `href` for an outside
// link, or `onClick` for something that scrolls.
export type MenuItem = {
  label: string;
  to?: "/" | "/work" | "/blog";
  hash?: string;
  href?: string;
  onClick?: () => void;
  cursor?: string;
  current?: boolean;
};

// The floating liquid-glass header: a rounded pill with the name on the left
// and a hamburger on the right (every screen size). The hamburger opens a
// matching glass panel with the menu. Style lives in the `.glass` classes in
// src/styles.css.
export function SiteHeader({
  items,
  tone = "light",
  ready = true,
  onHome,
}: {
  items: MenuItem[];
  tone?: "light" | "dark";
  // The home page hides the header until its intro has played.
  ready?: boolean;
  onHome?: () => void;
}) {
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const dark = tone === "dark";
  const glass = dark ? "glass glass-dark text-white" : "glass text-foreground";

  // Close on Escape, or on a tap/click anywhere outside the header.
  useEffect(() => {
    if (!open) return;
    const away = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const esc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("pointerdown", away);
    window.addEventListener("keydown", esc);
    return () => {
      window.removeEventListener("pointerdown", away);
      window.removeEventListener("keydown", esc);
    };
  }, [open]);

  const row = "flex w-full items-center justify-between rounded-2xl px-4 py-3 text-left font-serif text-3xl leading-none transition-colors";
  const rowHover = dark ? "hover:bg-white/15" : "hover:bg-white/50";

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-3 z-50 flex justify-center px-3 transition-opacity duration-700 sm:top-5",
        ready ? "opacity-100" : "pointer-events-none animate-reveal [animation-delay:2.6s]",
      )}
    >
      <div ref={rootRef} className="relative w-full max-w-[34rem]">
        <div className={cn("flex items-center justify-between rounded-full py-2 pl-6 pr-2", glass)}>
          {onHome ? (
            <button aria-label="Back to introduction" onClick={onHome} className="bg-transparent font-serif text-2xl font-medium sm:text-3xl">
              Shuklaji
            </button>
          ) : (
            <Link to="/" className="font-serif text-2xl font-medium sm:text-3xl">Shuklaji</Link>
          )}
          <button
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className={cn("relative h-11 w-11 rounded-full transition-colors", dark ? "hover:bg-white/15" : "hover:bg-white/50")}
          >
            <span className={cn("absolute left-1/2 top-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full transition-all duration-300", dark ? "bg-white" : "bg-foreground", open ? "rotate-45" : "-translate-y-[4px]")} />
            <span className={cn("absolute left-1/2 top-1/2 h-[2px] w-6 -translate-x-1/2 rounded-full transition-all duration-300", dark ? "bg-white" : "bg-foreground", open ? "-rotate-45" : "translate-y-[3px]")} />
          </button>
        </div>

        <nav
          aria-label="Main navigation"
          aria-hidden={!open}
          className={cn(
            "absolute inset-x-0 top-[calc(100%+0.5rem)] origin-top rounded-[2rem] p-3 transition-all duration-300",
            glass,
            open ? "translate-y-0 scale-100 opacity-100" : "pointer-events-none -translate-y-2 scale-95 opacity-0",
          )}
          style={{ transitionTimingFunction: "cubic-bezier(.34,1.3,.64,1)" }}
        >
          {items.map((item) => {
            const content = (
              <>
                <span className={cn(item.current && "underline underline-offset-8")}>{item.label}</span>
                {item.href && <ArrowUpRight className="h-5 w-5 opacity-60" />}
              </>
            );
            const cls = cn(row, rowHover);
            if (item.to) {
              return <Link key={item.label} to={item.to} {...(item.hash ? { hash: item.hash } : {})} onClick={() => setOpen(false)} className={cls} data-cursor={item.cursor}>{content}</Link>;
            }
            if (item.href) {
              return <a key={item.label} href={item.href} target="_blank" rel="noreferrer" onClick={() => setOpen(false)} className={cls} data-cursor={item.cursor}>{content}</a>;
            }
            return (
              <button key={item.label} onClick={() => { item.onClick?.(); setOpen(false); }} className={cn(cls, "bg-transparent")} data-cursor={item.cursor}>{content}</button>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
