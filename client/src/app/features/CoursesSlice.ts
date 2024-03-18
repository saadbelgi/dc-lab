import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";

export interface Course {
  name: string;
  code: string;
  teacher: string;
  duration: string;
}

interface CourseState {
  data: Course[];
  loading: boolean;
  error: string | null;
}

const initialState: CourseState = {
  data: [],
  loading: false,
  error: null,
};

export const createCourse = createAsyncThunk(
  "course/create",
  async (payload: Course, _) => {
    try {
      return payload;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const updateCourse = createAsyncThunk(
  "course/update",
  async (payload: { code: string; name: string; duration: string }, _) => {
    try {
      return payload;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const deleteCourse = createAsyncThunk(
  "course/delete",
  async (id: string, _) => {
    try {
      return id;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

export const CoursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setCourses: (state, action: PayloadAction<Course[]>) => {
      state.data = action.payload;
      state.error = null;
    },
    clearCourses: (state) => {
      state.data = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(createCourse.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(createCourse.fulfilled, (state, action) => {
      state.loading = false;
      state.data = [...state.data, action.payload];
      state.error = null;
    });
    builder.addCase(createCourse.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });
    builder.addCase(updateCourse.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(updateCourse.fulfilled, (state, action) => {
      state.loading = false;
      state.data = state.data.map((course) => {
        if (course.code === action.payload.code) {
          return {
            ...course,
            name: action.payload.name,
            duration: action.payload.duration,
          };
        }
        return course;
      });
      state.error = null;
    });
    builder.addCase(updateCourse.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });
    builder.addCase(deleteCourse.pending, (state, _) => {
      state.loading = true;
      state.error = null;
    });
    builder.addCase(deleteCourse.fulfilled, (state, action) => {
      state.loading = false;
      state.data = state.data.filter(
        (course) => course.code !== action.payload
      );
      state.error = null;
    });
    builder.addCase(deleteCourse.rejected, (state, action) => {
      state.loading = false;
      state.error = action.error.message || "An error occurred";
    });
  },
});

export const { setCourses, clearCourses } = CoursesSlice.actions;
export default CoursesSlice.reducer;
