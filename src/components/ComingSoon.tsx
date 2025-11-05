'use client'

import React from 'react';
import { Brain, Clock, ZapIcon, Leaf, Sparkles } from 'lucide-react';

const ComingSoon: React.FC = () => {
  return (
    <div 
      className="min-h-screen min-h-dvh flex flex-col items-center justify-start p-4 sm:p-8 relative overflow-x-hidden"
      style={{
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)'
      }}
    >
      {/* Beautiful organic gradient background - aesthetic and smooth */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none" style={{ minHeight: '100dvh' }}>
        {/* Base color - soft cream/green foundation */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'linear-gradient(135deg, #f0f4e8 0%, #e8f0e0 50%, #e0ece8 100%)'
          }}
        />
        
        {/* Main organic gradient - smooth multi-directional color transitions */}
        <div 
          className="absolute inset-0"
          style={{
            background: 'radial-gradient(ellipse 120% 100% at 0% 0%, rgba(251, 191, 36, 0.35) 0%, transparent 55%), radial-gradient(ellipse 100% 120% at 100% 0%, rgba(34, 197, 94, 0.3) 0%, transparent 55%), radial-gradient(ellipse 110% 80% at 20% 50%, rgba(2, 120, 82, 0.25) 0%, transparent 50%), radial-gradient(ellipse 90% 110% at 80% 60%, rgba(6, 182, 212, 0.2) 0%, transparent 55%), radial-gradient(ellipse 80% 100% at 50% 100%, rgba(14, 165, 233, 0.25) 0%, transparent 50%)',
            backgroundSize: '100% 100%',
            animation: 'gradientShift 30s ease infinite'
          }}
        />
        
        {/* Secondary organic layer - adds depth and flow */}
        <div 
          className="absolute inset-0 opacity-75"
          style={{
            background: 'radial-gradient(circle at 15% 25%, rgba(251, 191, 36, 0.15) 0%, transparent 45%), radial-gradient(circle at 85% 35%, rgba(34, 197, 94, 0.2) 0%, transparent 45%), radial-gradient(circle at 45% 70%, rgba(6, 182, 212, 0.15) 0%, transparent 40%), radial-gradient(circle at 75% 80%, rgba(14, 165, 233, 0.15) 0%, transparent 45%), radial-gradient(circle at 30% 85%, rgba(20, 184, 166, 0.12) 0%, transparent 40%)',
            animation: 'meshMove 35s ease-in-out infinite'
          }}
        />
        
        {/* Flowing color layer - smooth transitions */}
        <div 
          className="absolute inset-0 opacity-55"
          style={{
            background: 'linear-gradient(135deg, rgba(251, 191, 36, 0.12) 0%, rgba(34, 197, 94, 0.1) 25%, rgba(2, 120, 82, 0.08) 50%, rgba(6, 182, 212, 0.1) 75%, rgba(14, 165, 233, 0.12) 100%)',
            backgroundSize: '400% 400%',
            animation: 'colorFlow 25s ease infinite'
          }}
        />
        
        {/* Additional depth layer - subtle accents */}
        <div 
          className="absolute inset-0 opacity-45"
          style={{
            background: 'radial-gradient(ellipse at top left, rgba(251, 191, 36, 0.08) 0%, transparent 65%), radial-gradient(ellipse at bottom right, rgba(14, 165, 233, 0.1) 0%, transparent 65%), radial-gradient(ellipse at center, rgba(34, 197, 94, 0.06) 0%, transparent 50%)',
            animation: 'meshMoveReverse 40s ease-in-out infinite'
          }}
        />
        
        {/* Falling cannabis leaves animation */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Leaf 1 */}
          <div 
            className="absolute"
            style={{
              left: '10%',
              top: '-100px',
              animation: 'fallLeaf 8s linear infinite',
              animationDelay: '0s',
              color: 'rgba(16, 185, 129, 0.4)'
            }}
          >
            <Leaf className="w-8 h-8" style={{ transform: 'rotate(-15deg)' }} />
          </div>
          {/* Leaf 2 */}
          <div 
            className="absolute"
            style={{
              left: '25%',
              top: '-100px',
              animation: 'fallLeaf 10s linear infinite',
              animationDelay: '1.5s',
              color: 'rgba(2, 120, 82, 0.35)'
            }}
          >
            <Leaf className="w-6 h-6" style={{ transform: 'rotate(20deg)' }} />
          </div>
          {/* Leaf 3 */}
          <div 
            className="absolute"
            style={{
              left: '45%',
              top: '-100px',
              animation: 'fallLeaf 12s linear infinite',
              animationDelay: '3s',
              color: 'rgba(16, 185, 129, 0.4)'
            }}
          >
            <Leaf className="w-7 h-7" style={{ transform: 'rotate(-25deg)' }} />
          </div>
          {/* Leaf 4 */}
          <div 
            className="absolute"
            style={{
              left: '65%',
              top: '-100px',
              animation: 'fallLeaf 9s linear infinite',
              animationDelay: '5s',
              color: 'rgba(34, 197, 94, 0.35)'
            }}
          >
            <Leaf className="w-6 h-6" style={{ transform: 'rotate(15deg)' }} />
          </div>
          {/* Leaf 5 */}
          <div 
            className="absolute"
            style={{
              left: '80%',
              top: '-100px',
              animation: 'fallLeaf 11s linear infinite',
              animationDelay: '2s',
              color: 'rgba(16, 185, 129, 0.4)'
            }}
          >
            <Leaf className="w-8 h-8" style={{ transform: 'rotate(-20deg)' }} />
          </div>
          {/* Leaf 6 */}
          <div 
            className="absolute"
            style={{
              left: '15%',
              top: '-100px',
              animation: 'fallLeaf 13s linear infinite',
              animationDelay: '4s',
              color: 'rgba(2, 120, 82, 0.3)'
            }}
          >
            <Leaf className="w-5 h-5" style={{ transform: 'rotate(25deg)' }} />
          </div>
          {/* Leaf 7 */}
          <div 
            className="absolute"
            style={{
              left: '55%',
              top: '-100px',
              animation: 'fallLeaf 10.5s linear infinite',
              animationDelay: '6.5s',
              color: 'rgba(20, 184, 166, 0.35)'
            }}
          >
            <Leaf className="w-7 h-7" style={{ transform: 'rotate(-18deg)' }} />
          </div>
          {/* Leaf 8 */}
          <div 
            className="absolute"
            style={{
              left: '35%',
              top: '-100px',
              animation: 'fallLeaf 11.5s linear infinite',
              animationDelay: '7.5s',
              color: 'rgba(16, 185, 129, 0.3)'
            }}
          >
            <Leaf className="w-6 h-6" style={{ transform: 'rotate(22deg)' }} />
          </div>
          {/* Leaf 9 */}
          <div 
            className="absolute"
            style={{
              left: '72%',
              top: '-100px',
              animation: 'fallLeaf 9.5s linear infinite',
              animationDelay: '4.5s',
              color: 'rgba(34, 197, 94, 0.4)'
            }}
          >
            <Leaf className="w-8 h-8" style={{ transform: 'rotate(-22deg)' }} />
          </div>
          {/* Leaf 10 */}
          <div 
            className="absolute"
            style={{
              left: '88%',
              top: '-100px',
              animation: 'fallLeaf 12.5s linear infinite',
              animationDelay: '8s',
              color: 'rgba(2, 120, 82, 0.35)'
            }}
          >
            <Leaf className="w-6 h-6" style={{ transform: 'rotate(18deg)' }} />
          </div>
        </div>
      </div>

      {/* Main content - no card wrapper */}
      <div className="relative z-10 max-w-2xl w-full animate-fade-in px-4 sm:px-8 py-8 sm:py-12">
        {/* Logo - Made smaller */}
        <div className="flex justify-center mb-8 mt-4 sm:mt-0">
          <img
            src="/logo1.png"
            alt="ReLeafZ Logo"
            className="w-48 sm:w-56 h-auto"
            style={{ filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.2))' }}
          />
        </div>

        {/* Badge */}
        <div className="flex justify-center mb-8">
          <div className="animated-border-box inline-flex items-center rounded-full">
            <div className="inline-flex items-center px-5 py-2.5 rounded-full" style={{ background: 'transparent', display: 'inline-flex' }}>
              <Sparkles className="w-4 h-4 mr-2 animate-pulse" style={{ 
                background: 'linear-gradient(135deg, #059669, #10b981)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: '#059669',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
              }} />
              <span 
                className="text-sm font-semibold tracking-wide"
                style={{ color: '#1f2937', textShadow: '0 1px 2px rgba(255,255,255,0.8)' }}
              >
                SOON
              </span>
            </div>
          </div>
        </div>

        {/* Subheading */}
        <p 
          className="text-base sm:text-lg mb-10 text-center leading-relaxed font-light max-w-xl mx-auto"
          style={{ color: '#1f2937', textShadow: '0 2px 8px rgba(255,255,255,0.8)' }}
        >
          AI-powered strain matching analyzes your medical questionnaire to recommend personalized cannabis strains.
        </p>

        {/* Early Access Announcement - Transparent with simple border */}
        <div className="mb-10 rounded-2xl max-w-2xl mx-auto" style={{ border: '1px solid rgba(0, 0, 0, 0.1)' }}>
          <div className="rounded-2xl p-6" style={{ background: 'transparent' }}>
            <div className="flex items-start gap-4">
              <Sparkles className="w-8 h-8 flex-shrink-0 mt-1" style={{ 
                background: 'linear-gradient(135deg, #059669, #10b981)',
                WebkitBackgroundClip: 'text',
                backgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                color: '#059669',
                filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.15))'
              }} />
              <div className="flex-1 pt-0.5">
                <h3 
                  className="text-base sm:text-lg font-semibold mb-2"
                  style={{ color: '#1f2937', textShadow: '0 1px 3px rgba(255,255,255,0.8)' }}
                >
                  Join the Waiting List
                </h3>
                <p 
                  className="text-sm sm:text-base leading-relaxed mb-3 font-light"
                  style={{ color: '#374151', textShadow: '0 1px 2px rgba(255,255,255,0.7)' }}
                >
                  Be among the first to experience our AI-powered strain matching. Waiting list goes live <strong style={{ color: '#027852' }}>Saturday 12:00</strong>. First 30 registrations receive <strong style={{ color: '#027852' }}>free prescription</strong> instead of €14.99.
                </p>
                <div 
                  className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg backdrop-blur-sm"
                  style={{
                    background: 'rgba(255, 255, 255, 0.15)',
                    color: '#027852',
                    border: '1px solid rgba(2, 120, 82, 0.2)'
                  }}
                >
                  <Clock className="w-3.5 h-3.5" style={{ color: '#027852', filter: 'drop-shadow(0 1px 2px rgba(0,0,0,0.1))' }} />
                  <span>Limited spots available</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-10 max-w-2xl mx-auto">
          {/* Feature 1 - Flash/ZapIcon */}
          <div className="text-center transition-all duration-300">
            <ZapIcon className="w-10 h-10 mb-4 mx-auto" style={{ 
              background: 'linear-gradient(135deg, #059669, #0891b2)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: '#059669',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))'
            }} />
            <h3 
              className="text-sm font-semibold mb-2"
              style={{ color: '#1f2937', textShadow: '0 1px 4px rgba(255,255,255,0.8)' }}
            >
              FAST DELIVERY
            </h3>
            <p 
              className="text-xs font-light"
              style={{ color: '#374151', textShadow: '0 1px 3px rgba(255,255,255,0.7)' }}
            >
              Ultra quick service
            </p>
          </div>

          {/* Feature 2 - Brain */}
          <div className="text-center transition-all duration-300">
            <Brain className="w-10 h-10 mb-4 mx-auto" style={{ 
              color: '#7c3aed',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))'
            }} />
            <h3 
              className="text-sm font-semibold mb-2"
              style={{ color: '#1f2937', textShadow: '0 1px 4px rgba(255,255,255,0.8)' }}
            >
              AI STRAIN MATCHING
            </h3>
            <p 
              className="text-xs font-light"
              style={{ color: '#374151', textShadow: '0 1px 3px rgba(255,255,255,0.7)' }}
            >
              Personalized recommendations
            </p>
          </div>

          {/* Feature 3 - Leaf */}
          <div className="text-center transition-all duration-300">
            <Leaf className="w-10 h-10 mb-4 mx-auto" style={{ 
              background: 'linear-gradient(135deg, #0891b2, #2563eb)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: '#0891b2',
              filter: 'drop-shadow(0 2px 6px rgba(0,0,0,0.2))'
            }} />
            <h3 
              className="text-sm font-semibold mb-2"
              style={{ color: '#1f2937', textShadow: '0 1px 4px rgba(255,255,255,0.8)' }}
            >
              MEDICAL CANNABIS
            </h3>
            <p 
              className="text-xs font-light"
              style={{ color: '#374151', textShadow: '0 1px 3px rgba(255,255,255,0.7)' }}
            >
              Premium quality
            </p>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-black/20 my-8 max-w-2xl mx-auto" />

        {/* Footer text */}
        <p 
          className="text-center text-sm font-light mb-8 sm:mb-12"
          style={{ color: '#1f2937', textShadow: '0 1px 4px rgba(255,255,255,0.8)' }}
        >
          © 2025 ReLeafZ
        </p>
      </div>
    </div>
  );
};

export default ComingSoon;