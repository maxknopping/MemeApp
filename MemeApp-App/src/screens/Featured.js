import React, {useContext, useEffect, useState, useRef} from 'react';
import { Text, View, ScrollView, Image, ActivityIndicator, FlatList, ListView, 
         TouchableOpacity, RefreshControl, Platform, Share } from 'react-native';
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
                setPosts([response.data, 'Invite']);
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
                setPosts([response.data, 'Invite']);
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
    },
    shareIcon: {
        fontSize: '1.5rem',
        color: 'white',
        marginLeft: '.7rem'
    },
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

