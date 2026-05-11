"use client";

import { useEffect, useState } from "react";

export function BSOD({
  code = "CRITICAL_PROCESS_DIED",
  msg = "I cant find this"
}: {
  code?: string;
  msg?: string;
}) {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress((prev) => (prev < 100 ? prev + 1 : 100));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="h-screen w-screen text-white flex flex-col justify-center overflow-hidden"
      style={{
        backgroundColor: "#0078D7",
        fontFamily: '"Segoe UI Variable", "Segoe UI", system-ui, sans-serif',
      }}
    >
      <div className="max-w-220 mx-auto px-8">
        <h1
          style={{
            fontSize: "128px",
            lineHeight: "1",
            fontWeight: "300",
            marginBottom: "24px",
            letterSpacing: "-4px",
          }}
        >
          :(
        </h1>

        <p
          style={{
            fontSize: "28px",
            fontWeight: "400",
            lineHeight: "1.3",
            marginBottom: "32px",
          }}
        >
          Seu PC encontrou um problema e precisa ser reiniciado.<br />
          Estamos apenas coletando algumas informações de erro e depois vamos reiniciar para você.
        </p>

        <div className="mb-8">
          <p style={{ fontSize: "22px", marginBottom: "12px" }}>
            {progress}% concluído
          </p>
        </div>

        <div className="flex items-start gap-8">
          <div className="shrink-0 pt-1">
            <img
              src={`https://api.qrserver.com/v1/create-qr-code/?size=148x148&data=https://www.windows.com/stopcode`}
              alt="QR Code"
              width={148}
              height={148}
              style={{ imageRendering: "crisp-edges" }}
            />
          </div>

          <div style={{ fontSize: "17px", lineHeight: "1.65" }}>
            <p>
              Para saber mais sobre esse problema e possíveis soluções, visite<br />
              <span style={{ textDecoration: "underline" }}>
                https://www.windows.com/stopcode
              </span>
            </p>

            <p style={{ marginTop: "28px" }}>
              Se você precisar falar com o suporte, forneça as seguintes informações:
            </p>

            <p style={{ marginTop: "12px" }}>
              Stop code: <strong>{code} {msg}</strong>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}