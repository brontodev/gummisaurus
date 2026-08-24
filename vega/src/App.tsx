import {
  useHideSplashScreenCallback,
  usePreventHideSplashScreen,
} from '@amazon-devices/react-native-kepler';
import {WebView} from '@amazon-devices/webview';
import type {
  SslErrorData,
  WebViewErrorEvent,
  WebViewHttpErrorEvent,
  WebViewNavigationEvent,
} from '@amazon-devices/webview/dist/types/WebViewTypes';
import * as React from 'react';
import {useRef} from 'react';
import {StyleSheet, View} from 'react-native';

export const App = () => {
  const webRef = useRef(null);

  usePreventHideSplashScreen();
  const hideSplashScreen = useHideSplashScreenCallback();

  return (
    <View style={styles.container}>
      <WebView
        ref={webRef}
        style={styles.webview}
        allowSystemKeyEvents
        allowsDefaultMediaControl
        domStorageEnabled
        hasTVPreferredFocus
        javaScriptEnabled
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="compatibility"
        source={{uri: 'file:///pkg/assets/web/index.html'}}
        onLoad={(_event: WebViewNavigationEvent) => {
          hideSplashScreen();
        }}
        onError={({
          nativeEvent: {code, url, description},
        }: WebViewErrorEvent) => {
          console.error(`[WebView] (${code}: ${url}) ${description}`);
        }}
        onHttpError={({
          nativeEvent: {url, statusCode, description},
        }: WebViewHttpErrorEvent) => {
          console.error(`[WebView HTTP] (${statusCode}: ${url}) ${description}`);
        }}
        onSslError={({code, url, description}: SslErrorData) => {
          console.error(`[WebView TLS] (${code}: ${url}) ${description}`);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  webview: {backgroundColor: '#101010'},
});
