import React, { Component } from "react";
import styled from "styled-components";
import { styled as MUIStyled } from "@material-ui/styles";
import { Container, Col, Row } from "reactstrap";
import { Paper, Divider, Button, TextField } from "@material-ui/core";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection,
  PagingPanel,
  Toolbar,
  SearchPanel
} from "@devexpress/dx-react-grid-material-ui";
import {
  SelectionState,
  SearchState,
  PagingState,
  IntegratedPaging,
  IntegratedFiltering
} from "@devexpress/dx-react-grid";
import { getProducts, getGifts } from "../util/dataFetcher";
import { CircularProgress } from "@material-ui/core";
class AddOrderView extends Component {
  constructor(props) {
    super(props);
    this.state = {
      hasError: false,
      error: "",
      selectedProds: [],
      selectedGifts: [],
      products: [],
      gifts: [],
      orderNumber: null,
      giftContent: {},
      productContent: {},
      productColumns: [
        { name: "productId", disablePadding: false, title: "Id" },
        { name: "productTitle", disablePadding: false, title: "Titel" }
      ],
      giftColumns: [
        { name: "giftId", disablePadding: false, title: "Id" },
        { name: "giftTitle", disablePadding: false, title: "Titel" }
      ],
      productSearchValue: "",
      giftSearchValue: ""
    };
  }
  componentDidMount() {
    getProducts().then(res => {
      if (res) {
        this.setState({ products: res });
      }
    });
    getGifts().then(res => {
      if (res) {
        this.setState({ gifts: res });
      }
    });
  }

  selectProduct = selected => {
    this.setState({
      selectedProds: selected
    });
    selected.map(id =>
      this.setState({
        productContent: {
          ...this.state.productContent,
          [this.state.products[id].productId]: 1
        }
      })
    );
  };

  selectGift = selected => {
    this.setState({
      selectedGifts: selected
    });
    selected.map(id =>
      this.setState({
        giftContent: {
          ...this.state.giftContent,
          [this.state.gifts[id].giftId]: 1
        }
      })
    );
  };

  renderProducts = () => {
    const { products, selectedProds } = this.state;
    if (selectedProds.length <= 0) {
      return <NoDataWrapper>Ingen produkter valgt!</NoDataWrapper>;
    }
    return selectedProds.map(id => (
      <ContentLine key={id}>
        <Id xs={2}>{products[id].productId} |</Id>{" "}
        <Title xs={9}>{products[id].productTitle} </Title>
        <Quantity xs={2}>
          <QuantInput
            value={this.state.productContent[products[id].productId]}
            type="number"
            onChange={event =>
              this.setState({
                productContent: {
                  ...this.state.productContent,
                  [products[id].productId]: parseInt(event.target.value, 10)
                }
              })
            }
          />
        </Quantity>
      </ContentLine>
    ));
  };

  renderGifts = () => {
    const { gifts, selectedGifts } = this.state;
    if (selectedGifts.length <= 0) {
      return <NoDataWrapper>Ingen gaver valgt!</NoDataWrapper>;
    }
    return selectedGifts.map(id => (
      <ContentLine key={id}>
        <Id xs={2}>{gifts[id].giftId} |</Id>{" "}
        <Title xs={9}>{gifts[id].giftTitle} </Title>
        <Quantity xs={2}>
          <QuantInput
            value={this.state.giftContent[gifts[id].giftId]}
            type="number"
            onChange={event =>
              this.setState({
                giftContent: {
                  ...this.state.giftContent,
                  [gifts[id].giftId]: parseInt(event.target.value, 10)
                }
              })
            }
          />
        </Quantity>
      </ContentLine>
    ));
  };

  searchProducts = event => {
    this.setState({ productSearchValue: event.target.value });
  };

  searchGifts = event => {
    this.setState({ giftSearchValue: event.target.value });
  };

  clearOrder = () => {
    this.setState({
      selectedGifts: [],
      selectedProds: [],
      orderNumber: null,
      hasError: false,
      error: ""
    });
  };

