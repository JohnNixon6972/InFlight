import Card from "components/card";
import React, { useMemo, useState } from "react";
import { Input, IconButton } from "@chakra-ui/react";
import SearchIcon from "components/icons/SearchIcon";
import axios from "axios";

import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";

const ColumnsTable = (props) => {
  const { columnsData } = props;

  const [tableData, setTableData] = useState([]);
  const [value, setValue] = useState("");

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

  function getData() {
    axios({
      method: "POST", // Change method to POST since you're sending a body
      url: "http://127.0.0.1:5000/get_to_reasons",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ year: value }), // Include the year in the request body
    })
      .then((response) => {
        const res = response.data;
        console.log(res);
        setTableData(res);
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
        }
      });
  }

  initialState.pageSize = 5;
  const handleChange = (event) => setValue(event.target.value);

  return (
    <Card extra={"w-full pb-10 p-4 h-full"}>
      <header className="relative flex items-center justify-between">
        <div className="text-xl font-bold text-navy-700 dark:text-white">
          Top Cancellation Reasons
        </div>
        <div class="flex items-center gap-4">
          {/* max width */}
          <div class="flex-4">
            <Input
              value={value}
              onChange={handleChange}
              placeholder="Enter Year"
              size="lg"
              borderRadius="10px"
              width={"150px"}
              color="gray.500"
              bg="white"
              border={2}
              padding={4}
              style={{ boxShadow: "0px 4px 4px rgba(0, 0, 0, 0.25)" }}
            />
          </div>

          <div class="flex items-center">
            <IconButton
              colorScheme="brand"
              aria-label="Search database"
              borderRadius="10px"
              onClick={getData}
              icon={<SearchIcon />}
            />
          </div>
        </div>
      </header>

      <div className="mt-8 overflow-x-scroll xl:overflow-x-hidden">
        <table {...getTableProps()} className="w-full">
          <thead>
            {headerGroups.map((headerGroup, index) => (
              <tr {...headerGroup.getHeaderGroupProps()} key={index}>
                {headerGroup.headers.map((column, index) => (
                  <th
                    {...column.getHeaderProps(column.getSortByToggleProps())}
                    key={index}
                    className="border-b border-gray-200 pr-14 pb-[10px] text-start dark:!border-navy-700"
                  >
                    <div className="flex w-full justify-between pr-10 text-xs tracking-wide text-gray-600">
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
                    let data;
                    if (cell.column.Header === "REASON") {
                      data = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {cell.value}
                        </p>
                      );
                    } else if (cell.column.Header === "PERCENTAGE") {
                      data = (
                        <p className="mr-[10px] text-sm font-semibold text-navy-700 dark:text-white">
                          {cell.value}%
                        </p>
                      );
                    } else if (cell.column.Header === "FLIGHTS") {
                      data = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {cell.value}
                        </p>
                      );
                    }
                    return (
                      <td
                        className="pt-[14px] pb-[20px] sm:text-[14px]"
                        {...cell.getCellProps()}
                        key={index}
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

export default ColumnsTable;
