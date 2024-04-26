import axios from "axios";

const axiosApi = axios;

type MethodType = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export const api = (
  route: string,
  method: MethodType,
  body?: Record<string, any>,
  params?: Record<string, any>
) => {
  // transform the object into a query string
  const queryString = params
    ? Object.keys(params)
        .map((key) => `${key}=${params[key]}`)
        .join("&")
    : "";

  const url = `http://localhost:3001/api${route}${
    queryString ? `?${queryString}` : ""
  }`;

  return axiosApi({
    method,
    url,
    data: body,

    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });
};
