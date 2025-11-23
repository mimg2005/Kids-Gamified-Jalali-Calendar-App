import { motion } from 'framer-motion';

export const StarExplosion = () => {
  return (
    <div className="absolute inset-0 pointer-events-none flex items-center justify-center z-50">
      {[...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 1, scale: 0, x: 0, y: 0 }}
          animate={{ 
            opacity: 0, 
            scale: 1.5, 
            x: (Math.random() - 0.5) * 100, 
            y: (Math.random() - 0.5) * 100,
            rotate: Math.random() * 360
          }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="absolute text-3xl"
        >
          ⭐
        </motion.div>
      ))}
    </div>
  );
};