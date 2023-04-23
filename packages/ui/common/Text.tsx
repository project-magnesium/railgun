import React from 'react';
import { Text as RNText, TextProps as RNTextProps } from 'react-native';
import createStyles, { StylePropertyInput } from '../utils/createStyles';
import { theme } from '../utils/theme';

type TextProps = RNTextProps & {
    extraStyle?: StylePropertyInput;
};

export const Text: React.FC<Omit<TextProps, 'style'>> = (props) => {
    const styles = createStyles({
        text: {
            xs: {
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.fontSize,
                ...props.extraStyle,
            },
        },
    });
    return <RNText {...props} style={styles.text.styles} dataSet={styles.text.dataSet} />;
};
