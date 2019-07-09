import React, { Component, useState, useEffect } from "react";
import SortableTree, {
  getFlatDataFromTree,
  getTreeFromFlatData,
  addNodeUnderParent,
  removeNodeAtPath,
  changeNodeAtPath,
} from "react-sortable-tree";
import "react-sortable-tree/style.css"; // This only needs to be imported once in your app
import axios from "axios";
import Swal from "sweetalert2";
import IconButton from "@material-ui/core/IconButton";
import AddIcon from "@material-ui/icons/Add";
import EditIcon from "@material-ui/icons/Edit";
import DeleteIcon from "@material-ui/icons/Delete";
import SaveIcon from "@material-ui/icons/Save";
import Tooltip from "@material-ui/core/Tooltip";
import Fab from "@material-ui/core/Fab";
import Checkbox from "@material-ui/core/Checkbox";
import "assets/css/fixscroll.css";
export default function Category(props) {
  const [treeCategories, setTreeCategories] = useState([]);
  const [addAsFirstChild, setAddAsFirstChild] = useState(false);
  const getNodeKey = ({ treeIndex }) => treeIndex;
  useEffect(() => {
    async function fetchCategories() {
      let res = await axios.get("/categories");
      let treeData = getTreeFromFlatData({
        flatData: res.data.map(node => ({
          ...node,
          title: node.title,
          id: node._id,
          isEdit: false
        })),
        getKey: node => node.id, // resolve a node's key
        getParentKey: node => node.parent, // resolve a node's parent's key
        rootKey: null // The value of the parent key when there is no parent (i.e., at root level)
      });
      setTreeCategories(treeData);
    }
    fetchCategories();
  }, []);
  const getFlatDataFromNode = node =>
    getFlatDataFromTree({
      treeData: node,
      getNodeKey: ({ node }) => node.id, // This ensures your "id" properties are exported in the path
      ignoreCollapsed: false // Makes sure you traverse every node in the tree, not just the visible ones
    }).map(({ node, path }) => ({
      id: node.id,
      title: node.title,

      // The last entry in the path is this node's key
      // The second to last entry (accessed here) is the parent node's key
      parent: path.length > 1 ? path[path.length - 2] : null
    }));
  const changeIsEdit = (node, path) => {
    setTreeCategories(
      changeNodeAtPath({
        treeData: treeCategories,
        path,
        getNodeKey,
        newNode: { ...node, isEdit: !node.isEdit }
      })
    );
  };
  const Toast = Swal.mixin({
    toast: true,
    position: "top-end",
    showConfirmButton: false,
    timer: 3000
  });
  return (
    <div>
      {/* ↓treeData for this tree was generated from flat data similar to DB rows↓ */}
      <div style={{ height: 400 }}>
        <SortableTree
          treeData={treeCategories}
          onChange={treeCategories => {
            console.log("onChangeTree", treeCategories);
            setTreeCategories(treeCategories);
          }}
          generateNodeProps={({ node, path }) => ({
            title: node.isEdit ? (
              <input
                style={{ fontSize: "1.1rem" }}
                value={node.title}
                onChange={event => {
                  const title = event.target.value;

                  setTreeCategories(
                    changeNodeAtPath({
                      treeData: treeCategories,
                      path,
                      getNodeKey,
                      newNode: { ...node, title }
                    })
                  );
                }}
              />
            ) : (
              <p style={{ fontSize: "1.1rem" }}>{node.title}</p>
            ),
            buttons: [
              node.isEdit ? (
                <IconButton
                  onClick={() => changeIsEdit(node, path)}
                  aria-label="Save"
                  size="small"
                >
                  <SaveIcon fontSize="inherit" />
                </IconButton>
              ) : (
                <IconButton
                  onClick={() => changeIsEdit(node, path)}
                  aria-label="Edit"
                  size="small"
                >
                  <EditIcon fontSize="inherit" />
                </IconButton>
              ),
              <IconButton
                aria-label="Add"
                size="small"
                onClick={async () => {
                  console.log("node", node, "path", path);
                  let res = await axios.post("/category", { title: "" });
                  let _id = res.data;
                  if (_id) {
                    await setTreeCategories(
                      addNodeUnderParent({
                        treeData: treeCategories,
                        parentKey: path[path.length - 1],
                        expandParent: true,
                        getNodeKey,
                        newNode: {
                          _id: _id,
                          id: _id,
                          title: "",
                          parent: node.id,
                          isEdit: false
                        },
                        addAsFirstChild: addAsFirstChild
                      }).treeData
                    );
                  }
                  console.log(
                    getFlatDataFromTree({
                      treeData: treeCategories,
                      getNodeKey: ({ node }) => node.id, // This ensures your "id" properties are exported in the path
                      ignoreCollapsed: false // Makes sure you traverse every node in the tree, not just the visible ones
                    })
                  );
                }}
              >
                <AddIcon fontSize="inherit" />
              </IconButton>,
              <IconButton
                aria-label="Edit"
                size="small"
                onClick={async () => {
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
                    if (result.value) {
                      try {
                        let category_ids = getFlatDataFromNode([node]).map(
                          item => item.id
                        );
                        await axios.post("/categories/deletes", {
                          category_ids
                        });
                        setTreeCategories(
                          removeNodeAtPath({
                            treeData: treeCategories,
                            path,
                            getNodeKey
                          })
                        );
                        Toast.fire({
                          type: "success",
                          title: "Xóa thành công!"
                        });
                      } catch (err) {
                        Toast.fire({
                          type: "warning",
                          title: "Có lỗi xảy ra vui lòng kiểm tra đường truyền!"
                        });
                      }
                    }
                  });
                }}
              >
                <DeleteIcon fontSize="inherit" />
              </IconButton>
            ]
          })}
        />
      </div>
      <hr />
      {/* ↓This flat data is generated from the modified tree data↓ */}
      {/* <ul>
        {getFlatDataFromNode(treeCategories).map(({ id, title, parent }) => (
          <li key={id}>
            id: {id}, title: {title}, parent: {parent || "null"}
          </li>
        ))}
      </ul> */}
      <div style={{ marginLeft: 30 }}>
        <Tooltip
          onClick={async () => {
            let res = await axios.post("/category", { title: "" });
            let _id = res.data;
            addAsFirstChild
              ? setTreeCategories([
                  { id: _id, title: "", parent: null },
                  ...treeCategories
                ])
              : setTreeCategories([
                  ...treeCategories,
                  { id: _id, title: "", parent: null }
                ]);
          }}
          title="Thêm"
          aria-label="Add"
        >
          <Fab size="small" color="primary">
            <AddIcon />
          </Fab>
        </Tooltip>
        <Tooltip
          onClick={async () => {
            let categories = getFlatDataFromNode(treeCategories).map(
              ({ id, title, parent },key) => ({
                _id:id,
                title,
                parent,
                order:key+1
              })
            );
            let res = await axios.post("/categories",{categories});
            if(res.status==200){
              Toast.fire({
                type: "success",
                title: "Lưu thành công!"
              });
            }else{
              Toast.fire({
                type: "warning",
                title: "Có lỗi xảy ra vui lòng kiểm tra đường truyền!"
              });
            }
          }}
          style={{ marginLeft: 10 }}
          color="secondary"
          title="Lưu thao tác"
          aria-label="Save"
        >
          <Fab size="small">
            <SaveIcon />
          </Fab>
        </Tooltip>
        <br />
        <label htmlFor="addAsFirstChild">
          <Checkbox
            checked={addAsFirstChild}
            onChange={() => setAddAsFirstChild(!addAsFirstChild)}
            value=""
            color="primary"
            inputProps={{
              "aria-label": "secondary checkbox"
            }}
          />
          <span style={{ paddingLeft: 5 }}>Thêm vào đầu danh sách</span>
        </label>
      </div>
    </div>
  );
}
