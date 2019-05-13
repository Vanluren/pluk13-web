import React from "react";
import styled from "styled-components";
import { Paper } from "@material-ui/core";
import { Getter } from "@devexpress/dx-react-core";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableTreeColumn,
  TableEditColumn,
  TableEditRow
} from "@devexpress/dx-react-grid-material-ui";
import {
  EditingState,
  TreeDataState,
  CustomTreeData,
  SearchState,
  IntegratedFiltering
} from "@devexpress/dx-react-grid";
import CircularProgress from "@material-ui/core/CircularProgress";

const GiftTable = props => {
  const getChildRows = (row, rootRows) => (row ? row.contents : rootRows);

  const columns = [
    { name: "giftId", disablePadding: false, title: "Gave Id" },
    { name: "giftTitle", disablePadding: false, title: "Gave Navn" },
    { name: "productId", disablePadding: false, title: "Id" },
    { name: "productTitle", disablePadding: false, title: "Titel" },
    { name: "size", disablePadding: false, title: "Størrelse" },
    { name: "brand", disablePadding: false, title: "Mærke" },
    { name: "otherInfo", disablePadding: false, title: "Info" },
    { name: "location", disablePadding: false, title: "Placering" },
    { name: "productQuantity", disablePadding: false, title: "Antal" }
  ];
  return (
    <Paper style={{ position: "relative" }}>
      <Grid columns={columns} rows={props.dataRows} getRowId={props.getRowId}>
        <SearchState value={props.searchInputValue} />
        <IntegratedFiltering />
        <TreeDataState />
        {props.editable && (
          <EditingState
            columnExtensions={[
              {
                columnName: "giftId",
                editingEnabled: false
              },
              {
                columnName: "giftTitle",
                editingEnabled: false
              }
            ]}
          />
        )}
        <CustomTreeData getChildRows={getChildRows} />
        <Table />
        <TableHeaderRow />
        {props.editable && <TableEditRow />}
        {props.editable && (
          <TableEditColumn showAddCommand showEditCommand showDeleteCommand />
        )}
        <TableTreeColumn for="giftId" />
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

export default GiftTable;
