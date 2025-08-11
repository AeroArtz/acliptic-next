'use client'
import { useState, useEffect } from 'react'
import Image from 'next/image'
const testimonials = [
  {
    text: "Side Effect is a revelation. Other platforms shroud their payment structure in secrecy or take a sizable chunk out of your pay, but Side Effect is transparent and fair.",
    author: "Jane Smith",
    role: "Application Development",
    image: "/t5.jpg"
  },
  {
    text: "The platform's intuitive interface and robust feature set have transformed how I manage my freelance projects. It's a game-changer for developers.",
    author: "Michael Chen",
    role: "Full Stack Developer",
    image: "/t6.jpg"
  },
  {
    text: "What sets Side Effect apart is their commitment to fair compensation and transparency. It's refreshing to work with a platform that puts developers first.",
    author: "Sarah Johnson",
    role: "Software Engineer",
    image: "/t7.jpg"
  },
  {
    text: "I've tried many platforms, but Side Effect's approach to project management and client communication is unmatched. It's become my go-to platform.",
    author: "Charlize David",
    role: "Backend Developer",
    image: "/t8.jpg"
  }
]

export default function ConfirmationPage() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    const timer = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentIndex((prev) => (prev + 1) % testimonials.length)
        setIsTransitioning(false)
      }, 100)
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex min-h-screen">
      {/* Main Content */}
      <div className="flex-1 flex flex-col items-center justify-center p-8 -mt-20">
        <Image 
          src="/AElogo2.png" 
          alt="Side Effect Logo" 
          className="mb-2 h-20"
        />
        
        <div className="flex mb-8">
          {/* User avatars with overlap */}
          <Image src="/t1.jpg" alt="" className="w-8 h-8 rounded-full" />
          <Image src="/t2.jpg" alt="" className="w-8 h-8 rounded-full -ml-2" />
          <Image src="/t3.jpg" alt="" className="w-8 h-8 rounded-full -ml-2" />
          <Image src="/t4.jpg" alt="" className="w-8 h-8 rounded-full -ml-2" />
        </div>

        <h1 className="text-5xl font-normal mb-4" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>Check Your Email</h1>
        <p className="text-center text-gray-600 hel-font">
          We have sent you a confirmation email.<br />
          Please check your inbox and follow the link to verify your account.
        </p>
      </div>

      {/* Testimonial Sidebar */}
      <div className="w-[450px] bg-[#F5F8FE] p-9 flex flex-col justify-center">
        <div>
          <p 
            className={`text-xl mb-6 transition-opacity duration-200 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            {testimonials[currentIndex].text}
          </p>
          <div 
            className={`flex items-center gap-3 transition-opacity duration-200 ${
              isTransitioning ? 'opacity-0' : 'opacity-100'
            }`}
          >
            <Image 
              src={testimonials[currentIndex].image}
              alt="" 
              className="w-10 h-10 rounded-full"
            />
            <div>
              <p className="font-medium">{testimonials[currentIndex].author}</p>
              <p className="text-sm text-gray-600">{testimonials[currentIndex].role}</p>
            </div>
          </div>
        </div>
        
        {/* Navigation Dots */}
        <div className="flex gap-2 justify-center mt-8">
          {testimonials.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setIsTransitioning(true)
                setTimeout(() => {
                  setCurrentIndex(index)
                  setIsTransitioning(false)
                }, 200)
              }}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex ? 'bg-blue-600' : 'bg-gray-300'
              }`}
              aria-label={`Go to testimonial ${index + 1}`}
            />
          ))}
        </div>
      </div>
    </div>
  )
}
  