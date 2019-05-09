import React from "react";
import { Paper } from "@material-ui/core";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection,
  TableGroupRow
} from "@devexpress/dx-react-grid-material-ui";
import {
  SearchState,
  IntegratedFiltering,
  SelectionState,
  GroupingState,
  IntegratedGrouping
} from "@devexpress/dx-react-grid";

const CustomTable = props => (
  <Paper>
    <Grid columns={props.coloumnHeaders} rows={props.dataRows}>
      <SearchState value={props.searchInputValue} />
      <SelectionState />
      <IntegratedFiltering />
      {props.groupOnColumn && (
        <GroupingState grouping={[{ columnName: props.groupOnColumn }]} />
      )}
      {props.groupOnColumn && <IntegratedGrouping />}
      <Table />
      <TableHeaderRow />
      {props.group && <TableGroupRow />}
      {props.showSelect && <TableSelection selectByRowClick highlightRow />}
    </Grid>
  </Paper>
);

export default CustomTable;
