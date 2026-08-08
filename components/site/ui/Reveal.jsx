'use client';
import { motion, useReducedMotion } from 'motion/react';

/* Scroll-triggered fade + rise. Becomes a plain wrapper when the visitor
   asks for reduced motion, so nothing animates and nothing stays hidden. */
export default function Reveal({
  children,
  delay = 0,
  y = 24,
  as = 'div',
  className = '',
  ...rest
}) {
  const reduce = useReducedMotion();
  const MotionTag = motion[as] || motion.div;

  if (reduce) {
    const Tag = as;
    return (
      <Tag className={className} {...rest}>
        {children}
      </Tag>
    );
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </MotionTag>
  );
}
