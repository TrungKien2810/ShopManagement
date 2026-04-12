import axios from "axios";

const API_URL = "http://localhost:5000/api/Menu";

export const menuApi = {
  getMenu: async () => {
    const response = await axios.get(API_URL);
    return response.data;
  }
};
