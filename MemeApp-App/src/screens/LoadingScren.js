import React, { useEffect, useContext } from 'react';
import {Context as AuthContext} from '../context/AuthContext';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';

const LoadingScreen = () => {
    const {tryLocalSignIn} = useContext(AuthContext);

    useEffect(() => {
        tryLocalSignIn();
    } , []);
    
    return (
        <View style={styles.view}>
            <ActivityIndicator size="large" color={EStyleSheet.value('$crimson')}/>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        justifyContent: 'center',
        flex: 1
    }
});

export default LoadingScreen;