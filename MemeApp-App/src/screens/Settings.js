import React, { useContext } from 'react';
import { Text, View, ScrollView, TouchableOpacity,Linking } from 'react-native';
import {Card} from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Context } from '../context/AuthContext';

const Settings = ({
    navigation,
}) => {
    const {signout} = useContext(Context);
    const baseUrl = 'https://memeclub.co';

    const onGetTermsAndConditions = async () => {
        return Linking.openURL(baseUrl + '/terms');
    };

    const onGetPrivacyPolicy = async () => {
        return Linking.openURL(baseUrl + '/privacy');
    };

    return (
        <ScrollView>
            <Card containerStyle={{margin: 0, backgroundColor: EStyleSheet.value('$backgroundColor')}}>
                <TouchableOpacity onPress={() => navigation.navigate('ChangePassword')}>
                    <Text style={styles.changePassword}>Change Password</Text>
                </TouchableOpacity>
            </Card>
            <Card containerStyle={{margin: 0, backgroundColor: EStyleSheet.value('$backgroundColor')}}>
                <TouchableOpacity onPress={onGetPrivacyPolicy}>
                    <Text style={styles.changePassword}>Privacy Policy</Text>
                </TouchableOpacity>
            </Card>
            <Card containerStyle={{margin: 0, backgroundColor: EStyleSheet.value('$backgroundColor')}}>
                <TouchableOpacity onPress={onGetTermsAndConditions}>
                    <Text style={styles.changePassword}>Terms and Conditions</Text>
                </TouchableOpacity>
            </Card>
            <Card containerStyle={{margin: 0, backgroundColor: EStyleSheet.value('$backgroundColor')}}>
                <TouchableOpacity onPress={() => navigation.navigate('Blocked')}>
                    <Text style={styles.changePassword}>Blocked Users</Text>
                </TouchableOpacity>
            </Card>
            <Card containerStyle={{margin: 0, backgroundColor: EStyleSheet.value('$backgroundColor')}}>
                <TouchableOpacity onPress={signout}>
                    <Text style={styles.logOut}>Log Out</Text>
                </TouchableOpacity>
            </Card>
        </ScrollView>
    );
};

const styles = EStyleSheet.create({
    logOut: {
        fontSize: '1rem',
        alignSelf: 'center',
        color: '$crimson'
    },
    changePassword: {
        fontSize: '1rem',
        alignSelf: 'center',
        color: '$textColor'
    }
});

export default Settings;
