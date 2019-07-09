import React, { useState, useEffect, useReducer } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import { Grid, Row, Col } from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import Swal from "sweetalert2";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import axios from "axios";
import { IMG_AVATAR_URL, IMG_NO_AVATAR } from "config";
export default withRouter(function ListManu(props) {
  const { history } = props;
  const [userData, setUserData] = useState([]);
  useEffect(() => {
    async function fetchManu() {
      try {
        let res = await axios.get("/users");
        setUserData(res.data);
      } catch (err) {
        console.log(err);
      }
    }
    fetchManu();
  }, []);
  return (
    <div className="main-content">
      <Grid fluid>
        <Row>
          <Col md={12}>
            <MaterialTable
              title={
                <div>
                  <Link to="/hethong/taikhoan/danhsach/them">
                    <Tooltip title="Thêm" aria-label="Add">
                      <Fab size="small" color="primary">
                        <AddIcon />
                      </Fab>
                    </Tooltip>
                  </Link>
                  <span style={{ paddingLeft: "10px" }}> Danh sách</span>
                </div>
              }
              columns={[
                {
                  title: "Hình ảnh",
                  field: "avatar",
                  render: rowData => (
                    <img
                      src={
                        rowData.avatar == ""
                          ? IMG_NO_AVATAR
                          : IMG_AVATAR_URL + rowData.avatar
                      }
                      style={{ height: 20 }}
                    />
                  )
                },
                { title: "Tên", field: "name" },
                { title: "Tài khoản", field: "username" },
                {
                  title: "Quyền hạn",
                  field: "role",
                  render: rowData => (rowData.role === 1 ? "Admin" : "")
                }
              ]}
              data={userData}
              actions={[
                {
                  icon: "edit",
                  tooltip: "Sửa",
                  onClick: (event, rowData) =>
                    history.push(
                      "/hethong/taikhoan/danhsach/capnhat/" + rowData._id
                    )
                },
                rowData => ({
                  icon: "delete",
                  tooltip: "Xóa",
                  onClick: (event, rowData) => {
                    Swal.fire({
                      title: "Bạn có chắc muốn xóa?",
                      text: "Bạn sẽ không thể quay lại trạng thái cũ!",
                      type: "warning",
                      showCancelButton: true,
                      confirmButtonColor: "#3085d6",
                      cancelButtonColor: "#d33",
                      confirmButtonText: "Xóa!",
                      cancelButtonText: "Hủy"
                    }).then(async result => {
                      const Toast = Swal.mixin({
                        toast: true,
                        position: "top-end",
                        showConfirmButton: false,
                        timer: 3000
                      });
                      if (result.value) {
                        try {
                          await axios.delete("/user/" + rowData._id);
                          let newData = userData.filter(
                            item => item._id !== rowData._id
                          );
                          await setUserData(newData);
                          Toast.fire({
                            type: "success",
                            title: "Xóa thành công!"
                          });
                        } catch (err) {
                          Toast.fire({
                            type: "warning",
                            title:
                              "Có lỗi xảy ra vui lòng kiểm tra đường truyền!"
                          });
                        }
                      }
                    });
                  }
                })
              ]}
              options={{
                actionsColumnIndex: -1
              }}
            />
          </Col>
        </Row>
      </Grid>
    </div>
  );
});
