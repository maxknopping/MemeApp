import React, {useContext, useEffect, useState, useRef} from 'react';
import { Text, View, ScrollView, Image, ActivityIndicator, FlatList, ListView, TouchableOpacity, RefreshControl, Platform } from 'react-native';
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
import { Notifications } from 'expo';

const Featured = ({
    navigation,
}) => {
    const {state} = useContext(Context);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [posts, setPosts] = useState([]);
    const flatList = useRef(null);

    useEffect(() => {

        navigation.addListener('willFocus', () => {
            if (Platform.OS === 'ios') {
                Notifications.setBadgeNumberAsync(0);
            }
        });
        navigation.setParams({scrollToTop: scrollToTop});
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

    const scrollToTop = () => {
        // Scroll to top, in this case I am using FlatList
        if (!!flatList.current) {
          flatList.current.scrollToOffset({ offset: 0, animated: true });
        }
      }

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

    const description = "This is the featured page. Here you will see popular posts from the community.";

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
            ref={flatList}
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
    },
    text : {
        fontSize: '1.1rem',
        color: '$textColor',
        fontWeight: 'bold',
        marginBottom: 10
    }
});


Featured.navigationOptions = ({navigation}) => {
    return {
        headerTitle: () => (
            <TouchableOpacity onPress={() => navigation.getParam('scrollToTop')()}>
                <Text style={styles.text}>Featured</Text>
            </TouchableOpacity>
        )
    }
};

export default Featured;

