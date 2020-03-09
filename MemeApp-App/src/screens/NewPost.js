import React, { useState } from 'react';
import { Text, View, TouchableOpacity, Image, TextInput, SafeAreaView } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import {MaterialCommunityIcons} from '@expo/vector-icons';
import { Button } from 'react-native-elements';

const NewPost = ({
    navigation,
}) => {
    const image = navigation.getParam('image');
    const [caption, setCaption] = useState('');
    return (
        <SafeAreaView style={styles.safeArea}>
        <View style={styles.container}>
            <Image source={{uri: image}}  style={styles.image}/>
            <TextInput style={styles.textInput} placeholder="Add a caption..." multiline 
                value={caption}
                onChangeText={(text) => setCaption(text)}/>
        </View>
        <View style={styles.containerBottom}>
            <Button title="Post" buttonStyle={styles.postButton} style={styles.postButton}>
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
        width: '35%',
        aspectRatio: 1
    },
    textInput: {
        width: '60%',
        aspectRatio: 1.7143 /1,
        marginLeft: '1rem'
    }
});

export default NewPost;