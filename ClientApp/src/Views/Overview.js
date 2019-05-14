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
import { getGifts, getProducts } from "../util/dataFetcher";

class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      searchInputValue: "",
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
    getGifts().then(res => {
      if (res) {
        this.setState({
          loading: false,
          gifts: res
        });
      }
    });
    getProducts().then(res => {
      if (res) {
        this.setState({
          loading: false,
          products: res
        });
      }
    });
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
  newProductOnClick = params => {
    const body = {
      title: null,
      location: null,
      brand: null,
      otherInfo: null,
      size: null,
      type: null,
      ...params[0]
    };

    fetch(`/api/products`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body)
    })
      .then(res => res.json())
      .then(res => {
        this.setState({
          products: [...this.state.products, res]
        });
      });
  };

  searchOnChange = event => {
    this.setState({ searchInputValue: event.target.value });
  };

  setGifts = newGifts => {
    this.setState({
      gifts: newGifts
    });
  };

  handleSelect = selected => this.setState({ selected });
  isSelected = id => this.state.selected.indexOf(id) !== -1;
  render() {
    const {
      searchInputValue,
      products,
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
              component={() => (
                <ProductTable
                  coloumnHeaders={productsHeader}
                  dataRows={products}
                  searchInputValue={searchInputValue}
                  loading={products.length <= 0 || loading}
                  addNewFunc={this.newProductOnClick}
                  changedFunc={this.editProductOnClickHandler}
                  deleteFunc={this.deleteProductOnClickHandler}
                  disabledInEditing={[
                    {
                      columnName: "productId",
                      editingEnabled: false
                    }
                  ]}
                  getRowId={row => row.productId}
                  editable
                />
              )}
            />
            <Route
              exact
              path="/overview/gifts"
              component={() => (
                <GiftTable
                  coloumnHeaders={giftsHeader}
                  dataRows={gifts}
                  searchInputValue={searchInputValue}
                  groupOnColumn="giftId"
                  loading={gifts.length <= 0}
                  getRowId={row => row.giftId}
                  setGifts={this.setGifts}
                  editable
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
