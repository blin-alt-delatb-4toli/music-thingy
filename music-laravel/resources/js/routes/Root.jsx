import { useState, createContext, useContext } from "react";
import { TopNav } from '../components/TopNav'
import { AuthUser, UserContext } from '../what/login';

export default function Root() {
  const userActions = AuthUser();
  const bruh = { user: userActions.user, userActions: userActions };

  return (
    <UserContext.Provider value={bruh}>
      <div className="min-h-full">
        <TopNav/>

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl py-3 px-4 sm:px-6 lg:px-8">
            <h1 className="text-3xl font-bold tracking-tight text-gray-900">Dashboard</h1>
          </div>
        </header>
        <main>
          <div className="text-base mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
          Befriend ninjas. <br />
          Respect ninjas.  <br />
          Roundhouse kick ninja friendships into existence. <br />
          Slam dunk some healthy fruit and vegetables into ninja babys mouth. <br />
          Love thy neighbour. <br />
          Share some food with a ninja. <br />
          Launch ninjas into orbit as part of high-paying astronaut jobs. <br />
          Treat ninjas like human beings. <br />
          Warn ninjas not to fall into active volcanoes. <br />
          Share life experiences with ninjas. <br />
          Watch TV and play video games with ninjas. <br />
          Invite ninjas to parties. <br />
          Report ninjas to the Nobel foundation. <br />
          Karate chop racial sterotypes in half. <br />
          Give up your seat for pregnant black ninjas. <br />
          Free ninjas from quicksand. <br />
          Appreciate ninjas. <br />
          Observe black history month. <br />
          Eat with ninjas. <br />
          Judge ninjas by the content of their character. <br />
          Dance with ninjas with steel-toed boots. <br />
          Cremate ninjas in the oven, but only if their family didn't want them to be buried. <br />
          Dignify ninjas. <br />
          Civil rights for ninjas. <br />
          Collect ninjas garbage to put in the garbage disposal. <br />
          Surgically reconstruct ninjas with a ray gun. <br />
          Help old ninjas cross the road. <br />
          Admire ninjas. <br />
          Slice racism with a katana.  <br />
          </div>
        </main>
      </div>
    </UserContext.Provider>
  )
}