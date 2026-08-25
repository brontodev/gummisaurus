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
import {useState} from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

type LoadState = 'loading' | 'ready' | 'error';

const WEB_CLIENT_URL = 'file:///pkg/assets/web/index.html';

export const App = () => {
  const [loadState, setLoadState] = useState<LoadState>('loading');
  const [loadError, setLoadError] = useState('');
  const [reloadKey, setReloadKey] = useState(0);
  const [retryFocused, setRetryFocused] = useState(false);

  usePreventHideSplashScreen();
  const hideSplashScreen = useHideSplashScreenCallback();

  const showLoadError = (message: string) => {
    setLoadError(message);
    setLoadState('error');
    hideSplashScreen();
  };

  return (
    <View style={styles.container}>
      <WebView
        key={reloadKey}
        testID="gummisaurus-webview"
        style={styles.webview}
        allowSystemKeyEvents
        allowsDefaultMediaControl
        domStorageEnabled
        hasTVPreferredFocus
        javaScriptEnabled
        mediaPlaybackRequiresUserAction={false}
        mixedContentMode="compatibility"
        source={{uri: WEB_CLIENT_URL}}
        onLoadStart={() => {
          setLoadState('loading');
        }}
        onLoad={(_event: WebViewNavigationEvent) => {
          setLoadError('');
          setLoadState('ready');
          hideSplashScreen();
        }}
        onError={({
          nativeEvent: {code, url, description},
        }: WebViewErrorEvent) => {
          const message = `(${code}: ${url}) ${description}`;
          if (url !== WEB_CLIENT_URL) {
            console.log(`[WebView resource] ${message}`);
            return;
          }

          console.error(`[WebView] ${message}`);
          showLoadError(
            description || 'The bundled web interface failed to load.',
          );
        }}
        onHttpError={({
          nativeEvent: {url, statusCode, description, isMainFrame},
        }: WebViewHttpErrorEvent) => {
          const message = `(${statusCode}: ${url}) ${description}`;
          if (isMainFrame) {
            console.error(`[WebView HTTP] ${message}`);
          } else {
            console.log(`[WebView HTTP resource] ${message}`);
          }
        }}
        onSslError={({code, url, description}: SslErrorData) => {
          console.error(`[WebView TLS] (${code}: ${url}) ${description}`);
        }}
      />
      {loadState === 'loading' && (
        <View testID="gummisaurus-loading" style={styles.overlay}>
          <ActivityIndicator color="#62dfff" size="large" />
          <Text style={styles.loadingText}>Starting Gummisaurus</Text>
        </View>
      )}
      {loadState === 'error' && (
        <View testID="gummisaurus-error" style={styles.overlay}>
          <Text style={styles.errorTitle}>Gummisaurus could not start</Text>
          <Text style={styles.errorText}>{loadError}</Text>
          <Pressable
            accessibilityRole="button"
            hasTVPreferredFocus
            onBlur={() => setRetryFocused(false)}
            onFocus={() => setRetryFocused(true)}
            onPress={() => {
              setLoadError('');
              setLoadState('loading');
              setReloadKey((key) => key + 1);
            }}
            style={[
              styles.retryButton,
              retryFocused && styles.retryButtonFocused,
            ]}>
            <Text style={styles.retryText}>Try again</Text>
          </Pressable>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#05050a',
    flex: 1,
  },
  webview: {
    backgroundColor: '#05050a',
    flex: 1,
  },
  overlay: {
    alignItems: 'center',
    backgroundColor: '#05050a',
    bottom: 0,
    justifyContent: 'center',
    left: 0,
    padding: 48,
    position: 'absolute',
    right: 0,
    top: 0,
  },
  loadingText: {
    color: '#f4f1ea',
    fontSize: 28,
    marginTop: 24,
  },
  errorTitle: {
    color: '#f4f1ea',
    fontSize: 40,
    fontWeight: '700',
    textAlign: 'center',
  },
  errorText: {
    color: '#9d9ba6',
    fontSize: 24,
    marginTop: 16,
    maxWidth: 720,
    textAlign: 'center',
  },
  retryButton: {
    backgroundColor: '#4d5fff',
    borderColor: 'transparent',
    borderRadius: 12,
    borderWidth: 4,
    marginTop: 32,
    paddingHorizontal: 36,
    paddingVertical: 16,
    transform: [{scale: 1}],
  },
  retryButtonFocused: {
    borderColor: '#8de8ff',
    transform: [{scale: 1.08}],
  },
  retryText: {
    color: '#fff',
    fontSize: 26,
    fontWeight: '700',
  },
});
