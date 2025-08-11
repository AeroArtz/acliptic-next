"use server"

import { signIn } from "@/auth"
import type { AuthError } from "next-auth"
import { ZodError } from "zod"

export type FormState = {
  errors?: {
    email?: string[]
    password?: string[]
    _form?: string[]
  }
  success?: boolean
  message?: string
}

export async function SignInAction(prevState: FormState, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    // Validate inputs
    if (!email || !password) {
      return {
        errors: {
          _form: ["Email and password are required."],
        },
        success: false,
      }
    }

    // Attempt to sign in
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    })

    if (result?.error) {
      return {
        errors: {
          _form: [result.error],
        },
        success: false,
      }
    }
    
    // If we get here, sign in was successful
    return {
      success: true,
      message: "Successfully signed in!",
    }
  } catch (err) {
    console.error("Authentication error:", err)

    // Handle different error types
    if (err instanceof ZodError) {
      const fieldErrors = err.flatten().fieldErrors
      return {
        errors: {
          ...fieldErrors,
          _form: ["Invalid credentials."],
        },
        success: false,
      }
    }

    // Check if it's an AuthError with a type property
    if (err instanceof Error && "type" in err) {
      const authError = err as AuthError
      if (authError.type === "CredentialsSignin") {
        return {
          errors: {
            _form: ["Invalid email or password."],
          },
          success: false,
        }
      }
    }

    // Generic error fallback
    return {
      errors: {
        _form: ["An error occurred during sign in. Please try again."],
      },
      success: false,
    }
  }
}

