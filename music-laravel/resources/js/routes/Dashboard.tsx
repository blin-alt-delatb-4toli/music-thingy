import { useState, createContext, useContext } from "react";
import { TopNav } from '../components/TopNav'
import { UserContext } from '../what/login';

export function Dashboard() {
  return ( <>
    <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl py-3 px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
        </div>
    </header>
    <main>
        <div className="text-base mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
        Onboarding goes here (go check out the playlists or something)
        </div>
    </main>
    </>)
}