import MiniCalendar from "components/calendar/MiniCalendar";
import WeeklyRevenue from "views/admin/default/components/WeeklyRevenue";
import TotalSpent from "views/admin/default/components/TotalSpent";
import PieChartCard from "views/admin/default/components/PieChartCard";
import { IoMdHome } from "react-icons/io";
import { IoDocuments } from "react-icons/io5";
import { MdBarChart, MdDashboard } from "react-icons/md";
import axios from "axios";
import { useState,useEffect } from "react";

import { columnsDataCheck, columnsDataComplex } from "./variables/columnsData";

import Widget from "components/widget/Widget";
import CheckTable from "views/admin/default/components/CheckTable";
import ComplexTable from "views/admin/default/components/ComplexTable";
import DailyTraffic from "views/admin/default/components/DailyTraffic";
import TaskCard from "views/admin/default/components/TaskCard";
import tableDataCheck from "./variables/tableDataCheck.json";
import tableDataComplex from "./variables/tableDataComplex.json";

const Dashboard = () => {
  const [data, setData] = useState(null);

  function getData() {
    axios({
      method: "GET",
      url: "http://127.0.0.1:5000",
    })
      .then((response) => {
        const res = response.data;
        setData(res);
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
  }
  , []);
  //en

  let total_air_time = data ? data.air_time.reduce((accumulator, currentValue) => accumulator + currentValue, 0) : "Loading...";
  // round to two decimal places
  total_air_time = Math.round(total_air_time * 100) / 100;
  total_air_time = total_air_time.toLocaleString() + " minutes";

  return (
    <div>
      {/* Card widget */}

      <div className="mt-3 grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-3 3xl:grid-cols-6">
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Total Entries"}
          subtitle={data ? data.total_entries.toLocaleString() + " records" : "Loading..."}
        />
        <Widget
          icon={<IoDocuments className="h-6 w-6" />}
          title={"Data From"}
          subtitle={data ? Math.min(...data.data_range) : "Loading..."}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Data To"}
          subtitle={data ? Math.max(...data.data_range) : "Loading..."}
        />
        <Widget
          icon={<MdDashboard className="h-6 w-6" />}
          title={"Unique Origin Airports"}
          subtitle={data ? data.uniq_origin.length : "Loading..."}
        />
        <Widget
          icon={<MdBarChart className="h-7 w-7" />}
          title={"Unique Destination Airports"}
          subtitle={data ? data.uniq_dest.length : "Loading..."}
        />
       
        <Widget
          icon={<IoMdHome className="h-6 w-6" />}
          title={"Total AirTime"}
          subtitle={data ? total_air_time : "Loading..."}
        />
      </div>

      {/* Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 md:grid-cols-2">
        <TotalSpent flights_each_month = {data ? data.flights_each_month : data}/>
        <WeeklyRevenue flights_each_year={data ? data.flights_each_year : data} />
      </div>

      {/* Tables & Charts */}

      <div className="mt-5 grid grid-cols-1 gap-5 xl:grid-cols-2">
        {/* Check Table */}
        <div>
          <CheckTable
            columnsData={columnsDataCheck}
            tableData={tableDataCheck}
          />
        </div>

        {/* Traffic chart & Pie Chart */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <DailyTraffic />
          <PieChartCard />
        </div>

        {/* Complex Table , Task & Calendar */}

        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />

        {/* Task chart & Calendar */}

        <div className="grid grid-cols-1 gap-5 rounded-[20px] md:grid-cols-2">
          <TaskCard />
          <div className="grid grid-cols-1 rounded-[20px]">
            <MiniCalendar />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
