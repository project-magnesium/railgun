import StyleSheet from 'react-native-media-query';
import { ImageStyle, TextStyle, ViewStyle } from 'react-native';
import isContentScript from './isContentScript';

type WebStyle = { transition?: string; cursor?: string };
export type StylePropertyInput =
    | ViewStyle
    | TextStyle
    | ImageStyle
    | WebStyle
    | { [k: string]: ViewStyle | TextStyle | ImageStyle | WebStyle };

export type StyleProperty = ViewStyle | TextStyle | ImageStyle | { [k: string]: ViewStyle | TextStyle | ImageStyle };

type ResponsiveStyleProperty = {
    xs: StylePropertyInput;
    s?: StylePropertyInput;
    m?: StylePropertyInput;
    l?: StylePropertyInput;
    xl?: StylePropertyInput;
};

type ResponsiveNamedStyles<T> = {
    [P in keyof T]: ResponsiveStyleProperty;
};

type NamedStyles<T> = {
    [P in keyof T]: StylePropertyInput;
};

const getStylesWithMediaQuery = (styles: StylePropertyInput | undefined, width: number) => {
    if (!styles) return {};
    if (isContentScript()) return {};
    return {
        [`@media (min-width: ${width}px)`]: styles,
    };
};
const small = (styles: StylePropertyInput | undefined) => {
    return getStylesWithMediaQuery(styles, 576);
};
const medium = (styles: StylePropertyInput | undefined) => {
    return getStylesWithMediaQuery(styles, 768);
};
const large = (styles: StylePropertyInput | undefined) => {
    return getStylesWithMediaQuery(styles, 992);
};
const extraLarge = (styles: StylePropertyInput | undefined) => {
    return getStylesWithMediaQuery(styles, 1200);
};

type GeneratedStyles<T> = {
    [P in keyof T]: {
        styles: StyleProperty;
        dataSet: {
            media: string;
        };
    };
};

function createStyles<T extends ResponsiveNamedStyles<T> | ResponsiveNamedStyles<any>>(
    responsiveStyles: T | ResponsiveNamedStyles<T>
) {
    const finalStyles: NamedStyles<any> = {};

    for (const key in responsiveStyles) {
        const { xs, s, m, l, xl } = responsiveStyles[key];

        const smallStyles = small(s);
        const mediumStyles = medium(m);
        const largeStyles = large(l);
        const extraLargeStyles = extraLarge(xl);

        finalStyles[key] = {
            ...xs,
            ...smallStyles,
            ...mediumStyles,
            ...largeStyles,
            ...extraLargeStyles,
        };
    }

    // Ignore the typescript error below to accept the transition property. This does not cause issues on mobile and is simply ignored.
    // @ts-ignore
    const generatedStyles = StyleSheet.create(finalStyles);
    const styles = {};
    for (const key in generatedStyles.styles) {
        // Ignore the typescript error below to accept pseudo selectors
        // @ts-ignore
        styles[key] = { styles: generatedStyles.styles[key], dataSet: { media: generatedStyles.ids[key] } };
    }

    return styles as GeneratedStyles<T>;
}

export default createStyles;
