// components/dashboard/CommentsTab.jsx
'use client'
import { AnimatedCommentsDemo } from "@/components/Dashboard/dashboardComments";

export default function CommentsTab() {
    return (
        <>
            <div className="absolute right-20 top-1/2 -translate-y-1/2">
                <AnimatedCommentsDemo />
            </div>
            <div className="absolute bottom-8 left-8">
                <p className="text-4xl" style={{ letterSpacing: '-0.04em', lineHeight: '92.7%' }}>CLIP<br />COMMENTS</p>
            </div>
        </>
    );
}