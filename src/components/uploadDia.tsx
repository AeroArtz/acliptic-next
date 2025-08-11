'use client'

import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Switch } from "@/components/ui/switch"
import Image from "next/image"
import { useState } from "react"

interface SocialAccount {
    name: string
    username: string
    connected: boolean
    icon: string
}

export default function UploadDialog() {
    const [accounts, setAccounts] = useState<SocialAccount[]>([
        {
            name: "Count Orlok",
            username: "orlok_103",
            connected: false,
            icon: "/uploadTiktok.webp"
        },
        {
            name: "Instagram",
            username: "Connect to post",
            connected: false,
            icon: "/uploadInsta.webp"
        },
        {
            name: "YouTube Shorts",
            username: "Connect to post",
            connected: false,
            icon: "/youtubeShorts.png"
        }
    ])

    const handleConnect = (index: number) => {
        const newAccounts = [...accounts]
        newAccounts[index].connected = !newAccounts[index].connected
        setAccounts(newAccounts)
    }

    const isAnyAccountConnected = accounts.some(account => account.connected)

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button
                    className="h-[40px] w-[110px] rounded-[14px] flex justify-around"
                    variant="outline"
                >
                    <Image src="/upload.svg" alt="upload" height={25} width={25} />
                    <p className="text-[12px] font-light">Upload</p>
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[550px] min-h-[600px] flex flex-col">
                <DialogHeader>
                    <DialogTitle className="text-2xl font-normal mb-4">Post your clips</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                    <p className="text-lg">Accounts</p>
                    {accounts.map((account, index) => (
                        <div 
                            key={index}
                            className="flex items-center justify-between p-4 rounded-lg"
                            style={{ backgroundColor: "#F6F6F8" }}
                        >
                            <div className="flex items-center gap-3 hel-font">
                                <Image
                                    src={account.icon}
                                    alt={account.name}
                                    width={account.name === "YouTube Shorts" ? 24 : account.name === "Count Orlok" ? 46 : 32}
                                    height={account.name === "YouTube Shorts" ? 24 : account.name === "Count Orlok" ? 46 : 32}
                                    className={`rounded-md ${account.name === "Count Orlok" ? "-ml-2" : ""}`}
                                />
                                <div>
                                    <p className="font-medium">{account.name}</p>
                                    <p className="text-sm text-gray-500">{account.username}</p>
                                </div>
                            </div>
                            {account.username === "orlok_103" ? (
                                <Switch
                                    checked={account.connected}
                                    onCheckedChange={() => handleConnect(index)}
                                    className="data-[state=unchecked]:bg-[#E2E2E2]"
                                />
                            ) : (
                                <Button 
                                    variant="secondary"
                                    className="bg-[#E2E2E2] hover:bg-[#d1d1d1] hel-font"
                                    onClick={() => handleConnect(index)}
                                >
                                    Connect
                                </Button>
                            )}
                        </div>
                    ))}
                </div>
                <div className="mt-auto pt-6 flex justify-end">
                    <Button 
                        disabled={!isAnyAccountConnected}
                        className="w-[100px]"
                    >
                        Post
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    )
}
