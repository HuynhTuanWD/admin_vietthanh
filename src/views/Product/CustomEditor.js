import { IMG_PRODUCT_URL } from "config";
import axios from "axios";
import React from "react";
import { Editor } from "react-draft-wysiwyg";
export default function CustomEditor(props) {
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
