import { motion, AnimatePresence } from "framer-motion";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { BookOpen, Sparkles, Trash2 } from "lucide-react";
import PropTypes from "prop-types";

const GenreFilter = ({ bookData, selectedGenres, setSelectedGenres }) => {
  const handleGenreChange = (genre, checked) => {
    if (checked) {
      setSelectedGenres([...selectedGenres, genre]);
    } else {
      setSelectedGenres(selectedGenres.filter((g) => g !== genre));
    }
  };

  return (
   <motion.div
  initial={{ opacity: 0 }}
  animate={{ opacity: 1 }}
  className="flex flex-col h-full bg-[#0d0d0f] text-slate-200 pt-24"
>
      {/* Header Section */}
      <div className="p-8 pb-4">
        <div className="flex items-center gap-2 mb-2">
          <div className="p-2 bg-blue-500/10 rounded-lg">
            <BookOpen className="w-4 h-4 text-blue-500" />
          </div>
          <h2 className="text-sm font-black uppercase tracking-[0.2em] text-white">
            Library Genres
          </h2>
        </div>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest leading-relaxed">
          Filter your selection
        </p>
      </div>

      <ScrollArea className="flex-1 px-4">
        <div className="space-y-1 py-4">
          {/* "All Books" Option */}
          <div 
            className={`relative flex items-center justify-between p-3 rounded-xl transition-all duration-300 cursor-pointer group ${
              selectedGenres.length === 0 ? "bg-blue-500/10 border border-blue-500/20" : "hover:bg-white/5 border border-transparent"
            }`}
            onClick={() => setSelectedGenres([])}
          >
            <div className="flex items-center space-x-3">
              <Checkbox
                id="all-books"
                checked={selectedGenres.length === 0}
                onCheckedChange={() => setSelectedGenres([])}
                className="border-slate-700 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
              />
              <Label
                htmlFor="all-books"
                className="text-xs font-bold uppercase tracking-widest cursor-pointer group-hover:text-white transition-colors"
              >
                All Collections
              </Label>
            </div>
            <Sparkles className={`w-3 h-3 ${selectedGenres.length === 0 ? "text-blue-500" : "text-slate-700"}`} />
          </div>

          <div className="h-px bg-white/5 my-4 mx-2" />

          {/* Genre Options */}
          {Object.keys(bookData).map((genre) => {
            const isSelected = selectedGenres.includes(genre);
            const id = genre.replace(/\s+/g, "-").toLowerCase();

            return (
              <div
                key={genre}
                className={`relative flex items-center justify-between p-3 rounded-xl transition-all duration-300 cursor-pointer group ${
                  isSelected ? "bg-white/5 border border-white/10" : "hover:bg-white/5 border border-transparent"
                }`}
                onClick={() => handleGenreChange(genre, !isSelected)}
              >
                <div className="flex items-center space-x-3 min-w-0">
                  <Checkbox
                    id={id}
                    checked={isSelected}
                    onCheckedChange={(checked) => handleGenreChange(genre, checked)}
                    className="border-slate-700 data-[state=checked]:bg-blue-500 data-[state=checked]:border-blue-500"
                    onClick={(e) => e.stopPropagation()} // Prevent double trigger
                  />
                  <Label
                    htmlFor={id}
                    className={`text-xs font-bold uppercase tracking-widest cursor-pointer truncate transition-colors ${
                      isSelected ? "text-blue-400" : "text-slate-400 group-hover:text-slate-200"
                    }`}
                  >
                    {genre}
                  </Label>
                </div>
                
                <span className={`text-[10px] font-black font-mono ${isSelected ? "text-blue-500" : "text-slate-600"}`}>
                  {bookData[genre].length.toString().padStart(2, '0')}
                </span>

                {isSelected && (
                  <motion.div
                    layoutId="activeGlow"
                    className="absolute inset-0 bg-blue-500/5 rounded-xl -z-10"
                  />
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>

      {/* Footer / Summary */}
      <AnimatePresence>
        {selectedGenres.length > 0 && (
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 20, opacity: 0 }}
            className="p-6 bg-[#0a0a0c] border-t border-white/5"
          >
            <div className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
              <span className="text-[10px] font-black text-slate-500 uppercase tracking-tighter">
                {selectedGenres.length} Filtered
              </span>
              <button
                onClick={() => setSelectedGenres([])}
                className="flex items-center gap-2 text-[10px] font-black text-red-500 hover:text-red-400 uppercase tracking-widest transition-colors"
              >
                <Trash2 size={12} />
                Clear
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

GenreFilter.propTypes = {
  bookData: PropTypes.object.isRequired,
  selectedGenres: PropTypes.array.isRequired,
  setSelectedGenres: PropTypes.func.isRequired
};

export default GenreFilter;