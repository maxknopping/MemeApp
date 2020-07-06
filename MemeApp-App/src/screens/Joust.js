import React, {useContext, useEffect, useState} from 'react';
import { Text, View, ScrollView, Image, ActivityIndicator,
        FlatList, Dimensions, RefreshControl, SafeAreaView, TouchableOpacity, Modal, Animated } from 'react-native';
import {Button, Overlay} from 'react-native-elements';
import {Button as NativeButton} from 'native-base';
import {Context} from './../context/AuthContext';
import userService from './../apis/user';
import EStyleSheet from 'react-native-extended-stylesheet';
import {MaterialIcons, Ionicons, Feather} from 'react-native-vector-icons';
import Constants from 'expo-constants';
import PostCard from './PostCard';

const Joust = ({
    navigation
}) => {

    const {state} = useContext(Context);
    const {width, height} = Dimensions.get('window');
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        getNewPosts();
    }, []);

    const getNewPosts = () => {
        userService.get('/joust/NewPosts', {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                setPosts(response.data);
                setRefreshing(false);
            }
        ).catch(err => {
            console.log(err);
            setRefreshing(false);
        });
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getNewPosts();
    });

    const sendResult = (index) => {
        const loserIndex = index === 0 ? 1 : 0;
        userService.post(`/joust/result/${posts[index].id}/${posts[loserIndex].id}`, {}, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(() => getNewPosts()).catch(err => console.log(err));
    };

    return (
        <ScrollView style={{flex: 1}} refreshControl={
            <RefreshControl refreshing={refreshing} colors={EStyleSheet.value('$textColor')} tintColor={EStyleSheet.value('$textColor')} onRefresh={onRefresh} />
        }>
            {posts.length > 0 ?<View style={{marginTop: '35%'}}>
                <View style={styles.containerView}>
                    {posts.map((post, index) => {
                        return (
                            <View key={index} style={{width: width/2}}>
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
                            </View>
                        )
                    })}
                </View>
                <View style={styles.selectionContainer}>
                    <Button buttonStyle={styles.leftButton} title="Left is better" onPress={() => sendResult(0)}/>
                    <Button buttonStyle={styles.rightButton} title="Right is better" onPress={() => sendResult(1)}/>
                </View>
            </View>
                :
                <ActivityIndicator size="large" color={EStyleSheet.value("$crimson")}/>
            }
        </ScrollView>
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
        alignItems: 'center',
    },
    headerUsername: {
        marginLeft: '.5rem',
        color: '$textColor',
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
        color: '$textColor',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    caption: {
        color: '$textColor',
        fontSize: '1rem'
    },
    containerView: {
        flexDirection: 'row'
    },
    selectionContainer: {
        flexDirection: 'row',
        margin: '1rem',
        justifyContent: 'space-around'
    },
    leftButton: {
        backgroundColor: 'blue',
        borderRadius: '.5rem'
    },
    rightButton: {
        backgroundColor: '$crimson',
        borderRadius: '.5rem'
    }
});

export default Joust;
