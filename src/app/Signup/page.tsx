import React from "react";
import Image from 'next/image';
import Link from 'next/link';
import SignupForm from "@/components/SignUpForm";
import { auth } from "@/auth";

import { db } from "@/db";
import { users } from "@/db/schema/users";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";


const SignupPage = async () => {
    const session = await auth()

    if (session?.user) {

        const user_id = session?.user?.id

        console.log(user_id)
        const result = await db.select().from(users).where(eq(users.id, user_id));
        
        // THIS MEANS THAT THIS USER EXISTS IN DB
        if (result.length > 0){
            console.log("USER EXISTS IN DB")


            // THIS MEANS THAT THIS USER HAS NOT ONBOARDED YET  
            if (!result[0].onBoardingCompleted) {
                console.log("USER HAS NOT ONBOARDED")

                redirect("/Signup/ProfileSetup")

            }else{
                // THIS MEANS THAT THIS USER HAS ONBOARDED   
                console.log("USER HAS ONBOARDED ALREADY")
                
                redirect("/Studio")


            }
        }
        
        
    }
    return (
        <div>
            <Link href='/'>
                <Image
                    src="/AElogo2.png"
                    alt="Logo"
                    width={180}
                    height={180}
                    className="absolute top-5 left-8"
                    priority
                    quality={100}
                    sizes="100vw"
                />
            </Link>
            <SignupForm />
        </div>
    );
};

export default SignupPage;
