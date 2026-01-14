import { useState, useEffect } from 'react';
import { ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const ScrollToTopBtn = () => {
    const [showButton, setShowButton] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            // Show button after scrolling down one full screen height
            if (window.scrollY > 400) {
                setShowButton(true);
            } else {
                setShowButton(false);
            }
        };

        window.addEventListener('scroll', handleScroll, { passive: true });
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    return (
        <AnimatePresence>
            {showButton && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    onClick={scrollToTop}
                    // Enhanced UI: Glassmorphism + Glow
                    className="fixed bottom-8 right-8 w-12 h-12 bg-blue-600 text-white rounded-full shadow-[0_0_20px_rgba(37,99,235,0.4)] cursor-pointer hover:bg-blue-500 hover:scale-110 active:scale-90 transition-all z-[100] flex justify-center items-center border border-white/20 backdrop-blur-sm"
                >
                    <ChevronUp size={24} strokeWidth={3} />
                </motion.div>
            )}
        </AnimatePresence>
    );
};