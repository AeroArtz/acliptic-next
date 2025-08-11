'use client'

import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { HashLoader } from "react-spinners"
import { AlertCircle, Play, Video, Radio } from "lucide-react"

interface PluginDialogProps {
    user_id: string,
    isOpen: boolean;
    onOpenChange: (open: boolean) => void;
    twitch_username?: string;
    youtube_channel_id?: string;
}

// Define response types for API responses
interface StreamApiResponse {
    success: boolean;
    message: string;
    error?: string;
    details?: string;
    content_type?: 'live' | 'vod';
    platform?: 'twitch' | 'youtube';
    stream_quality?: 'source' | 'high' | 'medium' | 'low';
    stream_resolution?: '1080p' | '720p' | '480p' | '360p';
    stream_data?: {
        title?: string;
        thumbnail_url?: string;
        started_at?: string;
        viewer_count?: number;
    };
}

type ContentSource = 'youtube-video' | 'youtube-live' | 'twitch-vod' | 'twitch-live';

export default function PluginDialog({ 
    user_id,
    isOpen, 
    onOpenChange,
    twitch_username,
    youtube_channel_id
}: PluginDialogProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [streamOffline, setStreamOffline] = useState<boolean>(false);
    const [selectedSource, setSelectedSource] = useState<ContentSource>('youtube-video');
    const [inputValue, setInputValue] = useState<string>('');
    const router = useRouter();

    const contentSources = [
        {
            id: 'youtube-video' as ContentSource,
            title: 'YouTube Video',
            description: 'Process uploaded YouTube videos',
            icon: <Video className="w-6 h-6" />,
            platform: 'youtube',
            contentType: 'vod',
            connected: true,
            features: ['Auto Highlights', 'Captions', 'Reframing', 'Thumbnails'],
            requiresInput: true,
            inputPlaceholder: 'Enter YouTube video URL'
        },
        {
            id: 'youtube-live' as ContentSource,
            title: 'YouTube Live',
            description: 'Real-time livestream processing',
            icon: <Radio className="w-6 h-6" />,
            platform: 'youtube',
            contentType: 'live',
            connected: true,
            features: ['Live Clipping', 'Chat Analysis', 'Auto Upload', 'Alerts'],
            requiresInput: false,
            accountInfo: youtube_channel_id
        },
        {
            id: 'twitch-vod' as ContentSource,
            title: 'Twitch VOD',
            description: 'Process Twitch video recordings',
            icon: <Video className="w-6 h-6" />,
            platform: 'twitch',
            contentType: 'vod',
            connected: true,
            features: ['Highlight Detection', 'Viewer Peaks', 'Chat Replay', 'Clips'],
            requiresInput: true,
            inputPlaceholder: 'Enter Twitch VOD URL'
        },
        {
            id: 'twitch-live' as ContentSource,
            title: 'Twitch Live',
            description: 'Live Twitch stream monitoring',
            icon: <Radio className="w-6 h-6" />,
            platform: 'twitch',
            contentType: 'live',
            connected: true,
            features: ['Real-time Clips', 'Viewer Alerts', 'Auto Post', 'Analytics'],
            requiresInput: false,
            accountInfo: twitch_username
        }
    ];

    const handleLaunch = async () => {
        setIsLoading(true);
        setError(null);
        setStreamOffline(false);

        const selectedSourceData = contentSources.find(s => s.id === selectedSource);
        if (!selectedSourceData) return;

        try {
            const payload = {
                platform: selectedSourceData.platform,
                contentType: selectedSourceData.contentType,
                ...(selectedSourceData.requiresInput ? { inputValue } : {})
            };

            // Call the API to create a stream record
            let response1 = await fetch('/api/streams/twitch/live', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id : user_id,
                    twitch_username: twitch_username,
                    auto_upload : true
                })
            });

            const responseData1 = await response1.json();

            console.log(responseData1)

            // Call the API to create a stream record
            let response2 = await fetch('/api/launch-plugin/twitch/live', {
                method: 'POST', 
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    auto_upload : true
                })
            });

            const responseData2 = await response2.json() as StreamApiResponse;

            console.log(responseData2)

            // redirect to clips page
            let stream_id;
            if (responseData1){
                stream_id = responseData1["data"]

                console.log('stream id: ',stream_id)
                //router.push(`/Studio/stream/${stream_id}/clips`);
            }

            /*
            const response = await fetch('/api/streams/twitch/live', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user_id : true,
                    twitch_url: ''
                })
            });

            const responseData = await response.json() as StreamApiResponse;

            if (!responseData.success) {
                if (responseData.message?.includes("not live") || 
                    responseData.error?.includes("not live") || 
                    responseData.details?.includes("not available")) {
                    setStreamOffline(true);
                    throw new Error(responseData.message || "Stream or video is not available. Please check your input.");
                } else {
                    throw new Error(responseData.error || responseData.details || responseData.message || 'Failed to start processing');
                }
            }
            
            router.push(`/Studio/Plugin?platform=${selectedSourceData.platform}&contentType=${selectedSourceData.contentType}&user_id=${user_id}`);

            */ 
            
        } catch (error) {
            const err = error as Error;
            console.error('Error starting process:', err);
            setError(err.message);
            setIsLoading(false);
        }
    };

    const isInputValid = () => {
        const selectedSourceData = contentSources.find(s => s.id === selectedSource);
        if (!selectedSourceData) return false;
        
        if (selectedSourceData.requiresInput) {
            return !!inputValue.trim();
        }
        
        return true;
    };

    const renderContent = () => {
        if (isLoading) {
            return (
                <div className="flex flex-col items-center justify-center h-[200px]">
                    <HashLoader 
                        color="#000000"
                        size={50}
                        speedMultiplier={0.9}
                    />
                    <p className="mt-6 text-[16px] text-gray-900 dark:text-gray-100 font-helvetica">
                        Initializing...
                    </p>
                </div>
            );
        }
        
        if (streamOffline) {
            return (
                <>
                    <DialogHeader>
                        <DialogTitle className="text-3xl font-semibold text-gray-900 dark:text-gray-100">
                            Content Unavailable
                        </DialogTitle>
                    </DialogHeader>
                    
                    <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-lg flex items-start">
                        <AlertCircle className="text-red-500 mr-3 shrink-0 mt-0.5" size={20} />
                        <div>
                            <p className="text-[16px] text-red-700 dark:text-red-400 font-medium">
                                Content is unavailable
                            </p>
                            <p className="text-[14px] text-red-600 dark:text-red-300 mt-1">
                                The content you specified could not be accessed. Please check the URL and try again.
                            </p>
                        </div>
                    </div>
                    
                    {error && (
                        <div className="mt-2 text-red-600 dark:text-red-400 text-sm">
                            {error}
                        </div>
                    )}
                    
                    <div className="mt-8 flex justify-end gap-3">
                        <Button 
                            className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 px-6"
                            onClick={() => onOpenChange(false)}
                        >
                            Close
                        </Button>
                        <Button 
                            className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-gray-100 px-6"
                            onClick={() => {
                                setStreamOffline(false);
                                setError(null);
                            }}
                        >
                            Try Again
                        </Button>   
                    </div>
                </>
            );
        }
        
        return (
            <>
                <DialogHeader>
                    <DialogTitle className="text-2xl font-semibold text-gray-900 dark:text-gray-100 mb-2">
                        Choose Content Source
                    </DialogTitle>
                </DialogHeader>
                
                <div className="mt-6 space-y-4">
                    {/* Content Source Cards */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contentSources.map((source) => (
                            <div
                                key={source.id}
                                className={`relative p-4 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
                                    selectedSource === source.id
                                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 dark:border-blue-400 shadow-lg'
                                        : 'border-gray-500 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-600 dark:hover:border-gray-500 hover:shadow-md'
                                }`}
                                onClick={() => setSelectedSource(source.id)}
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-3">
                                        <div className={`p-2 rounded-lg ${
                                            source.platform === 'youtube' 
                                                ? 'bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400' 
                                                : 'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400'
                                        }`}>
                                            {source.icon}
                                        </div>
                                        <div>
                                            <h3 className="font-semibold text-gray-900 dark:text-gray-100">
                                                {source.title}
                                            </h3>
                                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                                {source.description}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                
                                {/* Account Info */}
                                {source.accountInfo && (
                                    <div className="mb-3 p-3 bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 rounded-lg border border-gray-600 dark:border-gray-600 shadow-sm">
                                        <div className="flex items-center gap-2">
                                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">Connected:</span> {source.accountInfo}
                                            </p>
                                        </div>
                                    </div>
                                )}
                                
                                {/* URL Input */}
                                {source.requiresInput && (
                                    <div className="mb-3">
                                        <div className="relative">
                                            <Input
                                                value={selectedSource === source.id ? inputValue : ''}
                                                onChange={(e) => {
                                                    if (selectedSource === source.id) {
                                                        setInputValue(e.target.value);
                                                    }
                                                }}
                                                placeholder={source.inputPlaceholder}
                                                className="w-full bg-white dark:bg-gray-800 border-2 border-gray-500 dark:border-gray-600 focus:border-blue-500 dark:focus:border-blue-400 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-blue-400/20 text-gray-900 dark:text-gray-100 text-sm rounded-lg px-4 py-3 transition-all duration-200 placeholder:text-gray-500 dark:placeholder:text-gray-500"
                                            />
                                            {selectedSource === source.id && inputValue && (
                                                <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                                                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                )}
                                
                                {/* Features */}
                                {/* <div className="mb-3">
                                    <p className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">AI FEATURES</p>
                                    <div className="flex flex-wrap gap-1">
                                        {source.features.map((feature, index) => (
                                            <span
                                                key={index}
                                                className="inline-flex items-center gap-1 px-2 py-1 bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 text-xs rounded-full"
                                            >
                                                ✨ {feature}
                                            </span>
                                        ))}
                                    </div>
                                </div> */}
                            </div>
                        ))}
                    </div>

                </div>
                
                {error && (
                    <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 text-red-600 dark:text-red-400 rounded-lg text-sm">
                        {error}
                    </div>
                )}
                
                <div className="mt-8 flex justify-end gap-3">
                    <Button 
                        className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 px-6"
                        onClick={() => onOpenChange(false)}
                    >
                        Cancel
                    </Button>
                    <Button 
                    className="bg-black dark:bg-white text-white dark:text-black hover:bg-black/90 dark:hover:bg-gray-100 px-6"
                    onClick={handleLaunch}
                    disabled={
                        !user_id || 
                        !isInputValid() || 
                        isLoading || 
                        !contentSources.find(s => s.id === selectedSource)?.accountInfo && !contentSources.find(s => s.id === selectedSource)?.requiresInput
                    }
                    >
                    Launch
                    </Button>
                </div>
            </>
        );
    };

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0 bg-white dark:bg-black border-gray-800 dark:border-gray-700 rounded-xl shadow-lg">
                <div className="p-6">
                    {renderContent()}
                </div>
            </DialogContent>
        </Dialog>
    );
}