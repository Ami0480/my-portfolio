
import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';

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
  'rgba(255, 183, 178, 0.9)',
  'rgba(255, 223, 186, 0.9)',
  'rgba(255, 255, 186, 0.9)',
  'rgba(186, 255, 201, 0.9)',
  'rgba(186, 225, 255, 0.9)',
  'rgba(226, 194, 255, 0.9)',
  'rgba(255, 192, 203, 0.9)',
];

interface BackgroundBubblesProps {
  layer: 'front' | 'back';
}

export const BackgroundBubbles = ({ layer }: BackgroundBubblesProps) => {
  const [bubbles, setBubbles] = useState<Bubble[]>([]);
  const requestRef = useRef<number>();
  const mouseRef = useRef({ x: -1000, y: -1000 });

  // Initialize bubbles
  useEffect(() => {
    const initBubbles = () => {
      const newBubbles: Bubble[] = [];
      const isMobile = window.innerWidth < 768;
      
      // Reverting to previous optimized counts (slightly fewer than the "lots" request)
      let count;
      if (layer === 'back') {
        count = isMobile ? 30 : 50; 
      } else {
        count = isMobile ? 15 : 25;
      }
      
      for (let i = 0; i < count; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: layer === 'back' ? Math.random() * 80 + 40 : Math.random() * 40 + 15,
          color: colors[Math.floor(Math.random() * colors.length)],
          vx: (Math.random() - 0.5) * 0.15, 
          vy: (Math.random() - 0.5) * 0.15,
          speedFactor: 0.2 + Math.random() * 0.3 
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

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('touchmove', handleTouchMove);

    return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('touchmove', handleTouchMove);
    };
  }, [layer]);

  // Physics loop
  const updateBubbles = () => {
    setBubbles(prevBubbles => {
      return prevBubbles.map(b => {
        let { x, y, vx, vy } = b;
        
        const time = Date.now() * 0.001;
        // Gentle sine wave motion
        vx += Math.sin(time + b.id * 0.1) * 0.0003 * b.speedFactor;
        vy += Math.cos(time + b.id * 0.1) * 0.0003 * b.speedFactor;

        // Interaction
        const dx = x - mouseRef.current.x;
        const dy = y - mouseRef.current.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const repulsionRadius = layer === 'front' ? 150 : 100;

        if (dist < repulsionRadius) {
          const force = (repulsionRadius - dist) / repulsionRadius;
          const angle = Math.atan2(dy, dx);
          const pushStrength = layer === 'front' ? 0.08 : 0.04; 
          
          vx += Math.cos(angle) * force * pushStrength;
          vy += Math.sin(angle) * force * pushStrength;
        }

        // Max Velocity Cap
        const maxV = layer === 'front' ? 0.6 : 0.3; 
        const v = Math.sqrt(vx * vx + vy * vy);
        if (v > maxV) {
            vx = (vx / v) * maxV;
            vy = (vy / v) * maxV;
        }

        // Apply velocity
        x += vx;
        y += vy;

        // Friction
        vx *= 0.99;
        vy *= 0.99;

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
    setBubbles(prev => prev.filter(b => b.id !== id));
    // Respawn logic
    setTimeout(() => {
        setBubbles(prev => {
            const newBubble: Bubble = {
                id: Date.now() + Math.random(),
                x: Math.random() * window.innerWidth,
                y: window.innerHeight + 50,
                size: layer === 'back' ? Math.random() * 80 + 40 : Math.random() * 40 + 15,
                color: colors[Math.floor(Math.random() * colors.length)],
                vx: (Math.random() - 0.5) * 0.15,
                vy: -0.3,
                speedFactor: 0.2 + Math.random() * 0.3
            };
            return [...prev, newBubble];
        });
    }, 800);
  };

  return (
    <div 
      className={`fixed inset-0 overflow-hidden pointer-events-none ${layer === 'front' ? 'z-20' : 'z-0'}`}
      style={{ width: '100%', height: '100%' }}
    >
      <AnimatePresence mode='popLayout'>
        {bubbles.map(bubble => (
          <motion.div
            key={bubble.id}
            layoutId={`bubble-${bubble.id}`}
            initial={{ scale: 0, opacity: 0 }}
            animate={{ 
              x: bubble.x - bubble.size / 2,
              y: bubble.y - bubble.size / 2,
              scale: 1, 
              opacity: 1 
            }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 0.5 }} 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: bubble.size,
              height: bubble.size,
              borderRadius: '50%',
              background: `radial-gradient(circle at 30% 30%, rgba(255, 255, 255, 0.9), rgba(255, 255, 255, 0.2) 40%, ${bubble.color} 100%)`,
              boxShadow: `inset -2px -2px 8px rgba(0,0,0,0.05), 0px 2px 8px rgba(0,0,0,0.05)`,
              backdropFilter: 'blur(1px)',
              cursor: 'pointer',
              pointerEvents: 'auto',
              willChange: 'transform'
            }}
            onClick={() => popBubble(bubble.id)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.9 }}
          />
        ))}
      </AnimatePresence>
    </div>
  );
};
