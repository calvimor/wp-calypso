/**
 * External dependencies
 */
import React from 'react';
import { connect } from 'react-redux';
import { localize } from 'i18n-calypso';
import page from 'page';

/**
 * Internal dependencies
 */
import HeaderCake from 'components/header-cake';
import ActionPanel from 'my-sites/site-settings/action-panel';
import ActionPanelTitle from 'my-sites/site-settings/action-panel/title';
import ActionPanelBody from 'my-sites/site-settings/action-panel/body';
import ActionPanelFooter from 'my-sites/site-settings/action-panel/footer';
import Notice from 'components/notice';
import Button from 'components/button';

let ThemeSetup = ( { translate, activeSiteDomain } ) => {
	const onBack = () => {
		page( '/settings/general/' + activeSiteDomain );
	};

	return (
		<div className="main main-column" role="main">
			<HeaderCake onClick={ onBack }><h1>{ translate( 'Theme Setup' ) }</h1></HeaderCake>
			<ActionPanel>
				<ActionPanelBody>
					<ActionPanelTitle>{ translate( 'Theme Setup' ) }</ActionPanelTitle>
					<Notice status="is-warning" showDismiss={ false }>
						{ translate( 'This action cannot be undone.' ) }
					</Notice>
					<p>{ translate( 'Getting your site to look like your theme\'s demo can be confusing. The Theme Setup tool will copy the demo site\'s settings over to your site automatically.' ) }</p>
					<p>{ translate( 'You can choose to start from scratch, in which Theme Setup {{strong}}deletes all of your existing content{{/strong}}, or you can save your current content. In either case, you will see some placeholder content which is needed by Theme Setup.', { components: { strong: <strong /> } } ) }</p>
				</ActionPanelBody>
				<ActionPanelFooter>
					<Button scary={ true } disabled={ true }>
						{ translate( 'Set Up From Scratch' ) }
					</Button>
					<Button disabled={ true }>
						{ translate( 'Set Up And Keep Content' ) }
					</Button>
				</ActionPanelFooter>
			</ActionPanel>
		</div>
	);
};

ThemeSetup = localize( ThemeSetup );


export default connect()( ThemeSetup );

