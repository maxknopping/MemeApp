import React, {useState, useContext} from 'react';
import {View, StyleSheet, Image, TextInput, TouchableOpacity, KeyboardAvoidingView, Dimensions, Linking} from 'react-native';
import {Text, Button} from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Context as AuthContext} from './../context/AuthContext';
import {CheckBox} from 'react-native-elements';

const { height: fullHeight } = Dimensions.get('window');

const SignUp = ({
    navigation,
}) => {
    const crimson = '#DC143C';
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirm] = useState('');
    const [termsChecked, setTermsChecked] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setLoading] = useState(false);
    const {state, signup} = useContext(AuthContext);
    const [offest, setOffset] = useState(0);
    const theme = EStyleSheet.value('$backgroundColor');
    const baseUrl = 'http://localhost:4200';

    const onLayout = ({
        nativeEvent: { layout: { height } },
      }) => {
        const off = fullHeight - height;
        setOffset(off);
      };

    const onGetTermsAndConditions = async () => {
        return Linking.openURL(baseUrl + '/terms');
    };

    const onGetPrivacyPolicy = async () => {
        return Linking.openURL(baseUrl + '/privacy');
    };

    return (
        <View style={{flex: 1}} onLayout={onLayout}>
        <KeyboardAvoidingView keyboardVerticalOffset={offest} behavior={Platform.OS === "ios" ? "padding" : null}  enabled style={styles.container}>
            <Image style={styles.image} source={theme === 'white' ? require('./img/logo.png') : require('./img/MemeClub.png')}/>
            <TextInput value={username} placeholderTextColor="gray" onChangeText={(text => setUsername(text))} 
                style={styles.username} placeholder="Username" autoCapitalize="none" autoCorrect={false}
            />
            {username === '' ? 
                <Text style={[styles.validator, {color: crimson}]}>Username is required</Text> :
                username.length > 30 ?  
                <Text style={[styles.validator, {color: crimson}]}>Username must be less than 30 characters</Text> : 
                username.indexOf(' ') != -1 ? 
                <Text style={[styles.validator, {color: crimson}]}>Username cannot contain any spaces</Text>: null}
            <TextInput value={password} placeholderTextColor="gray" onChangeText={(text => setPassword(text))} 
                secureTextEntry={true} style={styles.username} autoCapitalize="none" 
                placeholder="Password" autoCorrect={false}/>
            {password.length < 8 ?  
                <Text style={[styles.validator, {color: crimson}]}>Password must be at least 8 characters</Text> : null}
            <TextInput value={confirmPassword} placeholderTextColor="gray" onChangeText={(text => setConfirm(text))} 
                secureTextEntry={true} style={styles.username} autoCapitalize="none" 
                placeholder="Confirm Password" autoCorrect={false}/>
            {confirmPassword !== password ?  
                <Text style={[styles.validator, {color: crimson}]}>Passwords must match</Text> 
                : null
            }
            <TextInput value={email} placeholderTextColor="gray" onChangeText={(text => setEmail(text))} 
                style={styles.username} autoCapitalize="none" 
                placeholder="Email Address" autoCorrect={false}/>
            {!email.includes('@') || !email.includes('.') ?  
                <Text style={[styles.validator, {color: crimson}]}>Please enter a valid email address</Text> : null}
            {state.errorMessage ? <Text style={{color: crimson}}>{state.errorMessage}</Text> : null}
            <TextInput value={name} placeholderTextColor="gray" onChangeText={(text => setName(text))} 
                style={styles.username} autoCapitalize="none" 
                placeholder="Name" autoCorrect={false}/>
            <View style={{width: '80%'}}>
            <CheckBox containerStyle={{backgroundColor: 'transparent', borderWidth: 0}} 
                title={
                    <View style={{flexDirection: 'row', flexWrap: 'wrap', marginLeft: 10}}>
                        <Text style={styles.text}>I agree to the </Text>
                        <TouchableOpacity onPress={onGetTermsAndConditions}>
                            <Text style={styles.linkText}>Terms and Conditions </Text>
                        </TouchableOpacity>
                        <Text style={styles.text}>and the{' '}</Text>
                        <TouchableOpacity onPress={onGetPrivacyPolicy}>
                            <Text style={styles.linkText}>Privacy Policy</Text>
                        </TouchableOpacity>
                    </View>
                }
                checked={termsChecked}
                textStyle={{color: EStyleSheet.value('$textColor')}}
                onIconPress={() => setTermsChecked(!termsChecked)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-thin"
                uncheckedColor={EStyleSheet.value('$crimson')}
                checkedColor={EStyleSheet.value('$crimson')}/>
            </View>
            <Button loading={(state.errorMessage === null && isLoading || state.token === null && isLoading)} 
                buttonStyle={{borderRadius: 10, backgroundColor: crimson}} 
                style={styles.login} 
                title="Sign Up" 
                disabled={username === '' || password.length < 8 || confirmPassword !== password || username.length > 30 ||
                    !email.includes('@') || !email.includes('.') || termsChecked === false}
                onPress={() => {
                    signup({username, email, password, name});
                    setLoading(true);
                }}/>
            <View style={styles.textContainer}>
                <TouchableOpacity onPress={() => navigation.navigate('SignIn')}>
                    <Text style={[styles.text, {color: crimson}]}>Go back to Login screen</Text>
                </TouchableOpacity>
            </View>

        </KeyboardAvoidingView>
        </View>

    );
};

const styles = EStyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        marginBottom: '20%'
    },
    image: {
        width: '70%',
        aspectRatio: 3.5 /1,
        resizeMode: 'contain'
    },
    username: {
        margin: '.5rem',
        width: "80%",
        aspectRatio: 7 /1,
        borderWidth: 1,
        borderColor: 'grey',
        padding: 10,
        borderRadius: 10,
        color: '$textColor'
    },
    login: {
        marginTop: '.5rem',
        width: "80%",
        aspectRatio: 7/ 1,
        alignSelf: 'center',
        fontSize: '1.1rem'
    },
    textContainer: {
        flexDirection: 'row'
    },
    linkText: {
        fontSize: '.9rem',
        color: '$crimson'
    },
    text: {
        fontSize: '.9rem',
        color: 'gray'
    },
    validator: {
        fontSize: '.9rem'
    }
});

SignUp.navigationOptions = ({navigation}) => {
    return {
        headerShown: false
    }
}

export default SignUp;
