import React, {useContext, useEffect, useState} from 'react';
import { Text, View, ScrollView, Image, ActivityIndicator, Dimensions, RefreshControl, SafeAreaView, FlatList, ListView, TouchableOpacity } from 'react-native';
import {Button, Badge, Icon, withBadge} from 'react-native-elements';
import {Button as NativeButton} from 'native-base';
import {Context} from './../context/AuthContext';
import userService from './../apis/user';
import EStyleSheet from 'react-native-extended-stylesheet';
import {MaterialIcons, Feather} from 'react-native-vector-icons';
import Constants from 'expo-constants';
import PostCard from './PostCard';
import InfiniteScrollView from 'react-native-infinite-scroll-view';

const Feed = ({
    navigation,
}) => {
    const {state} = useContext(Context);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        userService.get(`/feed/${state.username}/0`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                setPosts([response.data]);
                userService.get(`/hasNewMessages/${state.id}`, {
                    headers: {
                        'Authorization': `Bearer ${state.token}`
                    }
                }).then((response) => navigation.setParams({newMessages: response.data.count})).catch(error => console.log(error));
                userService.get(`/hasNewNotifications/${state.id}`, {
                    headers: {
                        'Authorization': `Bearer ${state.token}`
                    }
                }).then((response) => navigation.setParams({newNotifications: response.data.count})).catch(error => console.log(error));
            }
            ).catch(error => {
                console.log(error);
                setRefreshing(false);
            });
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setPosts([]);
        userService.get(`/feed/${state.username}/0`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                setPosts([response.data]);
                userService.get(`/hasNewMessages/${state.id}`, {
                    headers: {
                        'Authorization': `Bearer ${state.token}`
                    }
                }).then((response) => navigation.setParams({newMessages: response.data.count})).catch(error => console.log(error));
                userService.get(`/hasNewNotifications/${state.id}`, {
                    headers: {
                        'Authorization': `Bearer ${state.token}`
                    }
                }).then((response) => navigation.setParams({newNotifications: response.data.count})).catch(error => console.log(error));
                setRefreshing(false);
            }).catch(error => {
                console.log(error);
                setRefreshing(false);
            });
    }, [refreshing]);

    const loadMore = async () => {
        setLoadingMore(true);
        userService.get(`/feed/${state.username}/${posts.length}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                setPosts([...posts, response.data]);
                setLoadingMore(false);
            }).catch(error => {
                console.log(error);
                setLoadingMore(false);
            });
    }

    const renderFeed = () => {
        return posts.map((post, index) => {
            return (
                <PostCard post={post} navigation={navigation} key={index}/>
            );
        });
    };

    return (
            <FlatList
            contentContainerStyle={{
                flexDirection: 'column'
            }}
            keyExtractor={(post) => `${post.id}`}
            data={posts}
            renderItem={({item}) => <PostCard post={item} navigation={navigation}/>}
            onEndReached={() => loadMore()}
            onEndReachedThreshold={0.5}
            initialNumToRender={3}
            refreshControl={
                <RefreshControl onRefresh={onRefresh}
                refreshing={refreshing} colors={EStyleSheet.value('$textColor')} tintColor={EStyleSheet.value('$textColor')}/>
            }
            ListFooterComponent={() => loadingMore ? <ActivityIndicator animating size="small" /> : null}
        />);
};

Feed.navigationOptions = ({navigation}) => {
    const newMessages = navigation.getParam('newMessages');
    const newNotifications = navigation.getParam('newNotifications');
    return {
        headerRight: () => (<TouchableOpacity onPress={() => {
                    navigation.navigate('Messages');
                }}>
                <View style={newMessages == 0 ? {marginRight: 10} : {marginRight: 10}}>
                    <Feather style={styles.gearIcon} name="message-circle"/>
                    {newMessages > 0 ? <Badge value={newMessages} badgeStyle={{backgroundColor: 'crimson'}}
                        containerStyle={{position: 'absolute', top: -4, right: -4}}/>:
                    null}
                </View>
            </TouchableOpacity>),
        headerLeft: () => (
            <TouchableOpacity onPress={() => {navigation.navigate('Notifications');}}>
                <View style={{marginLeft: 10}}>
                    <Feather style={styles.bellIcon} name="bell"/>
                    {newNotifications > 0 ? <Badge value={newNotifications} badgeStyle={{backgroundColor: 'crimson'}} 
                        containerStyle={{position: 'absolute', top: -4, right: -4}}/> :
                       null}
                </View>
            </TouchableOpacity>
        )
    };
};

const styles = EStyleSheet.create({
    container: {

    },
    gearIcon: {
        fontSize: '1.7rem',
        color: '$textColor'
    },
    bellIcon: {
        fontSize: '1.7rem',
        color: '$textColor'
    }
});

export default Feed;
