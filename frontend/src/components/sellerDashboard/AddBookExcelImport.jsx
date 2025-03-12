import React, { useState } from 'react';
import * as XLSX from 'xlsx';
import { toast } from 'react-toastify';

const AddBookExcelImport = () => {
  const [isUploading, setIsUploading] = useState(false);
  const [successCount, setSuccessCount] = useState(0);

  const handleFileUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Check if file is Excel
    const fileExtension = file.name.split('.').pop().toLowerCase();
    if (!['xlsx', 'xls', 'csv'].includes(fileExtension)) {
      toast.error("Please upload a valid Excel file (.xlsx, .xls, or .csv)");
      return;
    }

    setIsUploading(true);
    setSuccessCount(0);
    
    try {
      // Read the Excel file
      const data = await readExcelFile(file);
      if (!data || data.length === 0) {
        toast.error("No data found in the Excel file");
        setIsUploading(false);
        return;
      }

      // Validate data structure
      if (!validateExcelData(data)) {
        toast.error("Excel file must contain columns: isbn, price, and stock");
        setIsUploading(false);
        return;
      }

      // Process books one by one
      let addedBooks = 0;
      for (let i = 0; i < data.length; i++) {
        const book = data[i];
        try {
          await addBookToAPI(book);
          addedBooks++;
          setSuccessCount(addedBooks);
        } catch (error) {
          toast.error(`Error adding book with ISBN ${book.isbn}: ${error.message}`);
          // Continue processing the rest of the books
        }
      }

      if (addedBooks > 0) {
        toast.success(`Successfully added ${addedBooks} books out of ${data.length}`);
      }
    } catch (error) {
      toast.error(`Error processing Excel file: ${error.message}`);
    } finally {
      setIsUploading(false);
      // Reset the file input
      event.target.value = null;
    }
  };

  const readExcelFile = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target.result;
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet);
          resolve(json);
        } catch (error) {
          reject(error);
        }
      };
      reader.onerror = (error) => reject(error);
      reader.readAsArrayBuffer(file);
    });
  };

  const validateExcelData = (data) => {
    if (data.length === 0) return false;
    const requiredFields = ['isbn', 'price', 'stock'];
    const firstRow = data[0];
    return requiredFields.every(field => {
      const fieldExists = Object.keys(firstRow).some(key => 
        key.toLowerCase().trim() === field.toLowerCase()
      );
      return fieldExists;
    });
  };

  const addBookToAPI = async (book) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/add-book`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          isbn: book.isbn,
          price: parseFloat(book.price),
          stock: parseInt(book.stock, 10)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add book');
      }

      return await response.json();
    } catch (error) {
      throw error;
    }
  };

  return (
    <div className="flex justify-end mb-4">
      <label 
        htmlFor="excel-upload" 
        className="cursor-pointer bg-blue-500 hover:bg-blue-600 text-white py-2 px-4 rounded-md flex items-center transition-colors duration-300"
      >
        {isUploading ? (
          <>
            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            Processing ({successCount} added)
          </>
        ) : (
          <>
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path>
            </svg>
            Add by Excel
          </>
        )}
      </label>
      <input 
        id="excel-upload" 
        type="file" 
        accept=".xlsx,.xls,.csv" 
        className="hidden" 
        onChange={handleFileUpload}
        disabled={isUploading}
      />
    </div>
  );
};

export default AddBookExcelImport;