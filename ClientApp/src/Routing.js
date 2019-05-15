import React from "react";
import { Route } from "react-router";
import Layout from "./components/Layout";
import Order from "./Views/Order";
import Overview from "./Views/Overview";
import AddOrderView from "./Views/AddOrderView";

export default function Routing() {
  return (
    <Layout>
      <Route exact path="/" component={AddOrderView} />
      <Route path="/overview" component={Overview} />
      <Route path="/order/:id" component={Order} />
    </Layout>
  );
}
