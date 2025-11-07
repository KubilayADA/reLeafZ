'use client'

import React, { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Menu, X } from 'lucide-react'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import CookieBanner from '@/components/ui/cookie'
import './header.css'

// logo
const LeafLogo = ({ className = 'w-80 h-40 sm:w-56 sm:h-24 md:w-72 md:h-32' }) => (
  <div className={`relative overflow-hidden ${className}`}>
    <img
      src="/logo.png"
      alt="reLeafZ Logo"
      className="w-full h-full object-contain"
    />
  </div>
)

interface HeaderProps {
  dialogOpen: boolean
  setDialogOpen: (open: boolean) => void
  zipInput: string
  setZipInput: (input: string) => void
  handlePostcodeSubmit: () => void
  isValidBerlinPostcode: (postcode: string) => boolean
}

export default function Header({ 
  dialogOpen, 
  setDialogOpen, 
  zipInput, 
  setZipInput, 
  handlePostcodeSubmit, 
  isValidBerlinPostcode 
}: HeaderProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false)

  return (
    <>
      <header className="relative z-50 bg-#E9E6DE/50 backdrop-blur-md border-b border-black">
        {/* Cookie Banner - positioned above everything */}
        <div className="relative z-[90]">
          <CookieBanner />
        </div>
        
        {/* Moving information banner */}
        <div className="bg-transparent text-black py-1 overflow-hidden border-b border-black">
        <div className="moving-text">
          <span>Card payment accepted</span>
          <span>|</span>
          <span>Delivery within 90 min</span>
          <span>|</span>
          <span>Medical Cannabis good shit</span>
          <span className="spacer px-100"></span>
          <span>Card payment accepted</span>
          <span>|</span>
          <span>Delivery within 90 min</span>
          <span>|</span>
          <span>Medical Cannabis good shit</span>
          <span className="spacer px-100"></span>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20">
        <div className="flex justify-between items-center h-20">
          {/* Logo geniş, navbar sabit yükseklikte */}
          <div className="flex items-center h-20 overflow-visible">
            <LeafLogo className="w-45 h-52 transform translate-y-4" />
          </div>
          
          {/* Desktop Nav */}
          <nav className="hidden md:flex absolute left-1/2 top-flex mt-12 transform -translate-x-1/2 -translate-y-1/2 space-x-8 inconsolata font-normal ">
            <a href="#ablauf" className="text-mg md:text-xl   leading-relaxed">Ablauf</a>
            <a href="vorteile" className="text-lg md:text-xl   leading-relaxed">Vorteile</a>
            <a href="faq" className="text-lg md:text-xl   leading-relaxed">FAQ</a>
            <a href="chat" className="text-lg md:text-xl leading-relaxed">Chat with us!</a>
          </nav>
          
          {/* Desktop Button - Hidden on mobile, only in hamburger menu wish i believe is better let me know if you see this UwUwuu*/}
          <div className="hidden lg:block">
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
              <DialogTrigger asChild>
                  <Button
                    className="behandlung-button px-4 py-2 flex items-center justify-center"
                  >
                  BEHANDLUNG ANFRAGEN
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-md">
                <DialogHeader>
                  <DialogTitle className="inconsolata text-xl font-bold">Postleitzahl eingeben</DialogTitle>
                  <DialogDescription className="inconsolata text-gray-600">
                    Bitte geben Sie Ihre Postleitzahl ein, um zu prüfen, ob wir in Ihrer Region liefern können.
                  </DialogDescription>
                </DialogHeader>
                <div className="py-4">
                  <input
                    type="text"
                    name="zip"
                    placeholder="z.B. 10115"
                    value={zipInput}
                    onChange={(e) => setZipInput(e.target.value)}
                    className="w-full p-3 border border-gray-300 rounded-lg inconsolata text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                    maxLength={5}
                  />
                </div>
                <DialogFooter>
                  <Button
                    onClick={handlePostcodeSubmit}
                    disabled={!zipInput.trim() || !isValidBerlinPostcode(zipInput)}
                    className="w-full btn-primary font-medium py-3"
                  >
                    Weiter
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
          
          {/* Hamburger for mobile and tablet */}
          <button
            className="lg:hidden ml-4 p-2 rounded focus:outline-none"
            onClick={() => setMobileNavOpen(!mobileNavOpen)}
            aria-label="Open menu"
          >
            {mobileNavOpen ? <X className="w-7 h-7" /> : <Menu className="w-7 h-7" />}
          </button>
        </div>
        
        {/* Mobile Nav Drawer */}
        {mobileNavOpen && (
          <div className="lg:hidden absolute top-full left-0 w-full bg-white shadow-lg border-t border-emerald-200 z-50">
            <nav className="flex flex-col items-center py-6 space-y-6">
              <a href="#ablauf" className="text-xl text-black-800 inconsolata" onClick={() => setMobileNavOpen(false)}>Ablauf</a>
              <a href="vorteile" className="text-xl text-black-800 inconsolata" onClick={() => setMobileNavOpen(false)}>Vorteile</a>
              <a href="faq" className="text-xl text-black-800 inconsolata" onClick={() => setMobileNavOpen(false)}>FAQ</a>
              <a href="chat" className="text-xl text-black-800 inconsolata" onClick={() => setMobileNavOpen(false)}>Chat with us!</a>
              <div className="w-full px-4">
                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                  <DialogTrigger asChild>
                    <Button 
                      className="behandlung-button w-full px-6 py-3 flex items-center justify-center"
                    >
                      BEHANDLUNG ANFRAGEN
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="inconsolata text-xl font-bold">Postleitzahl eingeben</DialogTitle>
                      <DialogDescription className="inconsolata text-gray-600">
                        Bitte geben Sie Ihre Postleitzahl ein, um zu prüfen, ob wir in Ihrer Region liefern können.
                      </DialogDescription>
                    </DialogHeader>
                    <div className="py-4">
                      <input
                        type="text"
                        name="zip"
                        placeholder="z.B. 10115"
                        value={zipInput}
                        onChange={(e) => setZipInput(e.target.value)}
                        className="w-full p-3 border border-gray-300 rounded-lg inconsolata text-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
                        maxLength={5}
                      />
                    </div>
                    <DialogFooter>
                      <Button
                        onClick={handlePostcodeSubmit}
                        disabled={!zipInput.trim() || !isValidBerlinPostcode(zipInput)}
                        className={`w-full inconsolata text-white font-medium py-3 ${
                          !zipInput.trim() || !isValidBerlinPostcode(zipInput) 
                            ? 'opacity-50 cursor-not-allowed bg-gray-400' 
                            : 'animated-button'
                        }`}
                      >
                        Weiter
                      </Button>
                    </DialogFooter>
                  </DialogContent>
                </Dialog>
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
    </>
  )
}
