import React, { useState } from "react";
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

const CustomTable = props => {
  const [selected, handleSelect] = useState([]);
  return (
    <Paper>
      <Grid columns={props.coloumnHeaders} rows={props.dataRows}>
        <Table />
        <SelectionState selection={selected} onSelectionChange={handleSelect} />
        <SearchState value={props.searchInputValue} />
        <IntegratedFiltering />
        <TableHeaderRow />
        {props.showSelection && (
          <TableSelection selectByRowClick highlightRow />
        )}
      </Grid>
    </Paper>
  );
};

export default CustomTable;