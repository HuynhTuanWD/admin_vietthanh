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
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import { IMG_PRODUCT_URL, IMG_NO_URL } from "config";
import _ from "lodash";
function CustomEditor(props) {
  async function uploadImageCallBack(file) {
    let fd = new FormData();
    fd.append("productImage", file);
    let res = await axios.post("/product/image", fd);
    return {
      data: {
        link: IMG_PRODUCT_URL + res.data
      }
    };
  }
  return (
    <Editor
      {...props}
      wrapperClassName="demo-wrapper"
      editorClassName="demo-editor"
      toolbar={{
        inline: { inDropdown: true },
        list: { inDropdown: true },
        textAlign: { inDropdown: true },
        link: { inDropdown: true },
        history: { inDropdown: true },
        image: {
          uploadCallback: uploadImageCallBack,
          alt: { present: true, mandatory: true }
        }
      }}
    />
  );
}
export default withRouter(function AddProduct(props) {
  let file1 = React.createRef();
  let file2 = React.createRef();
  let file3 = React.createRef();
  let file4 = React.createRef();
  const [fileUpload, setFileUpload] = useState("");
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
  const [categoryOptions, setCategoryOptions] = useState([]);
  const [manufacturerOptions, setManufacturerOptions] = useState([]);
  const [colors, setColors] = useState([]);
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [shortDescription, setShortDescription] = useState(null);
  const [description, setDescription] = useState(null);
  const [technicalSpec, setTechnicalSpec] = useState(null);
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
    fetchCategoryOptions();
    fetchManuOptions();
    fetchColors();
  }, []);

  const handleFileChange = (e, setNameImage, setSrcImage) => {
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
    console.log("sumit");
    e.preventDefault();
    try {
      await setIsLoading(true);
      var fd = new FormData();
      fd.append("name", name);
      if (fileUpload) {
        fd.append("manuImage", fileUpload, fileUpload.name);
      }
      let res_manu = await axios.post("/manufacturer", fd);
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
                        style={{ display: "none" }}
                        type="file"
                        onChange={e =>
                          handleFileChange(e, setNameImage1, setSrcImage1)
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
                        style={{ display: "none" }}
                        type="file"
                        onChange={e =>
                          handleFileChange(e, setNameImage2, setSrcImage2)
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
                        style={{ display: "none" }}
                        type="file"
                        onChange={e =>
                          handleFileChange(e, setNameImage3, setSrcImage3)
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
                        style={{ display: "none" }}
                        type="file"
                        onChange={e =>
                          handleFileChange(e, setNameImage4, setSrcImage4)
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
                  onChange={value => {
                    console.log(value);
                    set_categories(value);
                  }}
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
                      onChange={value => {
                        console.log(value);
                        set_manufacturer(value);
                      }}
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
                // placeholder="Multiple Select"
                // closeOnSelect={false}
                // multi={true}
                // name="multipleSelect"
                // value={this.state.multipleSelect}
                // options={selectOptions}
                // onChange={value => {
                //   this.setState({ multipleSelect: value });
                // }}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Từ khóa SEO:</ControlLabel>
                <FormControl placeholder="Từ khóa SEO" type="text" />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Mô tả ngắn:</ControlLabel>
                <CustomEditor
                  editorState={shortDescription}
                  onEditorStateChange={editor => {
                    console.log(
                      draftToHtml(convertToRaw(editor.getCurrentContent()))
                    );
                    setShortDescription(editor);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Mô tả:</ControlLabel>
                <CustomEditor
                  editorState={description}
                  onEditorStateChange={editor => {
                    console.log(
                      draftToHtml(convertToRaw(editor.getCurrentContent()))
                    );
                    setDescription(editor);
                  }}
                />
              </FormGroup>
              <FormGroup>
                <ControlLabel>Thông số kỹ thuật:</ControlLabel>
                <CustomEditor
                  editorState={technicalSpec}
                  onEditorStateChange={editor => {
                    console.log(
                      draftToHtml(convertToRaw(editor.getCurrentContent()))
                    );
                    setTechnicalSpec(editor);
                  }}
                />
              </FormGroup>
            </Form>
          }
        />
      </Grid>
    </div>
  );
});
