import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Container, Row, Col } from "reactstrap";
import { withRouter } from "react-router";
import { NavLink, Switch, Route } from "react-router-dom";
import { styled as MUIStyled } from "@material-ui/styles";
import { Button } from "@material-ui/core";
import SearchField from "../components/SearchField";
import CustomTable from "../components/CustomTable";
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
        { name: "title", disablePadding: false, title: "Titel" },
        { name: "type", disablePadding: false, title: "Type" },
        { name: "size", disablePadding: false, title: "Størrelse" },
        { name: "brand", disablePadding: false, title: "Mærke" },
        { name: "otherInfo", disablePadding: false, title: "Info" },
        { name: "location", disablePadding: false, title: "Placering" }
      ],
      giftsHeader: [
        { name: "giftId", disablePadding: false, title: "Gave Id" },
        {
          name: "title",
          disablePadding: false,
          title: "Gave Titel"
        },
        {
          name: "contents",
          disablePadding: false,
          title: "Contents"
        }
      ]
    };
  }
  componentDidMount() {
    getGifts().then(res => {
      console.log(res);
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
  deleteOnClickHandler = id => {
    console.log(id);
  };
  editOnClickHandler = id => {
    console.log(id);
  };

  searchOnChange = event => {
    this.setState({ searchInputValue: event.target.value });
  };

  handleSelect = selected => this.setState({ selected });
  isSelected = id => this.state.selected.indexOf(id) !== -1;
  render() {
    const {
      searchInputValue,
      products,
      productsHeader,
      gifts,
      giftsHeader
    } = this.state;
    return (
      <Container>
        <TopWrapperRow>
          <Col xs={{ size: 6, offset: 2 }}>
            <NavLink to="/overview/products">
              <ViewChangerBTN variant="contained" size="large">
                Produkter
              </ViewChangerBTN>
            </NavLink>
            <NavLink to="/overview/gifts">
              <ViewChangerBTN variant="contained" size="large">
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
                <CustomTable
                  coloumnHeaders={productsHeader}
                  dataRows={products}
                  searchInputValue={searchInputValue}
                  loading={products.length <= 0}
                />
              )}
            />
            <Route
              exact
              path="/overview/gifts"
              component={() => (
                <CustomTable
                  coloumnHeaders={giftsHeader}
                  dataRows={gifts}
                  searchInputValue={searchInputValue}
                  groupOnColumn="giftTitle"
                  loading={gifts.length <= 0}
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
