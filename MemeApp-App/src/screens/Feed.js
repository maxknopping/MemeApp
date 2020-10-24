import React, {useContext, useEffect, useState, useRef} from 'react';
import { Text, View, ScrollView, Image, ActivityIndicator, Dimensions, RefreshControl, SafeAreaView, FlatList, ListView, TouchableOpacity, Platform, Share } from 'react-native';
import {Button, Badge, Icon, withBadge} from 'react-native-elements';
import {Button as NativeButton} from 'native-base';
import {Context} from './../context/AuthContext';
import userService from './../apis/user';
import EStyleSheet from 'react-native-extended-stylesheet';
import {MaterialIcons, Feather} from 'react-native-vector-icons';
import Constants from 'expo-constants';
import PostCard from './PostCard';
import InfiniteScrollView from 'react-native-infinite-scroll-view';
import WelcomeModal from './WelcomeModal';
import { Notifications } from 'expo';

const Feed = ({
    navigation,
}) => {
    const {state} = useContext(Context);
    const [refreshing, setRefreshing] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);
    const [posts, setPosts] = useState([]);
    const [doneLoading, setLoading] = useState(true);
    const flatList = useRef(null);
    useEffect(() => {
        navigation.addListener('willFocus', () => {
            if (Platform.OS === 'ios') {
                Notifications.setBadgeNumberAsync(0);
            }
        });
        navigation.setParams({scrollToTop: scrollToTop});
        userService.get(`/feed/${state.username}/0`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                setPosts([response.data, 'Invite']);
                setLoading(false);
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
                setLoading(false);
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
        userService.get(`/feed/${state.username}/0`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                setPosts([response.data, 'Invite']);
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

    const onShare = async () => {
        if (Platform.OS === 'ios') {
            const baseUrl = 'https://apps.apple.com/us/app/memeclub/id1529161180'
            Share.share({
                message: `${baseUrl}`
            }, {
                excludedActivityTypes: [
                    'com.apple.UIKit.activity.AirDrop'
                ]
            });
        }
    };

    const description = "Welcome to MemeClub! This tab is your feed. Here you will see posts from the accounts that you follow." +
        " To see your messages, click on the message icon in the top right corner. To see any notifications, click on " +
        "the bell icon in the top left corner.";

    return (
        <>
            <View>
                <WelcomeModal pagekey={"Feed"} title={"Welcome to MemeClub"} description={description}/>
            </View>
            {posts.length === 0 && !doneLoading && !refreshing ? <ScrollView refreshControl={
                <RefreshControl onRefresh={onRefresh}
                refreshing={refreshing} colors={EStyleSheet.value('$textColor')} tintColor={EStyleSheet.value('$textColor')}/>
            } style={{flex: 1, alignItems: 'center', marginTop: 10}}>
                    <Text style={styles.text}>When you follow other users, their posts will appear here.</Text>
                </ScrollView>: 
            <FlatList
            contentContainerStyle={{
                flexDirection: 'column'
            }}
            keyExtractor={(post) => `${post.id}`}
            data={posts}
            renderItem={({item}) => item == 'Invite' ? <TouchableOpacity onPress={onShare}>
                    <View style={{alignItems: 'center', justifyContent: 'center', 
                        height: 75, borderRadius: 10, margin: 25, flexDirection: 'row', backgroundColor: EStyleSheet.value('$crimson')}}>
                            <Text style={{fontWeight: 'bold', fontSize: EStyleSheet.value('1rem'), color: 'white'}}>Invite Your Friends To MemeClub</Text>
                            <Feather style={styles.shareIcon} name="external-link"/>
                    </View>
                </TouchableOpacity>
            : <PostCard post={item} navigation={navigation}/>}
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
            }
        </>);
};

Feed.navigationOptions = ({navigation}) => {
    const newMessages = navigation.getParam('newMessages');
    const newNotifications = navigation.getParam('newNotifications');
    const theme = EStyleSheet.value('$backgroundColor');
    return {
        headerRight: () => (<TouchableOpacity onPress={() => {
                    navigation.navigate('Messages');
                }}>
                <View style={newMessages == 0 ? {marginRight: 15} : {marginRight: 15}}>
                    <Feather style={styles.gearIcon} name="message-circle"/>
                    {newMessages > 0 ? <Badge value={newMessages} badgeStyle={{backgroundColor: 'crimson'}}
                        containerStyle={{position: 'absolute', top: -4, right: -4}}/>:
                    null}
                </View>
            </TouchableOpacity>),
        headerLeft: () => (
            <TouchableOpacity onPress={() => {navigation.navigate('Notifications');}}>
                <View style={{marginLeft: 15}}>
                    <Feather style={styles.bellIcon} name="bell"/>
                    {newNotifications > 0 ? <Badge value={newNotifications} badgeStyle={{backgroundColor: 'crimson'}} 
                        containerStyle={{position: 'absolute', top: -4, right: -4}}/> :
                       null}
                </View>
            </TouchableOpacity>
        ),
        headerTitle: () => (
            <TouchableOpacity onPress={() => navigation.getParam('scrollToTop')()}>
                <Image style={styles.image} source={theme === 'white' ? require('./img/logo.png') : require('./img/MemeClub.png')}/>
            </TouchableOpacity>
        )
    };
};

const styles = EStyleSheet.create({
    text: {
        color: '$textColor'
    },
    gearIcon: {
        fontSize: '1.9rem',
        color: '$textColor'
    },
    bellIcon: {
        fontSize: '1.9rem',
        color: '$textColor'
    },
    image: {
        width: '8rem',
        height: '6rem',
        resizeMode: 'contain'
    },
    shareIcon: {
        fontSize: '1.5rem',
        color: 'white',
        marginLeft: '.7rem'
    },
});

export default Feed;
