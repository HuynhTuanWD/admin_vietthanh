import axios from "axios";
import store from "store";
const userReducer = (user, action) => {
  switch (action.type) {
    case "LOG_IN": {
      axios.defaults.headers.common["Authorization"] = store.get("token");
      return {
        ...action.data
      };
    }
    case "LOG_OUT":
      axios.defaults.headers.common["Authorization"] = "";
      return {};
    case "GET_PROFILE":
      return {
        ...action.payload
      };
    default:
      return user;
  }
};
export default userReducer;
