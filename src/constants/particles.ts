import type { ISourceOptions } from '@tsparticles/engine'

/**
 * Shared tsParticles config for dark section backgrounds (Ablauf, Partner-Apotheken).
 * Derived from the former particles.js preset: upward drift, no link lines, bubble + repulse.
 */
export const sectionParticlesOptions: ISourceOptions = {
  fullScreen: { enable: false },
  background: {
    color: { value: 'transparent' },
  },
  fpsLimit: 60,
  detectRetina: true,
  particles: {
    number: {
      value: 160,
      density: { enable: false },
    },
    color: {
      value: ['#22d3ee', '#34e1a5', '#ffffff'],
    },
    shape: { type: 'circle' },
    opacity: {
      value: { min: 0.15, max: 0.5 },
    },
    size: {
      value: { min: 0.3, max: 3 },
    },
    links: { enable: false },
    move: {
      enable: true,
      random: true,
      speed: 1,
      direction: 'top',
      outModes: { default: 'out' },
    },
  },
  interactivity: {
    detectsOn: 'window',
    events: {
      onHover: {
        enable: true,
        mode: 'bubble',
      },
      onClick: {
        enable: true,
        mode: 'repulse',
      },
    },
    modes: {
      bubble: {
        distance: 250,
        duration: 10,
        size: 0,
        opacity: 0,
      },
      repulse: {
        distance: 400,
        duration: 10,
      },
    },
  },
}

/** Blue drift for landing hero — dense, full-viewport (mirrors Coming Soon motion). */
export const heroParticlesOptions: ISourceOptions = {
  fullScreen: { enable: false },
  background: {
    color: { value: 'transparent' },
  },
  fpsLimit: 60,
  detectRetina: true,
  particles: {
    number: {
      value: 240,
      density: { enable: false },
    },
    color: {
      value: ['#22d3ee', '#38bdf8', '#60a5fa', '#3b82f6', '#0ea5e9', '#7dd3fc'],
    },
    shape: { type: 'circle' },
    opacity: {
      value: { min: 0.2, max: 0.62 },
      animation: { enable: true, speed: 0.6, sync: false },
    },
    size: {
      value: { min: 0.3, max: 3.4 },
      animation: { enable: true, speed: 2, sync: false, startValue: 'random' },
    },
    links: { enable: false },
    move: {
      enable: true,
      random: true,
      speed: 0.9,
      direction: 'top',
      straight: false,
      outModes: { default: 'out' },
    },
  },
  interactivity: {
    detectsOn: 'window',
    events: {
      onHover: { enable: false },
      onClick: { enable: false },
    },
  },
}
