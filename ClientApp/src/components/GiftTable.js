import React, { useState } from "react";
import styled from "styled-components";
import { Paper } from "@material-ui/core";
import { Getter } from "@devexpress/dx-react-core";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableTreeColumn,
  TableEditColumn
} from "@devexpress/dx-react-grid-material-ui";
import {
  EditingState,
  TreeDataState,
  CustomTreeData,
  SearchState,
  IntegratedFiltering
} from "@devexpress/dx-react-grid";
import { CircularProgress, Button } from "@material-ui/core";
import AddProductToGiftDialog from "../components/AddProductToGiftDialog";

const GiftTable = props => {
  const [dialogActive, toggleDialog] = useState(false);
  const [editingRowIds] = useState([]);
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
  const disabledInEditing = [
    {
      columnName: "giftId",
      editingEnabled: false
    },
    {
      columnName: "giftTitle",
      editingEnabled: true
    },
    { name: "productId", editingEnabled: false },
    { name: "productTitle", editingEnabled: false },
    { name: "size", editingEnabled: false },
    { name: "brand", editingEnabled: false },
    { name: "otherInfo", editingEnabled: false },
    { name: "location", editingEnabled: false }
  ];

  // const removeProduct = giftId => {
  //   console.log(giftId);
  //   // const body = JSON.stringify({
  //   //   contents: {
  //   //     [productId]: 0
  //   //   }
  //   // });
  //   // fetch(`api/gifts/${giftId}/contents`, {
  //   //   method: "PATCH",
  //   //   headers: {
  //   //     headers: { "Content-Type": "application/json" }
  //   //   },
  //   //   body
  //   // })
  //   //   .then(res => res.json())
  //   //   .then(res => props.setGifts(res));
  // };
  // const updateGiftInfo = changed => {
  //   const giftIndex = Object.keys(changed)[0];
  //   const giftId = props.dataRows[giftIndex].giftId;
  //   console.log(editingRowIds);
  //   console.log(giftId);
  //   // const body = JSON.stringify({
  //   //   giftTitle: title
  //   // });
  //   // fetch(`api/gifts/${giftId}/contents`, {
  //   //   method: "PATCH",
  //   //   headers: {
  //   //     headers: { "Content-Type": "application/json" }
  //   //   },
  //   //   body
  //   // })
  //   //   .then(res => res.json())
  //   //   .then(res => props.setGifts(res));
  // };

  // const GiftRow = row => {
  //   console.log(row);
  //   return <Table.Row />;
  // };

  const commitChanges = ({ changed, deleted }) => {
    if (changed) {
      console.log(changed);
      const index = Object.keys(changed)[0];
      const giftId = props.dataRows[index].giftId;
      const productId = props.dataRows[index].productId;
      if (giftId !== undefined) {
        console.log("gift", giftId);
      } else {
        console.log("product", productId);
      }
      //const productId = props.dataRows[index].productId;
    }
    if (deleted) {
      console.log(deleted);
    }
  };
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
        <Grid columns={columns} rows={props.dataRows}>
          <SearchState value={props.searchInputValue} />
          <IntegratedFiltering />
          <TreeDataState />
          {props.editable && (
            <EditingState
              editingRowIds={editingRowIds}
              onEditingRowIdsChange={(params, newParams) =>
                console.log("edit!", params)
              }
              onCommitChanges={commitChanges}
              columnExtensions={disabledInEditing}
            />
          )}
          <CustomTreeData getChildRows={getChildRows} />
          {props.loading ? (
            <Table
              bodyComponent={() => (
                <tbody>
                  <LoaderWrapper>
                    <td style={{ left: "45%", position: "relative" }}>
                      <StyledLoader />
                    </td>
                  </LoaderWrapper>
                </tbody>
              )}
            />
          ) : (
            <Table //rowComponent={GiftRow}
            />
          )}
          <TableHeaderRow />
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
      <AddProductToGiftDialog
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
