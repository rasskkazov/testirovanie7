const axios = require("axios");

const axiosReqresInstance = axios.create({
  baseURL: "https://reqres.in/api",
  headers: {
    "Content-Type": "application/json",
  },
});

module.exports = axiosReqresInstance;
