import { axiosInstanceMultipart, axiosInstanceWithOutMultipart } from "../config/api"

export const addProject = (formData)=>{
  return axiosInstanceWithOutMultipart.post('/project/addProject',formData,{withCredentials:true});
}