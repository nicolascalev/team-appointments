import axios from "axios";

export const fetcherSimple = (url: string) =>
  axios.get(url).then((res) => res.data);

export const fetcherWithAuth = (...args: Parameters<typeof axios.get>) =>
  axios.get(...args).then((res) => res.data);

export const fetcherWithArgs = (url: string, args: Record<string, string>) =>
  axios.get(url, { params: args }).then((res) => res.data);
