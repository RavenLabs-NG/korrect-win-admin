import axios, { AxiosError } from "axios";

export const queryClient = (token?: string) =>
  axios.create({
    baseURL: "http://203.161.38.57:1322/",
    headers: {
      "Content-Type": "application/json",
      ...(token && { Authorization: `Bearer ${token}` }),
    },
  });

export const altQueryClient = (token?: string) =>
	axios.create({
		baseURL: "https://api.korrectpredict.com",
		headers: {
			"Content-Type": "application/json",
			...(token && { Authorization: `Bearer ${token}` })
		}
	});
//https://api.korrectpredict.com
export const nextError = (e: AxiosError) => {
  //@ts-ignore
  throw e.response.data ? e.response.data.message : "Something went wrong";
};
