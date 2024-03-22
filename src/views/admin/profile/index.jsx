
import { columnsDataCheck } from "../default/variables/columnsData";
import CheckTable from "views/admin/tables/components/CheckTable";

const ProfileOverview = () => {
  return <CheckTable columnsData={columnsDataCheck} />;
};

export default ProfileOverview;
