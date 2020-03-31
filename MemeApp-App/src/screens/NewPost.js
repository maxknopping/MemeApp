import React, { useState, useContext, useEffect } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, SafeAreaView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { Button } from 'react-native-elements';
import userService from './../apis/user';
import { Context } from '../context/AuthContext';
import axios from 'axios';
import { FileUploader, FileItem } from 'ng2-file-upload';
import {Buffer} from 'buffer';



const NewPost = ({
    navigation,
}) => {
    const {state} = useContext(Context);
    const image = navigation.getParam('image');
    const base64 = navigation.getParam('base64')
    const [caption, setCaption] = useState('');
    const [stateUploader, setUploader] = useState({});

    const post = (photo) => {
        userService.post(`${state.id}/posts/ios` , {
            file: photo,
            caption: caption
        }, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(() => {
                navigation.navigate('UploadPost');
                console.log(navigation);
        }
        ).catch(error => console.log(error));
    };

    return (
        <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <Image source={{uri: image}} style={styles.image}/>
            <TextInput style={styles.textInput} placeholder="Add a caption..." multiline 
                value={caption}
                onChangeText={(text) => setCaption(text)}/>
        </View>
        <View style={styles.containerBottom}>
            <Button onPress={() => post(base64)} title="Post" buttonStyle={styles.postButton} style={styles.postButton}>
                    <Text>{'Post'}</Text>
            </Button>
        </View>
        </SafeAreaView>
        );
};

NewPost.navigationOptions = ({navigation}) => {
    return {
        title: 'New Post'
    };
};

const styles = EStyleSheet.create({
    safeArea: {
        flex: 1,
    },
    containerBottom: {
        flex: 4
    },
    shareIcon: {
        fontSize: '1.7rem',
        marginRight: '1rem'
    },
    postButton: {
        marginHorizontal: '1rem',
        backgroundColor: '$crimson',
        borderRadius: '1rem'
    },
    container: {
        flexDirection: 'row',
        flex: 1,
        margin: '1rem'
    },
    image: {
        width: '30%',
        aspectRatio: 1,
        resizeMode: 'contain',
        backgroundColor: 'black'
    },
    textInput: {
        width: '60%',
        aspectRatio: 1.7143/1,
        marginLeft: '1rem'
    }
});

export default NewPost;