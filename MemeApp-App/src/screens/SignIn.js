import React, {useState, useContext, useEffect} from 'react';
import {View, StyleSheet, Image, TextInput, TouchableOpacity } from 'react-native';
import {Text, Button} from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Context as AuthContext} from './../context/AuthContext';

const SignIn = ({
    navigation,
}) => {
    const crimson = '#DC143C';
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setLoading] = useState(false);
    const {state, signin, tryLocalSignIn} = useContext(AuthContext);
    
    useEffect(() => {
        tryLocalSignIn();
    }, []);

    return (
        <View style={styles.container}>
            <Image style={styles.image} source={require('./img/logo.png')}/>
            <TextInput value={username} onChangeText={(text => setUsername(text))} 
                style={styles.username} placeholder="Username" autoCapitalize="none" autoCorrect={false}/>
            <TextInput value={password} onChangeText={(text => setPassword(text))} 
                secureTextEntry={true} style={styles.username} autoCapitalize="none" 
                placeholder="Password" autoCorrect={false}/>
            {state.errorMessage ? <Text style={{color: crimson}}>{state.errorMessage}</Text> : null}
            <Button loading={(state.errorMessage === null && isLoading || state.token === null && isLoading)} buttonStyle={{borderRadius: 10, backgroundColor: crimson}} style={styles.login} 
                title="Login" onPress={() => {
                    signin({username, password});
                    setLoading(true);
                }}/>
            <View style={styles.textContainer}>
                <Text style={styles.text}>Don't have an account? </Text>
                <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
                    <Text style={[styles.text, {color: crimson}]}>Sign Up</Text>
                </TouchableOpacity>
            </View>

        </View>);
};

const styles = EStyleSheet.create({
    container: {
        alignItems: 'center',
        flex: 1,
        justifyContent: 'center',
        marginBottom: '25%'
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
    text: {
        fontSize: '1.1rem'
    }
});

SignIn.navigationOptions = () => {
    return {
        headerShown: false
    };
} ;

export default SignIn;
