import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "motion/react";

// Custom hook to track window size
const useWindowSize = (options?: { [key: string]: any }) => {
  const [windowSize, setWindowSize] = useState({
    width: typeof window !== "undefined" ? window.innerWidth : 0,
    height: typeof window !== "undefined" ? window.innerHeight : 0,
  });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return windowSize;
};

interface Bubble {
  id: number;
  x: number;
  y: number;
  size: number;
  color: string;
  vx: number;
  vy: number;
  speedFactor: number;
}

const colors = [
  "rgba(255, 182, 193, 0.8)", // Pink
  "rgba(135, 206, 235, 0.8)", // Sky Blue
  "rgba(221, 160, 221, 0.8)", // Plum
  "rgba(255, 255, 153, 0.8)", // Yellow
  "rgba(152, 251, 152, 0.8)", // Pale Green
  "rgba(255, 159, 67, 0.8)", // Orange
];

interface BackgroundBubblesProps {
  layer: "front" | "back";
}

export const BackgroundBubbles = ({ layer }: BackgroundBubblesProps) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const requestRef = useRef<number>();
  const mouseRef = useRef({ x: -1000, y: -1000 });
  const { width, height } = useWindowSize();

  // Initialize bubbles
  useEffect(() => {
    const initBubbles = () => {
      const newBubbles: Bubble[] = [];
      const isMobile = window.innerWidth < 768;

      // Reduced number of bubbles for a cleaner look
      let count;
      if (layer === "back") {
        count = isMobile ? 15 : 25;
      } else {
        count = isMobile ? 8 : 12;
      }

      for (let i = 0; i < count; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size:
            layer === "back"
              ? Math.random() * 80 + 40
              : Math.random() * 40 + 15,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.15,
          vy: (Math.random() - 0.5) * 0.15,
          speedFactor: 0.2 + Math.random() * 0.3,
        });
      }
      setBubbles(newBubbles);
    };

    initBubbles();

    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    const handleTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) {
        mouseRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      }
    };

    window.addEventListener("mousemove", handleMouseMove);
    window.addEventListener("touchmove", handleTouchMove);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("touchmove", handleTouchMove);
    };
  }, [layer, width, height]);

  // Physics loop
  const updateBubbles = (timestamp: number) => {
    setBubbles((prevBubbles) => {
      return prevBubbles.map((b) => {
        let { x, y, vx, vy } = b;

        const time = Date.now() * 0.001;
        // More pronounced floating motion with increased base speed
        vx += Math.sin(time * 0.2 + b.id * 0.1) * 0.0012 * b.speedFactor;
        vy += Math.cos(time * 0.2 + b.id * 0.1) * 0.0012 * b.speedFactor;

        // Enhanced vertical drift for more noticeable movement
        vy -=
          0.01 *
          b.speedFactor *
          (0.8 + Math.sin(time * 0.15 + b.id * 0.5) * 0.3);

        // Interaction
        const dx = x - mouseRef.current.x;
        const dy = y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repulsionRadius = layer === "front" ? 150 : 100;

        if (dist < repulsionRadius) {
          const force = (repulsionRadius - dist) / repulsionRadius;
          const angle = Math.atan2(dy, dx);
          const pushStrength = layer === "front" ? 0.08 : 0.04;

          vx += Math.cos(angle) * force * pushStrength;
          vy += Math.sin(angle) * force * pushStrength;
        }

        // Increased max velocity for more dynamic, yet controlled movement
        const maxV = layer === "front" ? 1.5 : 0.9;
        const v = Math.sqrt(vx * vx + vy * vy);
        if (v > maxV) {
          vx = (vx / v) * maxV;
          vy = (vy / v) * maxV;
        }

        // Apply velocity with slight easing
        x += vx;
        y += vy;

        // Slightly reduced friction for smoother movement
        vx *= 0.96;
        vy *= 0.96;

        // Boundary wrapping
        const buffer = 100;
        if (x < -buffer) x = window.innerWidth + buffer;
        if (x > window.innerWidth + buffer) x = -buffer;
        if (y < -buffer) y = window.innerHeight + buffer;
        if (y > window.innerHeight + buffer) y = -buffer;

        return { ...b, x, y, vx, vy };
      });
    });
    requestRef.current = requestAnimationFrame(updateBubbles);
  };

  useEffect(() => {
    requestRef.current = requestAnimationFrame(updateBubbles);
    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, []);

  const popBubble = (id: number) => {
    setBubbles((prev) => prev.filter((b) => b.id !== id));
    // Respawn logic
    setTimeout(() => {
      setBubbles((prev) => {
        const newBubble: Bubble = {
          id: Date.now() + Math.random(),
          x: Math.random() * window.innerWidth,
          y: window.innerHeight + 50,
          size:
            layer === "back"
              ? Math.random() * 80 + 40
              : Math.random() * 40 + 15,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.2, // More noticeable horizontal movement
          vy: -0.15 - Math.random() * 0.12, // Stronger upward push
          speedFactor: 0.6 + Math.random() * 0.5, // Increased base speed factor for more movement
        };
        return [...prev, newBubble];
      });
    }, 800);
  };

  return (
    <div
      className={`fixed inset-0 overflow-hidden pointer-events-none ${
        layer === "front" ? "z-20" : "z-0"
      }`}
      style={{ width: "100%", height: "100%" }}
    >
      <AnimatePresence mode="popLayout">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            layoutId={`bubble-${bubble.id}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{
              x: bubble.x - bubble.size / 2,
              y: bubble.y - bubble.size / 2,
              scale: 1,
              opacity: 1,
            }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5 }}
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: bubble.size,
              height: bubble.size,
              borderRadius: "50%",
              background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.95), rgba(255, 255, 255, 0.5) 40%, ${bubble.color} 100%)`,
              boxShadow: `inset 0 0 ${
                bubble.size * 0.2
              }px rgba(255, 255, 255, 0.7), 
                        inset ${bubble.size * 0.1}px ${bubble.size * 0.1}px ${
                bubble.size * 0.2
              }px rgba(0, 0, 0, 0.03),
                        0 4px 12px rgba(0, 0, 0, 0.03)`,
              backdropFilter: "blur(2px)",
              cursor: "pointer",
              pointerEvents: "auto",
              willChange: "transform",
              opacity: 0.9,
              transition: "opacity 0.3s ease",
            }}
            whileHover={{
              scale: 1.05,
              opacity: 1,
              boxShadow: `inset 0 0 ${
                bubble.size * 0.25
              }px rgba(255, 255, 255, 0.9), 
                        inset ${bubble.size * 0.15}px ${bubble.size * 0.15}px ${
                bubble.size * 0.3
              }px rgba(0, 0, 0, 0.05),
                        0 6px 16px rgba(0, 0, 0, 0.05)`,
            }}
            onClick={() => popBubble(bubble.id)}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
