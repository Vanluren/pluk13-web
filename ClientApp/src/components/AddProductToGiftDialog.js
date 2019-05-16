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
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection,
  Toolbar,
  SearchPanel,
  PagingPanel
} from "@devexpress/dx-react-grid-material-ui";
import {
  SelectionState,
  SearchState,
  PagingState,
  IntegratedPaging,
  IntegratedFiltering
} from "@devexpress/dx-react-grid";
import { Container, Row, Col } from "reactstrap";

const AddProductToGiftDialog = props => {
  const productsHeader = [
    { name: "productId", disablePadding: false, title: "Id" },
    { name: "productTitle", disablePadding: false, title: "Titel" }
  ];
  const [error, setError] = useState({ hasError: false, errorText: "" });
  const [selection, changeSelection] = useState([]);
  const [giftTitle, setTitle] = useState("");
  const [contents, addToContents] = useState({});
  const saveGift = () => {
    if (giftTitle === "") {
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
    const toAdd = {};
    selection.map(
      idx =>
        (toAdd[props.products[idx].productId] = contents[props.products[idx]])
    );
    return fetch("/api/gifts", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        giftTitle: giftTitle,
        contents: toAdd
      })
    })
      .then(res => res.json())
      .then(res => props.setGifts(res))
      .then(() => props.handleToggle())
      .catch(err => setError({ hasError: true, errorText: err }));
  };
  const renderChosenProducts = () => {
    const { products } = props;
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
              value={1}
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
      <DialogContent>
        <Container>
          <Row>
            <Col>
              <h2>Opret ny gave</h2>
            </Col>
          </Row>
          <Row>
            <TableCol xs="6">
              <Paper>
                <Grid columns={productsHeader} rows={props.products}>
                  <SearchState />
                  <IntegratedFiltering />
                  <PagingState defaultCurrentPage={0} pageSize={5} />
                  <SelectionState
                    selection={selection}
                    onSelectionChange={selected => {
                      changeSelection(selected);
                      selected.map(id =>
                        addToContents({
                          [props.products[id]]: 1
                        })
                      );
                    }}
                  />
                  <IntegratedPaging />
                  <Table />
                  <TableHeaderRow />
                  <Toolbar />
                  <SearchPanel messages={{ search: "Søg.." }} />
                  <PagingPanel />
                  <TableSelection selectByRowClick highlightRow />
                </Grid>
              </Paper>
            </TableCol>
            <Col xs="6">
              <Row>
                <Col>
                  <TextField
                    required
                    id="outlined-required"
                    label="Gave titel"
                    value={giftTitle}
                    margin="normal"
                    variant="outlined"
                    fullWidth
                    InputProps={{
                      onChange: event => setTitle(event.target.value)
                    }}
                  />
                </Col>
              </Row>
              <Row>
                <Col>
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
  height: "365px",
  overflowY: "scroll"
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
const TableCol = styled(Col)`
  margin-top: 15px;
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
