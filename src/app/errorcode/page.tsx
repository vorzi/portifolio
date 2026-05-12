'use client';

import { useSearchParams } from 'next/navigation';
import { BSOD } from "@/components/error/BSOD";
import { LinuxKernelPanic } from "@/components/error/Kernel Panic";

export default function ErrorCode() {
    const searchParams = useSearchParams();
    
    const code = searchParams.get('code') || "404";
    const msg = searchParams.get('msg') || "System error occurred";

    const isWindows = Math.random() > 0.5;

    return isWindows ? (
        <BSOD 
            code={code} 
            msg={msg} 
        />
    ) : (
        <LinuxKernelPanic 
            code={code}
            message={msg}
        />
    );
}