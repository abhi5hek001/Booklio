import { ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion"; 

export const Faqs = () => {
    const faqs = [
        {
            question: "How can I purchase books on Booklio?",
            answer: "Simply search for your desired books, add them to your cart, and proceed to a secure checkout for a seamless purchase experience."
        },
        {
            question: "Can I easily find books by genre on Booklio?",
            answer: "Yes, Booklio offers a diverse range of over 17 genres and more than 1,800 books, making it easy to explore and find your next favorite read."
        },
        {
            question: "Is it possible to sell books on Booklio?",
            answer: "Absolutely! You can create a seller account, log in as a seller, and start listing your books to grow your business on Booklio."
        },
    ];

    const [clickedIndex, setClickedIndex] = useState(null);

    const handleClick = (index) => {
        setClickedIndex(clickedIndex === index ? null : index);
    };

    return (
        <div className="bg-transparent py-12 w-full">
            <div className="max-w-4xl mx-auto px-4 sm:px-6">
                
                {/* --- SIMPLIFIED HEADER --- */}
                <div className="text-center mb-12">
                    <motion.h2 
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        className="text-3xl md:text-4xl font-bold text-white mb-4 tracking-tight"
                    >
                        Frequently Asked <span className="text-blue-500">Questions</span>
                    </motion.h2>
                    <p className="text-slate-400 text-sm md:text-base">
                        Everything you need to know about Booklio
                    </p>
                </div>

                {/* --- ACCORDION SECTION --- */}
                <div className="space-y-4">
                    {faqs.map((faq, index) => (
                        <div
                            key={index}
                            className={`border border-white/10 rounded-xl transition-all duration-300 ${
                                clickedIndex === index 
                                ? "bg-white/5 border-blue-500/30" 
                                : "hover:bg-white/5"
                            }`}
                        >
                            <button
                                onClick={() => handleClick(index)}
                                className="w-full px-5 py-5 md:px-8 md:py-6 text-left flex items-center justify-between gap-4"
                            >
                                <span className="text-base md:text-lg font-medium text-slate-100 leading-snug">
                                    {faq.question}
                                </span>
                                <div className={`flex-shrink-0 transition-transform duration-300 ${clickedIndex === index ? "rotate-180" : ""}`}>
                                    <ChevronDown className={`h-5 w-5 ${clickedIndex === index ? "text-blue-500" : "text-slate-400"}`} />
                                </div>
                            </button>

                            <AnimatePresence initial={false}>
                                {clickedIndex === index && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        transition={{ duration: 0.3, ease: "easeInOut" }}
                                    >
                                        {/* px-5 on mobile, px-8 on desktop to match button and prevent clipping */}
                                        <div className="px-5 md:px-8 pb-6">
                                            <div className="pt-2 border-t border-white/5">
                                                <p className="text-slate-400 text-sm md:text-base leading-relaxed">
                                                    {faq.answer}
                                                </p>
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};