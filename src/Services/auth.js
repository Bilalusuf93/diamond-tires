import data from "../data";

export function AuthLogin(username, password) {
  const userData = data.users.find(
    (u) => u.password === password && u.username === username
  );
  if (userData) {
    localStorage.setItem("userInfo", userData.username);
  }
  return userData;
}

export function GetUserFromLS() {
  return localStorage.getItem("userInfo");
}
export function Logout() {
  return localStorage.removeItem("userInfo");
}
export default {
  AuthLogin,
  GetUserFromLS,
  Logout,
};
