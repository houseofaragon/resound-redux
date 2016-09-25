import React from 'react'
import { Link } from 'react-router'
import map from '../../services/map';
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import * as actions from '../../actions/index'
import { ARTISTS, DEFAULT_ARTIST, DEFAULT_ARTISTS } from '../../constants/artists'
import { browse, fave, dashboard } from '../../constants/pathnames'
import classNames from 'classnames';

const getArtistLink = (artist) => {
  return browse + '?artist=' + artist
}

const getVenueLink = (artistVenue) => {
  return browse + '?venue=' + artistVenue
}

const Logo = () => {
  return (
    <div>
      <Link to={browse}> <h1>Berghain</h1> </Link>
    </div>
  )
}

const VenueItem = ({ selectedArtist, artistVenue, artists, pathname }) => {
  const linkClass = classNames(
    'menu-item',
    {
      'menu-item-selected': artistVenue === selectedArtist
    }
  )
  console.log('artists: ', artists)
  return (
    <Link to={getVenueLink(artistVenue)} onClick={() => ArtistList(artists, pathname, selectedArtist)} className={linkClass}>
      {artistVenue}
    </Link>
  )
}

const ArtistItem = ({ selectedArtist, artist }) => {
  const linkClass = classNames(
    'menu-item',
    {
      'menu-item-selected': artist === selectedArtist
    }
  )
  return (
    <Link to={getArtistLink(artist)} className={linkClass}>
      {artist}
    </Link>
  )
}

const VenueList = ({ selectedVenue, pathname }) => {
  return (
    <div>
      {map((artist, idx) => {
        const artistVenue = artist.venue
        const artists = artist.artists
        const menuItemProps = { artistVenue, artists, selectedVenue, pathname }
        return <VenueItem key={idx} { ...menuItemProps } />
      }, ARTISTS)
    }
    </div>
  )
}

const ArtistList = ({ artists, pathname, selectedArtist }) => {
  return (
   <div>
      {map((artist, idx) => {
        const menuItemProps = { artist, selectedArtist, pathname }
        return <ArtistItem key={idx} { ...menuItemProps } />
      }, artists)
      }
    </div>
  )
}

const Login = ({ onLogin }) => {
  return <Link onClick={onLogin} to={dashboard}> Login </Link>
}

const Logout = ({ onLogout }) => {
  return <Link onClick={onLogout} to={browse}> Logout </Link>
}

const UserIcon = () => {
  return <Link to={dashboard}> Dashboard </Link>
}

const SessionAction = ({ currentUser, pathname, onLogin, onLogout }) => {
  const renderSessionLink = () => {
    if (currentUser && pathname && pathname !== '/dashboard') {
      return <UserIcon />
    } else if (currentUser && pathname && pathname === '/dashboard') {
      return <Logout onLogout={ onLogout } />
    } else {
      return <Login onLogin={ onLogin } />
    }
  }

  return (
    <div> {renderSessionLink()} </div>
  )
}

const Header = ({ currentUser, artistVenue, artists, artist, pathname, onLogin, onLogout, onChangeLocation }) => {
  return (
    <div className="header">
      <div className="header-content">
        <Logo />
        <VenueList selectedVenue={artistVenue} pathname={pathname} />
        <SessionAction currentUser={currentUser} pathname={pathname} onLogin={onLogin} onLogout={onLogout} />
      </div>
      <div className="header-sub-content">
        <ArtistList artists={artists} selectedArtist={artist} pathname={pathname} />
      </div>

    </div>
  )
}

const mapStateToProps = (state, props) => {
  return {
    currentUser: state.session.user,
    artist: props.artist,
    pathname: props.pathname
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: bindActionCreators(actions.login, dispatch),
    onLogout: bindActionCreators(actions.logout, dispatch),
    onChangeLocation: bindActionCreators(actions.changeLocation, dispatch)
  }
}

Header.propTypes = {
  currentUser: React.PropTypes.object,
  artist: React.PropTypes.string,
  artists: React.PropTypes.array,
  pathname: React.PropTypes.string,
  onLogin: React.PropTypes.func,
  onLogout: React.PropTypes.func,
  onChangeLocation: React.PropTypes.func
}

Header.defaultProps = {
  artist: DEFAULT_ARTIST,
  artists: DEFAULT_ARTISTS
}

const HeaderContainer = connect(mapStateToProps, mapDispatchToProps)(Header)

export { Header, HeaderContainer }
