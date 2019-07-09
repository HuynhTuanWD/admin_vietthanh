import React, { useState, useEffect } from "react";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import { IMG_NO_AVATAR } from "config";
import { convertFromRaw, convertToRaw, EditorState } from "draft-js";
import draftToHtml from "draftjs-to-html";
import axios from "axios";
import { IMG_PRODUCT_URL } from "config";
export const useInput = initialValue => {
  const [value, setValue] = useState(initialValue);

  return {
    value,
    setValue,
    reset: () => setValue(""),
    bind: {
      value,
      onChange: event => {
        setValue(event.target.value);
      }
    }
  };
};


export default function EditorImage({value,setValue}) {
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
      editorState={value}
      onEditorStateChange={editor => {
        console.log(draftToHtml(convertToRaw(editor.getCurrentContent())));
        setValue(editor);
      }}
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
