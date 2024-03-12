import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";

export interface Admin {
  id: string;
  teacher_name: string;
}

interface TecaherState {
  data: Admin;
  loading: boolean;
  error: string | null;
}

const initialState: TecaherState = {
  data: {
    id: "",
    teacher_name: "",
  },
  loading: false,
  error: null,
};

export const fetchTeacher = createAsyncThunk(
  "teacher/fetch",
  async (id: string, thunkAPI) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/teacher/get_teacher_by_id?id=${id}`
      );
      return res.data.SUCCESS;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const TeacherSlice = createSlice({
  name: "teacher",
  initialState,
  reducers: {
    setTeacher: (state, action: PayloadAction<Admin>) => {
      state.data = action.payload;
      state.error = null;
    },
    clearTeacher: (state) => {
      state.data = {
        id: "",
        teacher_name: "",
      };
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTeacher.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(fetchTeacher.fulfilled, (state, action) => {
      state.loading = false;
      state.data = action.payload;
      state.error = null;
    });
    builder.addCase(fetchTeacher.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });
  },
});

export const { setTeacher, clearTeacher } = TeacherSlice.actions;
export default TeacherSlice.reducer;
