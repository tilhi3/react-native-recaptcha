import React, {Component} from 'react';
import MessageWebView from './MessageWebView';

type Props = {
  containerStyle: any,
  siteKey: string,
  url: string,
  action: string,
  onExecute: Function,
};

export default class ReCaptcha extends Component<Props> {

  static defaultProps = {
    onExecute: () => {},
    action: '',
    containerStyle: {
      width: '100%',
      height: '100%',
      zIndex: -1,
      position: 'relative',
      marginBottom: 30,
      backgroundColor: 'transparent',
    },
  };

  render() {
    const {
      containerStyle,
      siteKey,
      action,
      onExecute,
      url
    } = this.props;

    return (
      <MessageWebView 
        siteKey={siteKey}
        action={action}
        url={url}
        ref={(ref) => { this.webview = ref ;}}
        scalesPageToFit={true}
        containerStyle={containerStyle}
        onMessage={(message) => onExecute(message)}
      />
    );
  }
}
