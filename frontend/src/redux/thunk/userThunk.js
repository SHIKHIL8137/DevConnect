import { createAsyncThunk } from "@reduxjs/toolkit";
import { fetchUser } from "../../apis/userApi";

export const fetchUserData = createAsyncThunk('user/fetch',async()=>{
  const res = await fetchUser();
  return res.data
})