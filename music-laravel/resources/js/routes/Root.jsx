import { useState, createContext, useContext } from "react";
import { TopNav } from '../components/TopNav'
import { UserState, UserContext } from '../what/login';
import { Outlet } from "react-router-dom";
import { Dashboard } from "./Dashboard";

export default function Root() {
  const userActions = UserState();
  const bruh = { user: userActions.user, userActions: userActions };

  return (
    <UserContext.Provider value={bruh}>
      <div className="min-h-full">
        <TopNav/>
        <Outlet />
      </div>
    </UserContext.Provider>
  )
}