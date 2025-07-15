import React from "react";
import Dashboard from "../Dashboard";
import UsersList from "../../components/users/users";

function UsersDashboardView() {
  return <Dashboard componentName={<UsersList />} />;
}

export default UsersDashboardView;
