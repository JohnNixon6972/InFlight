import PieChart from "components/charts/PieChart";
import { pieChartOptions } from "variables/charts";
import Card from "components/card";
import { Input, IconButton } from "@chakra-ui/react";
import SearchIcon from "components/icons/SearchIcon";
import { useState } from "react";
import axios from "axios";

const PieChartCard = () => {
  const [value, setValue] = useState("");
  const [pieChartData, setPieChartData] = useState("");
  const [onTime, setOnTime] = useState("");
  const [early, setEarly] = useState("");

  const handleChange = (event) => setValue(event.target.value);

  function getData() {
    axios({
      method: "POST", // Change method to POST since you're sending a body
      url: "http://127.0.0.1:5000/get_annual_stats",
      headers: {
        "Content-Type": "application/json",
      },
      data: JSON.stringify({ year: value }), // Include the year in the request body
    })
      .then((response) => {
        const res = response.data;
        console.log(res);
        setPieChartData(res);
        setOnTime(res[0]);
        setEarly(res[1]);
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
    <Card extra="rounded-[20px] p-3">
      <div className="flex flex-row justify-between px-3 pt-2">
        <div className="flex items-center gap-2">
          <h4 className="text-lg font-bold text-navy-700 dark:text-white">
            Annual Flight Analysis
          </h4>
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
              border="none"
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
      </div>

      <div className="mb-auto flex h-[220px] w-full items-center justify-center">
        <PieChart options={pieChartOptions} series={pieChartData} />
      </div>
      <div className="flex flex-row !justify-between rounded-2xl px-6 py-3 shadow-2xl shadow-shadow-500 dark:!bg-navy-700 dark:shadow-none">
        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-brand-500" />
            <p className="ml-1 text-sm font-normal text-gray-600">On Time</p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700  dark:text-white">
            {onTime}%
          </p>
        </div>

        <div className="h-11 w-px bg-gray-300 dark:bg-white/10" />

        <div className="flex flex-col items-center justify-center">
          <div className="flex items-center justify-center">
            <div className="h-2 w-2 rounded-full bg-[#6AD2FF]" />
            <p className="ml-1 text-sm font-normal text-gray-600">Early takeoff</p>
          </div>
          <p className="mt-px text-xl font-bold text-navy-700 dark:text-white">
            {early}%
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PieChartCard;
