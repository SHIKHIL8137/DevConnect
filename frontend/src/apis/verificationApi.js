import { axiosInstance } from "../config/api";

export const verificationRequest = (formData) => {
  return axiosInstance.post("/verification/request", formData, {
    withCredentials: true,
  });
};

export const verifiedClient = ()=>{
  return axiosInstance.get(`/verification/getClientData`,{withCredentials:true});
}

