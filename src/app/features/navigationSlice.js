import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeId: "gamification",
};

export const navigationSlice = createSlice({
  name: "navigation",
  initialState,
  reducers: {
    setActiveId: (state, action) => {
      state.activeId = action.payload;
    },
  },
});

export const { setActiveId } = navigationSlice.actions;

export const selectActiveId = (state) => state.navigation.activeId;

export default navigationSlice.reducer;
