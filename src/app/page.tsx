'use client';

import React, { useEffect, useState } from 'react';
import { ArrowRight, ArrowDown } from 'lucide-react';
import { Sparkles, Stethoscope, FlaskConical, BadgeEuro } from 'lucide-react';
import {
  Play,
  Zap,
  Brain,
  Users,
  Shield,
  Clock,
  MapPin,
  ChevronRight,
  Star,
} from 'lucide-react';
import { Button } from '@/components/ui/button';

type CannabisLeafLogoProps = {
  className?: string;
};

const CannabisLeafLogo: React.FC<CannabisLeafLogoProps> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative ${className}`}>
    <svg viewBox="0 0 40 40" className="w-full h-full">
      <path
        d="M20 35 Q15 30 12 25 Q10 20 12 15 Q15 10 20 8 Q25 10 28 15 Q30 20 28 25 Q25 30 20 35"
        fill="url(#leafGradient)"
        className="drop-shadow-sm"
      />
      <path
        d="M20 32 Q16 28 14 24 Q13 20 14 16 Q16 12 20 11 Q24 12 26 16 Q27 20 26 24 Q24 28 20 32"
        fill="url(#innerLeaf)"
      />
      <path d="M20 11 L20 32" stroke="rgba(34,197,94,0.3)" strokeWidth="0.5" />
      <path d="M16 16 Q18 18 20 20 Q22 18 24 16" stroke="rgba(34,197,94,0.2)" strokeWidth="0.5" fill="none" />
      <path d="M15 22 Q17.5 23 20 24 Q22.5 23 25 22" stroke="rgba(34,197,94,0.2)" strokeWidth="0.5" fill="none" />
      <defs>
        <linearGradient id="leafGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#059669', stopOpacity: 1 }} />
          <stop offset="100%" style={{ stopColor: '#10b981', stopOpacity: 1 }} />
        </linearGradient>
        <linearGradient id="innerLeaf" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" style={{ stopColor: '#10b981', stopOpacity: 0.8 }} />
          <stop offset="100%" style={{ stopColor: '#34d399', stopOpacity: 0.6 }} />
        </linearGradient>
      </defs>
    </svg>
  </div>
);

const SleepingMonkey: React.FC = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const interval = setInterval(() => setIsVisible((prev) => !prev), 8000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className={`fixed bottom-8 right-8 z-40 transition-all duration-1000 ${
        isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
      }`}
    >
      <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 shadow-2xl border border-emerald-200 max-w-xs">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <svg width="48" height="48" viewBox="0 0 48 48" className="transform rotate-12">
              <circle cx="24" cy="24" r="18" fill="#D2691E" />
              <circle cx="24" cy="24" r="14" fill="#DEB887" />
              <path d="M18 20 Q20 18 22 20" stroke="#8B4513" strokeWidth="2" fill="none" strokeLinecap="round" />
              <path d="M26 20 Q28 18 30 20" stroke="#8B4513" strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle cx="24" cy="26" r="2" fill="#8B4513" />
              <path d="M20 30 Q24 32 28 30" stroke="#8B4513" strokeWidth="2" fill="none" strokeLinecap="round" />
              <circle cx="12" cy="18" r="6" fill="#D2691E" />
              <circle cx="36" cy="18" r="6" fill="#D2691E" />
              <circle cx="12" cy="18" r="3" fill="#DEB887" />
              <circle cx="36" cy="18" r="3" fill="#DEB887" />
              <g className="animate-pulse">
                <rect x="38" y="28" width="8" height="2" rx="1" fill="#F5F5DC" transform="rotate(15)" />
                <circle cx="44" cy="29" r="1" fill="#FF6B47" />
                <path d="M45 28 Q47 27 48 28" stroke="#E5E7EB" strokeWidth="1" fill="none" opacity="0.7" />
              </g>
              <text x="32" y="12" fontSize="8" fill="#10b981" className="animate-bounce font-bold">
                Z
              </text>
              <text x="35" y="8" fontSize="6" fill="#059669" className="animate-bounce" style={{ animationDelay: '0.5s' }}>
                z
              </text>
              <text x="38" y="10" fontSize="4" fill="#047857" className="animate-bounce" style={{ animationDelay: '1s' }}>
                z
              </text>
            </svg>
          </div>
          <div className="flex-1">
            <div className="text-sm font-semibold text-emerald-700 mb-1">Feeling Relaxed?</div>
            <div className="text-xs text-gray-600">Luna found the perfect strain for your sleep schedule</div>
          </div>
        </div>
      </div>
    </div>
  );
};

const ReLeafZLanding: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'Sarah M.',
      condition: 'Chronic Pain',
      text: 'Finally found relief in under 90 minutes. The AI recommendations were spot on.',
    },
    {
      name: 'Marcus K.',
      condition: 'Anxiety',
      text: 'The community support and expert guidance made all the difference in my treatment.',
    },
    {
      name: 'Elena R.',
      condition: 'Insomnia',
      text: 'Fast, reliable, and professionally handled. Best medical cannabis service in Berlin.',
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [testimonials.length]);

  const handlePlayGreeting = () => {
    setIsPlaying(true);
    setTimeout(() => setIsPlaying(false), 3000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-100 via-white to-teal-50">
      {/* Header */}
      <header className="relative z-50 bg-white/80 backdrop-blur-md border-b border-emerald-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <CannabisLeafLogo className="w-10 h-10" />
              <span className="text-2xl font-bold bg-gradient-to-r from-emerald-700 to-teal-600 bg-clip-text text-transparent">reLeafZ</span>
              <span className="bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full text-xs font-medium">BETA</span>
            </div>
            <nav className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-gray-600 hover:text-emerald-600 transition-colors">
                How it Works
              </a>
              <a href="#community" className="text-gray-600 hover:text-emerald-600 transition-colors">
                Community
              </a>
              <a href="#doctors" className="text-gray-600 hover:text-emerald-600 transition-colors">
                For Doctors
              </a>
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white hover:from-emerald-700 hover:to-teal-800 shadow-lg hover:shadow-xl">
                Get Started
              </Button>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute top-40 left-20 w-72 h-72 bg-emerald-300/40 rounded-full blur-3xl"></div>
          <div className="absolute top-60 right-20 w-96 h-96 bg-teal-200/30 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 left-1/2 w-80 h-80 bg-emerald-200/35 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/60 backdrop-blur-sm rounded-full border border-emerald-300 mb-8">
              <Sparkles className="w-4 h-4 text-emerald-600 mr-2" />
              <span className="text-sm font-medium text-emerald-800">AI-Powered, Ultra fast Medical Cannabis Service </span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold text-gray-900 mb-6 leading-tight">
              Medizinal Cannabis
              <br />
              <span className="bg-gradient-to-r from-emerald-600 to-teal-700 bg-clip-text text-transparent">in Minuten geliefert</span>
              <br />
              <span className="relative">
                in Berlin
                <div className="absolute -bottom-2 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-full"></div>
              </span>
            </h1>

            <p className="text-base md:text-lg text-gray-600 mb-5 max-w-4xl mx-auto leading-relaxed">
              Lieferung in 30-90 Minuten in Berlin. 
Abholung in 15 minuten in Berlin 
Ganz Deutschland in 1-2 Tagen < br/> <br/> <br/>

✓ Online Behandlung anfragen <br/>
✓ Rezept digital austellen lassen <br/>
✓ Medikamente aus der Apotheke abholen oder liefern lassen <br/>


            </p>


            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
              <Button className="bg-gradient-to-r from-emerald-600 to-teal-700 text-white px-8 py-6 rounded-2xl text-lg font-semibold hover:from-emerald-700 hover:to-teal-800 shadow-xl hover:shadow-2xl">
                Rezept anfragen
                <ChevronRight className="w-5 h-5 ml-2" />
              </Button>
              

            </div>

            <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-gray-600">
              <div className="flex items-center">
                <Shield className="w-5 h-5 text-emerald-600 mr-2" />
                <span>GDPR Compliant</span>
              </div>
              <div className="flex items-center">
                <Clock className="w-5 h-5 text-emerald-600 mr-2" />
                <span>Licensed Doctors</span>
              </div>
              <div className="flex items-center">
                <MapPin className="w-5 h-5 text-emerald-600 mr-2" />
                <span>Berlin Pharmacies</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">SO LÄUFT'S</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">Behandlung anfragen und Medikamente in kürzester Zeit erhalten</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:border-emerald-300">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Brain className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Fragebogen Ausfüllen</h3>
              <p className="text-gray-600 mb-6">
Fülle den medizinischen Fragebogen aus oder buche eine Video-Beratung. So kann der Arzt deinen Gesundheitszustand genau verstehen.              </p>
              
            </div>

            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:border-emerald-300">
              <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4"> Behandlung erhalten</h3>
              <p className="text-gray-600 mb-6">Ein Arzt prüft deine Anfrage, berät dich und stellt dir gegebenenfalls ein Rezept aus.</p>
             
            </div>
            <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-100 group hover:border-emerald-300">
              <div className="w-16 h-16 bg-gradient-to-br from-emerald-600 to-teal-700 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">15-90min Delivery</h3>
              <p className="text-gray-600 mb-6">Medikamente in Berlin in max. 90 Min. geliefert oder in 15–30 Min. selbst in der Apotheke abholen.</p>
              <div className="text-emerald-700 font-semibold">Powered by Wolt & Uber →</div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-24 bg-gradient-to-r from-emerald-100 to-teal-100">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-16">Real Stories from Real Patients</h2>

          <div className="bg-white rounded-3xl p-12 shadow-2xl border border-emerald-200 relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-600 to-teal-700"></div>

            <div className="flex justify-center mb-6">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-6 h-6 text-yellow-400" />
              ))}
            </div>

            <blockquote className="text-2xl text-gray-800 mb-8 leading-relaxed">"{testimonials[currentTestimonial].text}"</blockquote>

            <div className="text-emerald-700 font-semibold text-lg">{testimonials[currentTestimonial].name}</div>
            <div className="text-gray-500">{testimonials[currentTestimonial].condition} Patient</div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <div
                  key={index}
                  className={`h-3 rounded-full transition-all duration-300 ${index === currentTestimonial ? 'bg-emerald-600 w-8' : 'bg-gray-300 w-3'}`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-br from-emerald-700 to-teal-800 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-20 left-20 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute bottom-20 right-20 w-80 h-80 bg-white/5 rounded-full blur-3xl"></div>
        </div>

        <div className="relative max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-5xl font-bold mb-6">
            Ready to Transform Your
            <br />
            Medical Cannabis Experience?
          </h2>
          <p className="text-xl text-emerald-100 mb-12 max-w-2xl mx-auto">
            Join thousands of patients who&apos;ve found better care, faster relief, and a supportive community with reLeafZ.
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center">
            <Button className="bg-white text-emerald-700 hover:bg-gray-50 px-10 py-6 rounded-2xl text-lg font-bold shadow-xl hover:shadow-2xl">
              Start Your Journey Today
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
            <Button variant="outline" className="border-2 border-white/30 text-white hover:border-white hover:bg-white/10 px-10 py-6 rounded-2xl text-lg font-bold">
              Speak with Luna
            </Button>
          </div>

          <p className="text-emerald-200 text-sm mt-8">No commitment required • Speak with licensed doctors • GDPR compliant</p>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-3 mb-6">
                <CannabisLeafLogo className="w-10 h-10" />
                <span className="text-2xl font-bold">reLeafZ</span>
              </div>
              <p className="text-gray-400 mb-4">Germany&apos;s fastest, safest, and coolest medical cannabis platform.</p>
            </div>

            <div>
              <h4 className="font-bold mb-4">For Patients</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    How it Works
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Strain Library
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Treatment Tracking
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Community
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">For Professionals</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    For Doctors
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    For Pharmacies
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Partner with Us
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-bold mb-4">Legal & Support</h4>
              <ul className="space-y-2 text-gray-400">
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Privacy Policy
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Terms of Service
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    GDPR Compliance
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white transition-colors">
                    Support
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-800 mt-12 pt-8 text-center text-gray-400">
            <p>&copy; 2025 reLeafZ. All rights reserved. Licensed medical cannabis platform serving Berlin.</p>
          </div>
        </div>
      </footer>

      <SleepingMonkey />
    </div>
  );
};

export default ReLeafZLanding;