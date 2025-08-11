'use client'
import Navigation from "@/components/afterNav";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useState, useEffect } from 'react';
import { useRouter } from "next/navigation";
import { toast, Toaster } from "sonner";
import { useStreamParams } from "@/hooks/useStreamParams";

export default function PluginClient() {
    const [currentStep, setCurrentStep] = useState(2); // Start at step 2 (Clipping)
    const [autoUpload, setAutoUpload] = useState(true);
    const [clipCount, setClipCount] = useState(0);


    useEffect(() => {
        setAutoUpload(false);
      }, []);
          const router = useRouter();
    const { streamId, userId } = useStreamParams(); // ✅ Use extracted params
    
    useEffect(() => {
        if (!userId || !streamId) return;

        const fetchData = async () => {
            const res = await fetch(`api/user/getClipCount`, {
                method: 'POST',
                body: JSON.stringify({
                    streamerId: userId,
                    stream_id: streamId
                })
            });

            const data = await res.json();
            if (data.confirmation === "success" && data.data?.[0]) {
                setClipCount(data.data[0].clipCount);
            }
        };

        fetchData().catch(console.error);
    }, [userId, streamId]);

    // Optional: Simulate progress
    useEffect(() => {
        const interval = setInterval(() => {
          setCurrentStep((prev) => (prev < 5 ? prev + 1 : 1));
        }, 3000);
    
        setAutoUpload(true); // only runs once
    
        return () => clearInterval(interval);
      }, []);

    const handleStop = async () => {
        let response = await fetch("/api/stop-plugin/twitch/live", {
            method : "POST",
            body: JSON.stringify({
                stream_id : streamId
            })
        })

        toast.success("Profile updated successfully!", {
            description: "Your changes have been saved to the database",
            duration: 4000,
        });

        router.push('/Studio')
        response = await response.json()
        console.log(response)
    }

    const handleGoToClips = async () => {
        router.push(`/Studio/stream/1/clips?autoUploaded=true&id=${streamId}`);
    }
    
    return (
        <div className="flex flex-col w-full min-h-screen">
            <Toaster position="top-right" />
            
            {/* Main content area with proper padding */}
            <div className="px-4 sm:px-6 md:px-8 w-full max-w-7xl mx-auto flex flex-col gap-4 sm:gap-8">
                {/* Hero banner section with fixed height and proper content positioning */}
                <div className="mt-4 rounded-md w-full overflow-hidden bg-black">
                    <div className="w-full relative">
                        {/* Fixed height container with proper image positioning */}
                        <div className="w-full h-40 sm:h-52 md:h-64 lg:h-72 relative">
                            <Image
                                src="/PluginBg.png"
                                alt="Plugin background"
                                fill
                                className="object-cover rounded-md"
                                priority
                            />
                            
                            {/* Content container with proper z-index */}
                            <div className="absolute inset-0 flex flex-col p-4 sm:p-6 md:p-8 z-10">
                                <div className="flex flex-col h-full">
                                    {/* Top section with texts side by side */}
                                    <div className="flex justify-between items-start">
                                        <div className="text-xl sm:text-2xl md:text-3xl lg:text-4xl " 
                                            style={{ letterSpacing: '-0.04em', lineHeight: '1.1' }}>
                                            Your stream is being clipped.
                                        </div>
                                        
                                        <div className="flex flex-col text-right ">
                                            <div className="text-lg sm:text-xl md:text-2xl" 
                                                style={{ letterSpacing: '-0.04em', lineHeight: '1.1' }}>
                                                Moments Clipped
                                            </div> 
                                            <div className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-medium" 
                                                style={{ letterSpacing: '-0.04em' }}>
                                                {clipCount}
                                            </div>
                                        </div>
                                    </div>
                                    
                                    {/* Bottom section with buttons */}
                                    <div className="flex justify-center sm:justify-start gap-2 sm:gap-3 mt-auto">
                                        <Button 
                                            onClick={handleGoToClips}
                                            variant="outline" 
                                            size="sm"
                                            className="text-xs sm:text-sm text-black border-white hel-font">
                                            GO TO CLIPS
                                        </Button>

                                        <Button 
                                            className="text-xs sm:text-sm text-black border-white hel-font"
                                            variant="outline" 
                                            size="sm"
                                            onClick={handleStop}>
                                            STOP PLUGIN
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Progress steps section - matching the reference image */}
                <div className="w-full mt-4 sm:mt-8 pb-8">
                    <div className="flex flex-col">
                        {/* Steps container */}
                        <div className="flex justify-between items-center">
                            {/* Step 1: Monitoring */}
                            <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black flex items-center justify-center
                                    ${currentStep === 1 ? 'animate-pulse' : ''}`}>
                                    <Image
                                        src="/MonitoringPlugin.svg"
                                        alt="Monitoring"
                                        width={24}
                                        height={24}
                                    />
                                </div>
                                <span className="mt-2 text-xs sm:text-sm">Monitoring</span>
                            </div>
                            
                            {/* Line 1-2 */}
                            <div className="h-px bg-black flex-grow mx-1 sm:mx-2"></div>
                            
                            {/* Step 2: Clipping */}
                            <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black flex items-center justify-center
                                    ${currentStep === 2 ? 'animate-pulse' : ''}`}>
                                    <Image
                                        src="/ClippingPlugin.svg"
                                        alt="Clipping"
                                        width={24}
                                        height={24}
                                    />
                                </div>
                                <span className="mt-2 text-xs sm:text-sm">Clipping</span>
                            </div>
                            
                            {/* Line 2-3 */}
                            <div className="h-px bg-black flex-grow mx-1 sm:mx-2"></div>
                            
                            {/* Step 3: Reframing */}
                            <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black flex items-center justify-center
                                    ${currentStep === 3 ? 'animate-pulse' : ''}`}>
                                    <Image
                                        src="/ReframePlugin.svg"
                                        alt="Reframing"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                                <span className="mt-2 text-xs sm:text-sm">Reframing</span>
                            </div>
                            
                            {/* Line 3-4 */}
                            <div className="h-px bg-black flex-grow mx-1 sm:mx-2"></div>
                            
                            {/* Step 4: Applying Presets */}
                            <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black flex items-center justify-center
                                    ${currentStep === 4 ? 'animate-pulse' : ''}`}>
                                    <Image
                                        src="/PresetPlugin.svg"
                                        alt="Applying Presets"
                                        width={20}
                                        height={20}
                                    />
                                </div>
                                <span className="mt-2 text-xs sm:text-sm text-center">Applying<br className="sm:hidden" /> Presets</span>
                            </div>
                            
                            {/* Line 4-5 */}
                            <div className="h-px bg-black flex-grow mx-1 sm:mx-2"></div>
                            
                            {/* Step 5: Uploading/Done */}
                            <div className="flex flex-col items-center">
                                <div className={`w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-black flex items-center justify-center
                                    ${currentStep === 5 ? 'animate-pulse' : ''}`}>
                                    <Image
                                        src={autoUpload ? "/UploadingPlugin.svg" : "/DonePlugin.svg"}
                                        alt={autoUpload ? "Uploading" : "Done"}
                                        width={autoUpload ? 20 : 16}
                                        height={autoUpload ? 20 : 16}
                                    />
                                </div>
                                <span className="mt-2 text-xs sm:text-sm">{autoUpload ? "Uploading" : "Done"}</span>
                            </div>
                        </div>
                    </div>
                </div>
                
                {/* Mobile-only clip count for very small screens */}
                {/* <div className="sm:hidden flex justify-center items-center mt-4 bg-gray-100 rounded-md p-4">
                    <div className="flex items-center gap-4">
                        <div className="text-lg font-medium">Moments Clipped:</div>
                        <div className="text-3xl font-bold">{clipCount}</div>
                    </div>
                </div> */}
            </div>
        </div>
    );
}