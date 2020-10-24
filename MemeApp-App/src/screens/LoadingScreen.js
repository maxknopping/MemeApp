import React, { useEffect, useContext, useRef } from 'react';
import {Context as AuthContext} from '../context/AuthContext';
import { View, ActivityIndicator, StyleSheet, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import ConfettiCannon from 'react-native-confetti-cannon';

const LoadingScreen = ({navigation}) => {
    const {tryLocalSignIn} = useContext(AuthContext);
    const screenToNavigateTo = useRef(null);
    
    return (
        <View style={styles.view}>
            <Image style={{width: '100%', resizeMode: 'contain', alignSelf: 'center'}} source={ require('./img/MemeClub.png')}/>
            <ConfettiCannon onAnimationStart={async () => {
                
                screenToNavigateTo.current = await tryLocalSignIn();
                
            }} 
            onAnimationEnd={() => {
                console.log(screenToNavigateTo.current);
                navigation.navigate(screenToNavigateTo.current);
            }}
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