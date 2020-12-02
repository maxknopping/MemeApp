import React, { useEffect, useContext, useRef } from 'react';
import {Context as AuthContext} from '../context/AuthContext';
import { View, ActivityIndicator, StyleSheet, Image, Vibration } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConfettiCannon from 'react-native-confetti-cannon';

const LoadingScreen = ({navigation}) => {
    const {tryLocalSignIn} = useContext(AuthContext);
    const screenToNavigateTo = useRef(null);
    const confettiCannon = useRef(null);
    useEffect( () => {
        async function load() {
            screenToNavigateTo.current = await tryLocalSignIn();
            if (confettiCannon.current != null) {
                confettiCannon.current.start();
                Vibration.vibrate();
            }
        }

        load();
    }, []);
    
    return (
        <View style={styles.view}>
            <Image style={{width: '100%', resizeMode: 'contain', alignSelf: 'center'}} source={ require('./img/MemeClub.png')}/>
            <ConfettiCannon
            autoStart={false}
            onAnimationEnd={() => {
                console.log(screenToNavigateTo.current);
                navigation.navigate(screenToNavigateTo.current);
            }}
            ref={confettiCannon}
            count={500} origin={{x: -10, y: 0}} colors={[EStyleSheet.value('$crimson'), 'black', 'white', 'gray']}/>
        </View>
    );
}

const styles = StyleSheet.create({
    view: {
        justifyContent: 'center',
        flex: 1,
        backgroundColor: 'black'
    }
});

export default LoadingScreen;