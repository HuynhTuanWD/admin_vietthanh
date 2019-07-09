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
import { ChromePicker } from "react-color";
export default withRouter(function ListManu(props) {
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
            colors: action.colors
          };
        case "ADD": {
          return {
            ...state,
            colors: [action.color, ...state.colors]
          };
        }
        case "EDIT": {
          return {
            ...state,
            colors: state.colors.map(item =>
              item._id === action.color._id ? action.color : item
            )
          };
        }
        case "DELETE": {
          return {
            ...state,
            colors: state.colors.filter(item => item._id !== action._id)
          };
        }
        default:
          return state;
      }
    },
    {
      colors: []
    }
  );
  const [addState, setAddState] = useState({
    color: {
      hex: "#000000",
      name: ""
    },
    isOpen: false
  });
  const handleAddChange = e => {
    setAddState({
      ...addState,
      color: { ...addState.color, [e.target.name]: e.target.value }
    });
  };

  const handleAddSubmit = async e => {
    e.preventDefault();
    try {
      let res = await axios.post("/color", addState.color);
      dispatch({ type: "ADD", color: res.data });
      Toast.fire({
        type: "success",
        title: "Thêm thành công"
      });
    } catch (err) {
      Toast.fire({
        type: "warning",
        title: "Có lỗi xảy ra, vui lòng kiểm tra đường truyền!"
      });
    }
  };
  let [editState, setEditState] = useState({
    color: {
      hex: "",
      name: ""
    },
    isOpen: false
  });
  const handleEditChange = e => {
    setEditState({
      ...editState,
      color: { ...editState.color, [e.target.name]: e.target.value }
    });
  };

  const handleEditSubmit = async e => {
    e.preventDefault();
    try {
      await axios.put("/color/" + editState.color._id, editState.color);
      dispatch({ type: "EDIT", color: editState.data });
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
        let res = await axios.get("/colors");
        dispatch({ type: "GET_ALL", colors: res.data });
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
                        color: { name: "", hex: "#000" },
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
                {
                  title: "Màu",
                  field: "hex",
                  render: rowData => (
                    <div
                      style={{
                        background: rowData.hex,
                        width: "25px",
                        height: "25px"
                      }}
                    />
                  )
                },
                { title: "Tên màu", field: "name" }
              ]}
              data={tableState.colors}
              actions={[
                {
                  icon: "edit",
                  tooltip: "Sửa",
                  onClick: (event, rowData) =>
                    setEditState({ color: rowData, isOpen: true })
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
                          await axios.delete("/color/" + rowData._id);
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
            <Modal.Title id="modal_add">Thêm màu mặc định</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              <ControlLabel>Tên màu:</ControlLabel>
              <input
                value={addState.color.name}
                onChange={handleAddChange}
                className="form-control"
                name="name"
                placeholder="Tên màu"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Chọn màu đàn:</ControlLabel>
              <ChromePicker
                color={addState.color.hex}
                onChangeComplete={(color, event) => {
                  setAddState({
                    ...addState,
                    color: { ...addState.color, hex: color.hex }
                  });
                }}
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
            <Modal.Title id="modal_add">Cập nhật màu mặc định</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <FormGroup>
              <ControlLabel>Tên màu:</ControlLabel>
              <input
                value={editState.color.name}
                onChange={handleEditChange}
                className="form-control"
                name="name"
                placeholder="Tên màu"
              />
            </FormGroup>
            <FormGroup>
              <ControlLabel>Chọn màu đàn:</ControlLabel>
              <ChromePicker
                color={editState.color.hex}
                onChangeComplete={(color, event) => {
                  setEditState({
                    ...editState,
                    color: { ...editState.color, hex: color.hex }
                  });
                }}
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
