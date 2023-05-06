import { Fragment } from 'react'
import { TopNav } from '../components/TopNav'

export default function Playlists() {
  return (
    <>
      <div className="min-h-full">
        { TopNav() }

        <header className="bg-white shadow">
          <div className="mx-auto max-w-7xl py-3 px-4 sm:px-6 lg:px-8">
            <h1 className="text-2xl font-bold tracking-tight text-gray-900">Playlists</h1>
          </div>
        </header>
        <main>
          <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
					Teh playlists go hiar
					</div>
        </main>
      </div>
    </>
  )
}