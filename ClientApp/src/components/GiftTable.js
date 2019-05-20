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
import { Container, Row, Col } from "reactstrap";
import AddProductToGiftDialog from "../components/AddProductToGiftDialog";
import EditGiftDialog from "../components/EditGiftDialog";

const GiftTable = props => {
  const [addDialogActive, toggleAddDialog] = useState(false);
  const [editDialogActive, toggleEditDialog] = useState(false);
  const [giftToEdit, editGift] = useState(null);
  const getChildRows = (row, rootRows) => {
    return row ? row.contents : rootRows;
  };
  const columns = [
    { name: "giftId", disablePadding: false, title: "Gave Id" },
    { name: "giftTitle", disablePadding: false, title: "Gave Navn" },
    { name: "productId", disablePadding: false, title: "Id" },
    { name: "productTitle", disablePadding: false, title: "Titel" },
    { name: "size", disablePadding: false, title: "Størrelse" },
    { name: "brand", disablePadding: false, title: "Mærke" },
    { name: "productQuantity", disablePadding: false, title: "Antal" }
  ];
  const tableColumnExtensions = [
    { columnName: "giftId", width: 135 },
    { columnName: "giftTitle", width: 210, wordWrapEnabled: true },
    { columnName: "productId", width: 100 },
    { columnName: "productTitle", width: 200, wordWrapEnabled: true },
    { columnName: "size", width: 100 },
    { columnName: "brand", width: 120, wordWrapEnabled: true },
    { columnName: "productQuantity", width: 50 }
  ];

  const deleteGift = giftId => {
    fetch(`api/gifts/${giftId}`, {
      method: "DELETE"
    })
      .then(res => res.json())
      .then(res => props.setGifts(res));
  };

  const editCell = ({ children, row, ...restProps }) => {
    if (row.giftId) {
      return (
        <TableEditColumn.Cell row={row} {...restProps}>
          <Button
            color="primary"
            onClick={() => {
              editGift(row);
              toggleEditDialog(!editDialogActive);
            }}
          >
            Ret
          </Button>
          <Button
            color="primary"
            onClick={() => {
              deleteGift(row.giftId);
            }}
          >
            Slet
          </Button>
        </TableEditColumn.Cell>
      );
    }
    return <TableEditColumn.Cell row={row} {...restProps} />;
  };

  return (
    <Container>
      <TopWrapperRow>
        <Col xs={{ size: 4 }}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => toggleAddDialog(!addDialogActive)}
          >
            Opret gave
          </Button>
        </Col>
      </TopWrapperRow>
      <Paper style={{ position: "relative" }}>
        <Grid columns={columns} rows={props.dataRows}>
          <EditingState onCommitChanges={() => {}} />
          <SearchState value={props.searchInputValue} />
          <IntegratedFiltering />
          <TreeDataState />
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
            <Table columnExtensions={tableColumnExtensions} />
          )}
          <TableHeaderRow />
          <TableTreeColumn for="giftId" />
          <TableEditRow />
          <TableEditColumn cellComponent={editCell} />
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
                  width: 70
                }
              ];
              return result;
            }}
          />
        </Grid>
      </Paper>
      <AddProductToGiftDialog
        dialogActive={addDialogActive}
        handleToggle={() => {
          editGift(null);
          toggleAddDialog(!addDialogActive);
        }}
        setGifts={props.setGifts}
        products={props.products}
        giftToEdit={giftToEdit}
      />
      <EditGiftDialog
        dialogActive={editDialogActive}
        handleToggle={() => {
          editGift(null);
          toggleEditDialog(!editDialogActive);
        }}
        setGifts={props.setGifts}
        products={props.products}
        giftToEdit={giftToEdit}
      />
    </Container>
  );
};

const LoaderWrapper = styled.tr`
  left: 50%;
  position: relative;
`;
const StyledLoader = styled(CircularProgress)`
  margin: 25px;
`;
const TopWrapperRow = styled(Row)`
  margin-bottom: 25px;
`;
export default GiftTable;
