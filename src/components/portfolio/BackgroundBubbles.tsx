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
  "rgba(255, 182, 193, 0.9)", // Pink - increased opacity
  "rgba(135, 206, 235, 0.9)", // Sky Blue - increased opacity
  "rgba(221, 160, 221, 0.9)", // Plum - increased opacity
  "rgba(255, 255, 153, 0.9)", // Yellow - increased opacity
  "rgba(152, 251, 152, 0.9)", // Pale Green - increased opacity
  "rgba(255, 159, 67, 0.9)", // Orange - increased opacity
  "rgba(255, 105, 180, 0.9)", // Hot Pink - new color
  "rgba(100, 149, 237, 0.9)", // Cornflower Blue - new color
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

      // Slightly increased bubble count for better visibility
      let count;
      if (layer === "back") {
        count = isMobile ? 8 : 15; // Slightly more back bubbles for depth
      } else {
        count = isMobile ? 4 : 7; // Slightly more front bubbles for visibility
      }

      for (let i = 0; i < count; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size:
            layer === "back"
              ? Math.random() * 100 + 60 // Increased size range for back bubbles (60-160px)
              : Math.random() * 50 + 20, // Increased size range for front bubbles (20-70px)
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

  // Physics loop with smoother, more natural movement
  const updateBubbles = (timestamp: number) => {
    setBubbles((prevBubbles) => {
      return prevBubbles.map((b) => {
        let { x, y, vx, vy } = b;

        const time = timestamp * 0.001; // Use the provided timestamp for smoother animation
        const noise = (n: number) => 0.5 * Math.sin(n) + 0.5; // Normalized sine wave for smoother transitions

        // Enhanced floating motion with more pronounced movement
        const noiseX = noise(time * 0.18 + b.id * 0.5) * 2 - 1;
        const noiseY = noise(time * 0.15 + b.id * 0.6) * 2 - 1;
        const noiseZ = noise(time * 0.12 + b.id * 0.3) * 2 - 1;

        // Size-based movement - larger bubbles move slower but more deliberately
        const sizeFactor = 1 + b.size / 80; // Stronger size effect on movement

        // More pronounced horizontal movement with size-based variation
        vx += ((noiseX * 0.002 + noiseZ * 0.0008) * b.speedFactor) / sizeFactor;

        // Stronger upward bias with smoother vertical movement
        const verticalBias = -0.0006; // Increased upward force
        vy +=
          ((noiseY * 0.0012 + noiseZ * 0.0006 + verticalBias) * b.speedFactor) /
          sizeFactor;

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

        // Apply velocity with easing for smoother movement
        x += vx;
        y += vy;

        // Enhanced physics for more natural movement
        const mass = 1 + b.size / 60; // Stronger size effect on inertia
        vx *= 0.97; // Slightly less friction for smoother movement
        vy *= 0.97;

        // Adjusted speed limits for better visibility
        const baseMaxSpeed = 1.1; // Increased for more noticeable movement
        const sizeEffect = 0.5 * (1 - b.size / 180); // More pronounced size effect
        const maxSpeed = baseMaxSpeed + sizeEffect; // Max 1.1-1.6
        const speed = Math.sqrt(vx * vx + vy * vy);
        if (speed > maxSpeed) {
          vx = (vx / speed) * maxSpeed;
          vy = (vy / speed) * maxSpeed;
        }

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
    // Smoother respawn logic with more natural starting positions
    setTimeout(() => {
      setBubbles((prev) => {
        // Start bubbles just below the viewport with gentle upward motion
        const startY = window.innerHeight + Math.random() * 100;
        const startX = Math.random() * window.innerWidth;

        const newBubble: Bubble = {
          id: Date.now() + Math.random(),
          x: startX,
          y: startY,
          size:
            layer === "back"
              ? Math.random() * 60 + 30 // 30-90px for back layer
              : Math.random() * 30 + 10, // 10-40px for front layer
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.1, // Gentler horizontal movement
          vy: -0.05 - Math.random() * 0.1, // Slower, more controlled upward movement
          speedFactor: 0.3 + Math.random() * 0.4, // More consistent speed range
        };
        return [...prev, newBubble];
      });
    }, 1000 + Math.random() * 1000); // More random respawn timing
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
