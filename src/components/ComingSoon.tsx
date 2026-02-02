'use client'

import React, { useState, useEffect } from 'react';
import { ZapIcon, Brain, Leaf, Lock } from 'lucide-react';

const ComingSoon: React.FC = () => {
  const [email, setEmail] = useState('');
  const [particles, setParticles] = useState<Array<{
    id: number;
    size: number;
    left: number;
    top: number;
    duration: number;
    delay: number;
  }>>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email submission here
    console.log('Email submitted:', email);
  };

  // Generate particle positions only on client side to avoid hydration mismatch
  useEffect(() => {
    setParticles(
      Array.from({ length: 6 }, (_, i) => ({
        id: i,
        size: Math.random() * 4 + 2,
        left: Math.random() * 100,
        top: Math.random() * 100,
        duration: Math.random() * 10 + 10,
        delay: Math.random() * 5,
      }))
    );
  }, []);

  // Set dark background on html/body only for ComingSoon page
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const originalHtmlBg = html.style.background;
    const originalBodyBg = body.style.background;

    html.style.background = '#0a0a0a';
    body.style.background = '#0a0a0a';

    return () => {
      html.style.background = originalHtmlBg;
      body.style.background = originalBodyBg;
    };
  }, []);

  return (
    <div 
      className="coming-soon-page min-h-screen min-h-dvh relative overflow-y-auto"
      style={{
        background: '#0a0a0a',
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        margin: 0,
        padding: 0,
        width: '100vw',
        minHeight: '100dvh',
      }}
    >
      {/* Futuristic glowing background elements */}
      <div 
        className="fixed overflow-hidden pointer-events-none"
          style={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          width: '100vw',
          height: '100dvh',
          zIndex: 0,
        }}
      >
        {/* Base dark background */}
        <div 
          className="absolute"
          style={{
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'linear-gradient(to bottom, #0a0a0a 0%, #0f0f0f 50%, #0a0a0a 100%)',
          }}
        />
        
        {/* Glowing horizontal ring/line - positioned behind form elements */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[2px] md:h-[3px] z-0"
          style={{
            background: 'linear-gradient(90deg, transparent 0%, rgba(34, 211, 238, 0.6) 20%, rgba(16, 185, 129, 0.8) 50%, rgba(34, 211, 238, 0.6) 80%, transparent 100%)',
            boxShadow: '0 0 60px rgba(34, 211, 238, 0.6), 0 0 120px rgba(16, 185, 129, 0.5), 0 0 180px rgba(34, 211, 238, 0.3)',
            animation: 'glowPulse 4s ease-in-out infinite',
          }}
        />
        
        {/* Additional glow layers for depth */}
        <div 
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[100%] h-[300px] md:h-[400px] z-0"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(34, 211, 238, 0.2) 0%, rgba(16, 185, 129, 0.15) 30%, transparent 70%)',
            animation: 'glowPulse 6s ease-in-out infinite',
            animationDelay: '1s',
          }}
        />
        
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.05]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)',
            backgroundSize: '50px 50px',
          }}
        />
        
        {/* Floating particles/glow dots */}
        {particles.map((particle) => (
          <div 
            key={particle.id}
            className="absolute rounded-full"
            style={{
              width: `${particle.size}px`,
              height: `${particle.size}px`,
              left: `${particle.left}%`,
              top: `${particle.top}%`,
              background: 'rgba(34, 211, 238, 0.7)',
              boxShadow: '0 0 15px rgba(34, 211, 238, 0.8), 0 0 30px rgba(34, 211, 238, 0.4)',
              animation: `floatParticle ${particle.duration}s ease-in-out infinite`,
              animationDelay: `${particle.delay}s`,
            }}
          />
        ))}
          </div>

      {/* Main content */}
          <div 
        className="relative z-10 w-full max-w-4xl mx-auto text-center flex flex-col items-center justify-center min-h-screen min-h-dvh py-8"
            style={{
          paddingTop: 'max(env(safe-area-inset-top, 0px), 2rem)',
          paddingBottom: 'max(env(safe-area-inset-bottom, 0px), 2rem)',
          paddingLeft: 'max(env(safe-area-inset-left, 0px), 1rem)',
          paddingRight: 'max(env(safe-area-inset-right, 0px), 1rem)',
        }}
      >
        {/* Logo */}
        <div className="flex justify-center mb-8 md:mb-12">
          <img
            src="/logo1.png"
            alt="reLeafZ Logo"
            className="w-40 h-auto sm:w-56 md:w-64 lg:w-72"
            style={{ 
              filter: 'drop-shadow(0 0 20px rgba(34, 211, 238, 0.3))',
            }}
          />
        </div>

        {/* Main headline */}
        <h1 
          className="text-2xl sm:text-2xl md:text-4xl lg:text-5xl font-bold mb-6 md:mb-8 leading-tight px-4"
          style={{ 
            color: '#ffffff',
            textShadow: '0 0 30px rgba(255, 255, 255, 0.1)',
          }}
        >
          AI-powered strain matching analyzes based on{' '}
          <span style={{ color: '#22d3ee' }}>your medical needs</span>.
        </h1>

        {/* Sub-text */}
        <p 
          className="text-sm sm:text-base md:text-lg mb-8 md:mb-12 text-gray-300 leading-relaxed max-w-2xl mx-auto px-4"
          style={{ 
            color: 'rgba(255, 255, 255, 0.8)',
          }}
        >
          Be among the first to experience our AI-powered strain matching. Waiting list goes live soon.{' '}
          <strong style={{ color: '#22d3ee' }}>Coming Soon</strong>.
        </p>

        {/* Email form - responsive layout */} 
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto px-4 relative z-10">
          {/* Desktop/Tablet: Horizontal layout */}
          <div className="hidden sm:flex items-center gap-4 justify-center">
            <div className="relative flex-1 max-w-md">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address"
                required
                disabled
                className="w-full px-4 py-3 md:py-4 bg-[#1a1a1a] border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all cursor-not-allowed opacity-70 text-center"
                style={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Lock 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6"
                style={{ 
                  color: '#22d3ee',
                  filter: 'drop-shadow(0 0 12px rgba(34, 211, 238, 0.8))',
                  pointerEvents: 'none',
                }}
              />
            </div>
            <button
              type="submit"
              disabled
              className="px-6 md:px-8 py-3 md:py-4 bg-transparent border border-white/20 rounded-lg text-white font-medium hover:border-[#22d3ee] hover:text-[#22d3ee] transition-all whitespace-nowrap cursor-not-allowed opacity-70"
                  style={{
                backdropFilter: 'blur(10px)',
                  }}
                >
              Get Notified
            </button>
                </div>

          {/* Mobile: Vertical layout */}
          <div className="flex flex-col gap-4 sm:hidden">
            <div className="relative w-full">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address"
                required
                disabled
                className="w-full px-4 py-4 bg-[#1a1a1a] border border-white/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-[#22d3ee] focus:ring-1 focus:ring-[#22d3ee] transition-all cursor-not-allowed opacity-70 text-center"
                style={{
                  background: 'rgba(26, 26, 26, 0.8)',
                  backdropFilter: 'blur(10px)',
                }}
              />
              <Lock 
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-6 h-6"
                style={{ 
                  color: '#22d3ee',
                  filter: 'drop-shadow(0 0 12px rgba(34, 211, 238, 0.8))',
                  pointerEvents: 'none',
                }}
              />
            </div>
            <button
              type="submit"
              disabled
              className="w-full px-6 py-4 bg-transparent border border-white/20 rounded-lg text-white font-medium hover:border-[#22d3ee] hover:text-[#22d3ee] transition-all cursor-not-allowed opacity-70"
              style={{
                backdropFilter: 'blur(10px)',
              }}
            >
              Get Notified
            </button>
          </div>
        </form>

        {/* Features grid - 3 icons */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 md:gap-8 mt-12 md:mt-16 max-w-2xl mx-auto px-4">
          {/* Feature 1 - Fast Delivery */}
          <div className="text-center transition-all duration-300 hover:scale-105">
            <div className="flex justify-center mb-4">
              <ZapIcon 
                className="w-10 h-10 md:w-12 md:h-12" 
                style={{ 
                  color: '#22d3ee',
                  filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.6))',
                }} 
              />
        </div>
            <h3 
              className="text-sm md:text-base font-semibold mb-2"
              style={{ color: '#ffffff' }}
            >
              FAST DELIVERY
            </h3>
            <p 
              className="text-xs md:text-sm font-light"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Ultra quick service
            </p>
          </div>

          {/* Feature 2 - AI Strain Matching */}
          <div className="text-center transition-all duration-300 hover:scale-105">
            <div className="flex justify-center mb-4">
              <Brain 
                className="w-10 h-10 md:w-12 md:h-12" 
                style={{ 
                  color: '#10b981',
                  filter: 'drop-shadow(0 0 10px rgba(16, 185, 129, 0.6))',
                }} 
              />
            </div>
            <h3 
              className="text-sm md:text-base font-semibold mb-2"
              style={{ color: '#ffffff' }}
            >
              AI STRAIN MATCHING
            </h3>
            <p 
              className="text-xs md:text-sm font-light"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Personalized recommendations
            </p>
          </div>

          {/* Feature 3 - Medical Cannabis */}
          <div className="text-center transition-all duration-300 hover:scale-105">
            <div className="flex justify-center mb-4">
              <Leaf 
                className="w-10 h-10 md:w-12 md:h-12" 
                style={{ 
                  color: '#22d3ee',
                  filter: 'drop-shadow(0 0 10px rgba(34, 211, 238, 0.6))',
                }} 
              />
            </div>
            <h3 
              className="text-sm md:text-base font-semibold mb-2"
              style={{ color: '#ffffff' }}
            >
              MEDICAL CANNABIS
            </h3>
            <p 
              className="text-xs md:text-sm font-light"
              style={{ color: 'rgba(255, 255, 255, 0.7)' }}
            >
              Premium quality
            </p>
          </div>
        </div>
      </div>

    </div>
  );
};

export default ComingSoon;