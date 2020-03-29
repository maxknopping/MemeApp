import React, { useContext, useState } from 'react';
import { Text, View, TextInput, Alert } from 'react-native';
import {Button} from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Context } from '../context/AuthContext';
import auth from './../apis/auth';

const ForgotUsername = ({
    navigation,
}) => {
    const {state, changePassword} = useContext(Context);
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');

    const getUsername = () => {
        auth.post(`/forgotUsername/${email}`, {}).then(
            function (response) {
                Alert.alert(
                    'Forgot Username',
                    'Check your email to receive your username.',
                    [
                      {text: 'Ok', onPress: () => navigation.navigate('SignIn')},
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
                <Text style={styles.inputLabel}>Email</Text>
                <TextInput autoCorrect={false} onSubmitEditing={() => getUsername()} blurOnSubmit={true} autoCapitalize="none" 
                    textContentType="emailAddress" returnKeyType="go" style={styles.input} value={email} 
                    onChangeText={(text) => {
                        setEmail(text);
                    }}/>
            </View>
            <View style={{margin: 20}}>
                {error.length > 0 ? <Text style={styles.validator}>{error}</Text> : null}
            </View>
            <Button title="Get Username"
                buttonStyle={styles.submitButton} onPress={() => getUsername()}/>
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
        fontSize: '1rem'
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

ForgotUsername.navigationOptions = ({navigation}) => {
    return {
        title: 'Forgot Username'
    }
}

export default ForgotUsername;
