import { buildCustomColorScheme } from 'themes/utils';

/** The Sunflower Yellow color scheme. */
const theme = buildCustomColorScheme({
    palette: {
        background: {
            default: '#090806',
            paper: '#18150d'
        },
        primary: {
            main: '#f5c542',
            dark: '#c99a16',
            light: '#ffe18a',
            contrastText: '#151007'
        },
        secondary: {
            main: '#ffdf6e',
            contrastText: '#151007'
        },
        text: {
            primary: '#fff8df',
            secondary: '#c8bea1'
        },
        action: {
            focus: 'rgba(245, 197, 66, 0.18)',
            hover: 'rgba(255, 225, 138, 0.09)'
        },
        divider: 'rgba(255, 248, 223, 0.12)',
        AppBar: {
            defaultBg: '#111008'
        },
        Button: {
            inheritContainedBg: '#242015',
            inheritContainedHoverBg: '#342d18'
        },
        FilledInput: {
            bg: '#1c190f'
        },
        SnackbarContent: {
            bg: '#242015',
            color: '#fff8df'
        }
    }
});

export default theme;
