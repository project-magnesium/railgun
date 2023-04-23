import React from 'react';
import isContentScript from '../utils/isContentScript';
import { Platform, Pressable } from 'react-native';

type LinkProps = {
    to: string;
    onPress?: () => void;
    children?: React.ReactNode;
};

export const Link: React.FC<LinkProps> = ({ to, onPress, children }) => {
    return Platform.OS === 'web' && !isContentScript() ? (
        <a href={`/app/${to}`} style={{ textDecoration: 'none' }}>
            {children}
        </a>
    ) : (
        <Pressable onPress={onPress}>{children}</Pressable>
    );
};
