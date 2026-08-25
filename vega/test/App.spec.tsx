import {fireEvent, render} from '@testing-library/react-native';
import * as React from 'react';

import {App} from '../src/App';

const mockHideSplashScreen = jest.fn();

jest.mock('@amazon-devices/webview', () => ({
  WebView: 'WebView',
}));

jest.mock('@amazon-devices/react-native-kepler', () => ({
  ActivityIndicator: 'ActivityIndicator',
  Pressable: 'Pressable',
  Text: 'Text',
  View: 'View',
  usePreventHideSplashScreen: jest.fn(),
  useHideSplashScreenCallback: jest.fn(() => mockHideSplashScreen),
  StyleSheet: {
    create: (styles: unknown) => styles,
    flatten: (style: unknown) => style,
  },
}));

describe('App', () => {
  beforeEach(() => {
    mockHideSplashScreen.mockClear();
    jest.spyOn(console, 'error').mockImplementation(() => undefined);
    jest.spyOn(console, 'log').mockImplementation(() => undefined);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('hides the loading state after the web client loads', () => {
    const {getByTestId, queryByTestId} = render(<App />);

    expect(getByTestId('gummisaurus-loading')).toBeTruthy();

    fireEvent(getByTestId('gummisaurus-webview'), 'load', {
      nativeEvent: {url: 'file:///pkg/assets/web/index.html'},
    });

    expect(queryByTestId('gummisaurus-loading')).toBeNull();
    expect(mockHideSplashScreen).toHaveBeenCalledTimes(1);
  });

  it('routes Fire TV remote and media controls to the web client', () => {
    const {getByTestId} = render(<App />);
    const webview = getByTestId('gummisaurus-webview');

    expect(webview.props.allowSystemKeyEvents).toBe(true);
    expect(webview.props.allowsDefaultMediaControl).toBe(true);
  });

  it('shows a recoverable error when the web client fails to load', () => {
    const {getByTestId, getByText} = render(<App />);

    fireEvent(getByTestId('gummisaurus-webview'), 'error', {
      nativeEvent: {
        code: -1,
        description: 'Web client unavailable',
        url: 'file:///pkg/assets/web/index.html',
      },
    });

    expect(getByTestId('gummisaurus-error')).toBeTruthy();
    expect(getByText('Web client unavailable')).toBeTruthy();
    expect(console.error).toHaveBeenCalledWith(
      '[WebView] (-1: file:///pkg/assets/web/index.html) Web client unavailable',
    );
    expect(mockHideSplashScreen).toHaveBeenCalledTimes(1);
  });

  it('keeps running when a dependent web resource fails to load', () => {
    const {getByTestId, queryByTestId} = render(<App />);

    fireEvent(getByTestId('gummisaurus-webview'), 'load', {
      nativeEvent: {url: 'file:///pkg/assets/web/index.html'},
    });
    fireEvent(getByTestId('gummisaurus-webview'), 'error', {
      nativeEvent: {
        code: -10,
        description: 'net::ERR_ACCESS_DENIED',
        url: 'file:///web/custom-theme.css?v=19',
      },
    });

    expect(queryByTestId('gummisaurus-error')).toBeNull();
    expect(console.log).toHaveBeenCalledWith(
      '[WebView resource] (-10: file:///web/custom-theme.css?v=19) net::ERR_ACCESS_DENIED',
    );
    expect(mockHideSplashScreen).toHaveBeenCalledTimes(1);
  });

  it('returns to loading when retry is pressed', () => {
    const {getByTestId, getByText, queryByTestId} = render(<App />);

    fireEvent(getByTestId('gummisaurus-webview'), 'error', {
      nativeEvent: {
        code: -1,
        description: 'Web client unavailable',
        url: 'file:///pkg/assets/web/index.html',
      },
    });
    fireEvent.press(getByText('Try again'));

    expect(queryByTestId('gummisaurus-error')).toBeNull();
    expect(getByTestId('gummisaurus-loading')).toBeTruthy();
  });
});
