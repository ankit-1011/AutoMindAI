import React from 'react';
import {
  Sparkles,
  ArrowRight,
  Shield,
  Brain,
  Zap,
  Link2,
  Car,
  TrendingUp,
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

interface HeroProps {
  onGetStarted: () => void;
}

const gridCells = [
  {
    icon: Shield,
    label: 'Blockchain',
    sub: 'Secured NFT',
    gradient: 'from-violet-500/10 to-violet-500/5',
    iconColor: 'text-violet-600',
    delay: 'animation-delay-200',
  },
  {
    icon: Brain,
    label: 'AI Engine',
    sub: 'Smart Insights',
    gradient: 'from-cyan-500/10 to-cyan-500/5',
    iconColor: 'text-cyan-600',
    delay: 'animation-delay-400',
  },
  {
    icon: Link2,
    label: 'Instant',
    sub: 'Transfers',
    gradient: 'from-emerald-500/10 to-emerald-500/5',
    iconColor: 'text-emerald-600',
    delay: 'animation-delay-600',
  },
  {
    icon: Car,
    label: 'Vehicle',
    sub: 'Registry',
    gradient: 'from-purple-500/10 to-purple-500/5',
    iconColor: 'text-purple-600',
    delay: 'animation-delay-800',
  },
];

function Hero({ onGetStarted }: HeroProps) {
  const { t } = useLanguage();

  const scrollToFAQ = () => {
    document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="relative overflow-hidden">
      {/* Animated grid background */}
      <div className="hero-grid-bg" aria-hidden="true">
        <div className="hero-grid-lines" />
        <div className="hero-grid-glow hero-grid-glow-1" />
        <div className="hero-grid-glow hero-grid-glow-2" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-24">
        {/* Bento Grid Layout */}
        <div className="hero-bento-grid">

          {/* Main content cell */}
          <div className="hero-cell hero-cell-main animate-fadeInUp">
            <div className="automind-badge">
              <Sparkles className="w-4 h-4 animate-pulseSoft" />
              {t('home.badge')}
            </div>

            <h1 className="cyber-hero-title mt-6">
              <span className="block text-slate-900">{t('home.title1')}</span>
              <span className="block cyber-text-glow mt-2">{t('home.title2')}</span>
            </h1>

            <p className="mt-5 text-lg text-slate-500 leading-relaxed max-w-lg">
              {t('home.subtitle')}
            </p>

            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <button onClick={onGetStarted} className="cyber-btn-hero group">
                <Sparkles className="w-5 h-5 mr-2 group-hover:animate-bounceSoft" />
                {t('home.getStarted')}
              </button>
              <button className="cyber-btn-secondary" onClick={scrollToFAQ}>
                {t('home.learnMore')}
                <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
              </button>
            </div>
          </div>

          {/* Stats row */}
          <div className="hero-cell hero-cell-stat animate-fadeInUp animation-delay-200">
            <div className="hero-stat-icon bg-violet-100">
              <Shield className="w-5 h-5 text-violet-600" />
            </div>
            <div className="automind-stat-value">{t('home.stat1.value')}</div>
            <div className="automind-stat-label">{t('home.stat1.label')}</div>
          </div>

          <div className="hero-cell hero-cell-stat animate-fadeInUp animation-delay-400">
            <div className="hero-stat-icon bg-cyan-100">
              <Brain className="w-5 h-5 text-cyan-600" />
            </div>
            <div className="automind-stat-value">{t('home.stat2.value')}</div>
            <div className="automind-stat-label">{t('home.stat2.label')}</div>
          </div>

          <div className="hero-cell hero-cell-stat animate-fadeInUp animation-delay-600">
            <div className="hero-stat-icon bg-emerald-100">
              <Zap className="w-5 h-5 text-emerald-600" />
            </div>
            <div className="automind-stat-value">{t('home.stat3.value')}</div>
            <div className="automind-stat-label">{t('home.stat3.label')}</div>
          </div>

          {/* Feature grid cells */}
          {gridCells.map((cell) => (
            <div
              key={cell.label}
              className={`hero-cell hero-cell-feature bg-gradient-to-br ${cell.gradient} animate-fadeInUp ${cell.delay}`}
            >
              <div className={`hero-feature-icon ${cell.iconColor}`}>
                <cell.icon className="w-6 h-6" />
              </div>
              <p className="font-semibold text-slate-800 mt-3">{cell.label}</p>
              <p className="text-sm text-slate-500">{cell.sub}</p>
              <div className="hero-cell-dot" />
            </div>
          ))}

          {/* Wide bottom banner cell */}
          <div className="hero-cell hero-cell-banner animate-fadeInUp animation-delay-1000">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center animate-pulseSoft">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-slate-800">Trusted Vehicle Intelligence</p>
                  <p className="text-sm text-slate-500">NFT ownership · AI resale · Service history</p>
                </div>
              </div>
              <div className="flex gap-6">
                {['NFT Mint', 'Transfer', 'AI Chat'].map((tag) => (
                  <span key={tag} className="hero-tag">{tag}</span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;
