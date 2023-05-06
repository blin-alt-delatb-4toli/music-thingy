import { Fragment } from 'react'
import { TopNav } from '../components/TopNav'

export default function About() {
  return (
    <>
      {/*
        This example requires updating your template:

        ```
        <html class="h-full bg-gray-100">
        <body class="h-full">
        ```
      */}
      <div className="min-h-full">
        { TopNav() }

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl py-3 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">About</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
					There would be an about here but I'm still working on it, go eff yourself
					</div>
        </main>
      </div>
    </>
  )
}