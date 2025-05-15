import {
  axiosInstance,
  axiosInstanceMultipart,
} from "../config/api";

export const addProject = (formData) => {
  return axiosInstanceMultipart.post("/project/addProject", formData, {
    withCredentials: true,
  });
};

export const fetchProjectOfUser = () => {
  return axiosInstance.get(`/project/getProjectOfUser`, {
    withCredentials: true,
  });
};

export const projectDetails = (id) => {
  return axiosInstance.get(`/project/projectDetails?id=${id}`);
};
export const projectDataFetch = (id) => {
  return axiosInstance.get(`/project/projectDataFetch?id=${id}`);
};

export const updateProject = (projectId, formData) => {
  return axiosInstanceMultipart.patch(
    `/project/editProject?projectId=${projectId}`,
    formData,
    { withCredentials: true }
  );
};

export const deleteProject = (projectId, attachmentId) => {
  return axiosInstance.delete(
    `/project/deleteAttachment?projectId=${projectId}&attachmentId=${attachmentId}`
  );
};
