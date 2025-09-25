import React from "react";

interface HeroProps {
  onGetStarted: () => void;
}

export default function Hero({ onGetStarted }: HeroProps) {
  return (
    <section className="cyber-hero">
      <h1 className="cyber-hero-title">Revolutionizing Vehicle Ownership</h1>
      <p className="cyber-hero-subtitle">
        Secure. Transparent. Powered by Blockchain.
      </p>
      <div className="flex justify-center space-x-6 mt-8">
        <button onClick={onGetStarted} className="cyber-btn-primary">Get Started</button>
        <button className="cyber-btn-secondary">Learn More</button>
      </div>
    </section>
  );
}
