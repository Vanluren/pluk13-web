import React, { Component } from "react";
import PropTypes from "prop-types";
import styled from "styled-components";
import { NavLink, Switch, Route } from "react-router-dom";
import { styled as MUIStyled } from "@material-ui/styles";
import { Paper, TextField, InputAdornment, Button } from "@material-ui/core";
import { Search } from "@material-ui/icons";

import {
  SearchState,
  IntegratedFiltering,
  SelectionState
} from "@devexpress/dx-react-grid";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection
} from "@devexpress/dx-react-grid-material-ui";
import { Container, Row, Col } from "reactstrap";

class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchInputValue: "",
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
      ],
      order: "asc",
      orderBy: "calories",
      selected: [],
      page: 0,
      rowsPerPage: 5
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
    const { selected, headerData, bodyData, searchInputValue } = this.state;
    const { match } = this.props;
    console.log(searchInputValue);
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
              id="input-with-icon-textfield"
              className="float-right"
              placeholder="Søg..."
              variant="outlined"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="end">
                    <Search />
                  </InputAdornment>
                ),
                onChange: event => this.searchOnChange(event)
              }}
            />
          </Col>
        </TopWrapperRow>

        <Route
          exact
          path="/overview/products"
          component={() => {
            return (
              <Row>
                <Paper>
                  <Grid columns={headerData} rows={bodyData}>
                    <Table />
                    <TableHeaderRow />
                    <SelectionState
                      selection={selected}
                      onSelectionChange={this.handleSelect}
                    />
                    <SearchState value={searchInputValue} />
                    <IntegratedFiltering />
                    <Table />
                    <TableHeaderRow />
                    <TableSelection selectByRowClick highlightRow />
                  </Grid>
                </Paper>
              </Row>
            );
          }}
        />
        <Route
          exact
          path={`/overview/gifts`}
          component={() => {
            return <h1>HEllow</h1>;
          }}
        />
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
const SearchField = MUIStyled(TextField)({
  focus: {
    width: "100%"
  }
});

Overview.propTypes = {};

export default Overview;
