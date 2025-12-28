
import React, { useEffect, useState } from 'react';

interface SplashScreenProps {
  onFinish: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onFinish }) => {
  const [lettersVisible, setLettersVisible] = useState(false);

  useEffect(() => {
    // Start animation sequence
    setTimeout(() => setLettersVisible(true), 300);
    
    // Finish after animation
    const timer = setTimeout(() => {
      onFinish();
    }, 3500);

    return () => clearTimeout(timer);
  }, [onFinish]);

  return (
    <div className="fixed inset-0 bg-[#F8F9FA] z-[100] flex flex-col items-center justify-center overflow-hidden">
      <div className="relative flex items-end">
        {/* Letters container */}
        <div className="flex text-4xl font-black tracking-tighter text-jobgreen overflow-hidden relative z-10">
          {['J', 'o', 'b', 'L', 'i', 'b', 'r', 'e'].map((letter, i) => (
            <span 
                key={i} 
                className="transform transition-all duration-500 ease-out"
                style={{ 
                    opacity: lettersVisible ? 1 : 0, 
                    transform: lettersVisible ? 'translateY(0)' : 'translateY(20px)',
                    transitionDelay: `${i * 100}ms`
                }}
            >
              {letter}
            </span>
          ))}
        </div>

        {/* The Rolling Dot */}
        <div 
            className={`w-3 h-3 rounded-full bg-jobgold absolute bottom-2 left-0 z-20 transition-all duration-[2000ms] ease-in-out ${lettersVisible ? 'opacity-100' : 'opacity-0'}`}
            style={{
                // Combine animation properties to avoid React warning about mixing shorthand and longhand
                animation: lettersVisible ? 'rollAndDrop 2s 1s forwards' : 'none',
            }}
        ></div>
      </div>

      <style>{`
        @keyframes rollAndDrop {
          0% { left: -20px; transform: rotate(0deg); bottom: 10px; }
          40% { left: 45%; bottom: 60px; transform: rotate(180deg); } /* Jump high */
          70% { left: 90%; bottom: 8px; transform: rotate(360deg); } /* Land near end */
          85% { left: 102%; bottom: 15px; transform: rotate(400deg); } /* Small bounce */
          100% { left: 100%; bottom: 8px; transform: rotate(360deg); } /* Rest as dot */
        }
      `}</style>
      
      <p className="absolute bottom-10 text-xs font-medium text-gray-400 uppercase tracking-widest animate-pulse">
        Chargement du réseau...
      </p>
    </div>
  );
};
