import React from 'react';
import { Image as RNImage, ImageStyle } from 'react-native';
import isContentScript from '../utils/isContentScript';
import createStyles from '../utils/createStyles';

type ImageProps = {
    source: string;
    extraStyle?: ImageStyle;
};

export const Image: React.FC<ImageProps> = ({ source, extraStyle }) => {
    const namedStyles = createStyles({
        image: {
            xs: {
                height: '100%',
                ...extraStyle,
            },
        },
    });

    return isContentScript() ? (
        <img src={source} style={extraStyle as React.CSSProperties} />
    ) : (
        <RNImage
            source={{ uri: source }}
            style={namedStyles.image.styles as ImageStyle}
            dataSet={namedStyles.image.dataSet}
        />
    );
};
