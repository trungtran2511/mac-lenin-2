import React, { useState } from "react";
import { Menu, X } from "lucide-react";
import { cn } from "./lib/utils";

export default function App() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { label: "Home", href: "#", active: true },
    { label: "Studio", href: "#" },
    { label: "About", href: "#" },
    { label: "Journal", href: "#" },
    { label: "Reach Us", href: "#" },
  ];

  return (
    <div className="relative min-h-screen flex flex-col justify-between overflow-hidden bg-background select-none">
      {/* Video Background */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none"
      >
        <source
          src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260314_131748_f2ca2a28-fed7-44c8-b9a9-bd9acdd5ec31.mp4"
          type="video/mp4"
        />
      </video>

      {/* Navigation Bar */}
      <header className="relative z-20 w-full">
        <nav className="flex flex-row justify-between items-center px-8 py-6 max-w-7xl mx-auto w-full">
          {/* Logo */}
          <a
            href="#"
            className="text-3xl tracking-tight text-foreground"
            style={{ fontFamily: "'Instrument Serif', serif" }}
          >
            Velorah<sup className="text-xs ml-0.5">®</sup>
          </a>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className={cn(
                  "text-sm font-medium transition-colors duration-300",
                  link.active
                    ? "text-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA Button & Mobile Menu Toggle */}
          <div className="flex items-center gap-4">
            <button className="liquid-glass rounded-full px-6 py-2.5 text-sm text-foreground font-medium transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-lg cursor-pointer">
              Begin Journey
            </button>

            {/* Hamburger Button */}
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="md:hidden p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Toggle menu"
            >
              <Menu className="w-6 h-6" />
            </button>
          </div>
        </nav>
      </header>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 bg-background/95 backdrop-blur-xl flex flex-col justify-between p-8 animate-fade-rise duration-300">
          <div className="flex items-center justify-between">
            <a
              href="#"
              className="text-3xl tracking-tight text-foreground"
              style={{ fontFamily: "'Instrument Serif', serif" }}
              onClick={() => setMobileMenuOpen(false)}
            >
              Velorah<sup className="text-xs ml-0.5">®</sup>
            </a>
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="p-2 text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
              aria-label="Close menu"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="flex flex-col gap-8 text-3xl font-medium tracking-tight py-12">
            {navLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  "transition-colors duration-300",
                  link.active ? "text-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </a>
            ))}
          </div>

          <div className="pb-8">
            <button
              onClick={() => setMobileMenuOpen(false)}
              className="w-full liquid-glass rounded-full py-4 text-center text-foreground font-medium text-lg border border-white/10 hover:scale-[1.02] active:scale-[0.98] transition-transform duration-200 cursor-pointer"
            >
              Begin Journey
            </button>
          </div>
        </div>
      )}

      {/* Hero Section Container */}
      <main className="relative z-10 flex-1 flex flex-col justify-center items-center text-center px-6 pt-32 pb-40 md:py-[90px]">
        {/* Main Heading H1 */}
        <h1
          className="text-5xl sm:text-7xl md:text-8xl leading-[0.95] tracking-[-2.46px] max-w-7xl font-normal text-foreground select-text animate-fade-rise"
          style={{ fontFamily: "'Instrument Serif', serif" }}
        >
          Where{" "}
          <em className="not-italic text-muted-foreground">dreams</em> rise{" "}
          <em className="not-italic text-muted-foreground">through the silence.</em>
        </h1>

        {/* Subtext Description */}
        <p className="text-muted-foreground text-base sm:text-lg max-w-2xl mt-8 leading-relaxed select-text animate-fade-rise-delay">
          We're designing tools for deep thinkers, bold creators, and quiet
          rebels. Amid the chaos, we build digital spaces for sharp focus and
          inspired work.
        </p>

        {/* Main CTA Button */}
        <button className="liquid-glass rounded-full px-14 py-5 text-base text-foreground font-medium mt-12 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] shadow-xl cursor-pointer animate-fade-rise-delay-2">
          Begin Journey
        </button>
      </main>

      {/* Footer (Empty space just to push the hero vertically centered) */}
      <footer className="relative z-10 w-full py-4" />
    </div>
  );
}
