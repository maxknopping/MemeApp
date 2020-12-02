import React, {useContext, useEffect, useState, useRef} from 'react';
import { Text, View, ScrollView, Image, ActivityIndicator, 
        FlatList, Dimensions, RefreshControl, SafeAreaView, TouchableOpacity, Modal, Alert } from 'react-native';
import {Button, Overlay} from 'react-native-elements';
import {Button as NativeButton} from 'native-base';
import {Context} from './../context/AuthContext';
import userService from './../apis/user';
import EStyleSheet from 'react-native-extended-stylesheet';
import {MaterialIcons, Ionicons, Feather, Entypo} from 'react-native-vector-icons';
import Constants from 'expo-constants';
import PostCard from './PostCard';
import WelcomeModal from './WelcomeModal';
import ProgressImage from 'react-native-image-progress';

const Profile = ({
    navigation
}) => {
    const {state} = useContext(Context);
    const [user, setUser] = useState(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const {width, height} = Dimensions.get('window');
    const [followButton, setFollowButton] = useState('Follow');
    const [followers, setFollowers] = useState(0); 
    const [modalVisible, setModalVisible] = useState(false);
    var username = useRef(state.username);
    const flatList = useRef(null);
    console.log(user);
    const segmentClicked = (index) => {
        setActiveIndex(index);
    };


    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        userService.get(`/username/${username.current}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                response.data.posts = [];
                setRefreshing(false);
                setFollowers(response.data.followers.length);
                async function load() {
                    let newPosts = [];
                    for (var i = 0; i < 9; i++) {
                        var responseTwo = await loadInitialPost(i);
                        if (typeof responseTwo !== 'undefined') {
                            newPosts.push(responseTwo.data);
                        }
                    }
                    setUser({...response.data, posts: newPosts});
                    setRefreshing(false);
                }
        
                load();
            }).catch(error => {console.log(error); setRefreshing(false)});
    }, [refreshing]);

    const loadInitialPost = (index) => {
        return userService.get(`/username/${username.current}/${index}`,  {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).catch(error => console.log(error));
    }

    const loadPost = (index) => {
        return userService.get(`/username/${username.current}/${index}`,  {
           headers: {
               'Authorization': `Bearer ${state.token}`
           }
       }).catch(error => console.log(error));
   }

   const reportUser = () => {
    userService.post(`/${user.id}/report`, {}, {
        headers: {
            'Authorization': `Bearer ${state.token}`
        }
    })
    .then(
        function (response) {
            Alert.alert(
                'Successfully Reported User', '', [{text: 'Ok', style: 'default', onPress: () => setModalVisible(false)}]
            );
        }
    ).catch(error => console.log(error));
   }
    
    useEffect(() => {
        navigation.setParams({scrollToTop: scrollToTop});
        if (navigation.getParam('username')) {
            username.current = navigation.getParam('username');
            navigation.setParams({otherUsername: state.username});
            console.log(username);
        } else {
            navigation.setParams({username: state.username, id: state.id});
            navigation.setParams({otherUsername: state.username});
        }
        userService.get(`/username/${username.current}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                response.data.posts = [];
                setFollowers(response.data.followers.length);
                if (response.data.username === state.username) {
                    setFollowButton('Edit Profile');
                } else {
                    for (let user in response.data.followers) {
                        if (response.data.followers[user].followerId == state.id) {
                            setFollowButton('Following');
                        }
                    }
                }
                async function load() {
                    let newPosts = [];
                    for (var i = 0; i < 9; i++) {
                        var responseTwo = await loadInitialPost(i);
                        if (typeof responseTwo === 'undefined') {
                            break;
                        }
                        if (typeof responseTwo !== 'undefined') {
                            newPosts.push(responseTwo.data);
                        }
                    }
                    setUser({...response.data, posts: newPosts});
                    setRefreshing(false);
                }
        
                load();
            }
        ).catch(error => console.log(error));

    }, []);

    const scrollToTop = () => {
        // Scroll to top, in this case I am using FlatList
        if (!!flatList.current) {
          flatList.current.scrollToOffset({ offset: 0, animated: true });
        }
      }


    const renderGridSection = () => {
        return user.posts.map((post, index) => {
            return (
                <TouchableOpacity key={index} onPress={() => navigation.push('SinglePost', {postId: post.id})}>
                <View style={[ {width: width / 3} , {height: width/3}, {marginBottom: EStyleSheet.value('.1rem')}, index % 3 !== 0 ? 
                    {paddingLeft: EStyleSheet.value('.1rem')} : {paddingLeft: 0}]} >
                        <ProgressImage style={{flex: 1, width: undefined, height: undefined}} source={{uri: post.url}}/>
                </View>
                </TouchableOpacity>
            );
        });
    }

    const renderListSection = () => {
        return user.posts.map((post, index) => {
            return (
                <PostCard post={post} key={index} navigation={navigation}/>
            )
        })
    };

    const renderSection = () => {
        if (activeIndex === 0) {
            return (
                <View style={styles.gridView}>
                    {user ? renderGridSection() : null}
                </View>
            );
        } else if (activeIndex === 1) {
            return (
                <View style={{flex: 1}}>
                    {user ? renderListSection() : null}
                </View>
            );
        }
    }
    
    const follow = () => {
            userService.post(`/${state.id}/follow/${user.id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            })
            .then(
                function (response) {
                    setFollowButton('Following');
                    setFollowers(followers + 1);
                }
            ).catch(error => console.log(error));
    };

    const blockUser = () => {
        userService.post(`/${state.id}/block/${user.id}`, {}, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        })
        .then(
            function (response) {
                Alert.alert('Successfully blocked user!');
            }
        ).catch(error => console.log(error));
    };

    const unfollow = () => {
        userService.post(`/${state.id}/unfollow/${user.id}`, {}, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        })
        .then(
            function (response) {
                setFollowButton('Follow');
                setFollowers(followers - 1);
            }
        ).catch(error => console.log(error));
    };

    const description = "This is your profile! You can come here to see your posts, check how many followers you have, or edit your profile. The gear icon in the top right leads to the settings page.";


    return (
        <View style={{flex: 1}}>
            {followButton === 'Edit Profile' ?
            <View>
                <WelcomeModal pagekey={"Profile"} title={"Profile Page"} description={description}/>
            </View>
            : null}
        {user ? 
        <FlatList
        style={{flex: 1}}
        ref={flatList} 
        refreshControl={
            <RefreshControl refreshing={refreshing} colors={EStyleSheet.value('$textColor')} tintColor={EStyleSheet.value('$textColor')} onRefresh={onRefresh} />
        }
        ListHeaderComponentStyle={{flex: 1}}
        ListHeaderComponent={(
            <View>
                <Overlay isVisible={modalVisible} children={
                            <>
                            <Text style={styles.text} onPress={reportUser}>
                                Report
                            </Text>
                            {followButton !== 'Edit Profile' ? <Text style={styles.text} onPress={blockUser}>
                                Block
                            </Text>: null}
                            <Text onPress={() => setModalVisible(false)} style={[styles.text, {color: '#DC143C'}]}>
                                Cancel
                            </Text>
                            </>
                            } onBackdropPress={() => setModalVisible(false)} height={'auto'} width={'auto'} animationType={'fade'}>
                        </Overlay>
            <View style={styles.headerView}>
                    {user ? (
                        <Image rounded style={styles.profilePicture} source={user.photoUrl ? {uri: user.photoUrl} : 
                        require('./../../assets/user.png')}/>
                        ) : null}
                    <View style={styles.infoView}>
                        {user.followers.length > 0 ? (
                            <TouchableOpacity onPress={() => 
                                navigation.push('List', {type: 'followers', identifier: user.username})}>
                                <View style={styles.followView}>
                                    {user ? (
                                    <Text style={styles.follow}>
                                        {followers}
                                    </Text>) : <Text style={styles.follow}>0</Text> }
                                    <Text style={styles.label}>Followers</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.followView}>
                                {user ? (
                                <Text style={styles.follow}>
                                    {followers}
                                </Text>) : <Text style={styles.follow}>0</Text> }
                                <Text style={styles.label}>Followers</Text>
                            </View>
                        )}
                        {user.following.length > 0 ? (
                            <TouchableOpacity onPress={() => 
                                navigation.push('List', {type: 'following', identifier: user.username})}>
                                <View style={styles.followView}>
                                    {user ? (
                                    <Text style={styles.follow}>
                                        {user.following.length}
                                    </Text>) : <Text style={styles.follow}>0</Text> }
                                    <Text style={styles.label}>Following</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.followView}>
                                    {user ? (
                                    <Text style={styles.follow}>
                                        {user.following.length}
                                    </Text>) : <Text style={styles.follow}>0</Text> }
                                    <Text style={styles.label}>Following</Text>
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.bioView}>
                    {user ? <Text style={[styles.bioText, {fontWeight: "bold", fontSize: 18}]}>{user.name}</Text>: null}
                </View>
                <View style={styles.bioView}>
                    {user ? <Text style={styles.bioText}>{user.bio}</Text> : null}
                </View>
                <View style={{flexDirection: 'row', flex: 1}}>
                {followButton === 'Follow' ? <Button containerStyle={{width: '90%'}} buttonStyle={{backgroundColor: EStyleSheet.value('$crimson'), 
                    borderRadius: EStyleSheet.value('.8rem')}} style={styles.followButton} title={followButton} onPress={follow}/> :
                    followButton === 'Edit Profile' ? <Button buttonStyle={{backgroundColor: EStyleSheet.value('$crimson'), 
                    borderRadius: EStyleSheet.value('.8rem')}} containerStyle={{width: '100%'}} style={styles.followButton} title={followButton} onPress={() => {
                        navigation.navigate('EditProfile', {username: state.username});
                    }}/> :
                    <Button containerStyle={{width: '90%'}} buttonStyle={{backgroundColor: 'gray', borderColor: 'black', borderWidth: EStyleSheet.value('.05rem'), 
                    borderRadius: EStyleSheet.value('.8rem')}}
                    style={styles.followButton} title={followButton} onPress={() => unfollow()}/>
                }
                { followButton !== 'Edit Profile' ?
                <TouchableOpacity onPress={() => setModalVisible(true)}>
                    <Entypo style={styles.ellipsis} name="dots-three-horizontal"/> 
                </TouchableOpacity> : null
                }
                </View>
                <View style={styles.tabView}>
                    <NativeButton onPress={() => segmentClicked(0)} active={activeIndex === 0} transparent>
                        <MaterialIcons style={[styles.icons, activeIndex === 0 ?
                            {color: EStyleSheet.value('$crimson')} : {color: EStyleSheet.value('$textColor')}]} name="apps"></MaterialIcons>
                    </NativeButton>
                    <NativeButton onPress={() => segmentClicked(1)} active={activeIndex === 1} transparent>
                        <MaterialIcons style={[styles.icons, activeIndex === 1 ? 
                            {color: EStyleSheet.value('$crimson')} : {color: EStyleSheet.value('$textColor')}]} name="format-list-bulleted"></MaterialIcons>
                    </NativeButton>
                </View>
            </View>
        )}
        renderItem={({item, index}) => {
            if (activeIndex === 1) {
                return <PostCard post={item} navigation={navigation}/>
            } else {
                return (
                    <TouchableOpacity onPress={() => navigation.push('SinglePost', {postId: item.id})}>
                        <View style={[ {width: width / 3} , {height: width/3}, {marginBottom: EStyleSheet.value('.1rem')}, index % 3 !== 0 ? 
                            {paddingLeft: EStyleSheet.value('.1rem')} : {paddingLeft: 0}]} >
                                <ProgressImage style={{flex: 1, width: undefined, height: undefined}} source={{uri: item.url}}/>
                        </View>
                    </TouchableOpacity>
                )
            }
        }}
        data={user.posts}
        numColumns={activeIndex === 0 ? 3 : 1}
        key={activeIndex === 0 ? '0' : '1'}
        keyExtractor={(item, i) => item.id.toString()}
        onEndReached={() => {

            async function load() {
                let newPosts = user.posts;
                const responseOne = await loadPost(user.posts.length);
                if (typeof responseOne !== 'undefined') {
                    newPosts.push(responseOne.data);
                }
                const responseTwo = await loadPost(user.posts.length+1);
                if (typeof responseTwo !== 'undefined') {
                    newPosts.push(responseTwo.data);
                }
                const responseThree = await loadPost(user.posts.length+2);
                if (typeof responseThree !== 'undefined') {
                    newPosts.push(responseThree.data);
                }
                setUser({...user, posts: newPosts});
                console.log(newPosts);
            }

            load();
        }}
        
        />: <ActivityIndicator color={EStyleSheet.value('$crimson')}/>}
        </View>
    );
};

const styles = EStyleSheet.create({
    profilePicture: {
        width: '27%',
        aspectRatio: 1/1,
        borderRadius: '20rem',
    },
    spinner: {
    },
    headerView: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: '5%',
        marginTop: '5%',
    },
    infoView: {
        marginVertical: '7%',
        marginHorizontal: '7%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 1
    },
    follow: {
        fontWeight: 'bold',
        fontSize: '1.4rem',
        color: '$textColor'
    },
    followView: {
        alignItems: 'center',
        height: '50%'
    },
    bioView: {
        marginHorizontal: '5%',
        marginTop: '3%',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    bioText: {
        fontSize: '1rem',
        color: '$textColor'
    },
    followButton: {
        marginHorizontal: '5%',
        marginVertical: '5%'
    },
    tabView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: '.05rem',
        borderTopColor: '#eae5e5'
    },
    icons: {
        fontSize: '1.7rem',
        color: '$textColor'
    },
    gridView: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
    gearIcon: {
        fontSize: '1.7rem',
        color: '$textColor'
    },
    label: {
        color: '$textColor'
    },
    ellipsis: {
        fontSize: '1rem',
        marginRight: '1rem',
        marginTop: '2rem',
        fontWeight: 'bold',
        color: '$textColor',
        alignSelf: 'center'
    },
    text: {
        fontSize: '1rem',
        fontWeight: 'bold',
        alignSelf: 'center',
        margin: '1rem'
    }

});

Profile.navigationOptions = ({navigation}) => {
    return {
        headerTitle: () => (
            <TouchableOpacity onPress={() => navigation.getParam('scrollToTop')()}>
                <Text style={{fontSize: EStyleSheet.value('1.4rem'), fontWeight: 'bold', color: EStyleSheet.value('$textColor')}}>
                    {navigation.getParam('username')}</Text>
            </TouchableOpacity>
        ),
        headerRight: () => (<>
            {navigation.getParam('username') === navigation.getParam('otherUsername') ? (
            <TouchableOpacity onPress={() => {
                console.log(navigation);
                navigation.navigate('Settings');
                }}>
                <View style={{marginRight: 15}}>
                    <Feather style={styles.gearIcon} name="settings"/>
                </View>
            </TouchableOpacity>) :
                null
            }
        </>),
    };
}

export default Profile;
