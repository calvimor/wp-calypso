/**
* External dependencies
*/
import React, { Component, PropTypes } from 'react';
import classNames from 'classnames';
import { connect } from 'react-redux';
import pick from 'lodash/pick';
import { localize, moment } from 'i18n-calypso';

/**
 * Internal dependencies
 */
import Card from 'components/card';
import StatsTabs from '../stats-tabs';
import StatsTab from '../stats-tabs/tab';
import SectionHeader from 'components/section-header';
import QuerySiteStats from 'components/data/query-site-stats';
import { getSelectedSiteId } from 'state/ui/selectors';
import {
	isRequestingSiteStatsForQuery,
	getSiteStatsNormalizedData
} from 'state/stats/lists/selectors';
import { getSiteSlug } from 'state/sites/selectors';

class StatsAllTime extends Component {

	static propTypes = {
		translate: PropTypes.func,
		siteId: PropTypes.number,
		requesting: PropTypes.bool,
		query: PropTypes.object,
		posts: PropTypes.number,
		views: PropTypes.number,
		viewsBestDay: PropTypes.string,
		viewsBestDayTotal: PropTypes.number,
		siteSlug: PropTypes.string,
	};

	render() {
		const {
			translate,
			siteId,
			requesting,
			posts,
			views,
			visitors,
			viewsBestDay,
			viewsBestDayTotal,
			query,
			siteSlug,
		} = this.props;
		const isLoading = requesting && ! views;

		let bestDay;

		if ( viewsBestDay && ! isLoading ) {
			bestDay = moment( viewsBestDay ).format( 'LL' );
		}

		const classes = {
			'is-loading': requesting
		};

		return (
			<div>
				{ siteId && <QuerySiteStats siteId={ siteId } statType="stats" query={ query } /> }
				<SectionHeader label={ translate( 'All-time posts, views, and visitors' ) } />
				<Card className={ classNames( 'stats-module', 'all-time', classes ) }>
					<StatsTabs borderless>
						<StatsTab
							gridicon="posts"
							label={ translate( 'Posts' ) }
							loading={ isLoading }
							value={ posts } />
						<StatsTab
							gridicon="visible"
							href={ `/stats/day/views/${ siteSlug }` }
							label={ translate( 'Views' ) }
							loading={ isLoading }
							value={ views } />
						<StatsTab
							gridicon="user"
							label={ translate( 'Visitors' ) }
							loading={ isLoading }
							value={ visitors } />
						<StatsTab
							className="all-time__is-best"
							gridicon="trophy"
							label={ translate( 'Best Views Ever' ) }
							loading={ isLoading }
							value={ viewsBestDayTotal }>
							<span className="all-time__best-day">{ bestDay }</span>
						</StatsTab>
					</StatsTabs>
				</Card>
			</div>
		);
	}
}

export default connect( ( state ) => {
	const siteId = getSelectedSiteId( state );
	const query = {};
	const allTimeData = getSiteStatsNormalizedData( state, siteId, 'stats', query ) || {};
	const allTimeStats = pick( allTimeData, [
		'posts',
		'views',
		'visitors',
		'viewsBestDay',
		'viewsBestDayTotal'
	] );

	return {
		requesting: isRequestingSiteStatsForQuery( state, siteId, 'stats', query ),
		siteSlug: getSiteSlug( state, siteId ),
		query,
		siteId,
		...allTimeStats
	};
} )( localize( StatsAllTime ) );
