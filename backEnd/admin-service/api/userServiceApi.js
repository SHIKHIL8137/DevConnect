import { axiosInstance } from "../config/api.js";

export const fetchUsersDashbordDetails = ()=>{
  return axiosInstance.get('/user/adminService/adminDashDetails');
};

export const fetchFreelancerDatas = (page,prefix)=>{
  return axiosInstance.get(`/user/adminService/freelancerDetails?page=${page}&search=${prefix}`);
}

export const fetchClientDatas = (page,prefix)=>{
  return axiosInstance.get(`/user/adminService/clientDetails?page=${page}&search=${prefix}`);
}

export const updataBlockStatus = (userId)=>{
  return axiosInstance.patch(`/user/adminService/updataBlockStatus?userId=${userId}`,{withCredentials:true})
}


