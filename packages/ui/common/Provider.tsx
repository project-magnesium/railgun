import React from 'react';
import { View, Platform } from 'react-native';

import createStyles from '../utils/createStyles';
import { theme } from '../utils/theme';

const styles = createStyles({
    container: {
        xs: {
            display: 'flex',
            alignItems: 'center',
            width: '100%',
            height: Platform.OS === 'web' ? '100vh' : '100%',
            backgroundColor: theme.palette.background.default,
        },
    },
    innerContainer: {
        xs: {
            width: '100%',
            height: '100%',
            padding: theme.spacing(3),
        },
        xl: {
            maxWidth: 1200,
        },
    },
});

export const Provider: React.FC<React.PropsWithChildren> = ({ children }) => {
    return (
        <View style={styles.container.styles} dataSet={styles.container.dataSet}>
            <View style={styles.innerContainer.styles} dataSet={styles.innerContainer.dataSet}>
                {children}
            </View>
        </View>
    );
};
