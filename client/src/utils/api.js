const axios = require("axios");

let axiosInstance;

if (process.env.NODE_ENV === "production") {
  axiosInstance = axios.create({
    baseURL: window.location.origin + "/"
  });
} else {
  axiosInstance = axios.create({
    baseURL: "http://localhost:8080/"
  });
}

module.exports = axiosInstance;
