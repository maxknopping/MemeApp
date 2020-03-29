import React, { useState, useContext, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, SafeAreaView, ScrollView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { Button, Overlay } from 'react-native-elements';
import userService from './../apis/user';
import { Context } from '../context/AuthContext';
import getPermissions from './../helpers/getPermissions';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import axios from 'axios';
import {Buffer} from 'buffer';



const EditProfile = ({
    navigation
}) => {
    const username = navigation.getParam('username');
    const {state, changeUsername} = useContext(Context);
    const [user, setUser] = useState(null);
    const [choosePictureOverlay, setPictureOverlay] = useState(false);
    const [base64, setBase64] = useState('');
    const [whatHasChanged, setWhatHasChanged] = useState({profilePicture: false, bio: false, username: false, email: false});
    const [bioHeight, setBioHeight] = useState(0);
    const [errorMessage, setErrorMessage] = useState('');

    useEffect(() => {
        userService.get(`/username/${username}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                setUser(response.data);
            }
        ).catch(error => console.log(error));
    }, []);

    const options = {
        allowsEditing: true,
        base64: true
      };
      
    const takePhoto = async () => {
      const status = await getPermissions(Permissions.CAMERA);
      if (status) {
        const result = await ImagePicker.launchCameraAsync(options);
        if (!result.cancelled) {
            let newUser = user;
            newUser.photoUrl = result.uri;
            setUser(newUser);
            setPictureOverlay(false);
            setWhatHasChanged({...whatHasChanged, profilePicture: true});
            setBase64(result.base64);
        }
      }
    };

    const selectPhoto = async () => {
        const status = await getPermissions(Permissions.CAMERA_ROLL);
        if (status) {
          const result = await ImagePicker.launchImageLibraryAsync(options);
          if (!result.cancelled) {
            let newUser = user;
            newUser.photoUrl = result.uri;
            setUser(newUser);
            setPictureOverlay(false);
            setWhatHasChanged({...whatHasChanged, profilePicture: true});
            setBase64(result.base64);
          }
        }
      };

      const saveChanges = async () => {
            if (whatHasChanged.profilePicture) {
                userService.post(`${state.id}/posts/profilePicture/ios` , {
                    file: base64,
                }, {
                    headers: {
                        'Authorization': `Bearer ${state.token}`
                    }
                }).then(
                    function (response) {
                        setWhatHasChanged({...whatHasChanged, profilePicture: false});
                    }
                ).catch(error => console.log(error));
            }


            if (whatHasChanged.bio || whatHasChanged.email || whatHasChanged.username) {
                userService.put(`${state.id}`, {
                    bio: user.bio,
                    email: user.email,
                    username: user.username
                }, {
                    headers: {
                        'Authorization': `Bearer ${state.token}`
                    }
                }).then(
                    function (response) {
                        if (whatHasChanged.username) {
                            changeUsername({newUsername: user.username});
                        }
                        setWhatHasChanged({...whatHasChanged, bio: false, username: false, email: false});
                        navigation.navigate('Profile', {username: user.username});
                    }
                ).catch(error => setErrorMessage(error.response.data));
            }
      };

    return (
        <ScrollView style={{flex: 1}}>
        {user ? 
            <View>
                <View style={[styles.listContainer, {alignItems: 'center'}]}>
                    <Image style={styles.image} source={user.photoUrl ? {uri: user.photoUrl} : 
                        require('./../../assets/user.png')}/>
                    <TouchableOpacity onPress={() => setPictureOverlay(true)}>
                        <Text style={styles.profilePictureText}>
                            Change Profile Picture
                        </Text>
                    </TouchableOpacity>
                    <Overlay isVisible={choosePictureOverlay} children={
                        <>
                        <Text onPress={selectPhoto} style={styles.text}>
                            Select Photo
                        </Text>
                        <Text onPress={takePhoto} style={styles.text}>
                            Take Photo
                        </Text>
                        <Text onPress={() => setPictureOverlay(false)} style={[styles.text, {color: '#DC143C'}]}>
                            Cancel
                        </Text>
                        </>
                    } onBackdropPress={() => setPictureOverlay(false)} height={'auto'} animationType={'fade'}>
                    </Overlay>
                </View>
                <View style={styles.listContainer}>
                    <Text style={styles.usernameLabel}>
                        Username
                    </Text>
                    <TextInput value={user.username} autoCorrect={false} autoCapitalize="none" onChangeText={(text) => {
                        let newUser = user;
                        newUser.username = text;
                        setUser(newUser);
                        setWhatHasChanged({...whatHasChanged, username: true});
                    }} style={styles.username}/>
                    {user.username.length > 30 ? <Text style={styles.validator}>Username must be less than 30 characters.</Text>: null}
                    {user.username.indexOf(' ') != -1 ? <Text style={styles.validator}>Username cannot have any spaces</Text> : null}
                    {user.username.length == 0 ? <Text style={styles.validator}>Username is required</Text> : null}
                </View>
                <View style={styles.listContainer}>
                    <Text style={styles.usernameLabel}>
                        Bio
                    </Text>
                    <TextInput value={user.bio} multiline onChangeText={(text) => {
                        let newUser = user;
                        newUser.bio = text;
                        setUser(newUser);
                        setWhatHasChanged({...whatHasChanged, bio: true});
                    }} style={styles.bio}/>
                </View>
                <View style={styles.listContainer}>
                    <Text style={styles.usernameLabel}>
                        Email
                    </Text>
                    <TextInput value={user.email} onChangeText={(text) => {
                        let newUser = user;
                        newUser.email = text;
                        setUser(newUser);
                        setWhatHasChanged({...whatHasChanged, email: true});
                    }} style={styles.bio} autoCapitalize="none" autoCorrect={false}/>
                    {!user.email.includes('@') || !user.email.includes('.') ?  
                <Text style={[styles.validator]}>Please enter a valid email address</Text> : null}
                </View>
                {errorMessage.length > 0 ? <Text style={[styles.validator, {alignSelf: 'center'}]}>{errorMessage}</Text> : null}
                <Button title='Save Changes' disabled={
                    (whatHasChanged.bio == false && 
                    whatHasChanged.email == false && whatHasChanged.username == false &&
                    whatHasChanged.profilePicture == false) || (!user.email.includes('@') || !user.email.includes('.')) || 
                    user.username.length > 30 || user.username.indexOf(' ') != -1 || user.username.length == 0
                
                } buttonStyle={styles.changePassword} 
                    disabledStyle={styles.saveChangesDisabled} onPress={() => saveChanges()}/>
            </View>
        : null}
        
        </ScrollView>
    );
};

const styles = EStyleSheet.create({
    image: {
        width: '20%',
        aspectRatio: 1,
        borderRadius: '10rem',
        resizeMode: 'contain'
    },
    listContainer: {
        marginHorizontal: '1rem',
        flexDirection: 'row',
        borderBottomWidth: '.02rem',
        borderBottomColor: 'gray',
        paddingVertical: '1rem',
        flexWrap: 'wrap'
    },
    profilePictureText: {
        marginVertical: '12%',
        marginHorizontal: '1rem',
        color: '$crimson',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    text: {
        padding: 24,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center'
    },
    username: {
        width: "70%",
        aspectRatio: 7 /1,
        padding: '.5rem',
        borderRadius: '.5rem',
        fontSize: '1rem'
    },
    usernameLabel: {
        paddingVertical: '.7rem',
        marginRight: '1rem',
        color: '$crimson',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    bio: {
        width: "75%",
        padding: '.5rem',
        borderRadius: '.5rem',
        fontSize: '1rem',
    },
    changePassword: {
        width: '80%',
        aspectRatio: 7/1,
        alignSelf: 'center',
        backgroundColor: '$crimson',
        borderRadius: '1rem',
        marginVertical: '1rem'
    },
    validator: {
        fontSize: '.8rem',
        color: '$crimson',
    },
    saveChangesDisabled: {
        width: '80%',
        aspectRatio: 7/1,
        alignSelf: 'center',
        backgroundColor: 'gray',
        borderRadius: '1rem',
        marginVertical: '1rem'
    }
});

EditProfile.navigationOptions = ({navigation}) => {
    return {
        title: 'Edit Profile'
    };
};

export default EditProfile;