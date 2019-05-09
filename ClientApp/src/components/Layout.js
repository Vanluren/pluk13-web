import React from 'react';
import { Container } from 'reactstrap';
import { NavMenu } from './NavMenu';

const Layout = ({children}) => (
  <React.Fragment>
    <NavMenu />
    <Container>
      {children}
    </Container>
  </React.Fragment>
);

export default Layout;
