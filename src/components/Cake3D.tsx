import { motion } from 'framer-motion';

export default function Cake3D() {
  return (
    <div className="flex items-center justify-center py-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="relative"
        style={{ perspective: '1000px' }}
      >
        {/* Cena 3D */}
        <div
          className="relative w-48 h-48"
          style={{
            transformStyle: 'preserve-3d',
            animation: 'rotateCake 8s linear infinite',
          }}
        >
          {/* Sombra no chão */}
          <div
            className="absolute bottom-0 left-1/2 -translate-x-1/2 w-40 h-8 bg-black/20 rounded-full blur-md"
            style={{
              transform: 'rotateX(90deg) translateZ(-60px)',
            }}
          />

          {/* Base do prato */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-44 h-44 rounded-full"
            style={{
              bottom: '10px',
              background: 'linear-gradient(145deg, #f5f5f5, #e0e0e0)',
              transform: 'rotateX(75deg) translateZ(-10px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.2)',
            }}
          />

          {/* Camada inferior do bolo */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-36 h-36 rounded-full"
            style={{
              bottom: '20px',
              background: 'linear-gradient(145deg, #fbbf24, #f59e0b)',
              transform: 'rotateX(75deg) translateZ(10px)',
              boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.2), 0 5px 15px rgba(245,158,11,0.3)',
            }}
          />

          {/* Recheio - creme */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-36 h-36 rounded-full"
            style={{
              bottom: '22px',
              background: 'linear-gradient(145deg, #fef3c7, #fde68a)',
              transform: 'rotateX(75deg) translateZ(25px)',
              boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.1)',
            }}
          />

          {/* Camada superior do bolo */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-32 h-32 rounded-full"
            style={{
              bottom: '25px',
              background: 'linear-gradient(145deg, #ec4899, #db2777)',
              transform: 'rotateX(75deg) translateZ(40px)',
              boxShadow: 'inset 0 -10px 20px rgba(0,0,0,0.3), 0 5px 15px rgba(219,39,119,0.4)',
            }}
          />

          {/* Cobertura de chocolate */}
          <div
            className="absolute left-1/2 -translate-x-1/2 w-32 h-32 rounded-full"
            style={{
              bottom: '27px',
              background: 'linear-gradient(145deg, #7c2d12, #431407)',
              transform: 'rotateX(75deg) translateZ(55px)',
              boxShadow: 'inset 0 -5px 10px rgba(0,0,0,0.4), 0 5px 15px rgba(67,20,7,0.5)',
            }}
          />

          {/* Cereja no topo */}
          <motion.div
            animate={{
              y: [0, -5, 0],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
            className="absolute left-1/2 -translate-x-1/2 w-8 h-8 rounded-full"
            style={{
              bottom: '110px',
              background: 'radial-gradient(circle at 30% 30%, #ef4444, #991b1b)',
              transform: 'translateZ(80px)',
              boxShadow: '0 5px 15px rgba(239,68,68,0.5), inset 0 -3px 6px rgba(0,0,0,0.3)',
            }}
          >
            {/* Folhinha da cereja */}
            <div
              className="absolute -top-2 left-1/2 w-1 h-4 bg-green-700 rounded-full"
              style={{
                transform: 'rotate(-20deg)',
              }}
            />
            <div
              className="absolute -top-3 left-1/2 w-3 h-2 bg-green-600 rounded-full"
              style={{
                transform: 'rotate(-20deg) translateX(-50%)',
              }}
            />
          </motion.div>

          {/* Decorações - granulado */}
          {[...Array(8)].map((_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 rounded-full"
              style={{
                left: `${50 + Math.cos((i * Math.PI) / 4) * 30}%`,
                bottom: `${60 + Math.sin((i * Math.PI) / 4) * 5}px`,
                background: ['#fbbf24', '#34d399', '#f472b6', '#60a5fa'][i % 4],
                transform: `translateZ(60px) rotateY(${i * 45}deg)`,
              }}
            />
          ))}
        </div>
      </motion.div>

      <style>{`
        @keyframes rotateCake {
          0% {
            transform: rotateY(0deg) rotateX(-10deg);
          }
          100% {
            transform: rotateY(360deg) rotateX(-10deg);
          }
        }
      `}</style>
    </div>
  );
}
