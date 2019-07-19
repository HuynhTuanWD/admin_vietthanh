import Profile from "../views/User/Profile";
import EditProfile from "../views/User/EditProfile";
var profileRoutes = [
  {
    path: "/thongtincanhan",
    name: "Thông tin cá nhân",
    component: Profile,
    icon: "pe-7s-user",
    isHidden: true
  },
  {
    path: "/capnhatthongtin",
    name: "Cập nhật thông tin cá nhân",
    component: EditProfile,
    icon: "pe-7s-note",
    isHidden: true
  }
];

export default profileRoutes;
