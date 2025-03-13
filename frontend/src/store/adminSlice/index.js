import { configureStore, createSlice, createAsyncThunk } from "@reduxjs/toolkit";

// Async thunk for fetching batch data (users, sellers, management)
export const fetchAllData = createAsyncThunk("data/fetchAllData", async (_, { rejectWithValue }) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/admin/api/v1/get-batch-data`);
        const data = await response.json();
        if (data) {
            return {
                users: data.users || [],
                sellers: data.sellers || [],
                management: data.management || [],
            };
        } else {
            return rejectWithValue("No data available");
        }
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Async thunk for fetching books
export const fetchBooks = createAsyncThunk("data/fetchBooks", async (_, { rejectWithValue }) => {
    try {
        const response = await fetch(`${import.meta.env.VITE_BASE_URL}/book/api/v1/all-genre-book`);
        const data = await response.json();
        if (data.success && data.books) {
            return Object.values(data.books).flat(); // Flatten books array
        } else {
            return rejectWithValue("No books found");
        }
    } catch (error) {
        return rejectWithValue(error.message);
    }
});

// Admin Slice
const adminSlice = createSlice({
    name: "adminReducer",
    initialState: {
        users: [],
        sellers: [],
        management: [],
        books: [],
        status: "idle",
        error: null,
    },
    reducers: {
        setBooks(state, action) {
            state.books = action.payload;
        },
        setSellers(state, action) {
            state.sellers = action.payload;
        }
    },
    extraReducers: (builder) => {
        builder
            // Handle batch data fetch
            .addCase(fetchAllData.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchAllData.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.users = action.payload.users;
                state.sellers = action.payload.sellers;
                state.management = action.payload.management;
            })
            .addCase(fetchAllData.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            })
            // Handle books fetch
            .addCase(fetchBooks.pending, (state) => {
                state.status = "loading";
            })
            .addCase(fetchBooks.fulfilled, (state, action) => {
                state.status = "succeeded";
                state.books = action.payload;
            })
            .addCase(fetchBooks.rejected, (state, action) => {
                state.status = "failed";
                state.error = action.payload;
            });
    },
});

export const { setBooks, setSellers } = adminSlice.actions;
export default adminSlice.reducer;
