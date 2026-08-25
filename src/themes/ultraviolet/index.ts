import { buildCustomColorScheme } from 'themes/utils';

/** The Ultraviolet Purple color scheme. */
const theme = buildCustomColorScheme({
    palette: {
        background: {
            default: '#08050f',
            paper: '#151021'
        },
        primary: {
            main: '#7c4dff',
            dark: '#5d2fe0',
            light: '#ad8cff',
            contrastText: '#fff'
        },
        secondary: {
            main: '#d27bff',
            contrastText: '#0a0511'
        },
        text: {
            primary: '#f7f1ff',
            secondary: '#b9adc9'
        },
        action: {
            focus: 'rgba(124, 77, 255, 0.2)',
            hover: 'rgba(210, 123, 255, 0.1)'
        },
        divider: 'rgba(247, 241, 255, 0.12)',
        AppBar: {
            defaultBg: '#0e0918'
        },
        Button: {
            inheritContainedBg: '#211631',
            inheritContainedHoverBg: '#302047'
        },
        FilledInput: {
            bg: '#1b1228'
        },
        SnackbarContent: {
            bg: '#211631',
            color: '#f7f1ff'
        }
    }
});

export default theme;
