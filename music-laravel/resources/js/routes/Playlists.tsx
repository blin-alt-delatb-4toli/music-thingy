import { PlaylistList } from '../components/player/PlaylistList';
import React from "react";
import { Playlist, PlaylistContext, PlaylistState, Publicity } from '../what/playlists';
import { PlaylistDetails } from './playlists/details';
import { User, UserContext } from '@/what/login';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faMagnifyingGlass, faPlayCircle, faPlus } from '@fortawesome/free-solid-svg-icons';

interface IPanelState {
  type: string,
  val?: any
}

interface IPanel {
  pnl: IPanelState,
  setPnl: (s: IPanelState) => null
}

interface IPropPanel {
  panel: IPanel
}

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

function Header({ panel } : IPropPanel) {
  const { pnl, setPnl } = panel;
  const { fetching } = React.useContext(PlaylistContext);
  const { user } = React.useContext(UserContext);

  const onNew = () => {
    setPnl({
      type: "New",
      val: new Playlist(-1, "New Playlist")
    });
  }

  return (<>
      <div className="font-bold m-2 mb-1 h-8 align-middle flex">
          <div className="flex h-full mr-2 flex-grow w-48">
            <span className="musTextFieldIconHolder bg-white">
                <FontAwesomeIcon icon={faMagnifyingGlass} />
            </span>
            <input type="search"
            id="search"
            onChange={ e => console.log(e) }
            className="musTextFieldEntry"
            placeholder="Search"/>
          </div>

          {user ? (<button className="musBtnElevatedGreen text-base h-full
            w-auto ml-auto p-2 flex justify-center items-center"
            onClick={onNew}>
            <FontAwesomeIcon icon={faPlus} />
          </button>) : null}
      </div>
    
      <h3>
        { /* fetching ? (
          <div className="hidden md:block ml-4 font-sans font-normal italic">
            updating...
          </div>
        ) : null */ }
      </h3>
  </>)
}

var THIS_SUCKS = 0;

export function Playlists() {
  const {playlistState} = PlaylistState();
  const [pnl, setPnl] = React.useState({type: "none"});
  const playlist = pnl.val;

  if (playlist) {
    THIS_SUCKS++;
    playlist.I_HATE_EVERYTHING_ABOUT_YOU ??= THIS_SUCKS;
  }

  const [selTab, setSelTab] = React.useState(0);
  const { user } : { user: User } = React.useContext(UserContext);
  const { playlists } : { playlists: Playlist[] } = playlistState;

  const playlistTabs = [
    {
      icon: <FontAwesomeIcon icon={faPlayCircle} className="mr-1 h-4"/>,
      name: "My playlists",
      canShow: () => {
        return !!user;
      },
      filter: (p: Playlist) => {
        return p.ownerId == user.id;
      }
    },
    {
      icon: <FontAwesomeIcon icon={faEye} className="mr-1 h-4"/>,
      name: "Public playlists",
      filter: (p: Playlist) => {
        return p.publicity == Publicity.Public;
      }
    },
  ]

  const selectTab = (v, idx) => {
    console.log("Select")
    setSelTab(idx);
  }

  var curTab = playlistTabs[selTab];

  if (curTab.canShow && curTab.canShow() == false) {
    // We can't show the selected tab anymore; select the next tab that we can
    for (var idx in playlistTabs) {
      var tab = playlistTabs[idx]
      if (!tab.canShow || tab.canShow()) {
        setSelTab(idx);
        curTab = tab;
        break;
      }
    }
  }

  const filtered = playlists.filter(curTab.filter);
  
  return (
    <PlaylistContext.Provider value={playlistState}>
      <div className="flex flex-row h-full">
        { /* Scroll */ }
        <div className="min-w-[16rem] sm:max-w-sm playlistScroll w-fit">
          <div className="inline-flex flex-col max-h-[calc(100vh-3rem)] w-full">
            <div className="h-10 flex w-full">
              {playlistTabs.map((v, idx) => {
                if (v.canShow && v.canShow() == false) {
                  return;
                }
                
                return (<React.Fragment key={idx}>
                  <button
                    className={ classNames(
                      (idx == selTab) ? "playlistListSelectionSel" : "playlistListSelection",
                      "h-full flex-1 content-b flex justify-center items-center w-full min-w-[fit-content]")
                    }
                    onClick={() => { selectTab(v, idx) }}>
                      {v.icon}
                      {v.name}
                  </button>
                  </React.Fragment>)
               } )
              }
            </div>

            <Header panel={{pnl, setPnl}}/>
            <div className="pl-2 overflow-auto w-72">
              <PlaylistList panel={{pnl, setPnl}} playlists={filtered}/>
            </div>
          </div>
        </div>

        { /* Right panel thing */ }
        <React.Fragment key={playlist?.I_HATE_EVERYTHING_ABOUT_YOU ?? "none"}>
        <div className="flex flex-col flex-auto h-full lg:px-[calc((100%-1024px)*0.1)]">
            <PlaylistDetails panel={{pnl, setPnl}}/>
        </div>
        </React.Fragment>
      </div>
    </PlaylistContext.Provider>
  )
}