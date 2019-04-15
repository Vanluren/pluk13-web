import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Overview from './Views/Overview/Overview.container';

export default function Routing() {
  return (
    <Layout>
      <Route exact path='/' component={Home} />
      <Route path='/overview' component={Overview} />
    </Layout>
  );
}
