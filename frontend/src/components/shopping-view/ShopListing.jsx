import { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import GenreFilter from "./GenreFilter";
import notAvailable from "../../assets/notAvailable.png";
import {
  Search, ShoppingCart, Filter, Loader, BookText, 
  Layers, Globe, Hash, Calendar
} from "lucide-react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";

const ShopListing = () => {
  const [bookData, setBookData] = useState({});
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [books, setBooks] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedBook, setSelectedBook] = useState(null);
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedSearch(searchQuery);
    }, 400);
    return () => clearTimeout(handler);
  }, [searchQuery]);

  useEffect(() => {
    setIsLoading(true);
    fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/all-genre-book`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBookData(data.bookData);
          setBooks(Object.values(data.bookData).flat());
        }
      })
      .catch((error) => console.error("Error fetching data:", error))
      .finally(() => setIsLoading(false));
  }, []);

  useEffect(() => {
    if (selectedGenres.length === 0) {
      setBooks(Object.values(bookData).flat());
    } else {
      setBooks(selectedGenres.flatMap((g) => bookData[g] || []));
    }
  }, [selectedGenres, bookData]);

  const handleBuyNowClick = (isbn, sellerId, event) => {
    event.stopPropagation();
    window.scrollTo({ top: 0, behavior: 'smooth' });
    navigate(`/seller/${sellerId}/isbn/${isbn}`);
  };

  const filteredBooks = books.filter((book) => {
    const title = book.data.volumeInfo?.title?.toLowerCase() || "";
    const authors = book.data.volumeInfo?.authors?.join(", ").toLowerCase() || "";
    return (
      title.includes(debouncedSearch.toLowerCase()) ||
      authors.includes(debouncedSearch.toLowerCase())
    );
  });

  return (
    <div className="flex flex-grow bg-[#09090b] min-h-screen selection:bg-blue-500/30">
      {/* Desktop Sidebar */}
      <div className="hidden md:block fixed w-1/4 xl:w-1/5 h-full bg-[#0c0c0e] border-r border-white/5 z-10 overflow-y-auto">
        <GenreFilter
          bookData={bookData}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
        />
      </div>

      <main className="w-full md:w-3/4 md:ml-[25%] xl:w-4/5 xl:ml-[20%] p-6 md:p-12 mt-16 min-h-screen relative">
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full -z-10" />

        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase italic">
              Explore
              <span className="text-blue-500 not-italic ml-3">Books</span>
            </h1>
          </div>

          <div className="relative w-full lg:w-96 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 h-4 w-4 group-focus-within:text-blue-400 transition-colors" />
            <input
              type="text"
              placeholder="Search title or author..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-12 py-4 bg-white/5 border border-white/10 rounded-2xl text-white outline-none focus:ring-2 focus:ring-blue-500/40 transition-all"
            />
            {searchQuery !== debouncedSearch && (
              <Loader className="absolute right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-blue-500 animate-spin" />
            )}
          </div>

          <Sheet>
            <SheetTrigger asChild>
              <Button className="md:hidden bg-white/5 border border-white/10 rounded-2xl p-4">
                <Filter className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[300px] bg-[#0d0d0f] border-white/10 text-white p-0">
              <GenreFilter bookData={bookData} selectedGenres={selectedGenres} setSelectedGenres={setSelectedGenres} />
            </SheetContent>
          </Sheet>
        </header>

        {isLoading ? (
          <div className="flex justify-center items-center h-[50vh]">
            <div className="w-12 h-12 border-4 border-blue-500/20 border-t-blue-500 rounded-full animate-spin" />
          </div>
        ) : (
          <motion.div layout className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            <AnimatePresence>
              {filteredBooks.map((book, index) => (
                <motion.div
                  key={`${book.isbn}-${index}`}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                >
                  <Card
                    className="group bg-[#121214] border-white/5 hover:border-blue-500/50 transition-all duration-500 rounded-3xl overflow-hidden h-full flex flex-col cursor-pointer"
                    onClick={() => setSelectedBook(book)}
                  >
                    <div className="relative aspect-[3/4] w-full bg-gradient-to-b from-white/[0.02] to-transparent overflow-hidden p-6 flex items-center justify-center">
                      {book.spCluster?.[0]?.price && (
                        <div className="absolute top-4 left-4 z-10 bg-blue-600 text-white text-xs font-bold px-3 py-1 rounded-lg shadow-xl">
                          ₹{book.spCluster[0].price}
                        </div>
                      )}
                      <img
                        src={book.data.volumeInfo?.imageLinks?.thumbnail || notAvailable}
                        alt={book.data.volumeInfo?.title}
                        className="h-full object-contain drop-shadow-[0_15px_15px_rgba(0,0,0,0.5)] transform group-hover:scale-105 transition-transform duration-500"
                      />
                    </div>

                    <CardContent className="p-6 pt-2 flex flex-col flex-grow">
                      <h3 className="text-white font-bold text-lg mb-1 line-clamp-1 group-hover:text-blue-400 transition-colors">
                        {book.data.volumeInfo?.title}
                      </h3>
                      <p className="text-zinc-500 text-xs font-medium truncate mb-4">
                        {book.data.volumeInfo.authors?.[0] || "Unknown Author"}
                      </p>

                      <Button
                        className="mt-auto w-full bg-white text-black hover:bg-blue-600 hover:text-white rounded-xl py-5 font-bold uppercase tracking-widest text-[10px] transition-all"
                        onClick={(e) => handleBuyNowClick(book.isbn, book.spCluster?.[0]?.sellerId, e)}
                      >
                        <ShoppingCart className="w-3.5 h-3.5 mr-2" />
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>
        )}
      </main>

      {/* ENHANCED DIALOG WITH LARGER IMAGE */}
      <Dialog open={!!selectedBook} onOpenChange={() => setSelectedBook(null)}>
        <DialogContent className="max-w-5xl bg-[#0c0c0e] border-white/10 text-white p-0 overflow-hidden shadow-2xl rounded-[2rem]">
          <div className="flex flex-col md:flex-row min-h-[500px] max-h-[90vh]">
            
            {/* Left Column: Image Showcase (Fixed Size Issue) */}
           {/* Left Column: Visual Showcase - FIXED & ENLARGED */}
<div className="w-full md:w-[45%] bg-[#121214] flex items-center justify-center relative border-b md:border-b-0 md:border-r border-white/5 min-h-[400px]">
    {/* Ambient Glow Background */}
    <div className="absolute inset-0 bg-blue-600/10 blur-[100px] rounded-full scale-75" />
    
    <div className="relative w-full h-full p-6 md:p-8 flex items-center justify-center">
        <img
            src={selectedBook?.data.volumeInfo?.imageLinks?.thumbnail || notAvailable}
            alt={selectedBook?.data.volumeInfo?.title}
            /* Changed: 
               - Removed hard max-h-[450px]
               - Added h-[80%] to force it to fill the vertical space of the dialog
               - scale-110 on hover for extra "pop"
            */
            className="w-auto h-[70vh] max-h-full object-contain rounded-md shadow-[0_40px_80px_-15px_rgba(0,0,0,0.8)] border border-white/10 transition-transform duration-700 group-hover:scale-105"
        />
        
        {/* Price Badge - Positioned relative to the container for better visibility */}
        <div className="absolute bottom-8 right-8 bg-blue-600 text-white px-4 py-1 rounded-2xl font-black text-2xl shadow-[0_20px_40px_rgba(0,0,0,0.4)] border border-blue-400/30 backdrop-blur-md">
            ₹{selectedBook?.spCluster?.[0]?.price}
        </div>
    </div>
</div>

            {/* Right Column: Content */}
            <div className="w-full md:w-[55%] p-8 md:p-12 flex flex-col">
              <div className="mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <span className="bg-blue-500/10 text-blue-400 text-[10px] font-bold px-3 py-1 rounded-full border border-blue-500/20 uppercase tracking-widest">
                    Available Now
                  </span>
                </div>
                <h2 className="text-3xl md:text-4xl font-black text-white leading-tight tracking-tight mb-2 italic uppercase">
                  {selectedBook?.data.volumeInfo?.title}
                </h2>
                <p className="text-zinc-400 text-lg font-medium italic">
                  <span className="text-zinc-600 not-italic uppercase text-sm font-bold mr-2 tracking-widest">By</span> 
                  {selectedBook?.data.volumeInfo?.authors?.join(", ")}
                </p>
              </div>

              <ScrollArea className="h-[180px] mb-8 pr-6">
                <p className="text-zinc-400 leading-relaxed text-sm font-medium">
                  {selectedBook?.data.volumeInfo?.description?.replace(/<[^>]*>?/gm, '') || "No summary available for this title."}
                </p>
              </ScrollArea>

              <div className="grid grid-cols-2 gap-4 mb-10">
                <DetailBadge icon={<Calendar className="w-3 h-3"/>} label="Published" value={selectedBook?.data.volumeInfo?.publishedDate} />
                <DetailBadge icon={<Layers className="w-3 h-3"/>} label="Pages" value={selectedBook?.data.volumeInfo?.pageCount} />
                <DetailBadge icon={<Hash className="w-3 h-3"/>} label="ISBN" value={selectedBook?.isbn} />
                <DetailBadge icon={<Globe className="w-3 h-3"/>} label="Publisher" value={selectedBook?.data.volumeInfo?.publisher} />
              </div>

              <Button
                className="w-full h-16 bg-white hover:bg-blue-600 text-black hover:text-white rounded-2xl font-black uppercase tracking-[0.2em] text-xs transition-all duration-500 shadow-xl active:scale-95"
                onClick={(e) => handleBuyNowClick(selectedBook.isbn, selectedBook.spCluster[0].sellerId, e)}
              >
                Buy This Copy
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

const DetailBadge = ({ label, value, icon }) => (
  <div className="bg-white/[0.03] border border-white/[0.05] p-3.5 rounded-2xl flex items-center gap-3">
    <div className="text-blue-500 bg-blue-500/10 p-2 rounded-lg">
        {icon}
    </div>
    <div className="flex flex-col min-w-0">
      <span className="text-[9px] uppercase tracking-widest text-zinc-500 font-bold leading-none mb-1">{label}</span>
      <span className="text-xs text-zinc-200 font-bold truncate">{value || "N/A"}</span>
    </div>
  </div>
);

export default ShopListing;