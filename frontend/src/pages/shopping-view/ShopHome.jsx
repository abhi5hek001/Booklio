import { Button } from "@/components/ui/button";
import bannerOne from "@/assets/slide1.jpg";
import bannerTwo from "@/assets/slide2.jpg";
import bannerThree from "@/assets/slide3.jpg";
import bannerFour from "@/assets/slide4.jpg";
import bannerFive from "@/assets/slide5.jpg";

// Using Material Design Icons for a more "Solid/Premium" look
import { 
  MdAutoAwesome, 
  MdArrowForwardIos, 
  MdMenuBook, 
  MdPsychology, 
  MdExplore, 
  MdBrush, 
  MdHistoryEdu,
  MdOutlineTheaterComedy 
} from "react-icons/md";
import { GiGhost } from "react-icons/gi";
import { GiCrystalWand } from "react-icons/gi";


import { Card, CardContent } from "@/components/ui/card";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllFilteredProducts } from "@/store/shop/products-slice";
import { useNavigate } from "react-router-dom";
import { Faqs } from "@/components/landingPage/Faqs";
import VideoCarousel from "@/components/landingPage/VideoCarousel";
import GenreCard from "@/components/GenreCard";
import { motion } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const genreIcon = [
  { id: "horror", label: "Horror", icon: GiGhost, color: "text-red-500", bg: "hover:bg-red-500/10", border: "border-red-500/20" },
  { id: "fantasy", label: "Fantasy", icon: GiCrystalWand, color: "text-purple-400", bg: "hover:bg-purple-500/10", border: "border-purple-500/20" },
  { id: "mystery", label: "Mystery", icon: MdPsychology, color: "text-blue-400", bg: "hover:bg-blue-500/10", border: "border-blue-500/20" },
  { id: "fiction", label: "Fiction", icon: MdOutlineTheaterComedy, color: "text-green-400", bg: "hover:bg-green-500/10", border: "border-green-500/20" },
  { id: "non-fiction", label: "Non-Fiction", icon: MdHistoryEdu, color: "text-orange-400", bg: "hover:bg-orange-500/10", border: "border-orange-500/20" },
  { id: "manga", label: "Manga", icon: MdBrush, color: "text-pink-400", bg: "hover:bg-pink-500/10", border: "border-pink-500/20" },
];

function ShoppingHome() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { productList } = useSelector((state) => state.shopProducts);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const sectionRef = useRef(null);
  const rowOneRef = useRef(null);
  const rowTwoRef = useRef(null);

  const rowOne = genreIcon.slice(0, 3);
  const rowTwo = genreIcon.slice(3, 6);

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "+=950",
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        }
      });

      tl.fromTo(rowOneRef.current,
        { x: "-150%", opacity: 0 },
        { x: "0%", opacity: 1, ease: "power2.out" },
        0
      );

      tl.fromTo(rowTwoRef.current,
        { x: "150%", opacity: 0 },
        { x: "0%", opacity: 1, ease: "power2.out" },
        0
      );
    }, sectionRef);

    return () => ctx.revert();
  }, []);

  const featureImageList = [
    { image: bannerOne, title: "Discover New Worlds", subtitle: "Explore our curated collection of literary masterpieces." },
    { image: bannerTwo, title: "The Best Sellers", subtitle: "Join thousands of readers in these top-rated journeys." },
    { image: bannerThree, title: "Exclusive Deals", subtitle: "Build your library without breaking the bank." },
    { image: bannerFour, title: "Fresh Arrivals", subtitle: "Be the first to turn the page on this week's newest releases." },
    { image: bannerFive, title: "Timeless Classics", subtitle: "The stories that shaped generations, now in premium editions." },
  ];

  useEffect(() => {
    dispatch(fetchAllFilteredProducts({ filterParams: {}, sortParams: "price-lowtohigh" }));
  }, [dispatch]);

  useEffect(() => {
    const slideTimer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % featureImageList.length);
    }, 5000);
    return () => clearInterval(slideTimer);
  }, [featureImageList.length]);

  return (
    <div className="min-h-screen bg-[#0a0a0c] text-slate-200 overflow-x-hidden selection:bg-blue-500/30">

      {/* --- HERO SECTION --- */}
      <section className="relative h-[90vh] w-full flex items-center justify-center overflow-hidden">
        {featureImageList.map((slide, index) => (
          <div
            key={index}
            className={`absolute inset-0 transition-all duration-1000 ease-in-out transform ${index === currentSlide ? "opacity-100 scale-100" : "opacity-0 scale-110"}`}
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0a0a0c] via-black/40 to-transparent z-10" />
            <img src={slide.image} alt="" className="w-full h-full object-cover opacity-60" />

            <div className="absolute inset-0 z-20 flex items-center">
              <div className="container mx-auto px-6 md:px-12">
                <div className="max-w-4xl space-y-6">
                  <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-xs font-bold uppercase tracking-[0.2em]"
                  >
                    <MdAutoAwesome className="w-4 h-4 text-blue-400" /> Featured Release
                  </motion.div>
                  <h1 className="text-6xl md:text-8xl font-black text-white leading-[1.1] tracking-tight">
                    {slide.title}
                  </h1>
                  <p className="text-lg md:text-2xl text-slate-400 max-w-2xl font-light leading-relaxed">
                    {slide.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-5 pt-6">
                    <Button
                      size="lg"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate("/shop/listing")
                      }}
                      className="group bg-blue-600 hover:bg-blue-500 text-white px-10 py-7 text-lg rounded-xl transition-all hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] border-none"
                    >
                      Start Reading <MdArrowForwardIos className="ml-2 w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}

        {/* Floating Indicator Bar */}
        <div className="absolute bottom-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-4 bg-white/5 backdrop-blur-md px-6 py-3 rounded-full border border-white/10">
          {featureImageList.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 transition-all duration-500 rounded-full ${i === currentSlide ? "w-12 bg-blue-500" : "w-3 bg-white/20"}`}
            />
          ))}
        </div>
      </section>

      {/* --- GENRE EXPLORER --- */}
      <section ref={sectionRef} className="py-24 relative overflow-hidden bg-[#0a0a0c]">
        <div className="container mx-auto px-6">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-6">
            <div className="space-y-4">
              <div className="flex items-center gap-2 text-blue-500 font-bold tracking-widest text-sm uppercase">
                <MdExplore className="w-5 h-5" /> Navigation
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white tracking-tighter uppercase">
                Browse <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600">Genres</span>
              </h2>
            </div>
          </div>

          <div className="flex flex-col gap-12">
            <div ref={rowOneRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {rowOne.map((genre) => (
                <GenreCard key={genre.id} genre={genre} navigate={navigate} />
              ))}
            </div>

            <div ref={rowTwoRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8">
              {rowTwo.map((genre) => (
                <GenreCard key={genre.id} genre={genre} navigate={navigate} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <VideoCarousel />

      <section className="py-24 border-t border-white/5 bg-gradient-to-b from-[#0a0a0c] to-black">
        <div className="container mx-auto px-6 max-w-4xl">
          <Faqs />
        </div>
      </section>
    </div>
  );
}

export default ShoppingHome;