import React, { Component } from "react";
import "./App.css";
import axios from "axios";

class App extends Component {
  constructor() {
    super();
    this.state = {
      data: [""],
      filteredData: [""],
      searchInput: "",
      sortDirection: "",
      sortingIsRequired: false,
      sortColumn: "",
    };
    this.tableHeading = "";
  }

  componentDidMount() {
    const api1 =
      "http://www.filltext.com/?rows=32&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D";
    // const api2 =
    //   "http://www.filltext.com/?rows=1000&id=%7Bnumber%7C1000%7D&firstName=%7BfirstName%7D&delay=3&lastName=%7BlastName%7D&email=%7Bemail%7D&phone=%7Bphone%7C(xxx)xxx-xx-xx%7D&address=%7BaddressObject%7D&description=%7Blorem%7C32%7D";
    axios
      .get(api1)
      .then((res) => {
        this.setState({
          data: res.data,
        });
        const headerData = Object.keys(res.data[0]);
        this.setState({
          tableHeading: headerData,
          sortingIsRequired: true,
        });
      })
      .catch((error) => {
        console.log(error);
      });
  }

  handleChange = (event, i) => {
    //search filter based on first td data
    console.log(event.currentTarget);
    this.setState({
      searchInput: event.target.value,
    });
    const { tableHeading } = this.state;
    if (event.target.value.length) {
      let filteredData = this.state.data.filter((value, key) => {
        //! Search by column 0,1,2,3...
        return value[tableHeading[2]]
          .toLowerCase()
          .includes(event.target.value.toLowerCase());
      });
      this.setState({
        filteredData: filteredData,
      });
    }
  };
  handleSort = (column, sortingIsRequired) => {
    if (sortingIsRequired) {
      const { sortDirection, data } = this.state;
      console.log(sortDirection);
      const comparer = (a, b) => {
        if (sortDirection === "" || sortDirection === "DESC") {
          this.setState({
            sortDirection: "ASC",
          });
          return a[column] > b[column] ? 1 : -1; //making data in ascending order
        } else if (sortDirection === "ASC") {
          this.setState({
            sortDirection: "DESC",
          });
          return a[column] < b[column] ? 1 : -1; //making data in descending order
        }
      };
      const sortedData = data.sort(comparer);
      this.setState({
        data: sortedData,
        sortColumn: column,
      });
    }
  };
  render() {
    const {
      filteredData,
      data,
      searchInput,
      tableHeading,
      sortDirection,
      sortingIsRequired,
      sortColumn,
    } = this.state;
    const bigTableColumns = ["id", "firstName", "lastName", "email", "phone"];

    //! Search area with placeholder = key index 0
    const searchplaceHolder = tableHeading
      ? "Search By " + tableHeading[2] + "......"
      : "";

    //if there is something in the searchInput, dataToDisplay = filteredData / if no, show the whole data
    const dataToDisplay = searchInput.length ? filteredData : data;
    console.log(sortColumn);
    const tableHeader =
      tableHeading &&
      tableHeading.map((val, ind) => {
        function isInArray(value, array) {
          return array.indexOf(value) > -1;
        }
        if (isInArray(val, bigTableColumns)) {
          return (
            <th
              onClick={() => this.handleSort(val, sortingIsRequired)}
              key={ind}
            >
              {val}
              {sortingIsRequired ? (
                <div
                  style={{ display: sortColumn === val ? "initial" : "none" }}
                >
                  {sortDirection === "ASC" ? (
                    <div className="glyphicon glyphicon-menu-up" />
                  ) : (
                    <div className="glyphicon glyphicon-menu-down" />
                  )}
                </div>
              ) : (
                ""
              )}
            </th>
          );
        }
      });

    // -----------------

    const td = bigTableColumns.map((headerColumn, i) => (
      <td key={i}>rowElement[headerColumn]</td>
    )); //

    const tableData =
      dataToDisplay &&
      dataToDisplay.map((rowObj, i) => {
        // console.log("dataToDisplay.map", rowObj, i)
        let td = Object.keys(rowObj).map((val, ind) => {
          console.log("td Object.map", val, ind, i, rowObj, rowObj[val]);

          function isInArray(value, array) {
            return array.indexOf(value) > -1;
          }
          if (isInArray(val, bigTableColumns)) {
            return <td key={ind}>{rowObj[val]}</td>;
          }
        });
        return <tr key={i}>{td}</tr>;
      });
    return (
      <div>
        <input
          type="text"
          className="searchbar"
          onChange={this.handleChange}
          placeholder={searchplaceHolder}
        />
        <table id="customers">
          <thead>
            <tr>{tableHeader}</tr>
          </thead>
          <tbody>{tableData}</tbody>
        </table>
      </div>
    );
  }
}

export default App;
