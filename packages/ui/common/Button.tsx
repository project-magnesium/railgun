import React from 'react';
import { Pressable, Platform, PressableProps, View, ActivityIndicator } from 'react-native';
import createStyles, { StylePropertyInput } from '../utils/createStyles';
import isContentScript from '../utils/isContentScript';
import { Text } from './Text';
import { theme } from '../utils/theme';

const BASE_STYLES: StylePropertyInput = {
    alignSelf: Platform.OS === 'web' ? 'auto' : 'flex-start',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    padding: theme.spacing(1.25),
    width: Platform.OS === 'web' ? 'fit-content' : 'auto',
    borderRadius: 4,
    cursor: 'pointer',
    transition: 'background-color 0.2s ease-in-out',
};

type ButtonContentsProps = {
    variant?: 'text' | 'contained' | 'outlined';
    title: string;
    isDisabled?: boolean;
};

const ButtonContents: React.FC<ButtonContentsProps> = (props) => {
    const { variant, title, isDisabled } = props;

    const styles = createStyles({
        text: {
            xs: {
                color: variant === 'text' ? theme.palette.common.black : theme.palette.common.white,
                cursor: 'pointer',
                pointerEvents: isDisabled ? 'none' : 'auto',
            },
        },
    });

    return (
        <Text extraStyle={styles.text.styles} dataSet={styles.text.dataSet}>
            {title}
        </Text>
    );
};

type ButtonProps = PressableProps & {
    variant?: 'text' | 'contained' | 'outlined';
    title: string;
    isLoading?: boolean;
    isDisabled?: boolean;
    extraStyle?: StylePropertyInput;
};

export const Button: React.FC<ButtonProps> = (props) => {
    const { variant, title, isLoading, isDisabled, extraStyle } = props;

    const styles = createStyles({
        button: {
            xs: {
                ...BASE_STYLES,
                backgroundColor: variant === 'text' ? 'transparent' : theme.palette.primary.main,
                opacity: isLoading || isDisabled ? 0.5 : 1,
                pointerEvents: isLoading || isDisabled ? 'none' : 'auto',
                ':hover': {
                    backgroundColor: variant === 'text' ? 'transparent' : theme.palette.primary.dark,
                },
                ...extraStyle,
            },
        },
    });

    return (
        <Pressable
            style={styles.button.styles}
            dataSet={styles.button.dataSet}
            disabled={isLoading || isDisabled}
            {...props}
        >
            {isLoading && (
                <ActivityIndicator
                    style={{ paddingRight: theme.spacing(0.5) }}
                    size={theme.typography.fontSize}
                    color={theme.palette.common.white}
                />
            )}
            <ButtonContents variant={variant} title={title} isDisabled={isLoading || isDisabled} />
        </Pressable>
    );
};

type LinkButtonProps = ButtonProps & {
    to: string;
};

export const LinkButton: React.FC<LinkButtonProps> = (props) => {
    const { to, variant, title, isLoading, isDisabled, extraStyle } = props;

    const styles = createStyles({
        button: {
            xs: {
                ...BASE_STYLES,
                backgroundColor: variant === 'text' ? 'transparent' : theme.palette.primary.main,
                opacity: isLoading || isDisabled ? 0.5 : 1,
                ...extraStyle,
            },
        },
    });

    return Platform.OS === 'web' && !isContentScript() ? (
        <a href={`/app/${to}`} style={{ textDecoration: 'none', width: 'fit-content' }}>
            <View style={styles.button.styles} dataSet={styles.button.dataSet}>
                <ButtonContents variant={variant} title={title} />
            </View>
        </a>
    ) : (
        <Button {...props} />
    );
};
