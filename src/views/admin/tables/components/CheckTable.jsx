import React, { useMemo } from "react";
import Card from "components/card";
import Checkbox from "components/checkbox";
import { Button, ButtonGroup } from "@chakra-ui/react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import { useState, useEffect } from "react";
import axios from "axios";

const CheckTable = (props) => {
  const [states, setStates] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedStates, setSelectedStates] = useState([]);

  function getData() {
    axios({
      method: "GET",
      url: "http://127.0.0.1:5000/get_states",
    })
      .then((response) => {
        const res = response.data;
        setStates(res);

        let temp = [];
        res.forEach((state) => {
          let data = {
            state: [state, false], // Add a boolean value to the state to track if it's selected
            total_flights: "",
            total_delays: "",
            total_cancellations: "",
          };
          temp.push(data);
        });
        console.log(temp);
        setStates(res);
        setTableData(temp);
        console.log(tableData);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  function getComparisonData() {
    axios({
      method: "POST",
      url: "http://127.0.0.1:5000/get_comparison",
      data: JSON.stringify({ states: selectedStates }),
      headers: {
        "Content-Type": "application/json",
      },
    })
      .then((response) => {
        const res = response.data;

        // Update the table data with the comparison data
        tableData.forEach((data) => {
          let updated = false;
          res.forEach((state) => {
            if (data.state[0] === state.state) {
              updated = true;
              data.total_flights = state.total;
              data.total_delays = state.delayed;
              data.total_cancellations = state.cancelled;
            }
          });

          if (!updated) {
            data.state[1] = false;
            data.total_flights = "";
            data.total_delays = "";
            data.total_cancellations = "";
          }
        });
        setTableData([...tableData]);

        console.log(res);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  useEffect(() => {
    getData();
  }, []);

  const { columnsData } = props;
  const columns = useMemo(() => columnsData, [columnsData]);
  const data = useMemo(() => tableData, [tableData]);

  const tableInstance = useTable(
    {
      columns,
      data,
    },
    useGlobalFilter,
    useSortBy,
    usePagination
  );

  const {
    getTableProps,
    getTableBodyProps,
    headerGroups,
    page,
    prepareRow,
    initialState,
  } = tableInstance;
  initialState.pageSize = 11;

  return (
    <Card extra={"w-full sm:overflow-auto p-4"}>
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Comparison of States
        </div>
        <Button
          colorScheme="teal"
          variant="outline"
          onClick={getComparisonData}
        >
          Compare
        </Button>
      </header>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table
          {...getTableProps()}
          className="w-full"
          variant="simple"
          color="gray-500"
          mb="24px"
        >
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    className="border-b border-gray-200 pr-16 pb-[10px] text-start dark:!border-navy-700"
                    key={index}
                  >
                    <div className="text-xs font-bold tracking-wide text-gray-600 lg:text-xs">
                      {column.render("Header")}
                    </div>
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody {...getTableBodyProps()}>
            {page.map((row, index) => {
              prepareRow(row);
              return (
                <tr {...row.getRowProps()} key={index}>
                  {row.cells.map((cell, index) => {
                    let data = "";
                    if (cell.column.Header === "STATES") {
                      data = (
                        <div className="flex items-center gap-2">
                          <Checkbox
                            label={cell.value[0]}
                            checked={cell.value[1]}
                            onChange={(e) => {
                              let temp = selectedStates;
                              let index = temp.indexOf(cell.value[0]);
                              if (index > -1) {
                                temp.splice(index, 1);
                              } else {
                                temp.push(cell.value[0]);
                              }
                              cell.value[1] = !cell.value[1];
                              setSelectedStates(temp);
                              setTableData([...tableData]);
                            }}
                          />
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {cell.value[0]}
                          </p>
                        </div>
                      );
                    } else if (cell.column.Header === "TOTAL FLIGHTS") {
                      data = (
                        <div className="flex items-center">
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {cell.value}
                          </p>
                        </div>
                      );
                    } else if (cell.column.Header === "TOTAL DELAYS") {
                      data = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {" "}
                          {cell.value}{" "}
                        </p>
                      );
                    } else if (cell.column.Header === "TOTAL CANCELLATIONS") {
                      data = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {cell.value}
                        </p>
                      );
                    }
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={index}
                        className="pt-[14px] pb-[16px] sm:text-[14px]"
                      >
                        {data}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </Card>
  );
};

export default CheckTable;
