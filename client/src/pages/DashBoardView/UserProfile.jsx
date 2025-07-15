import UserProfile from "../../components/Profile/CheckProfile";
import Dashboard from "../Dashboard";

function UserProfileView() {
  return <Dashboard componentName={<UserProfile />} />;
}

export default UserProfileView;
