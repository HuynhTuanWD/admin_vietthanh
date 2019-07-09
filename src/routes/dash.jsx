import Dashboard from "views/Dashboard/Dashboard.jsx";
import Buttons from "views/Components/Buttons.jsx";
import GridSystem from "views/Components/GridSystem.jsx";
import Panels from "views/Components/Panels.jsx";
import SweetAlert from "views/Components/SweetAlertPage.jsx";
import Notifications from "views/Components/Notifications.jsx";
import Icons from "views/Components/Icons.jsx";
import Typography from "views/Components/Typography.jsx";
import RegularForms from "views/Forms/RegularForms.jsx";
import ExtendedForms from "views/Forms/ExtendedForms.jsx";
import ValidationForms from "views/Forms/ValidationForms.jsx";
import Wizard from "views/Forms/Wizard/Wizard.jsx";
import RegularTables from "views/Tables/RegularTables.jsx";
import ExtendedTables from "views/Tables/ExtendedTables.jsx";
import DataTables from "views/Tables/DataTables.jsx";
import GoogleMaps from "views/Maps/GoogleMaps.jsx";
import FullScreenMap from "views/Maps/FullScreenMap.jsx";
import VectorMap from "views/Maps/VectorMap.jsx";
import Charts from "views/Charts/Charts.jsx";
import Calendar from "views/Calendar/Calendar.jsx";
import UserPage from "views/Pages/UserPage.jsx";
import AddManu from "../views/Manufacturer/AddManu";
import EditManu from "../views/Manufacturer/EditManu";
import ListManu from "../views/Manufacturer/ListManu";
import AddUser from "../views/User/AddUser";
import EditUser from "../views/User/EditUser";
import ListUser from "../views/User/ListUser";
import AddProduct from "../views/Product/AddProduct";
import EditProduct from "../views/Product/EditProduct";
import ListProduct from "../views/Product/ListProduct";
import ListColor from "../views/Color/ListColor";
import ListDepartment from "../views/Department/ListDepartment";
import Test from "../views/Product/Test";
import Category from "../views/Category/Category";
import pagesRoutes from "./pages.jsx";

var pages = [
  {
    path: "/pages/user-page",
    name: "User Page",
    mini: "UP",
    component: UserPage
  }
].concat(pagesRoutes);

