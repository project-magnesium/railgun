import React from 'react';
import { View, Modal as RNModal, TouchableHighlight } from 'react-native';
import createStyles from '../utils/createStyles';
import isContentScript from '../utils/isContentScript';
import { theme } from '../utils/theme';

const styles = createStyles({
    container: {
        xs: {
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: '#0000001F',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: theme.spacing(3),
            cursor: 'pointer',
        },
    },
    innerTouchable: {
        xs: {
            width: '100%',
            maxWidth: 400,
        },
    },
    innerContainer: {
        xs: {
            display: 'flex',
            borderRadius: 4,
            backgroundColor: theme.palette.common.white,
            padding: theme.spacing(1.25),
            cursor: 'default',
        },
    },
});

type ModalProps = React.PropsWithChildren & {
    isOpen: boolean;
    onClose: () => void;
};

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
    if (!isOpen) {
        return null;
    }

    const renderContents = () => {
        return (
            <TouchableHighlight
                style={styles.container.styles}
                // @ts-ignore
                dataSet={styles.container.dataSet}
                onPress={onClose}
                activeOpacity={1}
                underlayColor="#0000001F"
            >
                <TouchableHighlight
                    style={styles.innerTouchable.styles}
                    // @ts-ignore
                    dataSet={styles.innerTouchable.dataSet}
                    activeOpacity={1}
                    underlayColor="#000000"
                >
                    <View style={styles.innerContainer.styles} dataSet={styles.innerContainer.dataSet}>
                        {children}
                    </View>
                </TouchableHighlight>
            </TouchableHighlight>
        );
    };

    return isContentScript() ? (
        renderContents()
    ) : (
        <RNModal visible={isOpen} transparent animationType="fade" onRequestClose={onClose} onDismiss={onClose}>
            {renderContents()}
        </RNModal>
    );
};
