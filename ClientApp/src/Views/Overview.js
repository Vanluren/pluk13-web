import React, { Component } from "react";
import styled from "styled-components";
import { Container, Row, Col } from "reactstrap";
import { withRouter } from "react-router";
import { NavLink, Switch, Route } from "react-router-dom";
import { styled as MUIStyled } from "@material-ui/styles";
import { Button } from "@material-ui/core";
import SearchField from "../components/SearchField";
import ProductTable from "../components/ProductTable";
import GiftTable from "../components/GiftTable";
import OrdersTable from "../components/OrdersTable";
import { getGifts, getProducts, getOrders } from "../util/dataFetcher";

class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchInputValue: "",
      orders: [],
      gifts: [],
      products: [],
      productsHeader: [
        { name: "productId", disablePadding: false, title: "Id" },
        { name: "productTitle", disablePadding: false, title: "Titel" },
        { name: "size", disablePadding: false, title: "Størrelse" },
        { name: "brand", disablePadding: false, title: "Mærke" },
        { name: "otherInfo", disablePadding: false, title: "Info" },
        { name: "location", disablePadding: false, title: "Placering" }
      ]
    };
  }

  componentDidMount() {
    if (this.state.gifts.length <= 0) {
      getGifts().then(res => {
        if (res) {
          this.setState({
            loading: false,
            gifts: res
          });
        }
      });
    }
    if (this.state.products.length <= 0) {
      getProducts().then(res => {
        if (res) {
          this.setState({
            loading: false,
            products: res
          });
        }
      });
    }
    if (this.state.orders.length <= 0) {
      getOrders().then(res => {
        if (res) {
          this.setState({
            loading: false,
            orders: res
          });
        }
      });
    }
  }
  deleteProductOnClickHandler = params => {
    const id = params[0];
    fetch(`/api/products/${id}`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" }
    })
      .then(res => res.json())
      .then(res => {
        this.setState({ products: res });
      });
  };
  editProductOnClickHandler = params => {
    const id = Object.keys(params)[0];
    const product = this.state.products.find(
      p => p.productId === parseInt(id, 10)
    );
    const body = {
      ...product,
      ...Object.values(params)[0]
    };

    fetch(`/api/products/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(res => this.setState({ products: res }));
  };

  searchOnChange = event => {
    this.setState({ searchInputValue: event.target.value });
  };

  setGifts = newGifts => {
    this.setState({
      gifts: newGifts
    });
  };
  setProducts = newProds => {
    this.setState({
      products: [...this.state.products, newProds]
    });
  };

  render() {
    const {
      searchInputValue,
      products,
      orders,
      productsHeader,
      gifts,
      giftsHeader,
      loading
    } = this.state;
    return (
      <Container>
        <TopWrapperRow>
          <Col xs={{ size: 6, offset: 2 }}>
            <NavLink to="/overview/products">
              <ViewChangerBTN
                variant="contained"
                size="large"
                color={
                  window.location.pathname === "/overview/products"
                    ? "primary"
                    : "default"
                }
              >
                Produkter
              </ViewChangerBTN>
            </NavLink>
            <NavLink to="/overview/gifts">
              <ViewChangerBTN
                variant="contained"
                size="large"
                color={
                  window.location.pathname === "/overview/gifts"
                    ? "primary"
                    : "default"
                }
              >
                Gaver
              </ViewChangerBTN>
            </NavLink>
            <NavLink to="/overview/plukliste">
              <ViewChangerBTN
                variant="contained"
                size="large"
                color={
                  window.location.pathname === "/overview/plukliste"
                    ? "primary"
                    : "default"
                }
              >
                Pluklister
              </ViewChangerBTN>
            </NavLink>
          </Col>
          <Col xs="4" className="float-right">
            <SearchField onChange={this.searchOnChange} />
          </Col>
        </TopWrapperRow>
        <Row>
          <Switch>
            <Route
              exact
              path="/overview/products"
              component={({ match }) => (
                <ProductTable
                  coloumnHeaders={productsHeader}
                  dataRows={products}
                  searchInputValue={searchInputValue}
                  loading={products.length <= 0 || loading}
                  changedFunc={this.editProductOnClickHandler}
                  deleteFunc={this.deleteProductOnClickHandler}
                  disabledInEditing={[
                    {
                      columnName: "productId",
                      editingEnabled: false
                    }
                  ]}
                  getRowId={row => row.productId}
                  active={match}
                  setProducts={this.setProducts}
                />
              )}
            />
            <Route
              exact
              path="/overview/gifts"
              component={({ match }) => (
                <GiftTable
                  coloumnHeaders={giftsHeader}
                  dataRows={gifts}
                  products={products}
                  searchInputValue={searchInputValue}
                  groupOnColumn="giftId"
                  loading={gifts.length <= 0}
                  getRowId={row => row.giftId}
                  setGifts={this.setGifts}
                  editable
                  active={match}
                />
              )}
            />
            <Route
              exact
              path="/overview/plukliste"
              component={({ match }) => (
                <OrdersTable
                  active={match}
                  orders={orders}
                  searchInputValue={searchInputValue}
                  loading={orders.length <= 0}
                />
              )}
            />
          </Switch>
        </Row>
      </Container>
    );
  }
}

const TopWrapperRow = styled(Row)`
  margin-bottom: 25px;
`;
const ViewChangerBTN = MUIStyled(Button)({
  margin: "0 25px"
});

Overview.propTypes = {};

export default withRouter(Overview);
