import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface User {
  id: string;
  name: string;
  role: string;
  password: string;
}

interface UserState {
  data: User;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: {
    id: "",
    name: "",
    role: "",
    password: "",
  },
  loading: false,
  error: null,
};

export const fetchUser = createAsyncThunk(
  "user/fetch",
  async (id: string, thunkAPI) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/user/get_user_by_id?id=${id}`
      );
      return res.data.SUCCESS;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const createUser = createAsyncThunk(
  "user/create",
  async (payload: User, thunkAPI) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/user/create_user`,
        payload
      );
      return res.data.SUCCESS;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const updateUser = createAsyncThunk(
  "user/update",
  async (payload: { id: string; name: string; password: string }, thunkAPI) => {
    try {
      const { id, name, password } = payload;
      const res = await axios.put(
        `${
          import.meta.env.VITE_BACKEND_URL
        }/user/update_user?id=${id}&name=${name}&password=${password}`
      );
      return id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const deleteUser = createAsyncThunk(
  "user/delete",
  async (id: string, thunkAPI) => {
    try {
      const res = await axios.delete(
        `${import.meta.env.VITE_BACKEND_URL}/user/delete_user?id=${id}`
      );
      return id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const UserSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.data = action.payload;
      state.error = null;
    },
    clearUser: (state) => {
      state.data = {
        id: "",
        name: "",
        role: "",
        password: "",
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchUser.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchUser.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(fetchUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });
    builder.addCase(createUser.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createUser.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
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
      state.data.id = action.payload;
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
      state.data.id = action.payload;
      state.error = null;
    });
    builder.addCase(deleteUser.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });
  },
});

export const { setUser, clearUser } = UserSlice.actions;
export default UserSlice.reducer;
