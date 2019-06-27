import React, { useState, useEffect } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl,
  HelpBlock,
  Form,
  InputGroup
} from "react-bootstrap";

import Card from "components/Card/Card.jsx";
import Button from "elements/CustomButton/CustomButton.jsx";
import { withRouter } from "react-router-dom";
import axios from "axios";
import { deepStrictEqual } from "assert";
export default withRouter(function AddManu() {
  let fileInput = React.createRef();
  const [fileUpload, setFileUpload] = useState("");
  const [srcImage, setSrcImage] = useState("");
  const [nameImage, setNameImage] = useState("");
  const [name, setName] = useState("");
  const [isError, setIsError] = useState(false);
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
      let res = await axios.post("/api/manufacturer", { name });
      if (fileUpload && res.data._id) {
        console.log("voday");
        let fd = new FormData();
        fd.append("_id",res.data._id);
        console.log(fileUpload);
        fd.append("manuImage",fileUpload,fileUpload.name);
        await axios.post("/api/manufacturer/image",fd);
      }

    } catch (err) {
      setIsError(true);
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
              title={<legend>Thêm thương hiệu</legend>}
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
                          className="btn-fill"
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
                            <p>Có lỗi xảy ra</p>
                          </div>
                        )}
                        <Button type="submit" bsStyle="primary" fill wd>
                          Thêm
                        </Button>
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
