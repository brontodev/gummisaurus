import type { ColorSystemOptions, ThemeOptions } from '@mui/material/styles';
import type {} from '@mui/material/themeCssVarsAugmentation';

const LIST_ICON_WIDTH = 36;

/** The default Gummisaurus color scheme. */
export const DEFAULT_COLOR_SCHEME: ColorSystemOptions = {
    palette: {
        mode: 'dark',
        primary: {
            main: '#4d5fff',
            dark: '#4050da',
            light: '#925cff',
            contrastText: '#fff'
        },
        secondary: {
            main: '#62dfff',
            contrastText: '#05050a'
        },
        background: {
            default: '#05050a',
            paper: '#12121c'
        },
        text: {
            primary: '#f4f1ea',
            secondary: '#9d9ba6'
        },
        action: {
            focus: 'rgba(98, 223, 255, 0.13)',
            hover: 'rgba(244, 241, 234, 0.075)',
            selectedOpacity: 0.2
        },
        divider: 'rgba(244, 241, 234, 0.09)',
        starIcon: {
            main: '#f2b01e' // Yellow color
        },
        error: {
            main: '#c62828' // Red color
        },
        AppBar: {
            defaultBg: '#101019'
        }
    }
};

/** The default customizations to the default MUI theme. */
export const DEFAULT_THEME_OPTIONS: ThemeOptions = {
    typography: {
        fontFamily: '"Noto Sans", sans-serif',
        button: {
            textTransform: 'none'
        },
        h1: {
            fontSize: '1.8rem'
        },
        h2: {
            fontSize: '1.5rem'
        },
        h3: {
            fontSize: '1.17rem'
        }
    },
    components: {
        MuiAlert: {
            styleOverrides: {
                message: {
                    // NOTE: This seems like a bug. Block content does not fill the container width.
                    flexGrow: 1
                }
            }
        },
        MuiAppBar: {
            styleOverrides: {
                colorTransparent: ({ theme }) => ({
                    color: theme.vars.palette.text.primary
                })
            }
        },
        MuiButton: {
            defaultProps: {
                variant: 'contained'
            },
            variants: [
                {
                    props: {
                        size: 'large'
                    },
                    style: {
                        fontSize: '1rem',
                        fontWeight: 'bold'
                    }
                }
            ]
        },
        MuiFormControl: {
            defaultProps: {
                variant: 'filled'
            }
        },
        MuiFormHelperText: {
            styleOverrides: {
                root: {
                    fontSize: '1rem'
                }
            }
        },
        MuiTextField: {
            defaultProps: {
                variant: 'filled'
            }
        },
        MuiListItemIcon: {
            styleOverrides: {
                root: {
                    minWidth: LIST_ICON_WIDTH
                }
            }
        },
        MuiListSubheader: {
            styleOverrides: {
                root: {
                    // NOTE: Added for drawer subheaders, but maybe it won't work in other cases?
                    backgroundColor: 'inherit',
                    position: 'initial'
                }
            }
        },
        MuiListItemText: {
            styleOverrides: {
                inset: {
                    paddingLeft: LIST_ICON_WIDTH
                }
            }
        }
    }
};
