import { Platform } from 'react-native';

export const theme = {
    palette: {
        common: {
            black: '#00000',
            white: '#ffffff',
        },
        primary: {
            main: '#177ddc',
            light: '#4da1ff',
            dark: '#004ba0',
        },
        background: {
            default: '#f8fbfe',
        },
    },
    typography: {
        fontFamily:
            Platform.OS === 'web'
                ? 'Roboto, Helvetica, Arial, sans-serif'
                : Platform.OS === 'ios'
                ? 'Helvetica'
                : 'Roboto',
        fontSize: 14,
        fontWeightLight: 300,
        fontWeightRegular: 400,
        fontWeightMedium: 500,
        fontWeightBold: 700,
    },
    spacing: (multiplier: number) => multiplier * 8,
};
