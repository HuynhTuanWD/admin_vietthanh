import React, { useState, useEffect } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  Form
} from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import Button from "@material-ui/core/Button";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import Reply from "@material-ui/icons/Reply";
import Loader from "react-loader";
import Swal from "sweetalert2";
import { useInput } from "hooks/input-hook";
import { IMG_NO_AVATAR,IMG_URL,IMG_AVATAR_URL } from "config";
export default withRouter(function EditUser(props) {
  const { history, match } = props;
  let fileInput = React.createRef();
  const [fileUpload, setFileUpload] = useState("");
  const [srcImage, setSrcImage] = useState(IMG_NO_AVATAR);
  const [nameImage, setNameImage] = useState("");
  const { value: name, bind: bindName, setValue: setName } = useInput("");
  const { value: username, bind: bindUsername, setValue: setUsername } = useInput("");
  const [isUsernameDup, setIsUsernameDup] = useState(false);
  const { value: password, bind: bindPassword } = useInput("");
  const { value: repassword, bind: bindRepassword } = useInput("");
  const [isPassError, setIsPassError] = useState(false);
  const [role, setRole] = useState(1);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const handleFileChange = e => {
    setFileUpload(e.target.files[0]);
    console.log(e.target.files);
    if (e.target.files[0]) {
      setNameImage(e.target.files[0].name);
      let reader = new FileReader();
      reader.onload = e => {
        setSrcImage(e.target.result);
      };
      reader.readAsDataURL(e.target.files[0]);
    } else {
      setSrcImage("");
      setNameImage("");
    }
  };
  const handleSubmit = async e => {
    console.log("submit");
    e.preventDefault();
    if (!isPassError && !isUsernameDup) {
      try {
        await setIsLoading(true);
        var fd = new FormData();
        let user = { name, username, password, role };
        for (let key in user) fd.append(key, user[key]);
        fd.append("_id",match.params._id);
        if (fileUpload) {
          fd.append("userImage", fileUpload, fileUpload.name);
        }
        let res_user = await axios.put("/user", fd);
        await setIsLoading(false);
        if (res_user.status == 200) {
          const Toast = Swal.mixin({
            toast: true,
            position: "top-end",
            showConfirmButton: false,
            timer: 3000
          });
          Toast.fire({
            type: "success",
            title: "Câọ nhật thành công"
          });
          history.push("/hethong/taikhoan/danhsach");
        }
      } catch (err) {
        if (err.response.status == 422) {
          console.log(err.response);
          setIsUsernameDup(true);
        }
        if (err.response.status == 500) {
          setIsError(true);
        }
        setIsLoading(false);
      }
    }
  };
  useEffect(() => {
    async function fetchUser() {
      try {
        let res = await axios.get("/user/" + match.params._id);
        setName(res.data.name);
        setUsername(res.data.username);
        setRole(1);
        setSrcImage(
          res.data.avatar == "" ? IMG_NO_AVATAR : IMG_AVATAR_URL + res.data.avatar
        );
      } catch (err) {
        console.log(err);
      }
    }
    fetchUser();
  }, []);
  useEffect(() => {
    if (password !== repassword) {
      setIsPassError(true);
    } else {
      setIsPassError(false);
    }
  }, [password, repassword]);
  useEffect(() => {
    setIsUsernameDup(false);
  }, [username]);
  useEffect(() => {
    setIsError(false);
  }, [name, fileUpload]);
  return (
    <div className="main-content">
      <Grid fluid>
        <Row>
          <Col md={12}>
            <Card
              title={
                <div>
                  <Button onClick={() => history.goBack()} variant="contained">
                    <Reply />
                  </Button>
                  <legend style={{ marginTop: "10px" }}>Cập nhật tài khoản</legend>
                </div>
              }
              content={
                <Form onSubmit={handleSubmit} horizontal>
                  <fieldset>
                    <FormGroup>
                      <ControlLabel className="col-sm-2">Họ tên</ControlLabel>
                      <Col sm={10}>
                        <FormControl required {...bindName} type="text" />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel className="col-sm-2">
                        Tên đăng nhập
                      </ControlLabel>
                      <Col sm={10}>
                        <FormControl
                          className={!isUsernameDup || "error"}
                          required
                          {...bindUsername}
                          type="text"
                        />
                        {!isUsernameDup || (
                          <p className="text-danger">Tên đăng nhập bị trùng</p>
                        )}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel className="col-sm-2">Mật khẩu</ControlLabel>
                      <Col sm={10}>
                        <FormControl
                          required
                          className={!isPassError || "error"}
                          {...bindPassword}
                          type="password"
                        />
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel className="col-sm-2">
                        Nhập lại mật khẩu
                      </ControlLabel>
                      <Col sm={10}>
                        <FormControl
                          required
                          className={!isPassError || "error"}
                          {...bindRepassword}
                          type="password"
                        />
                        {!isPassError || (
                          <p className="text-danger">Mật khẩu không khớp</p>
                        )}
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel className="col-sm-2">
                        Quyền hạn
                      </ControlLabel>
                      <Col sm={10}>
                        <select
                          className="form-control"
                          value={role}
                          onChange={e => setRole(e.target.value)}
                        >
                          <option value="1">Admin</option>
                        </select>
                      </Col>
                    </FormGroup>
                  </fieldset>
                  <fieldset>
                    <FormGroup>
                      <ControlLabel className="col-sm-2">Avatar</ControlLabel>
                      <Col sm={10}>
                        <input
                          ref={fileInput}
                          style={{ display: "none" }}
                          type="file"
                          onChange={handleFileChange}
                        />
                        <Button
                          variant="contained"
                          onClick={() => {
                            fileInput.current.click();
                          }}
                        >
                          Chọn
                        </Button>
                        <div style={{ width: "200px" }}>
                          <img style={{ width: "100%" }} src={srcImage} />
                        </div>
                        <div>
                          <p>{nameImage}</p>
                        </div>
                        {!isError || (
                          <div>
                            <p className="text-danger">
                              Có lỗi xảy ra, vui lòng thử lại
                            </p>
                          </div>
                        )}
                        <Loader loaded={!isLoading}>
                          <Button
                            variant="contained"
                            type="submit"
                            color="primary"
                          >
                            Cập nhật
                          </Button>
                        </Loader>
                      </Col>
                    </FormGroup>
                  </fieldset>
                </Form>
              }
            />
          </Col>
        </Row>
      </Grid>
    </div>
  );
});
