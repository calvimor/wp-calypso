/**
 * External dependencies
 */
import debugFactory from 'debug';
import tinymce from 'tinymce/tinymce';

/**
 * Internal dependencies
 */
import { recordTracksEvent } from 'state/analytics/actions';

const debug = debugFactory( 'calypso:tinymce-plugins:wpcom-track-paste' );

const SOURCE_GOOGLE_DOCS = 'google_docs';
const SOURCE_UNKNOWN = 'unknown';

function trackPaste( editor ) {
	debug( 'init' );

	const store = editor.getParam( 'redux_store' );

	const isGoogleDocsType = type =>
		( type === 'application/x-vnd.google-docs-image-clip+wrapped' ) ||
		( type === 'application/x-vnd.google-docs-document-slice-clip+wrapped' );

	const getSource = types => types.some( isGoogleDocsType ) ? SOURCE_GOOGLE_DOCS : SOURCE_UNKNOWN;

	/**
	* Although types should be an array, some browsers -as Firefox- will pass a DOMStringList instead.
	*
	* @see [types]{@link https://html.spec.whatwg.org/multipage/interaction.html#datatransfer}
	* @see [DOMStringList]{@link https://developer.mozilla.org/en-US/docs/Web/API/DOMStringList}
	*
	* @param {String} mode 'html-editor' or 'visual-editor', indicates which editor was in use on paste.
	* @param {(Array|DOMStringList)} types The types the content is available to paste.
	*/
	const recordPasteEvent = ( mode, types ) => {
		debug( 'track paste event' );
		const typesAsArray = Array.from( types );
		store.dispatch( recordTracksEvent( 'calypso_editor_content_paste', {
			mode,
			types: typesAsArray.join( ', ' ),
			source: getSource( typesAsArray )
		} ) );
	};

	const onPasteFromTinyMCEEditor = event => recordPasteEvent( 'visual-editor', event.clipboardData.types );
	const onPasteFromHTMLEditor = event => recordPasteEvent( 'html-editor', event.clipboardData.types );

	editor.on( 'paste', onPasteFromTinyMCEEditor );
	const textarea = editor.getParam( 'textarea' );
	if ( textarea ) {
		textarea.addEventListener( 'paste', onPasteFromHTMLEditor );
	}

	editor.on( 'remove', () => {
		editor.off( 'paste', onPasteFromTinyMCEEditor );
		textarea.removeEventListener( 'paste', onPasteFromHTMLEditor );
	} );
}

export default ( ) => {
	tinymce.PluginManager.add( 'wpcom/trackpaste', trackPaste );
};
