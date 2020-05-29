import React, {useContext, useEffect, useState} from 'react';
import { Text, View, ScrollView, Image, ActivityIndicator } from 'react-native';
import {Button} from 'react-native-elements';
import {Button as NativeButton} from 'native-base';
import {Context} from '../context/AuthContext';
import userService from '../apis/user';
import EStyleSheet from 'react-native-extended-stylesheet';
import {MaterialIcons, Feather} from 'react-native-vector-icons';
import Constants from 'expo-constants';
import PostCard from './PostCard';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import auth from '../apis/auth';

const AuthSinglePost = ({
    navigation
}) => {
    const {state} = useContext(Context);
    const [post, setPost] = useState(null);

    useEffect(() => {
        const postId = navigation.getParam('postId');
            auth.get(`/post/${postId}`).then(
                function (response) {
                    setPost(response.data);
                }).catch(error => {
                    console.log(error);
                });
    }, []);

    return (
        <ScrollView style={{flex: 1}}>
            {post ? <PostCard post={post} navigation={navigation}/> : <ActivityIndicator size="small" animating/>}
        </ScrollView>
    
    );
};

AuthSinglePost.navigationOptions = ({navigation}) => {
    return {
        title: 'Post'
    };
};

export default AuthSinglePost;
