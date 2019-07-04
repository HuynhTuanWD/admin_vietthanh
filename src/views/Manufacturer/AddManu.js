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
export default withRouter(function AddManu(props) {
  let fileInput = React.createRef();
  const [fileUpload, setFileUpload] = useState("");
  const [srcImage, setSrcImage] = useState("");
  const [nameImage, setNameImage] = useState("");
  const [name, setName] = useState("");
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { history } = props;
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
  const handleNameChange = e => {
    setName(e.target.value);
  };
  const handleSubmit = async e => {
    console.log("sumit");
    e.preventDefault();
    try {
      await setIsLoading(true);
      var fd = new FormData();
      fd.append("name", name);
      if (fileUpload) {
        fd.append("manuImage", fileUpload, fileUpload.name);
      }
      let res_manu = await axios.post("/manufacturer",fd);
      await setIsLoading(false);
      if (res_manu.status == 200) {
        const Toast = Swal.mixin({
          toast: true,
          position: "top-end",
          showConfirmButton: false,
          timer: 3000
        });
        Toast.fire({
          type: "success",
          title: "Thêm thành công"
        });
        history.push("/sanpham/thuonghieu/danhsach");
      }
    } catch (err) {
      setIsError(true);
      setIsLoading(false);
    }
  };
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
                  <legend style={{ marginTop: "10px" }}>
                    Thêm thương hiệu
                  </legend>
                </div>
              }
              content={
                <Form onSubmit={handleSubmit} horizontal>
                  <fieldset>
                    <FormGroup>
                      <ControlLabel className="col-sm-2">
                        Tên thương hiệu
                      </ControlLabel>
                      <Col sm={10}>
                        <FormControl
                          onChange={handleNameChange}
                          value={name}
                          type="text"
                        />
                      </Col>
                    </FormGroup>
                  </fieldset>
                  <fieldset>
                    <FormGroup>
                      <ControlLabel className="col-sm-2">Hình ảnh</ControlLabel>
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
                            Thêm
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
