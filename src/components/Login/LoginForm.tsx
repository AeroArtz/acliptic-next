'use client'
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast, Toaster } from "sonner";
import { googleSignInAction } from "@/actions/googleSignInAction";

export default function LoginForm() {
    const router = useRouter();
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setIsLoading(true);

        const formData = new FormData(e.currentTarget);
        const email = formData.get('email') as string;
        const password = formData.get('password') as string;

        try {
            const result = await signIn('credentials', {
                email,
                password,
                redirect: false,
            });

            if (result?.error) {
                toast.error('Invalid email or password');
                setIsLoading(false);
                return;
            }

            router.push('/Studio');
        } catch (error) {
            toast.error('An error occurred. Please try again.');
            console.log(error)
            setIsLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen bg-white">
            <Toaster position="top-right" />
            
            {/* Left section - Login form */}
            <div className="flex flex-1 items-center justify-center p-4 sm:p-6 lg:p-8 z-10">
                <div className="w-full max-w-md space-y-6 sm:space-y-8 bg-white">
                    <div className="space-y-2">
                        <Link href="/" className="block">
                            <Image 
                                src="/AELogo.svg" 
                                alt="Logo" 
                                width={120} 
                                height={120} 
                                className="dark:invert" 
                                priority 
                            />
                        </Link>
                        <h1 className="text-3xl sm:text-4xl font-bold text-gray-900">Sign in</h1>
                    </div>

                    {/* <form onSubmit={handleSubmit} className="space-y-4 sm:space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="email" className="text-sm sm:text-base text-gray-700 hel-font">
                                Email
                            </Label>
                            <Input
                                id="email"
                                name="email"
                                type="email"
                                placeholder="Email"
                                required
                                className="bg-white border-gray-200 hel-font text-sm sm:text-base"
                            />
                        </div>
                        
                        <div className="space-y-2">
                            <div className="flex items-center justify-between">
                                <Label htmlFor="password" className="text-sm sm:text-base text-gray-700 hel-font">
                                    Password
                                </Label>
                                <Link href="/forgot-password" className="text-xs sm:text-sm text-gray-500 hover:text-gray-700 hel-font">
                                    Forgot password?
                                </Link>
                            </div>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                placeholder="Password"
                                required
                                className="bg-white border-gray-200 hel-font text-sm sm:text-base"
                            />
                        </div>

                        <Button
                            type="submit"
                            className="w-full bg-gray-900 text-white hover:bg-gray-700 hel-font text-sm sm:text-base py-2 sm:py-3"
                            disabled={isLoading}    
                        >
                            {isLoading ? "Signing in..." : "Sign in"}
                        </Button>
                    </form>


                    <div className="flex items-center">
                        <div className="flex-grow h-px bg-gray-200"></div>
                        <span className="px-2 text-xs uppercase text-gray-500 bg-white">OR</span>
                        <div className="flex-grow h-px bg-gray-200"></div>
                    </div> */}

                    {/* Social Login Buttons */}
                    <div className="space-y-3">
                        <Button 
                            variant="outline" 
                            className="w-full border-gray-200 bg-white hover:bg-gray-50 text-gray-700 hover:text-gray-900  text-sm sm:text-base py-2 sm:py-3"
                            onClick={async () => {
                                try {
                                    await googleSignInAction()
                                } catch (error) {
                                    console.log(error)
                                    toast.error("Failed to sign in with Google")
                                }
                            }}
                        >
                            <svg className="h-4 w-4 sm:h-5 sm:w-5 mr-2" viewBox="0 0 24 24">
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                />
                            </svg>
                            <span>Continue with Google</span>
                        </Button>
                    </div>

                    <p className="text-center text-xs sm:text-sm text-gray-500 hel-font">
                        Don&#39;t have an account?
                        <Link href="/Signup" className="text-gray-900 hover:underline ml-1">
                            Sign up
                        </Link>
                    </p>
                </div>
            </div>
            
            {/* Right section - Image */}
            <div className="hidden lg:block lg:w-1/2 h-screen">
                <Image 
                    src="/login45.jpeg" 
                    alt="Login illustration" 
                    className="object-cover"
                    width={1000}
                    height={1000}
                    style={{ width: '100%', height: '100%' }}
                    priority 
                />
            </div>
        </div>
    );
} 