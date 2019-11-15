import React from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

https://github.com/facebook/react-native/issues/10865#issuecomment-536757883
// Apply fix for newer react-native-webview not supporting window.postMessage
const webViewFix = function() {
  window.postMessage = function(data) {
    window.ReactNativeWebView.postMessage(data);
  };
};
const windowPostMessageFix = '(' + String(webViewFix) + ')();';

// fix https://github.com/facebook/react-native/issues/10865
const patchPostMessageJsCode = `(${String(function() {
    var originalPostMessage = window.postMessage
    var patchedPostMessage = function(message, targetOrigin, transfer) {
        originalPostMessage(message, targetOrigin, transfer)
    }
    patchedPostMessage.toString = function() {
        return String(Object.hasOwnProperty).replace('hasOwnProperty', 'postMessage')
    }
    window.postMessage = patchedPostMessage
})})();`


export default class MessageWebView extends React.Component {
    constructor(props) {
        super(props)
        this.postMessage = this.postMessage.bind(this)
    }
    postMessage(action) {
        this.WebView.postMessage(JSON.stringify(action))
    }

    getWebViewHandle = () => {
        return this.webview;
    }

    render() {
        const { html, source, url, onMessage, ...props } = this.props

        return (
            <View style={props.containerStyle}>
            <WebView
                {...props}
                style={props.containerStyle}
                javaScriptEnabled
                automaticallyAdjustContentInsets
                injectedJavaScript={[
                    windowPostMessageFix,
                    patchPostMessageJsCode
                ].join('')}
                source={source ? source : html ? { html } : url}
                ref={x => {this.webview = x}}
                onMessage={e => onMessage(e.nativeEvent.data)}

            />
            </View>
        )
    }
}
