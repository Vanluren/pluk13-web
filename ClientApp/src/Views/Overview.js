import React, { Component } from "react";
import PropTypes from "prop-types";
import { Layout } from "../components/Layout";

class Overview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: [
        {
          productId: 1,
          title: "Det her er en titel",
          type: "Bitz",
          size: "450g",
          brand: "Joachim Bitz",
          otherInfo:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          location: "A-2-2-2"
        },
        {
          productId: 2,
          title: "Det her er en titel",
          type: "Bitz",
          size: "450g",
          brand: "Joachim Bitz",
          otherInfo:
            "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
          location: "A-2-2-2"
        }
      ]
    };
  }
  deleteOnClickHandler = id => {
    console.log(id);
  };
  editOnClickHandler = id => {
    console.log(id);
  };
  render() {
    return (
      <table className="table table-striped">
        <thead>
          <tr>
            <th>Id</th>
            <th>Titel</th>
            <th>Type</th>
            <th>Størrelse</th>
            <th>Mærke</th>
            <th>Andet</th>
            <th>Placering</th>
            <th>actions</th>

          </tr>
        </thead>
        <tbody>
          {this.state.data.map(product => (
            <tr key={product.productId}>
              <td>{product.productId}</td>
              <td>{product.title}</td>
              <td>{product.type}</td>
              <td>{product.size}</td>
              <td>{product.brand}</td>
              <td>{product.otherInfo}</td>
              <td>{product.location}</td>
              <td onClick={() => this.editOnClickHandler(product.productId)}>
                Edit
              </td>
              <td onClick={() => this.deleteOnClickHandler(product.productId)}>
                Delete
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    );
  }
}

Overview.propTypes = {};

export default Overview;