var dashRoutes = [
  {
    collapse: true,
    path: "/sanpham",
    name: "Sản phẩm",
    state: "openThuonghieu",
    icon: "pe-7s-album",
    views: [
      {
        path: "/sanpham/sanpham/danhsach/them",
        name: "Thêm",
        mini: "T",
        component: AddProduct,
        isHidden: true
      },
      {
        path: "/sanpham/sanpham/danhsach/capnhat/:_id",
        name: "Cập nhật",
        mini: "S",
        component: EditProduct,
        isHidden: true
      },
      {
        path: "/sanpham/sanpham/danhsach",
        name: "Sản phẩm",
        mini: "SP",
        component: ListProduct
      },
      {
        path: "/sanpham/mausac/danhsach",
        name: "Màu mặc định",
        mini: "M",
        component: ListColor
      },
      {
        path: "/sanpham/danhmuc",
        name: "Danh mục",
        mini: "DM",
        component: Category
      },
      {
        path: "/sanpham/thuonghieu/danhsach/them",
        name: "Thêm",
        mini: "T",
        component: AddManu,
        isHidden: true
      },
      {
        path: "/sanpham/thuonghieu/danhsach/capnhat/:_id",
        name: "Cập nhật",
        mini: "S",
        component: EditManu,
        isHidden: true
      },
      {
        path: "/sanpham/thuonghieu/danhsach",
        name: "Thương hiệu",
        mini: "TH",
        component: ListManu
      },
      {
        path: "/sanpham/chinhanh/danhsach",
        name: "Chi nhánh",
        mini: "CN",
        component: ListDepartment
      },
      {
        path: "/sanpham/sanpham/test/test",
        name: "Test",
        mini: "TS",
        component: Test
      }
    ]
  },
  {
    collapse: true,
    path: "/hethong",
    name: "Hệ thống",
    state: "openHethong",
    icon: "pe-7s-album",
    views: [
      {
        path: "/hethong/taikhoan/danhsach/them",
        name: "Thêm",
        mini: "T",
        component: AddUser,
        isHidden: true
      },
      {
        path: "/hethong/taikhoan/danhsach/capnhat/:_id",
        name: "Cập nhật",
        mini: "S",
        component: EditUser,
        isHidden: true
      },
      {
        path: "/hethong/taikhoan/danhsach",
        name: "Tài khoản",
        mini: "DS",
        component: ListUser
      }
    ]
  },
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "pe-7s-graph",
    component: Dashboard
  },
  {
    collapse: true,
    path: "/components",
    name: "Components",
    state: "openComponents",
    icon: "pe-7s-plugin",
    views: [
      {
        path: "/components/buttons",
        name: "Buttons",
        mini: "B",
        component: Buttons
      },
      {
        path: "/components/grid-system",
        name: "Grid System",
        mini: "GS",
        component: GridSystem
      },
      {
        path: "/components/panels",
        name: "Panels",
        mini: "P",
        component: Panels
      },
      {
        path: "/components/sweet-alert",
        name: "Sweet Alert",
        mini: "SA",
        component: SweetAlert
      },
      {
        path: "/components/notifications",
        name: "Notifications",
        mini: "N",
        component: Notifications
      },
      { path: "/components/icons", name: "Icons", mini: "I", component: Icons },
      {
        path: "/components/typography",
        name: "Typography",
        mini: "T",
        component: Typography
      }
    ]
  },
  {
    collapse: true,
    path: "/forms",
    name: "Forms",
    state: "openForms",
    icon: "pe-7s-note2",
    views: [
      {
        path: "/forms/regular-forms",
        name: "Regular Forms",
        mini: "RF",
        component: RegularForms
      },
      {
        path: "/forms/extended-forms",
        name: "Extended Forms",
        mini: "EF",
        component: ExtendedForms
      },
      {
        path: "/forms/validation-forms",
        name: "Validation Forms",
        mini: "VF",
        component: ValidationForms
      },
      { path: "/forms/wizard", name: "Wizard", mini: "W", component: Wizard }
    ]
  },
  {
    collapse: true,
    path: "/tables",
    name: "Tables",
    state: "openTables",
    icon: "pe-7s-news-paper",
    views: [
      {
        path: "/tables/regular-tables",
        name: "Regular Tables",
        mini: "RT",
        component: RegularTables
      },
      {
        path: "/tables/extended-tables",
        name: "Extended Tables",
        mini: "ET",
        component: ExtendedTables
      },
      {
        path: "/tables/data-tables",
        name: "Data Tables",
        mini: "DT",
        component: DataTables
      }
    ]
  },
  {
    collapse: true,
    path: "/maps",
    name: "Maps",
    state: "openMaps",
    icon: "pe-7s-map-marker",
    views: [
      {
        path: "/maps/google-maps",
        name: "Google Maps",
        mini: "GM",
        component: GoogleMaps
      },
      {
        path: "/maps/full-screen-maps",
        name: "Full Screen Map",
        mini: "FSM",
        component: FullScreenMap
      },
      {
        path: "/maps/vector-maps",
        name: "Vector Map",
        mini: "VM",
        component: VectorMap
      }
    ]
  },
  { path: "/charts", name: "Charts", icon: "pe-7s-graph1", component: Charts },
  {
    path: "/calendar",
    name: "Calendar",
    icon: "pe-7s-date",
    component: Calendar
  },
  { redirect: true, path: "/", pathTo: "/dashboard", name: "Dashboard" }
];
export default dashRoutes;
