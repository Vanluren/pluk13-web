import React, { useState } from "react";
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
import { CircularProgress, Button } from "@material-ui/core";
import AddProductDialog from "../components/AddProductDialog";

const GiftTable = props => {
  const [dialogActive, toggleDialog] = useState(false);
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
    <React.Fragment>
      <BTNWrapper>
        <Button
          variant="contained"
          size="large"
          color="primary"
          onClick={() => toggleDialog(!dialogActive)}
        >
          Opret gave
        </Button>
      </BTNWrapper>
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
            <TableEditColumn showEditCommand showDeleteCommand />
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
      <AddProductDialog
        dialogActive={dialogActive}
        handleToggle={() => toggleDialog(!dialogActive)}
        setGifts={props.setGifts}
      />
    </React.Fragment>
  );
};

const LoaderWrapper = styled.tr`
  left: 50%;
  position: relative;
`;
const StyledLoader = styled(CircularProgress)`
  margin: 25px;
`;
const BTNWrapper = styled.div`
  margin: 20px 0px;
`;

export default GiftTable;
