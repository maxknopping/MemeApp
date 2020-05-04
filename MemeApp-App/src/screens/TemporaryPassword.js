import React, { useContext, useState } from 'react';
import { Text, View, TextInput } from 'react-native';
import {Button} from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Context } from '../context/AuthContext';
import auth from './../apis/auth';

const TemporaryPassword = ({
    navigation,
}) => {
    
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const setPassword = () => {
        const username = navigation.getParam('username');
        auth.put(`/changeTempPassword`, {
            username: username,
            currentPassword: currentPassword,
            newPassword: newPassword
        }).then(
            function (response) {
                navigation.navigate('SignIn');
            }
        ).catch(error => {
            setError(error.response.data);
        });
    }
    
    return(
        <View style={{flex: 1}}>
            <View style={styles.listContainer}>
                <Text style={styles.inputLabel}>Temporary Password</Text>
                <TextInput style={[styles.input, {width: '45%'}]} secureTextEntry={true} value={currentPassword} 
                onChangeText={(text) => {
                    setCurrentPassword(text);
                }}/>
            </View>
            <View style={styles.listContainer}>
                <Text style={styles.inputLabel}>New Password</Text>
                <TextInput style={styles.input} secureTextEntry={true} value={newPassword} 
                onChangeText={(text) => {
                    setNewPassword(text);
                }}/>
                {newPassword.length < 8 ? <Text style={styles.validator}>Password must be longer than 8 characters</Text> : null}
            </View>
            <View style={styles.listContainer}>
                <Text style={styles.inputLabel}>Confirm Password</Text>
                <TextInput style={styles.input} secureTextEntry={true} value={confirmPassword} 
                onChangeText={(text) => {
                    setConfirmPassword(text);
                }}/>
                {newPassword !== confirmPassword ? <Text style={styles.validator}>Passwords must match</Text> : null}
            </View>
            <View style={{margin: 20}}>
                {error.length > 0 ? <Text style={styles.validator}>{error}</Text> : null}
            </View>
            <Button title="Change Password" disabled={newPassword !== confirmPassword || newPassword.length < 8} 
                buttonStyle={styles.submitButton} onPress={() => setPassword()}/>
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

TemporaryPassword.navigationOptions = ({navigation}) => {
    return {
        title: 'Change Password'
    }
}

export default TemporaryPassword;
