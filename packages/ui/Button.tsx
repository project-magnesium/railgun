import * as React from 'react';
import { Pressable, Text, View, Platform } from 'react-native';
import type { PressableProps } from 'react-native';

export const Button: React.FC<PressableProps> = (props) => {
    return (
        <View>
            <Pressable
                style={{
                    backgroundColor: 'red',
                    padding: 4,
                    display: 'flex',
                    width: Platform.OS === 'web' ? 'fit-content' : 'auto',
                    marginLeft: 4,
                    borderRadius: 4,
                }}
                {...props}
            >
                {props.children}
            </Pressable>
        </View>
    );
};

export const commonToken = 'common string';
