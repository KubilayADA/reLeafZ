'use client'

import React, { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { Button } from './button'

const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [isAccepted, setIsAccepted] = useState(false)

  useEffect(() => {
    // Check if user has already made a choice
    const cookieChoice = localStorage.getItem('cookieConsent')
    if (!cookieChoice) {
      // Show banner after a short delay for better UX
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 1000)
      return () => clearTimeout(timer)
    } else {
      setIsAccepted(true)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem('cookieConsent', 'accepted')
    setIsVisible(false)
    setIsAccepted(true)
  }

  const handleDecline = () => {
    localStorage.setItem('cookieConsent', 'declined')
    setIsVisible(false)
    setIsAccepted(true)
  }

  const handleClose = () => {
    setIsVisible(false)
  }

  if (!isVisible || isAccepted) {
    return null
  }

  return (
    <div className="w-full bg-white border-b border-gray-200 shadow-lg rounded-none">
      <div className="max-w-7xl mx-auto px-4 py-3 sm:py-2">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-0">
          {/* Left side - Cookie icon and text */}
          <div className="flex items-start sm:items-center space-x-3">
            <img 
              src="/cookie.png" 
              alt="Cookie" 
              className="w-6 h-6 sm:w-8 sm:h-8 flex-shrink-0 mt-0.5 sm:mt-0"
            />
            <div className="flex-1">
              <p className="text-xs sm:text-sm text-gray-800 inconsolata leading-relaxed">
                This website uses cookies to ensure you get the best experience.{' '}
                <a 
                  href="/privacy" 
                  className="underline text-gray-600 hover:text-gray-800 transition-colors"
                >
                  Learn more
                </a>
              </p>
            </div>
          </div>

          {/* Right side - Buttons and close */}
          <div className="flex items-center justify-between sm:justify-end space-x-2 sm:ml-4">
            <div className="flex items-center space-x-2">
              <Button
                onClick={handleDecline}
                variant="outline"
                className="text-xs sm:text-sm px-3 py-1.5 sm:px-2 sm:py-1 border border-black-300 text-gray-700 hover:bg-gray-50 inconsolata rounded-none border-2px border-black-300"
              >
                Decline
              </Button>
              <Button
                onClick={handleAccept}
                className="text-xs sm:text-sm px-3 py-1.5 sm:px-2 sm:py-1 bg-gray-900 text-white hover:bg-gray-800 inconsolata rounded-none border-2px border-black-300"
              >
                Accept
              </Button>
            </div>
            <button
              onClick={handleClose}
              className="p-1.5 sm:p-1 hover:bg-gray-100 rounded-none transition-colors flex-shrink-0 self-center sm:self-auto"
              aria-label="Close cookie banner"
            >
              <X className="w-4 h-4 sm:w-3 sm:h-3 text-black-500" />
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default CookieBanner
