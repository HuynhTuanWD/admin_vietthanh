import React, { useState, useEffect, useReducer } from "react";
import MaterialTable from "material-table";
import { Grid, Row, Col } from "react-bootstrap";
import { withRouter } from "react-router-dom";
import Swal from "sweetalert2";
export default withRouter(function Test(props) {
  const { history } = props;
  const [manuData, setManuData] = useState([]);
  useEffect(() => {
    let data = [];
    for (let i = 1; i < 10000; i++) {
      data.push({
        id: i,
        name: "Zerya" + i,
        surname: "Baran" + i,
        birthYear: i,
        birthCity: i
      });
    }
    setManuData(data);
  }, []);
  return (
    <div className="main-content">
      {console.log("render")}
      <Grid fluid>
        <Row>
          <Col md={12}>
            <MaterialTable
              title="Positioning"
              columns={[
                {
                  title: "Hình ảnh",
                  field: "image",
                  render: rowData => (
                    <img
                      src={rowData.image}
                      style={{ width: 50, borderRadius: "50%" }}
                    />
                  )
                },
                { title: "Surname", field: "surname" },
                {
                  title: "Birth Year",
                  field: "birthYear",
                  type: "numeric"
                },
                {
                  title: "Birth Year",
                  field: "birthYear",
                  type: "numeric"
                },
                {
                  title: "Birth Place",
                  field: "birthCity",
                  lookup: { 34: "İstanbul", 63: "Şanlıurfa" }
                },
                {
                  title: "hành động"
                }
              ]}
              data={manuData}
              actions={[
                {
                  icon: "edit",
                  tooltip: "Sửa",
                  onClick: (event, rowData) =>
                    history.push("/thuonghieu/danhsach")
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
                      if (result.value) {
                        let newData = manuData.filter(
                          item => item.id !== rowData.id
                        );
                        await setManuData(newData);

                        const Toast = Swal.mixin({
                          toast: true,
                          position: "top-end",
                          showConfirmButton: false,
                          timer: 3000
                        });

                        Toast.fire({
                          type: "success",
                          title: "Xóa thành công!"
                        });
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
    </div>
  );
});
