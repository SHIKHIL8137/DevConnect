import { createSlice } from "@reduxjs/toolkit";
import { fetchUserData } from "../thunk/userThunk";
const initialState = {
  user:null,
  isAuthenticated : false
}

const userSlice = createSlice({
  name:"user",
  initialState,
  reducers:{
    logout(state){
      state.user = null;
      state.isAuthenticated = false;
    }
  },
  extraReducers:(builder)=>{
    builder.addCase(fetchUserData.fulfilled,(state,action)=>{
      state.isAuthenticated = true;
      state.user = action.payload;
    });
    builder.addCase(fetchUserData.rejected,(state,action)=>{
      state.isAuthenticated = false;
      state.user = null;
    });

  }
})

export const {setUser,logout} = userSlice.actions;
export default userSlice.reducer;