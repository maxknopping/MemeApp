import React, {useContext, useEffect, useState} from 'react';
import { Text, View, ScrollView, Image, ActivityIndicator, 
        FlatList, Dimensions, RefreshControl, SafeAreaView, TouchableOpacity, Modal } from 'react-native';
import {Button, Overlay} from 'react-native-elements';
import {Button as NativeButton} from 'native-base';
import {Context} from './../context/AuthContext';
import userService from './../apis/user';
import EStyleSheet from 'react-native-extended-stylesheet';
import {MaterialIcons, Ionicons, Feather} from 'react-native-vector-icons';
import Constants from 'expo-constants';
import PostCard from './PostCard';

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
    const [username, setUsername] = useState(state.username);
    const segmentClicked = (index) => {
        setActiveIndex(index);
    };


    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);

        userService.get(`/username/${username}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                setUser(response.data);
                setRefreshing(false);
                setFollowers(response.data.followers.length);
            }).catch(error => {console.log(error); setRefreshing(false)});
    }, [refreshing]);
    
    useEffect(() => {
        if (navigation.getParam('username')) {
            setUsername(navigation.getParam('username'));
            navigation.setParams({otherUsername: state.username});
        } else {
            navigation.setParams({username: state.username, id: state.id});
            navigation.setParams({otherUsername: state.username});
        }
        userService.get(`/username/${username}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                setUser(response.data);
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
            }
        ).catch(error => console.log(error));

    }, []);

    const renderGridSection = () => {
        return user.posts.map((post, index) => {
            return (
                <View style={[ {width: width / 3} , {height: width/3}, {marginBottom: EStyleSheet.value('.1rem')}, index % 3 !== 0 ? 
                    {paddingLeft: EStyleSheet.value('.1rem')} : {paddingLeft: 0}]} key={index}>
                    <Image style={{flex: 1, width: undefined, height: undefined}} source={{uri: post.url}}/>
                </View>
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
    
    follow = () => {
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

    unfollow = () => {
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

    return (
            <ScrollView refreshControl={
                <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
            } style={{flex: 1}}>
                {user ? <View>
                <View style={styles.headerView}>
                    {user ? (
                        <Image rounded style={styles.profilePicture} source={user.photoUrl ? {uri: user.photoUrl} : 
                        require('./../../assets/user.png')}/>
                        ) : null}
                    <View style={styles.infoView}>
                        {user.followers.length > 0 ? (
                            <TouchableOpacity onPress={() => 
                                navigation.navigate('List', {type: 'followers', identifier: user.username})}>
                                <View style={styles.followView}>
                                    {user ? (
                                    <Text style={styles.follow}>
                                        {followers}
                                    </Text>) : <Text>0</Text> }
                                    <Text>Followers</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.followView}>
                                {user ? (
                                <Text style={styles.follow}>
                                    {followers}
                                </Text>) : <Text>0</Text> }
                                <Text>Followers</Text>
                            </View>
                        )}
                        {user.following.length > 0 ? (
                            <TouchableOpacity onPress={() => 
                                navigation.navigate('List', {type: 'following', identifier: user.username})}>
                                <View style={styles.followView}>
                                    {user ? (
                                    <Text style={styles.follow}>
                                        {user.following.length}
                                    </Text>) : <Text>0</Text> }
                                    <Text>Following</Text>
                                </View>
                            </TouchableOpacity>
                        ) : (
                            <View style={styles.followView}>
                                    {user ? (
                                    <Text style={styles.follow}>
                                        {user.following.length}
                                    </Text>) : <Text>0</Text> }
                                    <Text>Following</Text>
                            </View>
                        )}
                    </View>
                </View>
                <View style={styles.bioView}>
                    {user ? <Text style={styles.bioText}>{user.bio}</Text> : null}
                </View>
                {followButton === 'Follow' ? <Button buttonStyle={{backgroundColor: EStyleSheet.value('$crimson'), 
                    borderRadius: EStyleSheet.value('.8rem')}} style={styles.followButton} title={followButton} onPress={follow}/> :
                    followButton === 'Edit Profile' ? <Button buttonStyle={{backgroundColor: 'gray', 
                    borderRadius: EStyleSheet.value('.8rem')}} style={styles.followButton} title={followButton} onPress={() => {
                        navigation.navigate('EditProfile', {username: state.username});
                    }}/> :
                    <Button buttonStyle={{backgroundColor: 'gray', borderColor: 'black', borderWidth: EStyleSheet.value('.05rem'), 
                    borderRadius: EStyleSheet.value('.8rem')}}
                    style={styles.followButton} title={followButton} onPress={() => unfollow()}/>
                }
                <View style={styles.tabView}>
                    <NativeButton onPress={() => segmentClicked(0)} active={activeIndex === 0} transparent>
                        <MaterialIcons style={[styles.icons, activeIndex === 0 ?
                            {color: EStyleSheet.value('$crimson')} : {color: 'black'}]} name="apps"></MaterialIcons>
                    </NativeButton>
                    <NativeButton onPress={() => segmentClicked(1)} active={activeIndex === 1} transparent>
                        <MaterialIcons style={[styles.icons, activeIndex === 1 ? 
                            {color: EStyleSheet.value('$crimson')} : {color: 'black'}]} name="format-list-bulleted"></MaterialIcons>
                    </NativeButton>
                </View>
                {renderSection()}
                </View> : <ActivityIndicator size="large" color={EStyleSheet.value('$crimson')}/>}
            </ScrollView>
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
        fontSize: '1.4rem'
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
        fontSize: '1rem'
    },
    followButton: {
        marginHorizontal: '5%',
        marginVertical: '5%',
    },
    tabView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: '.05rem',
        borderTopColor: '#eae5e5'
    },
    icons: {
        fontSize: '1.7rem',
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
        color: 'black'
    }

});

Profile.navigationOptions = ({navigation}) => {
    return {
        title: navigation.getParam('username'),
        headerTitleStyle: {
            fontSize: EStyleSheet.value('1.4rem')
        },
        headerRight: () => (<>
            {navigation.getParam('username') === navigation.getParam('otherUsername') ? (
            <TouchableOpacity onPress={() => {
                console.log(navigation);
                navigation.navigate('Settings');
                }}>
                <View style={{marginRight: 10}}>
                    <Feather style={styles.gearIcon} name="settings"/>
                </View>
            </TouchableOpacity>) :
                null
            }
        </>),
    };
}

export default Profile;
