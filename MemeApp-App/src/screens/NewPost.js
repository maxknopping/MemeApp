import React, { useState, useContext, useEffect, useRef } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, SafeAreaView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { Button, CheckBox } from 'react-native-elements';
import userService from './../apis/user';
import { Context } from '../context/AuthContext';
import axios from 'axios';
import {Buffer} from 'buffer';
import ViewShot from "react-native-view-shot";
import {ImageManipulator} from 'expo-image-crop';



const NewPost = ({
    navigation,
}) => {
    const {state} = useContext(Context);
    const [image, setImage] = useState(navigation.getParam('image'));
    const base64 = useRef('');
    const [caption, setCaption] = useState('');
    const [inJoust, setInJoust] = useState(false);
    const [cropperVisible, setCropperVisible] = useState(false);

    const post = (photo) => {
        userService.post(`${state.id}/posts/ios` , {
            file: photo,
            caption: caption,
            inJoust: inJoust
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

    useEffect(() => {
        let str = 'file://'
        str = str + image;
        setImage(str);
        setCropperVisible(true);
    }, [])

    return (
        <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <Image source={{uri: image}} style={styles.image}/>
            <TextInput style={styles.textInput} placeholderTextColor="gray" placeholder="Add a caption..." multiline 
                value={caption}
                onChangeText={(text) => setCaption(text)}/>
        </View>
        <View style={styles.containerBottom}>
            <CheckBox containerStyle={{backgroundColor: 'transparent', marginBottom: 20, marginTop: -10, borderWidth: 0}} 
                title="Include in Joust/Swipe" checked={inJoust}
                textStyle={{color: EStyleSheet.value('$textColor')}}
                onIconPress={() => setInJoust(!inJoust)}
                checkedIcon="dot-circle-o"
                uncheckedIcon="circle-thin"
                uncheckedColor={EStyleSheet.value('$crimson')}
                checkedColor={EStyleSheet.value('$crimson')}/>
            <Button onPress={() => post(base64.current)} title="Post" buttonStyle={styles.postButton} style={styles.postButton}>
                    <Text>{'Post'}</Text>
            </Button>
        </View>

        <ImageManipulator
                  photo={{ uri: image }}
                  isVisible={cropperVisible}
                  onPictureChoosed={({ uri, base64: base64Temp }) => {
                      setImage(uri);
                      base64.current = base64Temp;
                  }}
                  onToggleModal={() => setCropperVisible(false)}
                  saveOptions={{base64: true}}
              />
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
        flex: 5
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
        marginLeft: '1rem',
        color: '$textColor'
    }
});

export default NewPost;