import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface User {
  id: string;
  name: string;
  role: string;
  password: string;
}

interface UserState {
  data: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: [],
  loading: false,
  error: null,
};

export const createUser = createAsyncThunk(
  "user/create",
  async (payload: User, _) => {
    try {
      return payload;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async (payload: { id: string; name: string; password: string }, _) => {
    try {
      return payload;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (id: string, _) => {
    try {
      return id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const UsersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUsers: (state, action: PayloadAction<User[]>) => {
      state.data = action.payload;
      state.error = null;
    },
    clearUsers: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createUser.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      state.data = [...state.data, action.payload];
      state.error = null;
    });
    builder.addCase(createUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });
    builder.addCase(updateUser.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateUser.fulfilled, (state, action) => {
      state.loading = false;
      state.data = state.data.map((user) => {
        if (user.id === action.payload.id) {
          return {
            ...user,
            name: action.payload.name,
            password: action.payload.password,
          };
        }
        return user;
      });
      state.error = null;
    });
    builder.addCase(updateUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });
    builder.addCase(deleteUser.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.loading = false;
      state.data = state.data.filter((user) => user.id !== action.payload);
      state.error = null;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });
  },
});

export const { setUsers, clearUsers } = UsersSlice.actions;
export default UsersSlice.reducer;
