import React from "react";
import styled from "styled-components";
import { Paper } from "@material-ui/core";
import { Getter } from "@devexpress/dx-react-core";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableSelection,
  TableGroupRow,
  TableEditColumn,
  TableEditRow
} from "@devexpress/dx-react-grid-material-ui";
import {
  SearchState,
  IntegratedFiltering,
  SelectionState,
  GroupingState,
  IntegratedGrouping,
  EditingState
} from "@devexpress/dx-react-grid";
import CircularProgress from "@material-ui/core/CircularProgress";

const CustomTable = props => {
  console.log(props);
  const commitChanges = ({ added, changed, deleted }) => {
    if (added) {
      props.addNewFunc(added);
    }
    if (changed) {
      props.changedFunc(changed);
    }
    if (deleted) {
      props.deleteFunc(deleted);
    }
  };
  return (
    <Paper>
      <Grid
        columns={props.coloumnHeaders}
        rows={props.dataRows}
        getRowId={props.getRowId}
      >
        <SearchState value={props.searchInputValue} />
        <SelectionState />
        <IntegratedFiltering />
        {props.editable && (
          <EditingState
            onCommitChanges={commitChanges}
            columnExtensions={props.disabledInEditing}
          />
        )}
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
        {props.editable && <TableEditRow />}
        {props.editable && (
          <TableEditColumn showAddCommand showEditCommand showDeleteCommand />
        )}
        {props.showSelect && <TableSelection selectByRowClick highlightRow />}
        <Getter
          name="tableColumns"
          computed={({ tableColumns }) => {
            const result = [
              ...tableColumns.filter(
                c => c.type !== TableEditColumn.COLUMN_TYPE
              ),
              {
                key: "editCommand",
                type: TableEditColumn.COLUMN_TYPE,
                width: 140
              }
            ];
            return result;
          }}
        />
      </Grid>
    </Paper>
  );
};

const LoaderWrapper = styled.tr`
  left: 50%;
  position: relative;
`;
const StyledLoader = styled(CircularProgress)`
  margin: 25px;
`;

export default CustomTable;
