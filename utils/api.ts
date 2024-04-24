import axios from "axios";

const axiosApi = axios;

type MethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const api = (
  route: string,
  method: MethodType,
  body?: Record<string, any>
) => {
  return axiosApi({
    method,
    url: `http://localhost:3001/api${route}`,
    data: body,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
