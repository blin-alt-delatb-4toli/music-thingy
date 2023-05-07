import { Fragment } from 'react'
import { TopNav } from '../components/TopNav'
import { UserContext } from '../what/login';
import { PlaylistList } from '../components/player/PlaylistList';

export function Playlists() {
  return (
    <div className="min-h-full">
      <PlaylistList />
    </div>
  )
}