// import CardMenu from "components/card/CardMenu";
import Card from "components/card";
import { Input, IconButton } from "@chakra-ui/react";
import SearchIcon from "components/icons/SearchIcon";
import axios from "axios";
import React, { useMemo, useState } from "react";
import {
  useGlobalFilter,
  usePagination,
  useSortBy,
  useTable,
} from "react-table";
import Progress from "components/progress";

const DevelopmentTable = (props) => {
  const { columnsData } = props;
  const [tableData, setTableData] = useState([]);

  let columns = useMemo(() => columnsData, [columnsData]);
  let data = useMemo(() => tableData, [tableData]);
  const [value, setValue] = useState("");

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

  const handleChange = (event) => setValue(event.target.value);

  function getData() {
    axios({
      method: "POST", // Change method to POST since you're sending a body
      url: "http://127.0.0.1:5000/search_flights_by_year",
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

  return (
    <Card extra={"w-full h-full p-4"}>
      <div class="relative flex items-center justify-between">
        <div class="text-xl font-bold text-navy-700 dark:text-white">
          Total Flight's That took place
        </div>
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
            width={"300px"}
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

      <div class="h-full overflow-x-scroll xl:overflow-x-hidden">
        <table
          {...getTableProps()}
          className="mt-8 h-max w-full"
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
                    className="border-b border-gray-200 pr-32 pb-[10px] text-start dark:!border-navy-700 "
                    key={index}
                  >
                    <div className="text-xs font-bold tracking-wide text-gray-600">
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
                    if (cell.column.Header === "YEAR") {
                      data = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {cell.value}
                        </p>
                      );
                    } else if (cell.column.Header === "TOTAL FLIGHTS") {
                      data = (
                        <p className="text-sm font-bold text-navy-700 dark:text-white">
                          {cell.value}
                        </p>
                      );
                    } else if (cell.column.Header === "DELAYED FLIGHTS") {
                      data = (
                        <div className="flex items-center gap-3">
                          <p className="text-sm font-bold text-navy-700 dark:text-white">
                            {cell.value}%
                          </p>
                          <Progress width="w-[68px]" value={cell.value} />
                        </div>
                      );
                    }
                    return (
                      <td
                        {...cell.getCellProps()}
                        key={index}
                        className="pt-[14px] pb-3 text-[14px]"
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

export default DevelopmentTable;
