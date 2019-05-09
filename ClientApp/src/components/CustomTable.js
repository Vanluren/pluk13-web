import React from "react";
import styled from "styled-components";
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
import CircularProgress from "@material-ui/core/CircularProgress";

const CustomTable = props => {
  return (
    <Paper>
      <Grid columns={props.coloumnHeaders} rows={props.dataRows}>
        <SearchState value={props.searchInputValue} />
        <SelectionState />
        <IntegratedFiltering />
        {props.groupOnColumn && (
          <GroupingState grouping={[{ columnName: props.groupOnColumn }]} />
        )}
        {props.groupOnColumn && <IntegratedGrouping />}
        {props.loading ? (
          <Table
            bodyComponent={() => (
              <LoaderWrapper>
                <StyledLoader />
              </LoaderWrapper>
            )}
          />
        ) : (
          <Table />
        )}
        <TableHeaderRow />
        {props.group && <TableGroupRow />}
        {props.showSelect && <TableSelection selectByRowClick highlightRow />}
      </Grid>
    </Paper>
  );
};

const LoaderWrapper = styled.td`
  left: 50%;
  position: relative;
`;
const StyledLoader = styled(CircularProgress)`
  margin: 25px;
`;

export default CustomTable;
