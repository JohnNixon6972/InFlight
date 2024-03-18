import {
  columnsDataDevelopment,
  columnsDataColumns,
  columnsDataComplex,
} from "./variables/columnsData";

import tableDataComplex from "./variables/tableDataComplex.json";
import DevelopmentTable from "./components/DevelopmentTable";
import ColumnsTable from "./components/ColumnsTable";
import ComplexTable from "./components/ComplexTable";
import PieChartCard from "views/admin/default/components/PieChartCard";

const Tables = () => {
  return (
    <div>
      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-2">
        <DevelopmentTable
          columnsData={columnsDataDevelopment}
        />
        <PieChartCard />
      </div>

      <div className="mt-5 grid h-full grid-cols-1 gap-5 md:grid-cols-2">
        <ColumnsTable
          columnsData={columnsDataColumns}
        />

        <ComplexTable
          columnsData={columnsDataComplex}
          tableData={tableDataComplex}
        />
      </div>
    </div>
  );
};

export default Tables;
