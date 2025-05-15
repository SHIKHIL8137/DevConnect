import { axiosInstance } from "../config/api"

export const projectsDataHome = ()=>{
  return axiosInstance.get('/project/projectsDataHome');
}

export const freelancersDataHome =()=>{
  return axiosInstance.get('/user/commonData/freelancersDataHome');
}