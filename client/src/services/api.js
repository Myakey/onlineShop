import axios from "axios";

const URL = "http://localhost:8080/api"

const AuthURL = "http://localhost:8080/auth"

export const api = axios.create({
  baseURL: URL, // http://localhost:8080/api (dev) OR deployed URL (prod)
  headers: {
    "Content-Type": "application/json",
  },
});

export const auth = axios.create({
  baseURL: AuthURL,
  headers: {
    "Content-Type": "application/json",
  }
})


