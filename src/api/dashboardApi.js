import apiClient from "./apiClient";

export const getDashboardUsers = () => 
  apiClient.get("/users/get/usuarios");

export const getDashboardProjects = () => 
  apiClient.get("/projects/getProjects");

export const getDashboardPayments = () => 
  apiClient.get("/payments/getAll");