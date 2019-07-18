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
import Select from "react-select";
import Card from "components/Card/Card.jsx";
import Button from "@material-ui/core/Button";
import { withRouter, Link } from "react-router-dom";
import axios from "axios";
import Reply from "@material-ui/icons/Reply";
import Loader from "react-loader";
import Swal from "sweetalert2";
import Checkbox from "elements/CustomCheckbox/CustomCheckbox.jsx";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { IMG_PRODUCT_URL, IMG_NO_URL } from "config";
import _ from "lodash";
import { CustomEditor, htmlToEditorState,editorStateToHtml } from "./CustomEditor";
import FormData from "form-data";
export default withRouter(function AddProduct(props) {
  let file1 = React.createRef();
  let file2 = React.createRef();
  let file3 = React.createRef();
  let file4 = React.createRef();
  const [fileUpload, setFileUpload] = useState([0, 0, 0, 0]);
  const [fileStatus, setFileStatus] = useState(["0", "0", "0", "0"]);
  const [srcImage1, setSrcImage1] = useState("");
  const [nameImage1, setNameImage1] = useState("");
  const [srcImage2, setSrcImage2] = useState("");
  const [nameImage2, setNameImage2] = useState("");
  const [srcImage3, setSrcImage3] = useState("");
  const [nameImage3, setNameImage3] = useState("");
  const [srcImage4, setSrcImage4] = useState("");
  const [nameImage4, setNameImage4] = useState("");
  const [name, setName] = useState("");
  const [isLabelNew, setIsLabelNew] = useState(0);
  const [isLabelPrice, setIsLabelPrice] = useState(0);
  const [price, setPrice] = useState(0);
  const [discount, setDiscount] = useState(0);
  const [discountOnline, setDiscountOnline] = useState(0);
  const [_categories, set_categories] = useState([]);
  const [_manufacturer, set_manufacturer] = useState(null);
  const [quantity, setQuantity] = useState(0);
  const [_departments, set_departments] = useState([]);
  const [colors, setColors] = useState([]);
  const [shortDescriptionEditor, setShortDescriptionEditor] = useState(null);
  const [descriptionEditor, setDescriptionEditor] = useState(null);
  const [technicalSpecEditor, setTechnicalSpecEditor] = useState(null);
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [manufacturerOptions, setManufacturerOptions] = useState([]);
  const [departmentOptions, setDepartmentOptions] = useState([]);

  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const { history } = props;

  useEffect(() => {
    async function fetchCategoryOptions() {
      let res = await axios.get("/categories");
      setCategoryOptions(
        res.data.map(item => ({ label: item.title, value: item._id }))
      );
    }
    async function fetchManuOptions() {
      let res = await axios.get("/manufacturers");
      setManufacturerOptions(
        res.data.map(item => ({ label: item.name, value: item._id }))
      );
    }
    async function fetchColors() {
      let res = await axios.get("/colors");
      setColors(_.map(res.data, e => ({ ...e, checked: true })));
    }
    async function fetchDepartments() {
      let res = await axios.get("/departments");
      setDepartmentOptions(
        res.data.map(item => ({ label: item.address, value: item._id }))
      );
    }
    fetchCategoryOptions();
    fetchManuOptions();
    fetchColors();
    fetchDepartments();
  }, []);

  const handleFileChange = (e, setNameImage, setSrcImage, th) => {
    // setFileUpload(e.target.files[0]);
    let fileHandle = e.target.files[0];
    if (fileHandle) {
      setFileUpload(
        fileUpload.map((item, idx) => (idx === th ? fileHandle : item))
      );
      setFileStatus(fileStatus.map((item, idx) => (idx === th ? "ADD" : item)));
      setNameImage(fileHandle.name);
      let reader = new FileReader();
      reader.onload = e => {
        setSrcImage(e.target.result);
      };
      reader.readAsDataURL(fileHandle);
    } else {
      setFileUpload(fileUpload.map((item, idx) => (idx === th ? 0 : item)));
      setFileStatus(fileStatus.map((item, idx) => (idx === th ? 0 : item)));
      setSrcImage("");
      setNameImage("");
    }
  };
  const handleSubmit = async e => {
    console.log("sumit");
    e.preventDefault();
    try {
      await setIsLoading(true);
      var fd = new FormData();
      let shortDescription = editorStateToHtml(shortDescriptionEditor);
      let description = editorStateToHtml(descriptionEditor);
      let technicalSpec = editorStateToHtml(technicalSpecEditor);
      fd.append(
        "product",
        JSON.stringify({
          name,
          isLabelNew,
          isLabelPrice,
          price,
          discount,
          discountOnline,
          _categories,
          _manufacturer,
          quantity,
          _departments,
          shortDescription,
          description,
          technicalSpec,
          colors
        })
      );
      console.log(fileStatus);
      for (let i = 0; i < fileUpload.length; i++) {
        fd.append("productImages", fileUpload[i]);
        fd.append("fileStatus", fileStatus[i]);
      }
      let res = await axios.post("/product", fd);
      await setIsLoading(false);
      if (res.status == 200) {
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
        history.push("/sanpham/sanpham/danhsach");
      }
    } catch (err) {
      setIsError(true);
      setIsLoading(false);
    }
  };
  return (
    <div className="main-content">
      <Grid fluid>
        <Card
          title={
            <div>
              <Button onClick={() => history.goBack()} variant="contained">
                <Reply />
              </Button>
              <legend style={{ marginTop: "10px" }}>Thêm sản phẩm</legend>
            </div>
          }
          content={
            <Form onSubmit={handleSubmit}>
              <Row>
                <Col sm={6}>
                  <FormGroup>
                    <ControlLabel>Tên sản phẩm:</ControlLabel>
                    <FormControl
                      value={name}
                      onChange={e => setName(e.target.value)}
                      required
                      placeholder="Tên sản phẩm"
                      type="text"
                    />
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Nhãn sản phẩm mới:</ControlLabel>
                    <select
                      value={isLabelNew}
                      onChange={e => setIsLabelNew(e.target.value)}
                      className="form-control"
                    >
                      <option value="0">Không</option>
                      <option value="1">Có</option>
                    </select>
                  </FormGroup>
                  <FormGroup>
                    <ControlLabel>Nhãn giá sốc cuối tuần:</ControlLabel>
                    <select
                      value={isLabelPrice}
                      onChange={e => setIsLabelPrice(e.target.value)}
                      className="form-control"
                    >
                      <option value="0">Không</option>
                      <option value="1">Có</option>
                    </select>
                  </FormGroup>
                </Col>
                <Col sm={6}>
                  <FormGroup>
                    <ControlLabel>Hình đại diện</ControlLabel>
                    <div>
                      <input
                        ref={file1}
                        name="productImages"
                        style={{ display: "none" }}
                        type="file"
                        onChange={e =>
                          handleFileChange(e, setNameImage1, setSrcImage1, 0)
                        }
                      />
                      <Button
                        variant="contained"
                        onClick={() => {
                          file1.current.click();
                        }}
                      >
                        Chọn
                      </Button>
                      <div
                        style={{
                          marginTop: 5,
                          width: "250px",
                          height: "200px",
                          border: "1px solid grey"
                        }}
                      >
                        <img
                          style={{ width: "100%", height: "100%" }}
                          src={srcImage1 == "" ? IMG_NO_URL : srcImage1}
                        />
                      </div>
                      <div>
                        <p>{nameImage1}</p>
                      </div>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <FormGroup>
                    <ControlLabel>Hình chi tiết</ControlLabel>
                    <div>
                      <input
                        ref={file2}
                        name="productImages"
                        style={{ display: "none" }}
                        type="file"
                        onChange={e =>
                          handleFileChange(e, setNameImage2, setSrcImage2, 1)
                        }
                      />
                      <Button
                        variant="contained"
                        onClick={() => {
                          file2.current.click();
                        }}
                      >
                        Chọn
                      </Button>
                      <div
                        style={{
                          marginTop: 5,
                          width: "250px",
                          height: "180px",
                          border: "1px solid grey"
                        }}
                      >
                        <img
                          style={{ width: "100%", height: "100%" }}
                          src={srcImage2 == "" ? IMG_NO_URL : srcImage2}
                        />
                      </div>
                      <div>
                        <p>{nameImage2}</p>
                      </div>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm={4}>
                  <FormGroup>
                    <ControlLabel>Hình chi tiết</ControlLabel>
                    <div>
                      <input
                        ref={file3}
                        name="productImages"
                        style={{ display: "none" }}
                        type="file"
                        onChange={e =>
                          handleFileChange(e, setNameImage3, setSrcImage3, 2)
                        }
                      />
                      <Button
                        variant="contained"
                        onClick={() => {
                          file3.current.click();
                        }}
                      >
                        Chọn
                      </Button>
                      <div
                        style={{
                          marginTop: 5,
                          width: "250px",
                          height: "180px",
                          border: "1px solid grey"
                        }}
                      >
                        <img
                          style={{ width: "100%", height: "100%" }}
                          src={srcImage3 == "" ? IMG_NO_URL : srcImage3}
                        />
                      </div>
                      <div>
                        <p>{nameImage3}</p>
                      </div>
                    </div>
                  </FormGroup>
                </Col>
                <Col sm={4}>
                  <FormGroup>
                    <ControlLabel>Hình chi tiết</ControlLabel>
                    <div>
                      <input
                        ref={file4}
                        name="productImages"
                        style={{ display: "none" }}
                        type="file"
                        onChange={e =>
                          handleFileChange(e, setNameImage4, setSrcImage4, 3)
                        }
                      />
                      <Button
                        variant="contained"
                        onClick={() => {
                          file4.current.click();
                        }}
                      >
                        Chọn
                      </Button>
                      <div
                        style={{
                          marginTop: 5,
                          width: "250px",
                          height: "180px",
                          border: "1px solid grey"
                        }}
                      >
                        <img
                          style={{ width: "100%", height: "100%" }}
                          src={srcImage4 == "" ? IMG_NO_URL : srcImage4}
                        />
                      </div>
                      <div>
                        <p>{nameImage4}</p>
                      </div>
                    </div>
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={4}>
                  <FormGroup>
                    <ControlLabel>Giá:</ControlLabel>
                    <FormControl
                      value={price}
                      onChange={e => setPrice(e.target.value)}
                      placeholder="Giá"
                      type="text"
                    />
                  </FormGroup>
                </Col>
                <Col sm={4}>
                  <FormGroup>
                    <ControlLabel>Giảm giá(%):</ControlLabel>
                    <FormControl
                      value={discount}
                      onChange={e => setDiscount(e.target.value)}
                      placeholder="Giảm giá"
                      type="text"
                    />
                  </FormGroup>
                </Col>
                <Col sm={4}>
                  <FormGroup>
                    <ControlLabel>Giảm giá online(%):</ControlLabel>
                    <FormControl
                      value={discountOnline}
                      onChange={e => setDiscountOnline(e.target.value)}
                      placeholder="Giảm giá online"
                      type="text"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <FormGroup>
                <ControlLabel>Danh mục:</ControlLabel>
                <Select
                  placeholder="Danh sách danh mục"
                  closeOnSelect={false}
                  multi={true}
                  name="multipleSelect"
                  value={_categories}
                  options={categoryOptions}
                  onChange={value => set_categories(_.map(value, "value"))}
                />
              </FormGroup>
              <Row>
                <Col sm={6}>
                  <FormGroup>
                    <ControlLabel>Thương hiệu:</ControlLabel>
                    <Select
                      placeholder="Thương hiệu"
                      name="singleSelect"
                      value={_manufacturer}
                      options={manufacturerOptions}
                      onChange={value => set_manufacturer(value.value)}
                    />
                  </FormGroup>
                </Col>
                <Col sm={6}>
                  <FormGroup>
                    <ControlLabel>Số lượng còn:</ControlLabel>
                    <FormControl
                      value={quantity}
                      onChange={e => setQuantity(e.target.value)}
                      placeholder="Số lượng còn"
                      type="text"
                    />
                  </FormGroup>
                </Col>
              </Row>
              <Row>
                <Col sm={1}>
                  <FormGroup>
                    <ControlLabel>Màu sắc:</ControlLabel>
                  </FormGroup>
                </Col>
                {colors.map((item, key) => (
                  <Col key={key} sm={2}>
                    <Checkbox
                      onChange={e => {
                        setColors(
                          _.map(colors, item =>
                            item._id === e.target.id
                              ? { ...item, checked: !item.checked }
                              : item
                          )
                        );
                      }}
                      checked={item.checked}
                      number={item._id}
                      label={item.name}
                    />
                  </Col>
                ))}
              </Row>
              <FormGroup>
                <ControlLabel>Chi nhánh có hàng:</ControlLabel>
                <Select
                  placeholder="Chi nhánh có hàng"
                  closeOnSelect={false}
                  multi={true}
                  name="multipleSelect"
                  value={_departments}
                  options={departmentOptions}
                  onChange={value => set_departments(_.map(value, "value"))}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Mô tả ngắn:</ControlLabel>
                <CustomEditor
                  editorState={shortDescriptionEditor}
                  onEditorStateChange={editor => {
                    setShortDescriptionEditor(editor);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Mô tả:</ControlLabel>
                <CustomEditor
                  editorState={descriptionEditor}
                  onEditorStateChange={editor => {
                    setDescriptionEditor(editor);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Thông số kỹ thuật:</ControlLabel>
                <CustomEditor
                  editorState={technicalSpecEditor}
                  onEditorStateChange={editor => {
                    setTechnicalSpecEditor(editor);
                  }}
                />
              </FormGroup>
              <div className="text-center">
                <Loader loaded={!isLoading}>
                  <Button variant="contained" type="submit" color="primary">
                    Thêm
                  </Button>
                </Loader>
              </div>
            </Form>
          }
        />
      </Grid>
    </div>
  );
});
