import React, { useContext, useState } from 'react';
import { Text, View, TextInput, Alert } from 'react-native';
import {Button} from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Context } from '../context/AuthContext';
import auth from './../apis/auth';

const ForgotPassword = ({
    navigation,
}) => {
    const {state, changePassword} = useContext(Context);
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');

    const sendUsername = () => {
        auth.post(`/forgotPassword/${username}`, {}).then(
            function (response) {
                Alert.alert(
                    'Forgot Password',
                    `A temporary password was sent to ${response.data.email}`,
                    [
                      {text: 'Ok', onPress: () => navigation.navigate('TemporaryPassword', {username: username})},
                    ],
                    {cancelable: false},
                  );
            }
        ).catch(error => {
            setError(error.response.data);
        });
    }
    
    return(
        <View style={{flex: 1}}>
            <View style={styles.listContainer}>
                <Text style={styles.inputLabel}>Username</Text>
                <TextInput autoCorrect={false} autoCapitalize="none" 
                    style={styles.input} value={username} 
                    onChangeText={(text) => {
                        setUsername(text);
                    }}/>
            </View>
            <View style={{margin: 20}}>
                {error.length > 0 ? <Text style={styles.validator}>{error}</Text> : null}
            </View>
            <Button title="Get Temporary Password"
                buttonStyle={styles.submitButton} onPress={() => sendUsername()}/>
        </View>
    )
};

const styles = EStyleSheet.create({
    listContainer: {
        marginHorizontal: '1rem',
        flexDirection: 'row',
        borderBottomWidth: '.02rem',
        borderBottomColor: 'gray',
        paddingVertical: '1rem',
        flexWrap: 'wrap',
        alignItems: 'center'
    },
    inputLabel: {
        color: '$crimson',
        fontSize: '1rem',
        fontWeight: 'bold',
        marginRight: '1rem'
    },
    input: {
        width: "50%",
        padding: '.5rem',
        borderRadius: '.5rem',
        fontSize: '1rem',
        color: '$textColor'
    },
    submitButton: {
        backgroundColor: '$crimson',
        marginHorizontal: '1rem',
    },
    validator: {
        fontSize: '.8rem',
        color: '$crimson',
    }
});

ForgotPassword.navigationOptions = ({navigation}) => {
    return {
        title: 'Forgot Password',
        headerLeft: () => null
    }
}

export default ForgotPassword;
