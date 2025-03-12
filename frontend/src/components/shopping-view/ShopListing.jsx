import { useEffect, useState } from "react";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import GenreFilter from "./GenreFilter";
import notAvailable from "../../../public/notAvailable.png"

const ShopListing = () => {
  const [bookData, setBookData] = useState({});
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/all-genre-book`)
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          setBookData(data.bookData);
          setSelectedGenres([]);
          setBooks(Object.values(data.bookData).flat());
        }
      })
      .catch((error) => console.error("Error fetching data:", error));
  }, []);

  useEffect(() => {
    if (selectedGenres.length === 0) {
      setBooks(Object.values(bookData).flat());
    } else {
      setBooks(selectedGenres.flatMap((g) => bookData[g] || []));
    }
  }, [selectedGenres, bookData]);

  const handleBuyNowClick = (isbn, sellerId) => {
    navigate(`/seller/${sellerId}/isbn/${isbn}`);
  };

  const filteredBooks = books.filter((book) => {
    const title = book.data.volumeInfo?.title?.toLowerCase() || "";
    const authors =
      book.data.volumeInfo?.authors?.join(", ").toLowerCase() || "";
    return (
      title.includes(searchQuery.toLowerCase()) ||
      authors.includes(searchQuery.toLowerCase())
    );
  });

  return (
    <div className="flex flex-grow">
      {/* Sidebar: Genres - Fixed position */}
      <div className="fixed w-1/5 h-screen overflow-auto">
        <GenreFilter
          bookData={bookData}
          selectedGenres={selectedGenres}
          setSelectedGenres={setSelectedGenres}
        />
      </div>

      {/* Main Content - Scrollable */}
      <div className="w-4/5 ml-[20%] p-10 mt-[4rem] min-h-screen pb-16">
        {/* Search Bar */}
        <div className="mb-4">
          <input
            type="text"
            placeholder="Search by title or author..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-1 border rounded bg-backgroundContrast text-white"
          />
        </div>

        <h2 className="text-xl font-bold mb-4">
          {selectedGenres.length > 0
            ? `Books in ${selectedGenres.join(", ")}`
            : "All Books"}
        </h2>

        {/* Display filtered books */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {filteredBooks.length > 0 ? (
            filteredBooks.map((book, index) => {
              const price = book.spCluster?.[0]?.price;
              const thumbnail = book.data.volumeInfo?.imageLinks?.thumbnail;
              const title = book.data.volumeInfo?.title || "Unknown Title";
              const description =
                book.data.volumeInfo?.description || "No description available";

              return (
                <Card key={index} className="shadow-lg flex flex-col justify-between p-4 relative">
                  {price && (
                    <div className="absolute z-10 -top-1 -left-2 bg-red-500 text-white text-sm font-bold py-1 px-4 shadow-md before:z-5 before:content-[''] before:absolute before:-bottom-2 before:left-0 before:border-l-8 before:border-l-transparent before:border-t-8 before:border-t-red-700">
                      ₹{price}
                    </div>
                  )}

                  <CardHeader>
                    {thumbnail ? (
                      <img
                        src={thumbnail}
                        alt={title}
                        className="w-full h-80 object-cover rounded"
                      />
                    ) : (
                      <div className="w-full h-80 bg-gray-200 rounded flex items-center justify-center text-gray-200">
                        No Image
                      </div>
                    )}
                    <CardTitle className="mt-2 text-lg font-bold">
                      {title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent>
                    <p className="text-gray-200 truncate">{description}</p>
                    <p className="text-gray-200 mt-2">
                      <strong>Author:</strong>{" "}
                      {book.data.volumeInfo.authors?.join(", ") || "Unknown"}
                    </p>
                    <p className="text-gray-200">
                      <strong>Publisher:</strong>{" "}
                      {book.data.volumeInfo.publisher || "Unknown"}
                    </p>
                    <p className="text-gray-200">
                      <strong>Pages:</strong>{" "}
                      {book.data.volumeInfo.pageCount || "N/A"}
                    </p>
                  </CardContent>

                  {price && (
                    <CardFooter className="flex p-0 w-full bg-blue-700 rounded-lg justify-center items-center">
                      <Button
                        className="text-white"
                        onClick={() =>
                          handleBuyNowClick(
                            book.isbn,
                            book.spCluster?.[0]?.sellerId
                          )
                        }
                      >
                        Buy Now
                      </Button>
                    </CardFooter>
                  )}

                </Card>
              );
            })
          ) : (
            <div className="col-span-3 flex flex-col justify-center items-center">
              <p className="text-gray-200">No books match your search criteria.</p>
              <img className="h-80 opacity-70" src={notAvailable} alt="No books available" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ShopListing;