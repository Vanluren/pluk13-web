import React, { Component } from "react";
import styled from "styled-components";
import { Container, Row, Col } from "reactstrap";
import {
  Divider,
  AppBar,
  Toolbar,
  IconButton,
  Paper,
  List,
  ListItem,
  ListItemText
} from "@material-ui/core";
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
      .then(res => this.setState({ orderInfo: res }))
      .then(() => {
        if (location.state && location.state.print) {
          window.print();
        }
      });
  }

  renderGifts = () => {
    const { orderInfo } = this.state;
    if (orderInfo.gifts) {
      return orderInfo.gifts.map(gift => {
        const content = gift.contents.map(p => p.productTitle).join(",");
        const secondary = `
        Id: ${gift.giftId}, \n
        Indhold: "${content}"
        `;
        return (
          <ListItem key={gift.giftId}>
            <ListItemText
              primary={`${gift.giftQuantity} x ${gift.giftTitle}`}
              secondary={secondary}
            />
          </ListItem>
        );
      });
    }
  };
  renderProducts = () => {
    const { orderInfo } = this.state;
    if (orderInfo.products) {
      return orderInfo.products.map(prod => {
        const secondary = `
        Id: ${prod.productId}, \n
        Location: "${prod.location}"
        `;
        return (
          <ListItem key={prod.productId}>
            <ListItemText
              primary={`${prod.productQuantity} x ${prod.productTitle}`}
              secondary={secondary}
            />
          </ListItem>
        );
      });
    }
  };
  render() {
    const { currentOrder, orderInfo } = this.state;
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
                    <List>{this.renderGifts()}</List>
                  </Col>
                </Row>
              )}
              {orderInfo.products && orderInfo.products.length > 0 && (
                <Row>
                  <Col>
                    <ListHeader>Produkter:</ListHeader>
                    <Divider variant="middle" />
                    <List>{this.renderProducts()}</List>
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
  padding: 15px;
`;

export default Order;
