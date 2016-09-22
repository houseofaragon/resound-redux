import React from 'react';
import { HeaderContainer } from '../../components/Header';
import { PlayerContainer } from '../../components/Player';
import { PlaylistContainer } from '../../components/Playlist';
import { VolumeContainer } from '../../components/Volume';

export default class App extends React.Component {

  render() {
    const { location, children } = this.props;
    const { pathname, query } = location;
    const genre = query.genre;

    return (
      <div>
        <HeaderContainer genre={genre} pathname={pathname} />
          {children}
        <PlaylistContainer />
        <VolumeContainer />
        <PlayerContainer />
      </div>
    );
  }

}
