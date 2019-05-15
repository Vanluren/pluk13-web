import React, { Component } from "react";
import styled from "styled-components";
import { withRouter } from "react-router";
import { Paper, Button, CircularProgress } from "@material-ui/core";
import {
  Grid,
  Table,
  TableHeaderRow
} from "@devexpress/dx-react-grid-material-ui";
import {
  SearchState,
  IntegratedFiltering,
  SelectionState
} from "@devexpress/dx-react-grid";
import { Container, Row, Col } from "reactstrap";

class OrdersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { name: "orderId", disablePadding: false, title: "Id" },
        { name: "createdAt", disablePadding: false, title: "Dato" }
      ]
    };
  }

  OrderRow = ({ row, ...restProps }) => {
    return (
      <Table.Row
        {...restProps}
        onClick={() =>
          this.props.history.push({
            pathname: `/plukliste/${row.orderId}`,
            state: { currentOrder: row.orderId }
          })
        }
        style={{
          cursor: "pointer"
        }}
      />
    );
  };
  render() {
    const { columns } = this.state;
    const { orders, searchInputValue, loading } = this.props;
    return (
      <Container fluid>
        <TopWrapperRow>
          <Col xs={{ size: 4 }}>
            <Button
              variant="contained"
              size="large"
              color="primary"
              onClick={() => {
                this.props.history.push({
                  pathname: "/"
                });
              }}
            >
              Opret ny plukliste
            </Button>
          </Col>
        </TopWrapperRow>
        <Row>
          <Col>
            <Paper>
              <Grid
                columns={columns}
                rows={orders}
                getRowId={row => row.orderId}
              >
                <SearchState value={searchInputValue} />
                <SelectionState />
                <IntegratedFiltering />
                {loading ? (
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
                  <Table rowComponent={this.OrderRow} />
                )}
                <TableHeaderRow />
              </Grid>
            </Paper>
          </Col>
        </Row>
      </Container>
    );
  }
}

const TopWrapperRow = styled(Row)`
  margin-bottom: 25px;
`;
const LoaderWrapper = styled.tr`
  left: 50%;
  position: relative;
`;
const StyledLoader = styled(CircularProgress)`
  margin: 25px;
`;

export default withRouter(OrdersTable);
