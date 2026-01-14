import useMeasure from 'react-use-measure';
import Card from '@/components/landingPage/Card';
import { animate, motion, useMotionValue, useMotionValueEvent, useScroll } from 'framer-motion';  // Import useScroll
import { useEffect, useState } from 'react';
import ZoomOutCarousel from './ZoomOutCarousel';
import { useLocation } from "react-router-dom";
import { MdAutoAwesome } from "react-icons/md";


export default function VideoCarousel() {
    const location = useLocation();

    // Infinite Carousel
    const images = [
        'booksCoverPage/atomicHabits.png',
        'booksCoverPage/bhagwatGeeta.jpeg',
        'booksCoverPage/ikigai.jpeg',
        'booksCoverPage/psychologyOfMoney.jpeg',
        'booksCoverPage/richDadPoorDad.jpeg',
        'booksCoverPage/steveJobs.jpg',
        'booksCoverPage/thatNight.jpeg',
        'booksCoverPage/thePowerOfSubconsciousMind.jpeg',
    ];

    const FAST_DURATION = 25;
    const SLOW_DURATION = 75;

    const [duration, setDuration] = useState(FAST_DURATION);

    let [ref, { width }] = useMeasure();

    const xTranslation = useMotionValue(0);

    const [mustFinish, setMustFinish] = useState(false);
    const [rerender, setRerender] = useState(false);

    useEffect(() => {
        let controls;
        let finalPosition = -width / 2 - 8;

        if (mustFinish) {
            controls = animate(xTranslation, [xTranslation.get(), finalPosition], {
                ease: 'linear',
                duration: duration * (1 - xTranslation.get() / finalPosition),
                onComplete: () => {
                    setMustFinish(false);
                    setRerender(!rerender);
                }
            });
        } else {
            controls = animate(xTranslation, [0, finalPosition], {
                ease: 'linear',
                duration: duration,
                repeat: Infinity,
                repeatType: 'loop',
                repeatDelay: 0
            });
        }
    });

    const { scrollYProgress } = useScroll();

    const [carouselVariant, setCarouselVariant] = useState("inactive");

    useMotionValueEvent(scrollYProgress, "change", (progress) => {
        if (progress >= 0.67) setCarouselVariant("active");
        else setCarouselVariant("inactive");
    });

    return (
        <>
            <motion.div animate={carouselVariant} className="bg-backgroundContrast text-black">

                {
                    location.pathname === "/shop" && (
                        <div className="relative flex flex-col items-center justify-center pt-16 pb-10 overflow-hidden">
                            {/* Soft Ambient Glow - refined for a cleaner look */}
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-16 bg-blue-600/10 blur-[80px] -z-10" />

                            <motion.div
                                initial={{ opacity: 0, y: 15 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ duration: 0.6, ease: "easeOut" }}
                                className="text-center px-6"
                            >
                                {/* Simplified Label */}
                                <div className="flex justify-center items-center gap-2 text-blue-500 mb-3">
                                    <MdAutoAwesome className="w-4 h-4" />
                                    <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.3em]">
                                        Community Favorites
                                    </span>
                                </div>

                                {/* Responsive Main Heading */}
                                <h2 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight">
                                    Best <span className="text-blue-500">Sellers</span>
                                </h2>

                                {/* Simple Subtext to match FAQ style */}
                                <p className="text-slate-400 text-sm md:text-base mt-3 max-w-xs md:max-w-md mx-auto">
                                    The most loved stories in the Booklio collection right now.
                                </p>

                                {/* Minimalist Accent Line */}
                                <motion.div
                                    initial={{ scaleX: 0 }}
                                    whileInView={{ scaleX: 1 }}
                                    transition={{ duration: 0.8, delay: 0.3 }}
                                    className="h-[2px] w-12 bg-blue-500 mx-auto mt-6 rounded-full"
                                />
                            </motion.div>
                        </div>
                    )
                }
                {
                    location.pathname !== "/shop" && <ZoomOutCarousel />
                }

                <div className='relative overflow-hidden h-[300px] w-full bg-backgroundContrast'>
                    <motion.div
                        className="absolute left-0 top-0 flex gap-4"
                        ref={ref}
                        style={{ x: xTranslation }}
                        onHoverStart={() => {
                            setMustFinish(true);
                            setDuration(SLOW_DURATION);
                        }}
                        onHoverEnd={() => {
                            setMustFinish(true);
                            setDuration(FAST_DURATION);
                        }}
                    >
                        {[...images, ...images].map((item, idx) => (
                            <Card image={item} key={idx} />
                        ))}
                    </motion.div>
                </div>
            </motion.div>
        </>
    );
}