  saveOrder = print => {
    if (this.state.orderNumber === null) {
      return this.setState({
        hasError: true,
        error: "ORDREN SKAL HAVE ET NUMMER!"
      });
    }
    const body = {
      orderId: parseInt(this.state.orderNumber, 10),
      products: this.state.productContent,
      gifts: this.state.giftContent
    };
    return fetch("api/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json;charset=utf-8" },
      body: JSON.stringify(body)
    })
      .then(() => {
        this.props.history.push({
          pathname: `/plukliste/${body.orderId}`,
          state: { print: print }
        });
      })
      .catch(err => {
        this.setState({ hasError: true, error: err.message });
      });
  };

  render() {
    const {
      selectedProds,
      products,
      productColumns,
      selectedGifts,
      giftColumns,
      gifts,
      hasError,
      error,
      productSearchValue,
      giftSearchValue
    } = this.state;
    return (
      <Container fluid>
        <Row>
          <Col xs={6}>
            <Row>
              <Col>
                <Paper>
                  <ContentHeader>Gaver</ContentHeader>
                  <Grid columns={giftColumns} rows={gifts}>
                    <SearchState />
                    <IntegratedFiltering />
                    <PagingState defaultCurrentPage={0} pageSize={5} />
                    <SelectionState
                      selection={selectedGifts}
                      onSelectionChange={this.selectGift}
                    />
                    <IntegratedPaging />
                    {gifts && gifts.length <= 0 ? (
                      <Table
                        bodyComponent={() => (
                          <tbody>
                            <LoaderWrapper>
                              <td style={{ left: "45%", position: "relative" }}>
                                <StyledLoader />
                              </td>
                            </LoaderWrapper>
                          </tbody>
                        )}
                      />
                    ) : (
                      <Table />
                    )}
                    <TableHeaderRow />
                    <Toolbar />
                    <SearchPanel />
                    <PagingPanel />
                    <TableSelection selectByRowClick highlightRow />
                  </Grid>
                </Paper>
              </Col>
            </Row>
            <RowTopMargin>
              <Col>
                <Paper>
                  <ContentHeader>Produkter</ContentHeader>
                  <Grid columns={productColumns} rows={products}>
                    <SearchState />
                    <IntegratedFiltering />
                    <PagingState defaultCurrentPage={0} pageSize={5} />
                    <SelectionState
                      selection={selectedProds}
                      onSelectionChange={this.selectProduct}
                    />
                    <IntegratedPaging />
                    {products && products.length <= 0 ? (
                      <Table
                        bodyComponent={() => (
                          <tbody>
                            <LoaderWrapper>
                              <td style={{ left: "45%", position: "relative" }}>
                                <StyledLoader />
                              </td>
                            </LoaderWrapper>
                          </tbody>
                        )}
                      />
                    ) : (
                      <Table />
                    )}
                    <TableHeaderRow />
                    <Toolbar />
                    <SearchPanel />
                    <PagingPanel />
                    <TableSelection selectByRowClick highlightRow />
                  </Grid>
                </Paper>
              </Col>
            </RowTopMargin>
          </Col>
          <Col xs={{ size: 6 }}>
            <ContentsWrapper>
              <ContentHeader>Ny plukliste:</ContentHeader>
              <Row>
                <Col>
                  <TextField
                    required
                    id="outlined-required"
                    label="Ordrenr.:"
                    margin="normal"
                    variant="outlined"
                    type="number"
                    fullWidth
                    onChange={event =>
                      this.setState({ orderNumber: event.target.value })
                    }
                    style={{ padding: "0px 8px" }}
                  />
                </Col>
              </Row>
              <Row>
                <GiftCol>
                  <ContentHeader>Gaver:</ContentHeader>
                  <Divider variant="middle" />
                  {this.renderGifts()}
                </GiftCol>
              </Row>
              <Row>
                <ProdCol>
                  <ContentHeader>Produkter:</ContentHeader>
                  <Divider variant="middle" />
                  {this.renderProducts()}
                </ProdCol>
              </Row>
              <Row>
                <Col>
                  <Footer>
                    <Error>{hasError ? error : null}</Error>
                    <ActionBTN
                      variant="outlined"
                      color="secondary"
                      onClick={this.clearOrder}
                    >
                      Anuller
                    </ActionBTN>
                    <ActionBTN
                      onClick={() => this.saveOrder(false)}
                      color="primary"
                      variant="outlined"
                    >
                      Gem
                    </ActionBTN>
                    <ActionBTN
                      onClick={() => this.saveOrder(true)}
                      color="primary"
                      variant="contained"
                    >
                      Gem og print plukliste
                    </ActionBTN>
                  </Footer>
                </Col>
              </Row>
            </ContentsWrapper>
          </Col>
        </Row>
      </Container>
    );
  }
}

const GiftCol = styled(Col)`
  height: 400px;
  overflow: scroll;
`;
const ProdCol = styled(Col)`
  height: 350px;
  overflow: scroll;
`;
const RowTopMargin = styled(Row)`
  margin-top: 20px;
`;
const ContentsWrapper = MUIStyled(Paper)({
  height: "100%"
});
const ContentHeader = styled.div`
  padding: 10px 15px 10px;
  font-size: 25px;
`;
const Error = styled.span`
  color: #dc3545;
  font-size: 12px;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: left;
  margin: 10px 10px;
`;
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
const NoDataWrapper = styled.div`
  font-size: 18px;
  padding: 10px 15px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #c3c3c3;
`;
const Footer = styled.div`
  border-top: 1px solid #c3c3c3;
  padding: 10px;
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  position: relative;
  bottom: -35px;
`;
const ActionBTN = MUIStyled(Button)({
  margin: "5px"
});

const LoaderWrapper = styled.tr`
  left: 50%;
  position: relative;
`;
const StyledLoader = styled(CircularProgress)`
  margin: 25px;
`;
export default AddOrderView;
