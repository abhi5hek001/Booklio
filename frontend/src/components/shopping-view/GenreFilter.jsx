const GenreFilter = ({ bookData, selectedGenres, setSelectedGenres }) => {
    const handleGenreChange = (genre, checked) => {
      if (checked) {
        setSelectedGenres([...selectedGenres, genre]);
      } else {
        setSelectedGenres(selectedGenres.filter((g) => g !== genre));
      }
    };
  
    return (
      <div className="fixed top-[120px] left-4 w-1/5  overflow-y-auto bg-backgroundContrast p-4 z-30 shadow-lg border border-white-2 rounded">
        <h2 className="text-lg font-bold mb-2">Genres</h2>
  
        <div className="space-y-2">
          {/* "All Books" Checkbox */}
          <div className="flex items-center">
            <input
              type="checkbox"
              id="all-books"
              checked={selectedGenres.length === 0}
              onChange={() => setSelectedGenres([])}
              className="mr-2"
            />
            <label htmlFor="all-books">All Books</label>
          </div>
  
          {/* Genre Checkboxes */}
          {Object.keys(bookData).map((genre) => (
            <div key={genre} className="flex items-center">
              <input
                type="checkbox"
                id={genre.replace(/\s+/g, "-").toLowerCase()}
                checked={selectedGenres.includes(genre)}
                onChange={(e) => handleGenreChange(genre, e.target.checked)}
                className="mr-2"
              />
              <label htmlFor={genre.replace(/\s+/g, "-").toLowerCase()}>
                {genre.charAt(0).toUpperCase() + genre.slice(1)}
              </label>
            </div>
          ))}
        </div>
      </div>
    );
  };
  
  export default GenreFilter;
  