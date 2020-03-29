import React, {useContext, useEffect, useState} from 'react';
import { Text, View, ScrollView, Image, ActivityIndicator, Dimensions, RefreshControl, SafeAreaView, FlatList, ListView, TouchableOpacity } from 'react-native';
import {Button} from 'react-native-elements';
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
            }).catch(error => {
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
            onRefresh={onRefresh}
            refreshing={refreshing}
            ListFooterComponent={() => loadingMore ? <ActivityIndicator animating size="small" /> : null}
        />);
};

Feed.navigationOptions = ({navigation}) => {
    return {
        headerRight: () => (<TouchableOpacity onPress={() => {
                    navigation.navigate('Messages');
                }}>
                <View style={{marginRight: 10}}>
                    <Feather style={styles.gearIcon} name="message-circle"/>
                </View>
            </TouchableOpacity>),
        headerLeft: () => (
            <TouchableOpacity>
                <View style={{marginLeft: 10}}>
                    <Feather style={styles.bellIcon} name="bell"/>
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
        color: 'black'
    },
    bellIcon: {
        fontSize: '1.7rem'
    }
});

export default Feed;
