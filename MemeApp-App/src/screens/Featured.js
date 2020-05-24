import React, {useContext, useEffect, useState} from 'react';
import { Text, View, ScrollView, Image, ActivityIndicator, FlatList, ListView, TouchableOpacity, RefreshControl } from 'react-native';
import {Button} from 'react-native-elements';
import {Button as NativeButton} from 'native-base';
import {Context} from './../context/AuthContext';
import userService from './../apis/user';
import EStyleSheet from 'react-native-extended-stylesheet';
import {MaterialCommunityIcons, Feather} from 'react-native-vector-icons';
import Constants from 'expo-constants';
import PostCard from './PostCard';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import WelcomeModal from './WelcomeModal';

const Featured = ({
    navigation,
}) => {
    const {state} = useContext(Context);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        userService.get(`/featured/0`, {
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
        userService.get(`/featured/0`, {
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
        userService.get(`/featured/${posts.length}`, {
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

    const description = "This is the featured page. Here you will see popular posts from the community." +
        " Next, click on the sword icon in the top right corner. This will take you to the home page for Joust mode.";

    return (
        <>
            <View>
                <WelcomeModal pagekey={"Featured5"} title={"Featured"} description={description}/>
            </View>
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
        />
        </>);
};

const styles = EStyleSheet.create({
    container: {

    },
    gearIcon: {
        fontSize: '1.7rem',
        color: 'black'
    },
    joustIcon: {
        fontSize: '1.7rem',
        color: '$textColor'
    }
});

Featured.navigationOptions = ({navigation}) => {
    return {
        headerRight: () => (
            <TouchableOpacity onPress={() => navigation.navigate('JoustHome')}>
                <View style={{marginRight: 10}}>
                    <MaterialCommunityIcons style={styles.joustIcon} name="sword-cross"/>
                </View>
            </TouchableOpacity>
        )
    };
};


export default Featured;

