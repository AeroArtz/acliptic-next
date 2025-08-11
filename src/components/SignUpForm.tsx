"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { toast, Toaster } from "sonner"
import { signInSchema } from "@/lib/zod"
import { googleSignInAction } from "@/actions/googleSignInAction"
import { ZodError } from "zod"
import Link from "next/link"

export default function SignupForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [step, setStep] = useState("email")
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({})
  const router = useRouter()

  // Validate email in real-time as user types
  useEffect(() => {
    if (email) {
      try {
        signInSchema.shape.email.parse(email)
        setErrors((prev) => ({ ...prev, email: undefined }))
      } catch (error) {
        if (error instanceof ZodError) {
          setErrors((prev) => ({ ...prev, email: error.errors[0].message }))
        }
      }
    }
  }, [email])

  // Validate password in real-time as user types
  useEffect(() => {
    if (password) {
      try {
        signInSchema.shape.password.parse(password)
        setErrors((prev) => ({ ...prev, password: undefined }))
      } catch (error) {
        if (error instanceof ZodError) {
          setErrors((prev) => ({ ...prev, password: error.errors[0].message }))
        }
      }
    }
  }, [password])

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()

    if (step === "email") {
      // Validate email before proceeding to password step
      try {
        signInSchema.shape.email.parse(email)
        setStep("password")
      } catch (error) {
        if (error instanceof ZodError) {
          setErrors({ email: error.errors[0].message })
          toast.error(error.errors[0].message)
        }
      }
      return
    }

    // Validate full form before submission
    try {
      signInSchema.parse({ email, password })
    } catch (error) {
      if (error instanceof ZodError) {
        const formattedErrors = error.errors.reduce(
          (acc, curr) => {
            const path = curr.path[0] as string
            acc[path as keyof typeof acc] = curr.message
            return acc
          },
          {} as { email?: string; password?: string },
        )

        setErrors(formattedErrors)
        toast.error(error.errors[0].message)
        return
      }
    }

    setLoading(true)

    try {
      const response = await fetch("/api/user/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.message || "Something went wrong")
      }

      toast.success("Account created successfully!")
      // Redirect to login or dashboard
      setTimeout(() => {
        router.push("/Login")
      }, 2000)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Error signing up"
      toast.error(errorMessage)
      console.error("Signup error:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      await googleSignInAction()
    } catch (error) {
      toast.error("Error signing in with Google")
      console.error("Error with Google auth:", error)
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster position="top-right" />
      
      <div className="flex-grow flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl font-medium text-center mb-4 sm:mb-6" style={{ letterSpacing: "-0.04em", lineHeight: "92.7%" }}>
              Welcome to Acliptic
            </h2>
            <p className="text-center text-gray-600 mb-6 hel-font text-sm sm:text-base">
              Start streaming, and let us clip the most interesting moments for you, all hassle free.
            </p>
          </div>

          {/* Buttons */}
          <div className="space-y-4">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleGoogleAuth()
              }}
            >
              <button
                type="submit"
                className="flex items-center justify-center w-full border border-gray-300 py-2 sm:py-3 rounded-lg hover:bg-gray-100 font-medium text-sm sm:text-base"
                disabled={loading}
              >
                <svg className="h-5 w-5 sm:h-6 sm:w-6 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="-0.5 0 48 48">
                  <title>Google-color</title>
                  <g id="Icons" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                    <g id="Color-" transform="translate(-401.000000, -860.000000)">
                      <g id="Google" transform="translate(401.000000, 860.000000)">
                        <path
                          d="M9.82727273,24 C9.82727273,22.4757333 10.0804318,21.0144 10.5322727,19.6437333 L2.62345455,13.6042667 C1.08206818,16.7338667 0.213636364,20.2602667 0.213636364,24 C0.213636364,27.7365333 1.081,31.2608 2.62025,34.3882667 L10.5247955,28.3370667 C10.0772273,26.9728 9.82727273,25.5168 9.82727273,24"
                          fill="#FBBC05"
                        />
                        <path
                          d="M23.7136364,10.1333333 C27.025,10.1333333 30.0159091,11.3066667 32.3659091,13.2266667 L39.2022727,6.4 C35.0363636,2.77333333 29.6954545,0.533333333 23.7136364,0.533333333 C14.4268636,0.533333333 6.44540909,5.84426667 2.62345455,13.6042667 L10.5322727,19.6437333 C12.3545909,14.112 17.5491591,10.1333333 23.7136364,10.1333333"
                          fill="#EB4335"
                        />
                        <path
                          d="M23.7136364,37.8666667 C17.5491591,37.8666667 12.3545909,33.888 10.5322727,28.3562667 L2.62345455,34.3946667 C6.44540909,42.1557333 14.4268636,47.4666667 23.7136364,47.4666667 C29.4455,47.4666667 34.9177955,45.4314667 39.0249545,41.6181333 L31.5177727,35.8144 C29.3995682,37.1488 26.7323182,37.8666667 23.7136364,37.8666667"
                          fill="#34A853"
                        />
                        <path
                          d="M46.1454545,24 C46.1454545,22.6133333 45.9318182,21.12 45.6113636,19.7333333 L23.7136364,19.7333333 L23.7136364,28.8 L36.3181818,28.8 C35.6879545,31.8912 33.9724545,34.2677333 31.5177727,35.8144 L39.0249545,41.6181333 C43.3393409,37.6138667 46.1454545,31.6490667 46.1454545,24"
                          fill="#4285F4"
                        />
                      </g>
                    </g>
                  </g>
                </svg>
                Continue with Google
              </button>
            </form>
          </div>

          {/* <div className="flex items-center my-6">
            <div className="flex-grow h-px bg-gray-200"></div>
            <span className="px-4 text-xs uppercase text-gray-500 bg-white">OR</span>
            <div className="flex-grow h-px bg-gray-200"></div>
          </div> */}

          <div className="mt-6">
            {/* <form onSubmit={handleSignUp} className="space-y-4">
              {step === "email" ? (
                <>
                  <label htmlFor="email" className="block mb-2 text-gray-700 font-medium hel-font text-sm sm:text-base">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    placeholder="Type your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full p-3 my-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 hel-font text-sm sm:text-base ${
                      errors.email ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
                </>
              ) : (
                <>
                  <label htmlFor="password" className="block mb-2 text-gray-700 font-medium hel-font text-sm sm:text-base">
                    Password
                  </label>
                  <input
                    id="password"
                    placeholder="Password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full p-3 my-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 hel-font text-sm sm:text-base ${
                      errors.password ? "border-red-500" : ""
                    }`}
                    required
                  />
                  {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password}</p>}
                </>
              )}

              <button
                type="submit"
                className="w-full mt-4 bg-black text-white rounded-lg py-2 sm:py-3 hel-font text-sm sm:text-base"
                disabled={loading}
              >
                {loading ? "Loading..." : step === "email" ? "Continue" : "Sign up"}
              </button>
            </form> */}

            <p className="text-center text-xs sm:text-sm text-gray-500 hel-font mt-4">
              Already have an account?
              <Link href="/Login" className="text-gray-900 hover:underline ml-1">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="py-4 px-4 text-xs sm:text-sm text-gray-500 text-center">
        &#34;By clicking Sign in with Google or Apple&#34; or
        <br className="hidden sm:block" />
        &#34; Continue with email&#34; you agree to our &nbsp;
        <a href="#" className="text-indigo-500">
          Terms of Use
        </a>
        &nbsp; and &nbsp; 
        <Link href="/privacy-policy" className="text-indigo-500" >
          Privacy Policy
        </Link>
        .
      </footer>
    </div>
  )
}

