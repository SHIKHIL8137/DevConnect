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
