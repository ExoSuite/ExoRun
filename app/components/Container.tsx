// components/Container.tsx
import React from 'react';
import {StyleSheet, View} from "react-native";

interface Props {
    children: React.ReactNode;
}

export default class Container extends React.Component<Props> {

    render() {
        const {children} = this.props;

        return (
            <View style={styles.container}>
                {children}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1
    }
});