import React from "react";
import styled from "styled-components";
import { Paper } from "@material-ui/core";
import { Getter, Action } from "@devexpress/dx-react-core";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableRowDetail,
  TableEditColumn,
  TableEditRow
} from "@devexpress/dx-react-grid-material-ui";
import {
  SearchState,
  IntegratedFiltering,
  SelectionState,
  EditingState,
  RowDetailState
} from "@devexpress/dx-react-grid";
import { Container, Row, Col } from "reactstrap";
import { CircularProgress, Button } from "@material-ui/core";
import AddProductDialog from "./AddProductDialog";

const ProductTable = props => {
  const [dialogActive, toggleDialog] = React.useState(false);
  const productsHeader = [
    { name: "productId", disablePadding: false, title: "Id" },
    { name: "productTitle", disablePadding: false, title: "Titel" },
    { name: "size", disablePadding: false, title: "Størrelse" },
    { name: "brand", disablePadding: false, title: "Mærke" },
    { name: "location", disablePadding: false, title: "Placering" }
  ];
  const commitChanges = ({ changed, deleted }) => {
    if (changed) {
      props.changedFunc(changed);
    }
    if (deleted) {
      props.deleteFunc(deleted);
    }
  };

  const RowDetail = ({ row }) => <div>{row.otherInfo}</div>;
  return (
    <Container>
      <TopWrapperRow>
        <Col xs={{ size: 4 }}>
          <Button
            variant="contained"
            size="large"
            color="primary"
            onClick={() => toggleDialog(!dialogActive)}
          >
            Opret produkt
          </Button>
        </Col>
      </TopWrapperRow>
      <Paper>
        <Grid
          columns={productsHeader}
          rows={props.dataRows}
          getRowId={props.getRowId}
        >
          <RowDetailState />
          <SearchState value={props.searchInputValue} />
          <SelectionState />
          <IntegratedFiltering />
          <EditingState
            onCommitChanges={commitChanges}
            columnExtensions={props.disabledInEditing}
          />
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
            <Table />
          )}
          <TableHeaderRow />
          <TableEditRow />
          <TableEditColumn
            showEditCommand
            showDeleteCommand
            messages={{
              editCommand: "Ret",
              deleteCommand: "slet"
            }}
          />
          <TableRowDetail contentComponent={RowDetail} />
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
        open={dialogActive}
        handleToggle={() => {
          toggleDialog(!dialogActive);
        }}
        addNewFunc={props.addNewFunc}
        setProducts={props.setProducts}
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

export default ProductTable;
