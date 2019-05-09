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

class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productsTableData: {
        bodyData: [
          {
            productId: 112312,
            title: "ny titel",
            type: "Bitz",
            size: "450g",
            brand: "Joachim Bitz",
            otherInfo:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            location: "A-2-2-2"
          },
          {
            productId: 29890,
            title: "Det her er en titel",
            type: "Morgenthaler",
            size: "450g",
            brand: "Kim Nielsen",
            otherInfo:
              "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
            location: "B-2-3-1"
          }
        ],
        headerData: [
          { name: "productId", disablePadding: false, title: "Id" },
          { name: "title", disablePadding: false, title: "Titel" },
          { name: "type", disablePadding: false, title: "Type" },
          { name: "size", disablePadding: false, title: "Størrelse" },
          { name: "brand", disablePadding: false, title: "Mærke" },
          { name: "otherInfo", disablePadding: false, title: "Info" },
          { name: "location", disablePadding: false, title: "Placering" }
        ]
      },
      giftsTableData: {
        bodyData: [
          {
            giftId: 1,
            giftTitle: "Gift Title",
            contents: [
              {
                productId: 112312,
                title: "ny titel",
                type: "Bitz",
                size: "450g",
                brand: "Joachim Bitz",
                otherInfo:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                location: "A-2-2-2"
              },
              {
                productId: 29890,
                title: "Det her er en titel",
                type: "Morgenthaler",
                size: "450g",
                brand: "Kim Nielsen",
                otherInfo:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                location: "B-2-3-1"
              }
            ]
          },
          {
            giftId: 2,
            giftTitle: "Some Other Gift Title",
            contents: [
              {
                productId: 1122312,
                title: "ny titel",
                type: "Bitz",
                size: "450g",
                brand: "Joachim Bitz",
                otherInfo:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                location: "A-2-2-2"
              },
              {
                productId: 292890,
                title: "Det her er en titel",
                type: "Morgenthaler",
                size: "450g",
                brand: "Kim Nielsen",
                otherInfo:
                  "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
                location: "B-2-3-1"
              }
            ]
          }
        ],
        headerData: [
          { name: "giftId", disablePadding: false, title: "Gave Id" },
          { name: "giftTitle", disablePadding: false, title: "Gave Titel" },
          { name: "contains", disablePadding: false, title: "Contents" }
        ]
      },
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
    const { searchInputValue, productsTableData, giftsTableData } = this.state;
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
                  coloumnHeaders={productsTableData.headerData}
                  dataRows={productsTableData.bodyData}
                  searchInputValue={searchInputValue}
                />
              )}
            />
            <Route
              exact
              path="/overview/gifts"
              component={() => (
                <CustomTable
                  coloumnHeaders={giftsTableData.headerData}
                  dataRows={giftsTableData.bodyData}
                  searchInputValue={searchInputValue}
                  groupOnColumn="giftTitle"
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
