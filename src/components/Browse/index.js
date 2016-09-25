import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { DEFAULT_ARTIST } from '../../constants/artists';
import { SORT_FUNCTIONS } from '../../constants/sort';
import { DURATION_FILTER_FUNCTIONS } from '../../constants/durationFilter';
import * as actions from '../../actions/index';
import * as requestTypes from '../../constants/requestTypes';
import Activities from '../../components/Activities';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { getTracknameFilter } from '../../constants/nameFilter';
import { getAndCombined } from '../../services/filter';

class Browse extends React.Component {
  constructor(props) {
    super(props);
    this.fetchActivitiesByArtist = this.fetchActivitiesByArtist.bind(this);
    this.fetchArtistBio = this.fetchArtistBio.bind(this);
  }

  componentDidMount() {
    if (!this.needToFetchActivities()) { return }
    this.fetchActivitiesByArtist()
    this.fetchArtistBio()
  }

  componentDidUpdate() {
    if (!this.needToFetchActivities()) { return }
    this.fetchActivitiesByArtist();
    this.fetchArtistBio()
  }

  fetchArtistBio() {
    const { artist, paginateLinks } = this.props;
    const nextHref = paginateLinks[artist];
    this.props.fetchArtistBio(nextHref, artist);
  }

  fetchActivitiesByArtist() {
    const { artist, paginateLinks } = this.props;
    const nextHref = paginateLinks[artist];
    this.props.fetchActivitiesByArtist(nextHref, artist);
  }

  needToFetchActivities() {
    const { artist, browseActivities } = this.props;
    return !browseActivities[artist] || browseActivities[artist].length < 20;
  }

  render() {
    const { browseActivities, bio, artist, requestsInProcess, trackEntities, activeFilter, activeSort } = this.props;
    return (
      <div className="dashboard">
        <div className="dashboard-main">
          <Activities
            isLoading={requestsInProcess[requestTypes.ARTISTS] && !browseActivities[artist]}
            ids={browseActivities[artist]}
            entities={trackEntities}
            activeFilter={activeFilter}
            activeSort={activeSort}
            scrollFunction={this.fetchActivitiesByArtist}
          />
        </div>
        <div className="dashboard-side">
          <ArtistBio artist={artist} bio={bio} />
        </div>
        <LoadingSpinner isLoading={requestsInProcess[requestTypes.ARTISTS] && browseActivities[artist]} />
      </div>
    );
  }
}

const ArtistBio = ({ artist, bio }) => {
  return (
    <div className="dashboard-side-fixed">
      <h1>{artist}</h1>
      <p>{bio}</p>
    </div>
  )
}

function mapStateToProps(state, routerState) {
  const filters = [
    DURATION_FILTER_FUNCTIONS[state.filter.durationFilterType],
    getTracknameFilter(state.filter.filterNameQuery)
  ];

  return {
    artist: routerState.location.query.artist,
    bio: state.browse.bio,
    browseActivities: state.browse,
    requestsInProcess: state.request,
    paginateLinks: state.paginate,
    trackEntities: state.entities.tracks,
    userEntities: state.entities.users,
    activeFilter: getAndCombined(filters),
    activeSort: SORT_FUNCTIONS[state.sort.sortType],
  };
}

function mapDispatchToProps(dispatch) {
  return {
    fetchActivitiesByArtist: bindActionCreators(actions.fetchActivitiesByArtist, dispatch),
    fetchArtistBio: bindActionCreators(actions.fetchArtistBio, dispatch),
  };
}

Browse.propTypes = {
  artist: React.PropTypes.string,
  bio: React.PropTypes.string,
  browseActivities: React.PropTypes.object,
  requestsInProcess: React.PropTypes.object,
  paginateLinks: React.PropTypes.object,
  trackEntities: React.PropTypes.object,
  userEntities: React.PropTypes.object,
  fetchActivitiesByArtist: React.PropTypes.func,
  fetchArtistBio: React.PropTypes.func
};

Browse.defaultProps = {
  artist: DEFAULT_ARTIST
};

const BrowseContainer = connect(mapStateToProps, mapDispatchToProps)(Browse);

export {
  Browse,
  BrowseContainer
};
