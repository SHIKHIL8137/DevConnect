import { axiosInstance, axiosInstanceMultipart, axiosInstanceWithOutMultipart } from "../config/api"

export const addProject = (formData)=>{
  return axiosInstanceMultipart.post('/project/addProject',formData,{withCredentials:true});
}

export const fetchProjectOfUser = ()=>{
  return axiosInstance.get(`/project/getProjectOfUser`,{withCredentials:true});
}

export const projectDetails = (id)=>{
  return axiosInstance.get(`/project/projectDetails?id=${id}`)
}