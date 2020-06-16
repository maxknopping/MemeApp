import React, { useContext } from 'react';
import { Text, View } from 'react-native';
import { Context } from '../context/AuthContext';
import EStyleSheet from 'react-native-extended-stylesheet';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

const Banned = ({
    navigation,
}) => { 
    const {state} = useContext(Context);
    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo('en-US');

    return (
    <View style={{flex: 1, alignItems: "center", justifyContent: 'center'}}>
        <Text style={styles.text}>You are banned</Text>
    <Text style={[styles.text, {fontSize: 15}]}>Your ban ends {new Date(state.banEnds).toLocaleDateString()}{' '}{new Date(state.banEnds).toLocaleTimeString()}</Text>
    </View>
    );
};

const styles = EStyleSheet.create({
    text: {
        color: '$textColor',
        fontSize: '2rem'
    }
});

export default Banned;
