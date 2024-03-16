import Card from "components/card";
import BarChart from "components/charts/BarChart";
import { MdBarChart } from "react-icons/md";
import { useEffect, useState } from "react";

const WeeklyRevenue = ({ flights_each_year }) => {
  const [barChartDataWeeklyRevenue, setBarChartDataWeeklyRevenue] =
    useState(null);
  const [barChartOptionsWeeklyRevenue, setBarChartOptionsWeeklyRevenue] =
    useState(null);

  useEffect(() => {
    if (flights_each_year) {
      const dataArray = Object.entries(flights_each_year).map(
        ([year, { total, delayed }]) => ({ year, total, delayed })
      );

      // Sort the array based on total flights in descending order
      dataArray.sort((a, b) => b.total - a.total);

      // Select top 10 years with most total flights
      const topTenYears = dataArray.slice(0, 10);

      // Extracting total flights, years, and delayed flights into separate arrays
      const totalFlights = topTenYears.map((entry) => entry.total);
      const years = topTenYears.map((entry) => entry.year);
      const delayedFlights = topTenYears.map((entry) => entry.delayed);

      const chartData = [
        {
          name: "Total Flights",
          data: totalFlights,
          color: "#6AD2Fa",
        },
        {
          name: "Delayed Flights",
          data: delayedFlights,
          color: "#5E37FF",
        },
      ];

      const chartOptions = {
        chart: {
          stacked: true,
          toolbar: {
            show: false,
          },
        },
        // colors:['#ff3322','#faf']
        tooltip: {
          style: {
            fontSize: "12px",
            fontFamily: undefined,
            backgroundColor: "#000000",
          },
          theme: "dark",
          onDatasetHover: {
            style: {
              fontSize: "12px",
              fontFamily: undefined,
            },
          },
        },
        xaxis: {
          categories: years,
          show: false,
          labels: {
            show: true,
            style: {
              colors: "#A3AED0",
              fontSize: "14px",
              fontWeight: "500",
            },
          },
          axisBorder: {
            show: false,
          },
          axisTicks: {
            show: false,
          },
        },
        yaxis: {
          show: false,
          color: "black",
          labels: {
            show: false,
            style: {
              colors: "#A3AED0",
              fontSize: "14px",
              fontWeight: "500",
            },
          },
        },

        grid: {
          borderColor: "rgba(163, 174, 208, 0.3)",
          show: true,
          yaxis: {
            lines: {
              show: false,
              opacity: 0.5,
            },
          },
          row: {
            opacity: 0.5,
          },
          xaxis: {
            lines: {
              show: false,
            },
          },
        },
        fill: {
          type: "solid",
          colors: ["#5E37FF", "#6AD2FF", "#E1E9F8"],
        },
        legend: {
          show: false,
        },
        colors: ["#5E37FF", "#6AD2FF", "#E1E9F8"],
        dataLabels: {
          enabled: false,
        },
        plotOptions: {
          bar: {
            borderRadius: 10,
            columnWidth: "20px",
          },
        },
      };

      setBarChartDataWeeklyRevenue(chartData);
      setBarChartOptionsWeeklyRevenue(chartOptions);
    }
  }, [flights_each_year]);

  return (
    <Card extra="flex flex-col bg-white w-full rounded-3xl py-6 px-2 text-center">
      <div className="mb-auto flex items-center justify-between px-6">
        <h2 className="text-lg font-bold text-navy-700 dark:text-white">
          Top 10 Years with Most Flights
        </h2>
        <button className="!linear z-[1] flex items-center justify-center rounded-lg bg-lightPrimary p-2 text-brand-500 !transition !duration-200 hover:bg-gray-100 active:bg-gray-200 dark:bg-navy-700 dark:text-white dark:hover:bg-white/20 dark:active:bg-white/10">
          <MdBarChart className="h-6 w-6" />
        </button>
      </div>

      <div className="md:mt-16 lg:mt-0">
        <div className="h-[250px] w-full xl:h-[350px]">
          {barChartDataWeeklyRevenue !== null &&
          barChartOptionsWeeklyRevenue !== null ? (
            <BarChart
              chartData={barChartDataWeeklyRevenue}
              chartOptions={barChartOptionsWeeklyRevenue}
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

export default WeeklyRevenue;
