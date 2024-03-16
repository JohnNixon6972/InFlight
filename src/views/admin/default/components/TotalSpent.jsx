import React from "react";
import {
  MdArrowDropUp,
  MdOutlineCalendarToday,
  MdBarChart,
} from "react-icons/md";
import Card from "components/card";
import LineChart from "components/charts/LineChart";
import { useEffect, useState } from "react";

const TotalSpent = ({ flights_each_month }) => {
  const [lineChartDataTotalSpent, setLineChartDataTotalSpent] = useState(null);
  const [lineChartOptionsTotalSpent, setLineChartOptionsTotalSpent] =
    useState(null);

  const [totalDelays, setTotalDelays] = useState(0);
  const [avgPercentageDelay, setAvgPercentageDelay] = useState(0);

  useEffect(() => {
    if (flights_each_month) {
      const dataArray = Object.entries(flights_each_month).map(
        ([month, { total, delayed }]) => ({ month, total, delayed })
      );
      // Sort the array based on month order
      let month_order = {
        January: 1,
        February: 2,
        March: 3,
        April: 4,
        May: 5,
        June: 6,
        July: 7,
        August: 8,
        September: 9,
        October: 10,
        November: 11,
        December: 12,
      };
      dataArray.sort((a, b) => month_order[a.month] - month_order[b.month]);
      // Extracting total flights, years, and delayed flights into separate arrays

      const totalFlights = dataArray.map((entry) => entry.total);
      const months = dataArray.map((entry) => entry.month);
      const delayedFlights = dataArray.map((entry) => entry.delayed);

      let total_delays = 0;
      let total_flights = 0;
      for (let i = 0; i < delayedFlights.length; i++) {
        // convert to number
        total_delays += parseInt(delayedFlights[i]);
        total_flights += parseInt(totalFlights[i]);
      }
      // round to single decimal place
      // calculate average percentage delay
      let avg_percentage_delay = (total_delays / total_flights) * 100;
      // round to single decimal place
      total_flights = Math.round(total_flights * 10) / 10;
      avg_percentage_delay = Math.round(avg_percentage_delay * 10) / 10;

      // round upto 2 decimal places
  
      total_delays = total_delays.toLocaleString();


      setAvgPercentageDelay(avg_percentage_delay);
      setTotalDelays(total_delays);

      const lineChartDataTotalSpent = [
        {
          name: "Total Flights",
          data: totalFlights,
          color: "#4318FF",
        },
        {
          name: "Delayed Flights",
          data: delayedFlights,
          color: "#6AD2FF",
        },
      ];

      const lineChartOptionsTotalSpent = {
        legend: {
          show: false,
        },

        theme: {
          mode: "light",
        },
        chart: {
          type: "line",

          toolbar: {
            show: false,
          },
        },

        dataLabels: {
          enabled: false,
        },
        stroke: {
          curve: "smooth",
        },

        tooltip: {
          style: {
            fontSize: "12px",
            fontFamily: undefined,
            backgroundColor: "#000000",
          },
          theme: "dark",
          x: {
            format: "dd/MM/yy HH:mm",
          },
        },
        grid: {
          show: false,
        },
        xaxis: {
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
          labels: {
            style: {
              colors: "#A3AED0",
              fontSize: "12px",
              fontWeight: "500",
            },
          },
          type: "text",
          range: undefined,
          categories: months,
        },

        yaxis: {
          show: false,
        },
      };

      setLineChartDataTotalSpent(lineChartDataTotalSpent);
      setLineChartOptionsTotalSpent(lineChartOptionsTotalSpent);
    }
  }, [flights_each_month]);

  return (
    <Card extra="!p-[20px] text-center">
      <div className="flex justify-between">
        <button className="linear mt-1 flex items-center justify-center gap-2 rounded-lg bg-lightPrimary p-2 text-gray-600 transition duration-200 hover:cursor-pointer hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:hover:opacity-90 dark:active:opacity-80">
          <MdOutlineCalendarToday />
          <span className="text-sm font-medium text-gray-600">This month</span>
        </button>
        <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
          <MdBarChart className="h-6 w-6" />
        </button>
      </div>

      <div className="flex h-full w-full flex-row justify-between sm:flex-wrap lg:flex-nowrap 2xl:overflow-hidden">
        <div className="flex flex-col">
          <p className="mt-[20px] text-3xl font-bold text-navy-700 dark:text-white">
            {totalDelays === 0 ? "Loading..." : totalDelays}
          </p>
          <div className="flex flex-col items-start">
            <p className="mt-2 text-sm text-gray-600">Total Delayed Flights</p>
            <div className="flex flex-row items-center justify-center">
              <MdArrowDropUp className="font-medium text-green-500" />
              <p className="text-sm font-bold text-green-500">
                {" "}
                {avgPercentageDelay}%
              </p>
            </div>
          </div>
        </div>
        <div className="h-full w-full">
          {lineChartDataTotalSpent !== null &&
          lineChartOptionsTotalSpent !== null ? (
            <LineChart
              series={lineChartDataTotalSpent}
              options={lineChartOptionsTotalSpent}
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <p className="text-lg font-bold text-navy-700 dark:text-white">
                Loading...
              </p>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
};

export default TotalSpent;
