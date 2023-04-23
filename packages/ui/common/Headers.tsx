import React from 'react';
import { Text } from './Text';

import createStyles, { StylePropertyInput } from '../utils/createStyles';

type BaseHeaderProps = React.PropsWithChildren & {
    accessibilityLevel: 1 | 2 | 3 | 4 | 5 | 6;
    extraStyle?: StylePropertyInput;
};

const Header: React.FC<BaseHeaderProps> = ({ accessibilityLevel, children, extraStyle }) => {
    const styles = createStyles({
        1: {
            xs: {
                fontSize: 32,
                fontWeight: 'bold',
                marginBottom: 16,
                ...extraStyle,
            },
        },
        2: {
            xs: {
                fontSize: 24,
                fontWeight: 'bold',
                marginBottom: 12,
                ...extraStyle,
            },
        },
        3: {
            xs: {
                fontSize: 20,
                fontWeight: 'bold',
                marginBottom: 10,
                ...extraStyle,
            },
        },
        4: {
            xs: {
                fontSize: 16,
                fontWeight: 'bold',
                marginBottom: 8,
                ...extraStyle,
            },
        },
        5: {
            xs: {
                fontSize: 12,
                fontWeight: 'bold',
                marginBottom: 6,
                ...extraStyle,
            },
        },
        6: {
            xs: {
                fontSize: 11,
                fontWeight: 'bold',
                marginBottom: 4,
                ...extraStyle,
            },
        },
    });

    return (
        <Text
            extraStyle={styles[accessibilityLevel].styles}
            dataSet={styles[accessibilityLevel].dataSet}
            accessibilityRole="header"
            // @ts-ignore
            accessibilityLevel={accessibilityLevel}
        >
            {children}
        </Text>
    );
};

type HeaderProps = React.PropsWithChildren & {
    extraStyle?: StylePropertyInput;
};

export const H1: React.FC<HeaderProps> = ({ children, extraStyle }) => {
    return (
        <Header accessibilityLevel={1} extraStyle={extraStyle}>
            {children}
        </Header>
    );
};

export const H2: React.FC<HeaderProps> = ({ children, extraStyle }) => {
    return (
        <Header accessibilityLevel={2} extraStyle={extraStyle}>
            {children}
        </Header>
    );
};

export const H3: React.FC<HeaderProps> = ({ children, extraStyle }) => {
    return (
        <Header accessibilityLevel={3} extraStyle={extraStyle}>
            {children}
        </Header>
    );
};
export const H4: React.FC<HeaderProps> = ({ children, extraStyle }) => {
    return (
        <Header accessibilityLevel={4} extraStyle={extraStyle}>
            {children}
        </Header>
    );
};
export const H5: React.FC<HeaderProps> = ({ children, extraStyle }) => {
    return (
        <Header accessibilityLevel={5} extraStyle={extraStyle}>
            {children}
        </Header>
    );
};
export const H6: React.FC<HeaderProps> = ({ children, extraStyle }) => {
    return (
        <Header accessibilityLevel={6} extraStyle={extraStyle}>
            {children}
        </Header>
    );
};
