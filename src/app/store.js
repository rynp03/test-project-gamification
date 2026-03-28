import { configureStore } from "@reduxjs/toolkit";
import navigationReducer from "./features/navigationSlice";
import gamificationModalReducer from "./features/gamificationModalSlice";

export const store = configureStore({
  reducer: {
    navigation: navigationReducer,
    gamificationModal: gamificationModalReducer,
  },
});