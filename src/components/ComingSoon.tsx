'use client'

import React from 'react';
import { Sparkles, Clock, ZapIcon, Leaf } from 'lucide-react';

const ComingSoon: React.FC = () => {
  return (
    <div 
      className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-8"
      style={{
        backgroundColor: '#E9E6DE',
        fontFamily: '"Inconsolata", monospace'
      }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-500/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
      </div>

      {/* Main content card */}
      <div className="relative z-10 max-w-2xl w-full">
        <div 
          className="bg-white border-2 border-black rounded-2xl p-8 sm:p-12 shadow-2xl"
          style={{
            boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
          }}
        >
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <img
              src="/logo.png"
              alt="ReLeafZ Logo"
              className="w-48 sm:w-64 h-auto"
            />
          </div>

          {/* Badge */}
          <div className="flex justify-center mb-8">
            <div 
              className="inline-flex items-center px-4 py-2 rounded-full"
              style={{
                background: 'linear-gradient(135deg, #E9E6DE, #E9E6DE)',
                border: '1px solid #000'
              }}
            >
              <Sparkles className="w-4 h-4 mr-2" style={{ color: '#027852' }} />
              <span 
                className="text-sm font-medium"
                style={{ color: '#3c3d40' }}
              >
                SOON
              </span>
            </div>
          </div>

          {/* Main heading */}
          <h1 
            className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 text-center italic leading-tight"
            style={{
              background: 'linear-gradient(to right, #111827, #000000)',
              WebkitBackgroundClip: 'text',
              backgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              color: '#111827'
            }}
          >
            COMING SOON
          </h1>

          {/* Subheading */}
          <p 
            className="text-lg sm:text-xl mb-8 text-center leading-relaxed font-thin"
            style={{ color: '#3c3d40' }}
          >
            We're working hard to bring you something amazing.
            <br />
            Stay tuned!
          </p>

          {/* Features grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-8">
            {/* Feature 1 */}
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #027852, #10b981)',
                  boxShadow: '0 4px 15px rgba(9, 150, 103, 0.3)'
                }}
              >
                <ZapIcon className="w-8 h-8 text-white" />
              </div>
              <h3 
                className="text-sm font-semibold mb-2"
                style={{ color: '#3c3d40' }}
              >
                FAST DELIVERY
              </h3>
              <p 
                className="text-xs font-thin"
                style={{ color: '#3c3d40' }}
              >
                Ultra quick service
              </p>
            </div>

            {/* Feature 2 */}
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #027852, #10b981)',
                  boxShadow: '0 4px 15px rgba(9, 150, 103, 0.3)'
                }}
              >
                <Clock className="w-8 h-8 text-white" />
              </div>
              <h3 
                className="text-sm font-semibold mb-2"
                style={{ color: '#3c3d40' }}
              >
                COMING SOON
              </h3>
              <p 
                className="text-xs font-thin"
                style={{ color: '#3c3d40' }}
              >
                Launching 2025
              </p>
            </div>

            {/* Feature 3 */}
            <div className="text-center">
              <div 
                className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 mx-auto"
                style={{
                  background: 'linear-gradient(135deg, #027852, #10b981)',
                  boxShadow: '0 4px 15px rgba(9, 150, 103, 0.3)'
                }}
              >
                <Leaf className="w-8 h-8 text-white" />
              </div>
              <h3 
                className="text-sm font-semibold mb-2"
                style={{ color: '#3c3d40' }}
              >
                MEDICAL CANNABIS
              </h3>
              <p 
                className="text-xs font-thin"
                style={{ color: '#3c3d40' }}
              >
                Premium quality
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-t border-black my-8" />

          {/* Footer text */}
          <p 
            className="text-center text-sm font-thin"
            style={{ color: '#3c3d40' }}
          >
            © 2025 ReLeafZ
          </p>
        </div>
      </div>
    </div>
  );
};

export default ComingSoon;