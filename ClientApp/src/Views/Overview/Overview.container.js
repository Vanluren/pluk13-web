import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { Container, Row, Col } from "reactstrap";
import { NavLink, Switch, Route } from "react-router-dom";
import { styled as MUIStyled } from "@material-ui/styles";
import { Button } from "@material-ui/core";
import ProductsTable from "./components/ProductsTable";
import GiftsTable from "./components/GiftsTable";
import SearchField from "../../components/SearchField";

class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInputValue: ""
    };
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
    const { searchInputValue } = this.state;
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
            <SearchField
              onChange={this.searchOnChange}
            />
          </Col>
        </TopWrapperRow>
        <Row>
          <Switch>
            <Route
              exact
              path="/overview/products"
              component={() => (
                <ProductsTable searchInputValue={searchInputValue} />
              )}
            />
            <Route
              exact
              path="/overview/gifts"
              component={() => (
                <GiftsTable searchInputValue={searchInputValue} />
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

export default Overview;
