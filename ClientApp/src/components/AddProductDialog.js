import React, { useState } from "react";
import styled from "styled-components";
import {
  Dialog,
  DialogActions,
  Button,
  DialogContent,
  TextField,
  Paper
} from "@material-ui/core";
import { styled as MUIStyled } from "@material-ui/styles";
import { Container, Row, Col } from "reactstrap";

const AddProductDialog = props => {
  const [error, setError] = useState({ hasError: false, errorText: "" });
  const [values, setValues] = React.useState({
    productTitle: "",
    size: "",
    brand: "",
    location: "",
    otherInfo: ""
  });
  const handleChange = name => event => {
    setValues({ ...values, [name]: event.target.value });
  };

  const addNewProduct = () => {
    if (values.productTitle === "" || values.location === "") {
      return setError({
        hasError: true,
        errorText: "Produkttitel og placering skal udfyldes! "
      });
    }
    return fetch(`/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values)
    })
      .then(res => res.json())
      .then(res => props.setProducts(res));
  };
  return (
    <Dialog
      maxWidth="md"
      fullWidth
      open={props.open}
      onClose={props.handleToggle}
      scroll="paper"
    >
      <DialogContent>
        <Container>
          <Row>
            <Col>
              <h2>Opret ny produkt</h2>
            </Col>
          </Row>
          <Row>
            <Col>
              <Row>
                <Col>
                  <StyledInput
                    error={error.hasError}
                    required
                    id="outlined-required"
                    label="Produkttitel"
                    value={values.productTitle}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange("productTitle")}
                  />
                </Col>
                <Col>
                  <StyledInput
                    error={error.hasError}
                    required
                    id="outlined-required"
                    label="Placering på lager"
                    value={values.location}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange("location")}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <StyledInput
                    required
                    id="outlined-required"
                    label="Størrelse"
                    value={values.size}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange("size")}
                  />
                </Col>
                <Col>
                  <StyledInput
                    required
                    id="outlined-required"
                    label="Mærke"
                    value={values.brand}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    onChange={handleChange("brand")}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
                  <StyledInput
                    required
                    id="outlined-required"
                    label="Andet"
                    value={values.otherInfo}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    multiline
                    onChange={handleChange("otherInfo")}
                    rowsMax="4"
                    rows="4"
                  />
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </DialogContent>
      <DialogActions>
        <Row>
          <Error>{error.hasError ? error.errorText : null}</Error>
          <ActionBTN
            onClick={props.handleToggle}
            variant="outlined"
            color="secondary"
          >
            Anuller
          </ActionBTN>
          <ActionBTN
            onClick={addNewProduct}
            color="primary"
            variant="contained"
          >
            Gem produkt
          </ActionBTN>
        </Row>
      </DialogActions>
    </Dialog>
  );
};

const Error = styled.span`
  color: #dc3545;
  font-size: 15px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  margin: 10px 10px;
`;

const StyledInput = MUIStyled(TextField)({});
const ActionBTN = MUIStyled(Button)({
  margin: "5px"
});
export default AddProductDialog;
