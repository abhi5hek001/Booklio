import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FaShoppingCart, FaStore, FaStar, FaChevronLeft } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

const BookDetails = () => {
  const { isbn, sellerId } = useParams();
  const navigate = useNavigate();
  
  const [book, setBook] = useState(null);
  const [sellers, setSellers] = useState([]);
  const [sellerInfo, setSellerInfo] = useState(null);
  const [suggestedBooks, setSuggestedBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // --- 1. Fetch Book & Sellers (Listen to ISBN change) ---
  useEffect(() => {
    // Scroll to top on every route change
    window.scrollTo({ top: 0, behavior: 'smooth' });
    
    setBook(null); // Reset current book to show loader
    fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/sellers-by-book/${isbn}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          setBook(data.book);
          setSellers(data.sellers);
        }
      });
  }, [isbn]); // DEPENDENCY: Rerun when ISBN in URL changes

  // --- 2. Fetch Seller Info (Listen to sellerId change) ---
  useEffect(() => {
    if (sellerId) {
      fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/${sellerId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.success) setSellerInfo(data.seller);
        });
    }
  }, [sellerId]); // DEPENDENCY: Rerun when sellerId in URL changes

  // --- 3. Fetch Recommendations (Listen to ISBN change) ---
  useEffect(() => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/all-genre-book`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const allBooks = Object.values(data.bookData).flat();
          const filtered = allBooks.filter(b => b.isbn !== isbn);
          setSuggestedBooks(filtered.sort(() => 0.5 - Math.random()).slice(0, 4));
        }
      })
      .finally(() => setIsLoading(false));
  }, [isbn]); // DEPENDENCY: Update suggestions when ISBN changes

  const handlePlaceOrderClick = () => {
    navigate("/placeOrder", { state: { sellerUniqueId: sellerId, isbnId: isbn } });
  };

  const handleBookClick = (sId, bIsbn) => {
    // This now works because the useEffects are watching the URL params
    navigate(`/seller/${sId}/isbn/${bIsbn}`);
  };

  if (!book) return (
    <div className="flex justify-center items-center min-h-screen bg-[#070708]">
      <div className="w-12 h-12 border-4 border-blue-600/20 border-t-blue-500 rounded-full animate-spin" />
    </div>
  );

  return (
    <div className="min-h-screen bg-[#070708] text-zinc-100 pt-32 pb-20 px-4 sm:px-6 lg:px-8 font-sans">
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-600/10 blur-[150px] rounded-full" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-purple-600/10 blur-[150px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-zinc-500 hover:text-blue-500 transition-colors mb-10 group"
        >
          <FaChevronLeft className="group-hover:-translate-x-1 transition-transform" />
          <span className="text-[10px] font-black uppercase tracking-[0.2em]">Go Back</span>
        </button>

        <div className="grid lg:grid-cols-12 gap-16 mb-24">
          {/* Main Book Visual */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            key={`img-${isbn}`} // unique key forces animation to reset
            className="lg:col-span-5 flex flex-col items-center"
          >
            <div className="relative w-full max-w-[420px] group">
              <div className="relative bg-[#111113] p-8 rounded-[2.5rem] border border-white/5 shadow-2xl">
                <img
                  src={book.volumeInfo.imageLinks?.thumbnail}
                  alt={book.volumeInfo.title}
                  className="w-full h-auto min-h-[450px] object-contain rounded-xl"
                />
              </div>
            </div>

            {sellerInfo && (
                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="ghost" className="mt-8 text-zinc-400 gap-2">
                            <FaStore className="text-blue-500" /> Distributed by {sellerInfo.storeName}
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0f0f11] border-white/10 text-white rounded-[2rem]">
                        <DialogHeader className="p-4 flex flex-col items-center">
                            <img src={sellerInfo.image} className="w-24 h-24 rounded-full border-4 border-blue-500 mb-4 object-cover" />
                            <DialogTitle className="text-2xl font-black italic">{sellerInfo.storeName}</DialogTitle>
                        </DialogHeader>
                    </DialogContent>
                </Dialog>
            )}
          </motion.div>

          {/* Book Content */}
          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            key={`content-${isbn}`}
            className="lg:col-span-7"
          >
            <div className="space-y-6">
              <Badge className="bg-blue-600/10 text-blue-500 px-4 py-1.5 rounded-full font-bold uppercase tracking-widest text-[10px]">
                Verified Listing
              </Badge>
              <h1 className="text-5xl md:text-7xl font-black uppercase tracking-tighter italic leading-[0.9] bg-gradient-to-b from-white to-zinc-500 bg-clip-text text-transparent">
                {book.volumeInfo.title}
              </h1>
              <p className="text-xl md:text-2xl text-zinc-400 font-medium italic">
                by {book.volumeInfo.authors?.join(", ")}
              </p>

              <div className="bg-white/[0.03] border border-white/5 rounded-3xl p-8 mt-8">
                <h4 className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-500 mb-4">Description</h4>
                <ScrollArea className="h-[180px] pr-4">
                  <p className="text-zinc-400 leading-relaxed text-sm">
                    {book.volumeInfo.description?.replace(/<[^>]*>?/gm, '') || "Summary not available."}
                  </p>
                </ScrollArea>
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                 <QuickInfo label="Pages" value={book.volumeInfo.pageCount || "N/A"} />
                 <QuickInfo label="Language" value={book.volumeInfo.language?.toUpperCase() || "EN"} />
                 <QuickInfo label="Publisher" value={book.volumeInfo.publisher?.split(' ')[0] || "Global"} />
                 <QuickInfo label="Year" value={book.volumeInfo.publishedDate?.split('-')[0] || "2024"} />
              </div>

              <Button 
                onClick={handlePlaceOrderClick}
                className="w-full h-20 bg-blue-600 hover:bg-blue-500 text-white rounded-[1.5rem] mt-10 text-lg font-black uppercase tracking-[0.2em] shadow-2xl transition-all"
              >
                <FaShoppingCart className="mr-3" /> Process Order
              </Button>
            </div>
          </motion.div>
        </div>

        {/* Recommendations Section */}
        <section className="pt-20 border-t border-white/5">
          <div className="flex items-center justify-between mb-12">
            <h2 className="text-3xl font-black uppercase italic tracking-tighter">Recommended</h2>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {suggestedBooks.map((b, i) => (
              <motion.div
                key={`${b.isbn}-${i}`}
                whileHover={{ y: -10 }}
                onClick={() => handleBookClick(b.spCluster?.[0]?.sellerId, b.isbn)}
                className="group cursor-pointer"
              >
                {/* Fixed: Aspect-ratio wrapper for uniform card sizes */}
                <div className="relative aspect-[2/3] w-full bg-[#111113] border border-white/5 rounded-2xl overflow-hidden mb-4 p-6 flex items-center justify-center">
                  <img
                    src={b.data.volumeInfo?.imageLinks?.thumbnail || "https://via.placeholder.com/200x300"}
                    alt={b.data.volumeInfo?.title}
                    className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-blue-600 px-3 py-1 rounded-lg font-black text-xs shadow-xl">
                    ₹{b.spCluster?.[0]?.price}
                  </div>
                </div>
                <h3 className="font-bold text-sm truncate text-zinc-200 group-hover:text-blue-500 transition-colors uppercase italic tracking-tighter">
                  {b.data.volumeInfo?.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

const QuickInfo = ({ label, value }) => (
  <div className="bg-white/[0.02] border border-white/[0.04] p-4 rounded-2xl text-center min-w-0">
    <span className="text-[9px] font-black uppercase tracking-widest text-zinc-500 block mb-1 truncate">{label}</span>
    <span className="text-xs font-bold text-zinc-200 truncate block">{value}</span>
  </div>
);

export default BookDetails;