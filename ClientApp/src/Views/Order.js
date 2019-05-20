import React, { Component } from "react";
import styled from "styled-components";
import { Container, Row, Col } from "reactstrap";
import { Divider, AppBar, Toolbar, IconButton, Paper } from "@material-ui/core";
import {
  Grid,
  Table,
  TableHeaderRow,
  TableTreeColumn,
  TableRowDetail
} from "@devexpress/dx-react-grid-material-ui";
import {
  TreeDataState,
  CustomTreeData,
  RowDetailState
} from "@devexpress/dx-react-grid";
import { Print } from "@material-ui/icons/";

class Order extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentOrder: window.location.pathname.split("/")[2],
      orderInfo: {}
    };
  }
  componentDidMount() {
    const { location } = this.props;
    const { currentOrder } = this.state;
    fetch(`api/orders/${currentOrder}`)
      .then(res => res.json())
      .then(res => {
        return this.setState({
          orderInfo: res,
          expandedProducts: res.products.map(p => p.productId),
          expandedGifts: Array.from(
            Array(res.gifts.length * 10),
            (x, idx) => idx++
          )
        });
      })
      .then(() => {
        if (location.state && location.state.print) {
          window.print();
        }
      });
  }

  RowDetail = ({ row }) => <div>{row.otherInfo}</div>;
  getChildRows = (row, rootRows) => {
    this.setState({ expandedGifts: this.state.expandedGifts.push(row) });
    return row ? row.contents : rootRows;
  };

  render() {
    const {
      currentOrder,
      orderInfo,
      expandedGifts,
      expandedProducts
    } = this.state;
    return (
      <Container>
        <Row>
          <Col>
            <AppBar position="static" color="primary">
              <Toolbar>
                <Col xs={{ size: 10 }}>
                  <ListHeader>Order: {currentOrder}</ListHeader>
                </Col>
                <Col xs={{ size: 2 }}>
                  <IconButton
                    color="inherit"
                    aria-label="Print"
                    onClick={() => window.print()}
                  >
                    <Print />
                  </IconButton>
                </Col>
              </Toolbar>
            </AppBar>
          </Col>
        </Row>
        <Row>
          <Col>
            <Paper>
              {orderInfo.gifts && orderInfo.gifts.length > 0 && (
                <Row>
                  <Col>
                    <ListHeader>Gaver:</ListHeader>
                    <Divider variant="middle" />
                    <Grid
                      columns={[
                        {
                          name: "giftId",
                          disablePadding: false,
                          title: "Gave Id"
                        },
                        {
                          name: "giftTitle",
                          disablePadding: false,
                          title: "Gave Navn"
                        },
                        {
                          name: "productId",
                          disablePadding: false,
                          title: "Id"
                        },
                        {
                          name: "productTitle",
                          disablePadding: false,
                          title: "Titel"
                        },
                        {
                          name: "size",
                          disablePadding: false,
                          title: "Størrelse"
                        },
                        {
                          name: "brand",
                          disablePadding: false,
                          title: "Mærke"
                        },
                        {
                          name: "productQuantity",
                          disablePadding: false,
                          title: "Antal"
                        },
                        {
                          name: "location",
                          disablePadding: false,
                          title: "Placering"
                        }
                      ]}
                      rows={orderInfo.gifts}
                    >
                      <TreeDataState defaultExpandedRowIds={expandedGifts} />
                      <CustomTreeData getChildRows={this.getChildRows} />
                      <Table
                        columnExtensions={[
                          { columnName: "giftId", width: 135 },
                          {
                            columnName: "giftTitle",
                            width: 210,
                            wordWrapEnabled: true
                          },
                          { columnName: "productId", width: 100 },
                          {
                            columnName: "productTitle",
                            width: 200,
                            wordWrapEnabled: true
                          },
                          { columnName: "size", width: 100 },
                          {
                            columnName: "brand",
                            width: 120,
                            wordWrapEnabled: true
                          },
                          { columnName: "productQuantity", width: 50 }
                        ]}
                      />
                      <TableHeaderRow />
                      <TableTreeColumn for="giftId" />
                    </Grid>
                  </Col>
                </Row>
              )}
              {orderInfo.products && orderInfo.products.length > 0 && (
                <Row>
                  <Col>
                    <ListHeader>Produkter:</ListHeader>
                    <Divider variant="middle" />
                    <Grid
                      columns={[
                        {
                          name: "productId",
                          disablePadding: false,
                          title: "Id"
                        },
                        {
                          name: "productTitle",
                          disablePadding: false,
                          title: "Titel"
                        },
                        {
                          name: "size",
                          disablePadding: false,
                          title: "Størrelse"
                        },
                        {
                          name: "brand",
                          disablePadding: false,
                          title: "Mærke"
                        },
                        {
                          name: "otherInfo",
                          disablePadding: false,
                          title: "Info"
                        },
                        {
                          name: "productQuantity",
                          disablePadding: false,
                          title: "Antal"
                        },
                        {
                          name: "location",
                          disablePadding: false,
                          title: "Placering"
                        }
                      ]}
                      rows={orderInfo.products}
                      getRowId={row => row.productId}
                    >
                      <RowDetailState expandedRowIds={expandedProducts} />
                      <Table
                        columnExtensions={[
                          { columnName: "productId", width: 100 },
                          {
                            columnName: "productTitle",
                            width: 250,
                            wordWrapEnabled: true
                          },
                          { columnName: "size", width: 130 },
                          {
                            columnName: "brand",
                            width: 120,
                            wordWrapEnabled: true
                          },
                          {
                            columnName: "otherInfo",
                            width: 215,
                            wordWrapEnabled: true
                          },
                          { columnName: "productQuantity", width: 50 }
                        ]}
                      />
                      <TableHeaderRow />
                      <TableRowDetail contentComponent={this.RowDetail} />
                    </Grid>
                  </Col>
                </Row>
              )}
            </Paper>
          </Col>
        </Row>
      </Container>
    );
  }
}

const ListHeader = styled.div`
  font-size: 25px;
  /* jeg ved ikke hvorfor det næste virker, det gør det bare. */
  padding: 13px 0px;
  margin: 15px;
`;

export default Order;
