"use client";

import { useEffect, useState, useMemo } from "react";

export function LinuxKernelPanic({
  message = "not syncing: Fatal exception in interrupt",
  code,
  errorType = "Oops: 0002 [#1] SMP NOPTI",
}: {
  message?: string;
  code?: string;
  errorType?: string;
}) {
  const [lines, setLines] = useState(0);

  const generatedCode = useMemo(() => {
    if (code) return code;

    const hex = Math.floor(Math.random() * 0xffffffff)
      .toString(16)
      .padStart(16, '0')
      .toUpperCase();

    return `0x${hex}`;
  }, [code]);

  useEffect(() => {
    const interval = setInterval(() => {
      setLines((prev) => (prev < 24 ? prev + 1 : 24));
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="h-screen w-screen bg-black text-[#00ff41] font-mono p-6 overflow-hidden flex flex-col"
      style={{
        fontFamily: '"Courier New", Courier, monospace',
        fontSize: "14.5px",
        lineHeight: "1.42",
      }}
    >
      <div className="max-w-5xl mx-auto w-full">
        <div className="mb-4">
          <div className="flex justify-center text-red-500 font-bold text-3xl mb-1">
            ------------[ !! KERNEL PANIC !! ]------------
          </div>
        </div>

        <p className="text-red-500 font-bold mb-4">{errorType}</p>

        <div className="space-y-1 text-white">
          {lines >= 1 && <p>CPU: 3 PID: 666 Comm: {message.slice(0, 20)} Tainted: G</p>}
          {lines >= 2 && <p>Hardware name: VorziOS Kernel Panic Simulator</p>}
          {lines >= 3 && <p>RIP: 0010:0xffffffff8a1b3c4d</p>}
          {lines >= 4 && <p>Code: {generatedCode} Bad RIP value</p>}
          {lines >= 5 && <p>RSP: 0018:ffffa3c0d2e1f8b0 EFLAGS: 00010286</p>}
          {lines >= 6 && <p>RAX: 0000000000000000 RBX: ffff9f0a5c3d2e00 RCX: 0000000000000000</p>}
          {lines >= 7 && <p>RDX: 0000000000000002 RSI: 0000000000000000 RDI: ffff9f0a5c3d2e00</p>}
          {lines >= 8 && <p>RBP: ffffa3c0d2e1f8d8 R08: 0000000000000001 R09: 0000000000000000</p>}
          {lines >= 9 && <p>R10: ffff9f0a5c3d2e00 R11: 0000000000000000 R12: 0000000000000000</p>}
          {lines >= 10 && <p>R13: ffffffffc05a1b2c R14: 0000000000000000 R15: 0000000000000000</p>}
          {lines >= 11 && <p>CR2: 0000000000000000 CR3: 0000000108a0a000 CR4: 00000000003706f0</p>}
          <br />

          {lines >= 12 && <p className="text-red-500">Call Trace:</p>}
          {lines >= 13 && <p> &lt;TASK&gt;</p>}
          {lines >= 14 && <p> ? {message}+0x2c/0x50</p>}
          {lines >= 15 && <p> ? do_syscall_64+0x3c/0x90</p>}
          {lines >= 16 && <p> ? entry_SYSCALL_64_after_hwframe+0x76/0x7e</p>}
          {lines >= 17 && <p> ? ksys_read+0x5f/0xe0</p>}
          {lines >= 18 && <p> ? vfs_read+0x1a0/0x2b0</p>}
          {lines >= 19 && <p>Modules linked in: panic_sim O</p>}
          {lines >= 20 && <p>---[ end trace 0000000000000000 ]---</p>}
        </div>

        <div className="mt-10 pl-4 flex justify-center">
          <p className="text-red-500 font-bold text-3xl">
            ---[ !! END OF KERNEL PANIC !! ]---
          </p>
        </div>
      </div>
    </div>
  );
}
