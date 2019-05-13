import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  Dialog,
  DialogTitle,
  DialogActions,
  Button,
  DialogContent,
  TextField,
  Paper
} from "@material-ui/core";
import { styled as MUIStyled } from "@material-ui/styles";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection
} from "@devexpress/dx-react-grid-material-ui";
import { SelectionState } from "@devexpress/dx-react-grid";
import { Container, Row, Col } from "reactstrap";
import { getProducts } from "../util/dataFetcher";

const AddProductToGiftDialog = props => {
  const productsHeader = [
    { name: "productId", disablePadding: false, title: "Id" },
    { name: "productTitle", disablePadding: false, title: "Titel" }
  ];
  const [error, setError] = useState({ hasError: false, errorText: "" });
  const [selection, changeSelection] = useState([]);
  const [products, setProducts] = useState([]);
  const [giftTitle, setTitle] = useState(null);
  const [contents, addToContents] = useState({});
  useEffect(() => {
    if (products.length <= 0) {
      getProducts().then(res => {
        if (res) {
          setProducts(res);
        }
      });
    }
  });
  const saveGift = () => {
    if (!giftTitle) {
      return setError({
        hasError: true,
        errorText: "Gaven skal have en titel!"
      });
    } else if (selection.length <= 0) {
      return setError({
        hasError: true,
        errorText: "Gaven skal have indhold!"
      });
    }
    return fetch("/api/gifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        giftTitle: giftTitle,
        contents: { ...contents }
      })
    })
      .then(res => res.json())
      .then(res => props.setGifts(res))
      .then(() => props.handleToggle())
      .catch(err => setError({ hasError: true, errorText: err }));
  };
  const renderChosenProducts = () => {
    if (selection.length <= 0) {
      return <NoDataWrapper>Ingen produkter valgt!</NoDataWrapper>;
    }
    return selection.map(id => {
      return (
        <ContentLine key={id}>
          <Id xs={2}>{products[id].productId} |</Id>{" "}
          <Title xs={9}>{products[id].productTitle} </Title>
          <Quantity xs={2}>
            <QuantInput
              value={contents[products[id].productId]}
              onChange={event =>
                addToContents({
                  ...contents,
                  [products[id].productId]: parseInt(event.target.value, 10)
                })
              }
              type="number"
            />
          </Quantity>
        </ContentLine>
      );
    });
  };
  return (
    <Dialog
      maxWidth="lg"
      fullWidth
      open={props.dialogActive}
      onClose={props.handleToggle}
      aria-labelledby="max-width-dialog-title"
      scroll="paper"
    >
      <DialogTitle id="max-width-dialog-title">Opret ny gave</DialogTitle>
      <DialogContent>
        <Container>
          <Row>
            <Col xs={{ size: 6, offset: 6 }}>
              <TextField
                required
                id="outlined-required"
                label="Gave titel"
                value={giftTitle}
                margin="normal"
                fullWidth
                InputProps={{
                  onChange: event => setTitle(event.target.value)
                }}
              />
            </Col>
          </Row>
          <Row>
            <Col xs="6">
              <Paper>
                <Grid
                  columns={productsHeader}
                  rows={products}
                  //getRowId={row => row.productId}
                >
                  <SelectionState
                    selection={selection}
                    onSelectionChange={selected => {
                      changeSelection(selected);
                      selected.map(id =>
                        addToContents({
                          ...contents,
                          [products[id].productId]: 1
                        })
                      );
                    }}
                  />
                  <Table />
                  <TableHeaderRow />
                  <TableSelection selectByRowClick highlightRow />
                </Grid>
              </Paper>
            </Col>
            <Col xs="6">
              <ContentsWrapper>
                {selection.length > 0 && (
                  <Row>
                    <Col>
                      <ContentHeader>Indhold:</ContentHeader>
                    </Col>
                  </Row>
                )}
                {renderChosenProducts()}
              </ContentsWrapper>
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
          <ActionBTN onClick={saveGift} color="primary" variant="contained">
            Gem Gave
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

const ContentsWrapper = MUIStyled(Paper)({
  height: "100%"
});
const ContentLine = styled.div`
  border-top: 1px solid #c3c3c3;
  padding: 10px 15px;
  display: flex;
  flex-direction: row;
  justify-content: space-evenly;
`;
const Id = styled(Col)`
  text-align: left;
`;
const Title = styled(Col)`
  text-align: left;
`;
const Quantity = styled(Col)``;
const QuantInput = styled.input`
  max-width: 100%;
  text-align: right;
`;
const ContentHeader = styled.div`
  margin: 20px 15px;
  font-weight: 600;
  font-size: 18px;
`;
const NoDataWrapper = styled.div`
  height: 100%;
  font-size: 18px;
  padding: 10px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c3c3c3;
`;
const ActionBTN = MUIStyled(Button)({
  margin: "5px"
});
export default AddProductToGiftDialog;
