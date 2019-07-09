import React, { useState, useEffect, useReducer } from "react";
import MaterialTable, { MTableToolbar } from "material-table";
import {
  Grid,
  Row,
  Col,
  Modal,
  Label,
  FormGroup,
  ControlLabel,
  Form
} from "react-bootstrap";
import { withRouter, Link } from "react-router-dom";
import Swal from "sweetalert2";
import Button from "@material-ui/core/Button";
import Tooltip from "@material-ui/core/Tooltip";
import AddIcon from "@material-ui/icons/Add";
import Fab from "@material-ui/core/Fab";
import SaveIcon from "@material-ui/icons/Save";
import ClearIcon from "@material-ui/icons/Clear";
import axios from "axios";
import { IMG_MANU_URL, IMG_NO_URL } from "config";
const Manu = withRouter(function ListManu(props) {
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000
  });
  let { history } = props;
  const [tableState, dispatch] = useReducer(
    (state, action) => {
      switch (action.type) {
        case "GET_ALL":
          return {
            ...state,
            departments: action.departments
          };
        case "ADD": {
          return {
            ...state,
            departments: [action.department, ...state.departments]
          };
        }
        case "EDIT": {
          return {
            ...state,
            departments: state.departments.map(item =>
              item._id === action.department._id ? action.department : item
            )
          };
        }
        case "DELETE": {
          return {
            ...state,
            departments: state.departments.filter(
              item => item._id !== action._id
            )
          };
        }
        default:
          return state;
      }
    },
    {
      departments: []
    }
  );
  const [addState, setAddState] = useState({
    department: {
      name: "",
      address: ""
    },
    isOpen: false
  });
  const handleAddChange = e => {
    setAddState({
      ...addState,
      department: { ...addState.department, [e.target.name]: e.target.value }
    });
  };

  const handleAddSubmit = async e => {
    e.preventDefault();
    try {
      let res = await axios.post("/department", addState.department);
      dispatch({ type: "ADD", department: res.data });
      Toast.fire({
        type: "success",
        title: "Thêm thành công"
      });
    } catch (err) {
      console.log(err);
      Toast.fire({
        type: "warning",
        title: "Có lỗi xảy ra, vui lòng kiểm tra đường truyền!"
      });
    }
  };
  let [editState, setEditState] = useState({
    department: {
      name: "",
      address: ""
    },
    isOpen: false
  });
  const handleEditChange = e => {
    setEditState({
      ...editState,
      department: { ...editState.department, [e.target.name]: e.target.value }
    });
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put(
        "/department/" + editState.department._id,
        editState.department
      );
      dispatch({ type: "EDIT", department: editState.data });
      Toast.fire({
        type: "success",
        title: "Cập nhật thành công"
      });
    } catch (err) {
      Toast.fire({
        type: "warning",
        title: "Có lỗi xảy ra, vui lòng kiểm tra đường truyền!"
      });
    }
  };
  useEffect(() => {
    async function fetchManu() {
      try {
        let res = await axios.get("/departments");
        dispatch({ type: "GET_ALL", departments: res.data });
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
                  <Tooltip
                    onClick={() =>
                      setAddState({
                        department: { name: "", address: "" },
                        isOpen: true
                      })
                    }
                    title="Thêm"
                    aria-label="Add"
                  >
                    <Fab size="small" color="primary">
                      <AddIcon />
                    </Fab>
                  </Tooltip>
                  <span style={{ paddingLeft: "10px" }}> Danh sách</span>
                </div>
              }
              columns={[
                { title: "Tên chi nhánh", field: "name" },
                { title: "Địa chỉ", field: "address" }
              ]}
              data={tableState.departments}
              actions={[
                {
                  icon: "edit",
                  tooltip: "Sửa",
                  onClick: (event, rowData) =>
                    setEditState({ department: rowData, isOpen: true })
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
                          await axios.delete("/department/" + rowData._id);
                          dispatch({ type: "DELETE", _id: rowData._id });
                          // let newData = manuData.filter(
                          //   item => item._id !== rowData._id
                          // );
                          // await setManuData(newData);
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
      <Modal
        size="lg"
        show={addState.isOpen}
        onHide={() => setAddState({ ...addState, isOpen: false })}
        aria-labelledby="modal_add"
      >
        <Form onSubmit={handleAddSubmit}>
          <Modal.Header closeButton>
            <Modal.Title id="modal_add">Thêm chi nhánh</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              <ControlLabel>Tên chi nhánh:</ControlLabel>
              <input
                value={addState.department.name}
                onChange={handleAddChange}
                className="form-control"
                name="name"
                placeholder="Tên chi nhánh"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Địa chỉ:</ControlLabel>
              <input
                value={addState.department.address}
                onChange={handleAddChange}
                className="form-control"
                name="address"
                placeholder="Địa chỉ"
              />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              onClick={() => setAddState({ ...addState, isOpen: false })}
              variant="contained"
              color="primary"
              size="medium"
            >
              <SaveIcon />
              Lưu
            </Button>
            <i> </i>
            <Button
              onClick={() => setAddState({ ...addState, isOpen: false })}
              variant="contained"
              size="medium"
            >
              <ClearIcon />
              Hủy
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
      <Modal
        size="lg"
        show={editState.isOpen}
        onHide={() => setEditState({ ...editState, isOpen: false })}
        aria-labelledby="modal_add"
      >
        <Form onSubmit={handleEditSubmit}>
          <Modal.Header closeButton>
            <Modal.Title id="modal_add">Cập nhật chi nhánh</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              <ControlLabel>Tên chi nhánh:</ControlLabel>
              <input
                value={editState.department.name}
                onChange={handleEditChange}
                className="form-control"
                name="name"
                placeholder="Tên chi nhánh"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Địa chỉ:</ControlLabel>
              <input
                value={editState.department.address}
                onChange={handleEditChange}
                className="form-control"
                name="address"
                placeholder="Địa chỉ"
              />
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <Button
              type="submit"
              onClick={() => setEditState({ ...editState, isOpen: false })}
              variant="contained"
              color="primary"
              size="medium"
            >
              <SaveIcon />
              Lưu
            </Button>
            <i> </i>
            <Button
              onClick={() => setEditState({ ...editState, isOpen: false })}
              variant="contained"
              size="medium"
            >
              <ClearIcon />
              Hủy
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
});
export default Manu;
function test() {
  return <Manu />;
}
