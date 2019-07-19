import userReducer from './user';
const mainReducer = ({ user }, action) => ({
  user: userReducer(user, action),
});
export default mainReducer;