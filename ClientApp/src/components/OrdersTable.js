import React, { Component } from "react";
import styled from "styled-components";
import { withRouter } from "react-router";
import { Paper, Button } from "@material-ui/core";
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
import { getOrders } from "../util/dataFetcher";

class OrdersTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      columns: [
        { name: "orderId", disablePadding: false, title: "Id" },
        { name: "createdAt", disablePadding: false, title: "Dato" }
      ],
      orders: [],
      searchInputValue: ""
    };
  }
  componentDidMount() {
    getOrders().then(res => {
      if (res) {
        this.setState({
          loading: false,
          orders: res
        });
      }
    });
  }
  searchOnChange = event => {
    this.setState({ searchInputValue: event.target.value });
  };

  OrderRow = ({ row, ...restProps }) => {
    return (
      <Table.Row
        {...restProps}
        onClick={() =>
          this.props.history.push({
            pathname: `/order/${row.orderId}`,
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
    const { orders, columns, searchInputValue } = this.state;
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
          <Paper>
            <Grid columns={columns} rows={orders} getRowId={row => row.orderId}>
              <SearchState value={searchInputValue} />
              <SelectionState />
              <IntegratedFiltering />
              <Table rowComponent={this.OrderRow} />
              <TableHeaderRow />
            </Grid>
          </Paper>
        </Row>
      </Container>
    );
  }
}

const TopWrapperRow = styled(Row)`
  margin-bottom: 25px;
`;
// const LoaderWrapper = styled.tr`
//   left: 50%;
//   position: relative;
// `;
// const StyledLoader = styled(CircularProgress)`
//   margin: 25px;
// `;

export default withRouter(OrdersTable);
