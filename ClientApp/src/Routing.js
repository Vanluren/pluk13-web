import React from "react";
import { Route } from "react-router";
import Layout from "./components/Layout";
import Order from "./Views/Order";
import Overview from "./Views/Overview";
import OrderHistory from "./Views/OrderHistory";

export default function Routing() {
  return (
    <Layout>
      <Route exact path="/" component={Order} />
      <Route path="/overview" component={Overview} />
      <Route path="/history" component={OrderHistory} />
    </Layout>
  );
}
