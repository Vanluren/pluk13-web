import React, { Component } from "react";
import { Paper } from "@material-ui/core";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection
} from "@devexpress/dx-react-grid-material-ui";
import {
  SearchState,
  IntegratedFiltering,
  SelectionState
} from "@devexpress/dx-react-grid";

class ProductsTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
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
      selected: []
    };
  }
  render() {
    const { headerData, bodyData, selected } = this.state;
    const {searchInputValue} = this.props;
    return (
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
    );
  }
}

export default ProductsTable;
