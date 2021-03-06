const React = require( 'react' );

const EmptyContent = require( 'components/empty-content' ),
	stats = require( 'reader/stats' ),
	discoverHelper = require( 'reader/discover/helper' );

const FollowingEmptyContent = React.createClass( {
	shouldComponentUpdate: function() {
		return false;
	},

	recordAction: function() {
		stats.recordAction( 'clicked_search_on_empty' );
		stats.recordGaEvent( 'Clicked Search on EmptyContent' );
		stats.recordTrack( 'calypso_reader_search_on_empty_stream_clicked' );
	},

	render: function() {
		const action = discoverHelper.isDiscoverEnabled()
		? (
			<a
				className="empty-content__action button is-primary"
				onClick={ this.recordAction }
				href="/read/search">{ this.translate( 'Find Sites to Follow' ) }</a> ) : null,
			secondaryAction = null;

		return ( <EmptyContent
			title={ this.translate( 'Welcome to Reader' ) }
			line={ this.translate( 'Recent posts from sites you follow will appear here.' ) }
			action={ action }
			secondaryAction={ secondaryAction }
			illustration={ '/calypso/images/drake/drake-all-done.svg' }
			illustrationWidth={ 500 }
			/> );
	}
} );

module.exports = FollowingEmptyContent;
