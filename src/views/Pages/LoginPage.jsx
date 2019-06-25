import React, { Component, useState, useEffect } from "react";
import {
  Grid,
  Row,
  Col,
  FormGroup,
  ControlLabel,
  FormControl
} from "react-bootstrap";

import Card from "components/Card/Card.jsx";

import Button from "elements/CustomButton/CustomButton.jsx";
import Checkbox from "elements/CustomCheckbox/CustomCheckbox.jsx";
import Loader from "react-loader";
import { useInput } from "../../hooks/input-hook";
export default function LoginPage() {
  const [cardHidden, setCardHidden] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    setTimeout(
      function() {
        setCardHidden(false);
      }.bind(this),
      700
    );
  }, []);
  const {
    value: username,
    bind: bindUsername,
    reset: resetUsername
  } = useInput("");
  const {
    value: password,
    bind: bindPassword,
    reset: resetPassword
  } = useInput("");
  return (
    <Grid>
      <Row>
        <Col md={4} sm={6} mdOffset={4} smOffset={3}>
          <form>
            <Card
              hidden={cardHidden}
              textCenter
              title="Đăng nhập"
              content={
                <div>
                  <Loader loaded={!isLoading}>
                    <FormGroup>
                      <ControlLabel>Tài khoản</ControlLabel>
                      <FormControl
                        {...bindUsername}
                        placeholder="Tài khoản"
                        type="text"
                      />
                    </FormGroup>
                    <FormGroup>
                      <ControlLabel>Mật khẩu</ControlLabel>
                      <FormControl
                        {...bindPassword}
                        placeholder="Mật khẩu"
                        type="password"
                      />
                    </FormGroup>
                  </Loader>
                </div>
              }
              legend={
                <Button disabled={isLoading} bsStyle="info" fill wd>
                  Đăng nhập
                </Button>
              }
              ftTextCenter
            />
          </form>
        </Col>
      </Row>
    </Grid>
  );
}
