import { motion } from 'framer-motion';
import { useEffect } from 'react';

interface ConfettiProps {
  show: boolean;
  onComplete?: () => void;
}

export default function Confetti({ show, onComplete }: ConfettiProps) {
  useEffect(() => {
    if (show && onComplete) {
      const timer = setTimeout(onComplete, 1000);
      return () => clearTimeout(timer);
    }
  }, [show, onComplete]);

  if (!show) return null;

  const confettiPieces = Array.from({ length: 20 }, (_, i) => (
    <motion.div
      key={i}
      initial={{
        x: Math.random() * window.innerWidth,
        y: -10,
        rotate: 0,
        scale: 0,
      }}
      animate={{
        y: window.innerHeight + 10,
        rotate: 360,
        scale: 1,
      }}
      transition={{
        duration: 2 + Math.random(),
        ease: 'easeOut',
        delay: Math.random() * 0.5,
      }}
      className={`absolute w-3 h-3 ${
        ['bg-tfe-primary', 'bg-tfe-accent', 'bg-yellow-400', 'bg-green-400', 'bg-purple-400'][
          Math.floor(Math.random() * 5)
        ]
      }`}
      style={{
        transform: `rotate(${Math.random() * 360}deg)`,
      }}
    />
  ));

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {confettiPieces}
    </div>
  );
}
