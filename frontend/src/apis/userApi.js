import { axiosInstance, axiosInstanceMultipart } from "../config/api";

export const getOtp = (formData) => {
  return axiosInstance.post("/user/otp", formData);
};

export const checkUserName = (formData) => {
  return axiosInstance.post("/user/checkUserName", formData);
};

export const validateOtp = (formData) => {
  return axiosInstance.post("/user/validateOTP", formData);
};

export const validateUser = (formData) => {
  return axiosInstance.post("/user/validateUser", formData);
};

export const loginUser = (formData) => {
  return axiosInstance.post("/user/loginValidate", formData, {
    withCredentials: true,
  });
};

export const googleLogin = async () => {
  return await axiosInstance.get("/user/auth/google", {
    withCredentials: true,
  });
};

export const fetchUser = () => {
  return axiosInstance.get("/user/verify", { withCredentials: true });
};

export const updateProfile = (formData) => {
  return axiosInstance.patch("/user/update", formData);
};

export const ProfileImgUpdate = (formData, type) => {
  return axiosInstanceMultipart.post(
    `/user/upload-profileImg?type=${type}`,
    formData
  );
};

export const forgetPassword = (formData) => {
  return axiosInstance.post("/user/forgetPassword", formData);
};

export const validateUserChangPswd = (formData) => {
  return axiosInstance.patch("/user/validateUserChangPswd", formData);
};

export const updateFreelancer = (formData) => {
  return axiosInstance.patch("/user/updateFreelancer", formData, {
    withCredentials: true,
  });
};

export const clientHome = (query) => {
  const queryString = new URLSearchParams(query).toString();
  console.log(queryString);
  return axiosInstance.get(`/user/commonData/clinetHome?${queryString}`, {
    withCredentials: true,
  });
};

export const freelancerFetch = (userId) => {
  return axiosInstance.get(`/user/commonData/freelancerProfile?id=${userId}`);
};

export const freelancerHome = (query) => {
  const queryString = new URLSearchParams(query).toString();
  console.log(queryString);
  return axiosInstance.get(`/project/freelancerHome?${queryString}`, {
    withCredentials: true,
  });
};

export const applyProject = (formData) => {
  return axiosInstance.post(`/project/apply`, formData, {
    withCredentials: true,
  });
};

export const uploadResume = (formData) => {
  return axiosInstanceMultipart.patch("/user/updateResume", formData, {
    withCredentials: true,
  });
};

export const removeResume = () => {
  return axiosInstance.delete("/user/deleteResume", { withCredentials: true });
};
