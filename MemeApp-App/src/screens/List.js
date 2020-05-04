import React, {useState, useEffect, useContext} from 'react';
import { Text, View, ScrollView, TouchableOpacity } from 'react-native';
import { Context } from '../context/AuthContext';
import EStyleSheet from 'react-native-extended-stylesheet';
import {ListItem, Button} from 'react-native-elements';

const List = ({
    navigation,
}) => {
    const listType = navigation.getParam('type');
    const {state} = useContext(Context);
    const [list, setList] = useState([]);
    const identifier = navigation.getParam('identifier');

    useEffect(() => {
        if (listType === 'followers') {
            userService.get(`/${state.id}/followers/${identifier}`, {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            }).then(
                function (response) {
                    setList(response.data);
                }
            ).catch(error => console.log(error));
        } else if (listType === 'following') {
            userService.get(`/${state.id}/following/${identifier}`, {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            }).then(
                function (response) {
                    setList(response.data);
                }
            ).catch(error => console.log(error));
        } else if (listType === 'likers') {
            userService.get(`/${state.id}/likers/${identifier}`, {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            }).then(
                function (response) {
                    setList(response.data);
                }
            ).catch(error => console.log(error));
        } else if (listType === 'commentLikers') {
            userService.get(`/${state.id}/commentLikers/${identifier}`, {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            }).then(
                function (response) {
                    setList(response.data);
                }
            ).catch(error => console.log(error)); 
        } else if (listType === 'group') {
            userService.get(`/${state.id}/group/${identifier}`, {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            }).then(
                function (response) {
                    setList(response.data);
                }
            ).catch(error => console.log(error));
        }
    }, []);

    follow = (user) => {
        userService.post(`/${state.id}/follow/${user.id}`, {}, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        })
        .then(
            function (response) {
                let index = list.indexOf(user);
                let newUser = user;
                newUser.followButton = 'Following';
                let old = list;
                old[index] = newUser;
                console.log(old);
                setList([...old]);
            }
        ).catch(error => console.log(error));
    };

    unfollow = (user) => {
        userService.post(`/${state.id}/unfollow/${user.id}`, {}, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        })
        .then(
            function (response) {
                let index = list.indexOf(user);
                let newUser = user;
                newUser.followButton = 'Follow';
                let old = list;
                old[index] = newUser;
                console.log(old);
                setList([...old]);
            }
        ).catch(error => console.log(error));
    };

    return (
        <ScrollView>
                {list.map((item, index) => (
                    <ListItem
                    key={index}
                    containerStyle={{backgroundColor: EStyleSheet.value('$backgroundColor')}}
                    leftAvatar={{source: item.photoUrl ? {uri: item.photoUrl} : 
                        require('./../../assets/user.png')}}
                    title={
                        <View style={styles.titleWrapper}>
                            <TouchableOpacity onPress={() => {
                                if (listType == 'followers' || listType == 'following')
                                {
                                    navigation.navigate('OtherProfile', {username: item.username});
                                } else {
                                    navigation.navigate('Profile', {username: item.username});
                                }
                                
                                }}>
                                <Text style={styles.username}>{item.username}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    subtitle= {
                        <Text style={{fontSize: EStyleSheet.value('.75rem'), color: 'gray'}}>{item.name}</Text>
                    }
                    chevron={
                        <>
                        {item.followButton === 'Follow' ? <Button buttonStyle={{backgroundColor: EStyleSheet.value('$crimson'), 
                        borderRadius: EStyleSheet.value('.8rem')}} style={styles.followButton} title={item.followButton} 
                        onPress={() => follow(item)}/> :
                        item.followButton === 'Following' ? <Button buttonStyle={{backgroundColor: 'gray', 
                        borderRadius: EStyleSheet.value('.8rem')}} onPress={() => unfollow(item)} style={styles.followButton}
                         title={item.followButton}/> :
                        null
                        }
                        </>
                    }
                    />
                ))}
            </ScrollView>
        );
};

const styles = EStyleSheet.create({
    username: {
        fontSize: '1rem',
        fontWeight: 'bold',
        marginRight: '.75rem',
        color: '$textColor'
    },
    titleWrapper: {
        flexDirection: 'row',
    },
    followButton: {
        marginHorizontal: '5%',
        marginVertical: '5%',
    }
});

List.navigationOptions = ({navigation}) => {
    let title = '';
    let type = navigation.getParam('type');
    if (type === 'likers' || type === 'commentLikers') {title = 'Likes';}
    else if (type === 'followers') {title = 'Followers';}
    else if (type === 'following') {title = 'Following';}
    return {
        title: title
    };
};

export default List;
