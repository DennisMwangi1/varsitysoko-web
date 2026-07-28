import React from 'react';
import { motion } from 'framer-motion';
import { useIsMobile, usePrefersReducedMotion } from './useSceneLoop';
import { EASE } from './variants';

/**
 * Product device cluster — high-res 3D laptop + phone mockup.
 */
const Hero: React.FC<{ className?: string }> = ({ className = '' }) => {
  const reduced = usePrefersReducedMotion();
  const mobile = useIsMobile();
  const staticHero = reduced || mobile;

  const image = (
    <img
      src="/images/laptop.png"
      alt="VarsitySoko on laptop and phone — browse listings, chat with sellers, and arrange campus meetups"
      width={1320}
      height={862}
      className="mx-auto h-auto w-full max-w-5xl"
      decoding="async"
      loading="eager"
      fetchPriority="high"
    />
  );

  return (
    <div className={`relative w-full ${className}`}>
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="h-2/3 w-2/3 rounded-full bg-brand/15 blur-3xl" />
      </div>

      <div className="relative">
        {staticHero ? (
          image
        ) : (
          <motion.div
            initial={false}
            animate={{ y: [0, -6, 0] }}
            transition={{
              duration: 8,
              ease: EASE,
              repeat: Infinity,
              repeatType: 'loop',
            }}
            style={{ willChange: 'transform' }}
          >
            {image}
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Hero;
