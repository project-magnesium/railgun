import React from 'react';
import { TextInput as RNTextInput, TextInputProps as RNTextInputProps } from 'react-native';
import createStyles, { StylePropertyInput } from '../utils/createStyles';
import { theme } from '../utils/theme';

type TextInputProps = RNTextInputProps & {
    extraStyle?: StylePropertyInput;
};

export const TextInput: React.FC<TextInputProps> = (props) => {
    const styles = createStyles({
        input: {
            xs: {
                padding: theme.spacing(1.25),
                borderWidth: 1,
                flex: 1,
                borderColor: '#0B111E1F',
                borderStyle: 'solid',
                borderRadius: 4,
                fontFamily: theme.typography.fontFamily,
                ...props.extraStyle,
            },
        },
    });

    return <RNTextInput style={styles.input.styles} dataSet={styles.input.dataSet} {...props} />;
};
