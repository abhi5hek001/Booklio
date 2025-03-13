import React from "react";
import { Button } from "@/components/ui/button"; // ShadCN button
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"; // ShadCN dialog components
import { IoCloseCircle } from "react-icons/io5"; // Close icon

const BookDetailView = ({ book, selectedBook, setSelectedBook, getSellerInfo }) => {
  const { data, spCluster, isbn } = book;
  const title = data?.volumeInfo?.title || "Untitled";
  const authors = data?.volumeInfo?.authors?.join(", ") || "Unknown Author";
  const description = data?.volumeInfo?.description || "No description available.";
  const maturityRating = data?.volumeInfo?.maturityRating || "Not defined.";
  const publishedDate = data?.volumeInfo?.publishedDate || "Not defined.";
  const publisher = data?.volumeInfo?.publisher || "Not defined.";
  const language = data?.volumeInfo?.language || "Language not defined.";
  const genre = data?.volumeInfo?.categories || "No genre available.";
  const imageUrl = data?.volumeInfo?.imageLinks?.thumbnail || "/default-image.jpg";
  const infoLink = data?.volumeInfo?.infoLink || "#";

  return (
    <DialogContent className="max-w-[90%] lg:max-w-[70%] min-h-[75vh] p-6 bg-white rounded-2xl shadow-xl">
      <DialogHeader>
        <DialogTitle className="text-2xl font-bold text-gray-900">{title}</DialogTitle>
      </DialogHeader>

      <DialogDescription className="text-gray-700">
        <div className="flex flex-col lg:flex-row gap-6">
          {/* Image Section */}
          <div className="flex-shrink-0 lg:w-1/3">
            <img
              src={imageUrl}
              alt={title}
              className="w-full h-auto object-contain rounded-lg shadow-md"
            />
          </div>

          {/* Details Section */}
          <div className="flex-1 space-y-3">
            <p>
              <strong className="text-gray-900">Authors:</strong> {authors}
            </p>
            <p>
              <strong className="text-gray-900">Description:</strong>{" "}
              {description.split(" ").slice(0, 25).join(" ")}...
            </p>
            <p>
              <strong className="text-gray-900">ISBN:</strong> {isbn || "Not available"}
            </p>
            <p>
              <strong className="text-gray-900">Publisher:</strong> {publisher}
            </p>
            <p>
              <strong className="text-gray-900">Published Date:</strong> {publishedDate}
            </p>
            <p>
              <strong className="text-gray-900">Maturity Rating:</strong> {maturityRating}
            </p>
            <p>
              <strong className="text-gray-900">Language:</strong> {language}
            </p>
            <p>
              <strong className="text-gray-900">Genre:</strong>{" "}
              {Array.isArray(genre) ? genre.join(", ") : genre}
            </p>
            <p>
              <strong className="text-gray-900">More Info:</strong>{" "}
              <a
                href={infoLink}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 hover:underline"
              >
                View on Google Books
              </a>
            </p>

            {/* Seller Details */}
            <div className="mt-6">
              <strong className="text-gray-900 text-lg">Sellers:</strong>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                {spCluster.map((sellerCluster, idx) => {
                  const seller = getSellerInfo(sellerCluster.sellerId);
                  return seller ? (
                    <div key={idx} className="p-4 bg-gray-50 border rounded-lg shadow-sm">
                      <p className="font-semibold text-gray-900">
                        {seller.storeName
                          ? seller.storeName.replace(/\b\w/g, (char) => char.toUpperCase())
                          : "Anonymous Store"}
                      </p>
                      <p className="text-blue-500">Price: ₹{sellerCluster.price || "N/A"}</p>
                      <p className="text-orange-500">Stock: {sellerCluster.stock || "N/A"}</p>
                    </div>
                  ) : null;
                })}
              </div>
            </div>
          </div>
        </div>
      </DialogDescription>

      <DialogFooter className="flex justify-end">
        <Button
          variant="outline"
          className="rounded-lg bg-red-500 text-white hover:bg-red-600 transition-all"
          onClick={() => setSelectedBook(null)}
        >
          Close
          <IoCloseCircle className="ml-2" />
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

export default BookDetailView;
