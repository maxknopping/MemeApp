import React, {useState, useEffect, useContext} from 'react';
import { Text, View, Image, TouchableOpacity, Dimensions, TouchableHighlight } from 'react-native';
import {Context} from './../context/AuthContext';
import userService from './../apis/user';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Entypo, FontAwesome, EvilIcons, SimpleLineIcons} from 'react-native-vector-icons';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';


const PostCardMessage = ({
    post, navigation
}) => {

    return (
        <View>
            {post ? <View>
                <View style={styles.headerWrapper}>
                    <Image style={styles.profilePicture} source={post.profilePictureUrl ? {uri: post.profilePictureUrl} : 
                        require('./../../assets/user.png')} />
                    <Text style={styles.headerUsername}>{post.username}</Text>
                </View>
                <Image style={styles.mainImage} source={{uri: post.url}}/>
                <View style={styles.bottomView}>
                    <Text style={styles.caption}>
                                <Text style={styles.bottomUsername}>
                                    {post.username}
                                </Text>
                            {' '}{post.caption}
                    </Text>
                </View>
            </View> : null}
        </View>
        
    );

};

const styles = EStyleSheet.create({
    profilePicture: {
        width: '2rem',
        aspectRatio: 1/1,
        borderRadius: '3rem',
        marginHorizontal: '2%'
    },
    headerWrapper: {
        margin: '.5rem',
        flexDirection: 'row',
        alignItems: 'center'
    },
    headerUsername: {
        marginLeft: '.5rem',
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    mainImage: {
        width: '100%',
        aspectRatio: 1
    },
    bottomView: {
        flexDirection: 'row',
        margin: '.5rem',
        flexWrap: 'wrap'
    },
    bottomUsername: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    caption: {
        color: 'white',
        fontSize: '1rem'
    }
    
});

export default PostCardMessage;