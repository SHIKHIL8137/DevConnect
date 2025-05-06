import { axiosInstance, axiosInstanceMultipart } from "../config/api";


export const loginValidate = (formData)=>{
  return axiosInstance.post('/admin/login',formData,{withCredentials:true})
}
export const fetchAdmin = ()=>{
  return axiosInstance.get('/admin/verify',{withCredentials : true});
}

export const fetchDashboardData = () =>{
  return axiosInstance.get('/admin/dashboard/dasboardData',{withCredentials : true});
}

export const getFreelancersData = (page,prefix)=>{
return axiosInstance.get(`/admin/freelancer/freelacerData?page=${page}&search=${prefix}`,{withCredentials:true});
}

export const getClientsData = (page,prefix)=>{
  return axiosInstance.get(`/admin/client/clientData?page=${page}&search=${prefix}`,{withCredentials:true});
  }

export const blockUser = (userId)=>{
  return axiosInstance.patch(`/admin/common/blockUser?userId=${userId}`);
}