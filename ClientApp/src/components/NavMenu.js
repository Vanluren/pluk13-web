import React, { Component } from 'react';
import { Collapse, Container, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import { Link } from 'react-router-dom';
import styled from 'styled-components';

export class NavMenu extends Component {
  static displayName = NavMenu.name;

  constructor (props) {
    super(props);
    this.toggleNavbar = this.toggleNavbar.bind(this);
    this.state = {
      collapsed: true
    };
  }

  toggleNavbar () {
    this.setState({
      collapsed: !this.state.collapsed
    });
  }

  render () {
    return (
      <header>
        <NavContainer className="navbar-expand-sm navbar-toggleable-sm ng-white border-bottom box-shadow mb-3" light>
          <Container>
            <NavBranding tag={Link} to="/">pluk13_web</NavBranding>
            <NavbarToggler onClick={this.toggleNavbar} className="mr-2" />
            <Collapse className="d-sm-inline-flex flex-sm-row-reverse" isOpen={!this.state.collapsed} navbar>
              <ul className="navbar-nav flex-grow">
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/">Plukliste</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/overview/products">Oversigt</NavLink>
                </NavItem>
                <NavItem>
                  <NavLink tag={Link} className="text-dark" to="/history">Historik</NavLink>
                </NavItem>
              </ul>
            </Collapse>
          </Container>
        </NavContainer>
      </header>
    );
  }
}

const NavContainer = styled(Navbar)`
  box-shadow: 0 .25rem .75rem rgba(0, 0, 0, .05);
`;

const NavBranding = styled(NavbarBrand)`
  white-space: normal;
  text-align: center;
  word-break: break-all;
`;
