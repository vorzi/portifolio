"use client";

import { useEffect } from "react";

export default function AnimatedTitle({ text }: { text: string }) {
  useEffect(() => {
    let index = 1;
    let deleting = false;

    const interval = setInterval(() => {
      if (!deleting) {
        document.title = text.slice(0, index);

        index++;

        if (index > text.length) {
          deleting = true;

          setTimeout(() => {}, 1000);
        }
      } else {
        document.title = text.slice(0, index);

        index--;

        if (index === 0) {
          deleting = false;
          index = 1;
        }
      }
    }, 750);

    return () => clearInterval(interval);
  }, []);

  return null;
}