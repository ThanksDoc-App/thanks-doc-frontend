import { apiGetCategories, apiDeleteCateory } from '@/services/CrmService';
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface Category {
  _id: string
  name: string
  createdAt?: string
  updatedAt?: string
  __v?: number
}

interface CategoryState {
  data: Category[];
  loading: boolean;
  error: string | null;
  deleteLoading: boolean;
  deleteError: string | null;
}

const initialState: CategoryState = {
  data: [],
  loading: false,
  error: null,
  deleteLoading: false,
  deleteError: null,
};

// ✅ Fixed: Extract the correct nested data
export const fetchCategories = createAsyncThunk(
  'category/fetchCategories',
  async (_, thunkAPI) => {
    try {
      const response = await apiGetCategories<any>(); // Change generic type
      console.log(response, "full response");
      console.log(response.data, "response.data");
      console.log(response.data.data, "response.data.data");
      console.log(response.data.data.categories, "categories array");
      
      // ✅ Fix: Access the nested categories array
      const categories = response.data.data.categories;
      
      if (!categories || !Array.isArray(categories)) {
        throw new Error('Categories data is not an array');
      }
      
      return categories; // This is the actual array
    } catch (error: any) {
      console.error('Error in fetchCategories:', error);
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || error.message || 'Failed to fetch categories'
      );
    }
  }
);

// Delete category async thunk
export const deleteCategory = createAsyncThunk(
  'category/deleteCategory',
  async (categoryId: string, thunkAPI) => {
    try {
      const response = await apiDeleteCateory<any>(categoryId);
      console.log('Delete category response:', response);
      
      // Return the deleted category ID for state update
      return categoryId;
    } catch (error: any) {
      console.error('Error in deleteCategory:', error);
      return thunkAPI.rejectWithValue(
        error?.response?.data?.message || 
        error?.message || 
        'Failed to delete category'
      );
    }
  }
);

const categorySlice = createSlice({
  name: 'category',
  initialState,
  reducers: {
    // Clear delete error
    clearDeleteError: (state) => {
      state.deleteError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch categories cases
      .addCase(fetchCategories.pending, (state) => {
        console.log('fetchCategories.pending - setting loading to true');
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        console.log('fetchCategories.fulfilled - payload:', action.payload);
        console.log('fetchCategories.fulfilled - state before:', state.data);
        state.data = action.payload; // Now this will be the actual categories array
        state.loading = false;
        console.log('fetchCategories.fulfilled - state after:', state.data);
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        console.log('fetchCategories.rejected - error:', action.payload);
        state.loading = false;
        state.error = action.payload as string;
      })
      
      // Delete category cases
      .addCase(deleteCategory.pending, (state) => {
        console.log('deleteCategory.pending - setting deleteLoading to true');
        state.deleteLoading = true;
        state.deleteError = null;
      })
      .addCase(deleteCategory.fulfilled, (state, action) => {
        console.log('deleteCategory.fulfilled - deleted category ID:', action.payload);
        state.deleteLoading = false;
        state.deleteError = null;
        
        // Remove the deleted category from the data array
        state.data = state.data.filter(category => category._id !== action.payload);
        console.log('deleteCategory.fulfilled - updated categories:', state.data);
      })
      .addCase(deleteCategory.rejected, (state, action) => {
        console.log('deleteCategory.rejected - error:', action.payload);
        state.deleteLoading = false;
        state.deleteError = action.payload as string;
      });
  },
});

// Export actions
export const { clearDeleteError } = categorySlice.actions;

// Export selectors
export const selectCategories = (state: { category: CategoryState }) => state.category.data;
export const selectCategoriesLoading = (state: { category: CategoryState }) => state.category.loading;
export const selectCategoriesError = (state: { category: CategoryState }) => state.category.error;
export const selectDeleteLoading = (state: { category: CategoryState }) => state.category.deleteLoading;
export const selectDeleteError = (state: { category: CategoryState }) => state.category.deleteError;

export default categorySlice.reducer;