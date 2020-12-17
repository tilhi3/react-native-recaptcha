import React from 'react'
import { View } from 'react-native'
import { WebView } from 'react-native-webview'

const getCaptchaContent = (siteKey: string, action: string) => {
  return `<!DOCTYPE html>
    <html>
      <head> 
        <style>  .text-xs-center { text-align: center; } .g-recaptcha { display: inline-block; } </style>
        <script src="https://www.google.com/recaptcha/api.js?render=${siteKey}"></script>
        <script type="text/javascript">
          grecaptcha.ready(function() {
            //execute invisible recaptcha
            window.grecaptcha.execute('${siteKey}', { action: '${action}' })
            .then(function(args) {
              window.ReactNativeWebView.postMessage(args);
            });
          }); 
        </script>
      </head>
    </html>`;
};

export default class MessageWebView extends React.Component {
  constructor(props) {
    super(props);
    this.reloadCaptcha = this.reloadCaptcha.bind(this);
    this.state = {
      reloadCount: 0,
    };
  }

  reloadCaptcha() {
    this.setState({reloadCount: this.state.reloadCount + 1});
  }

  render() {
    const { html, source, url, onMessage, ...props } = this.props

    return (
      <View style={props.containerStyle}>
        <WebView
          {...props}
          key={`try-${this.state.reloadCount}`}
          style={props.containerStyle}
          javaScriptEnabled
          originWhitelist={['*']}
          automaticallyAdjustContentInsets
          mixedContentMode={'always'}
          source={{
            html: getCaptchaContent(this.props.siteKey, this.props.action),
            baseUrl: this.props.url
          }}
          onMessage={e => onMessage(e.nativeEvent.data)}
        />
      </View>
    );
  }
}
