import React, {useEffect, useState, useContext} from 'react';
import { Text, View, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert, Keyboard, ActivityIndicator } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import userService from './../apis/user';
import { Context } from '../context/AuthContext';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem, Overlay } from 'react-native-elements';
import {FontAwesome, Feather} from 'react-native-vector-icons';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

const MessageList = ({
    navigation
}) => {
    const {state} = useContext(Context);
    const [messages, setMessages] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);
    const [list, setList] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    TimeAgo.addLocale(en);
    const timeAgo = new TimeAgo('en-US');

    useEffect(() => {
        setRefreshing(true);
        userService.get(`/${state.id}/messages`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                setMessages(response.data);
                console.log(response.data);
                setRefreshing(false);
            }).catch(error => {
                console.log(error);
                setRefreshing(false);
        });
        navigation.addListener('willFocus', () => {
            getMessages();
        });
    }, []);

    const getMessages = () => {
        userService.get(`/${state.id}/messages`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                setMessages(response.data);
                console.log(response.data);
            }).catch(error => {
                console.log(error);
            });
    };

    search = (text) => {
        userService.get(`/search/${state.id}/${text}/true`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function(response) {
                setList([...response.data]);
                console.log(response.data);
            }
        ).catch(error => console.log(error));
    };

 
    return (
        <>
            {!refreshing  ?
                <ScrollView style={{flex: 1}}>
                    <ListItem 
                        contentContainerStyle={{alignItems: 'center'}}
                        title={
                            <View style={styles.searchBackground}>
                                <Feather style={styles.searchIcon} name="search" />
                                <Text onPress={() => setSearchVisible(true)} style={styles.searchText}>Search...</Text>
                            </View>

                        }/>
                    <Overlay isVisible={searchVisible} children={
                        <>
                            <ListItem 
                            contentContainerStyle={{alignItems: 'center'}}
                            title={
                                <View style={styles.searchBackground}>
                                    <Feather style={styles.searchIcon} name="search" />
                                    <TextInput value={searchInput} onChangeText={(text) => {
                                        setSearchInput(text);
                                        search(text);
                                    }} style={styles.searchInput} placeholder="Search..." placeholderTextColor="#A9A9A9"/>
                                </View>

                                }/>
                        <ScrollView style={styles.scrollView}>
                                {list.map((item, index) => (
                                    <ListItem
                                    onPress={() => {
                                        navigation.navigate('MessageThread', {username: item.username, photoUrl: item.photoUrl,
                                        recipientId: item.id});
                                        setSearchVisible(false);
                                    }
                                    }
                                    key={index}
                                    leftAvatar={{source: item.photoUrl ? {uri: item.photoUrl} : 
                                        require('./../../assets/user.png')}}
                                    title={
                                        <View style={styles.titleWrapper}>
                                                <Text style={styles.username}>{item.username}</Text>
                                        </View>
                                    }
                                    subtitle= {
                                        <Text style={{fontSize: EStyleSheet.value('.75rem'), color: 'gray'}}>{item.name}</Text>
                                    }
                                    />
                                ))}
                        </ScrollView>
                        </>
                    } onBackdropPress={() => setSearchVisible(false)} animationType={'fade'}>
                    </Overlay>
                    {messages.map((message, index) => (
                        <ListItem
                            key={index}
                            leftAvatar={{source: message.senderId == state.id ? (message.recipientPhotoUrl ? {uri: message.recipientPhotoUrl} : 
                                require('./../../assets/user.png')) : (message.senderPhotoUrl ? {uri: message.senderPhotoUrl} : 
                                require('./../../assets/user.png'))}
                            }
                            title={
                                <View style={styles.mainLineWrapper}>
                                    <TouchableOpacity onPress={() => navigation.navigate('Profile', {username: 
                                        message.senderId == state.id ? message.recipientUsername
                                        : message.senderUsername})}>
                                        <Text style={styles.usernameText}>{message.senderId == state.id ? message.recipientUsername
                                        : message.senderUsername}</Text>
                                    </TouchableOpacity>
                                    {!message.isRead && message.senderId != state.id  ? <FontAwesome style={styles.circle} name="circle"/> : null}
                                    <Text numberOfLines={1} style={styles.messageContent}>{message.content}</Text>
                                </View>
                            }
                            subtitle={
                                <Text style={styles.timeAgo}>{timeAgo.format(Date.parse(message.messageSent), 'twitter')}</Text>
                            }
                            onPress={() => navigation.navigate('MessageThread', {username: message.senderId == state.id ?
                                 message.recipientUsername: message.senderUsername, photoUrl: message.senderId == state.id ?
                                 message.recipientPhotoUrl : message.senderPhotoUrl, recipientId: message.senderId == state.id ? 
                                message.recipientId : message.senderId})}
                            />
                    ))}
                </ScrollView>
            : <ActivityIndicator animating size="small" />
            }
        </>
    );
};

const styles = EStyleSheet.create({
    usernameText: {
        fontWeight: 'bold',
        fontSize: '1rem',
    },
    mainLineWrapper: {
        flexDirection: 'row'
    },
    messageContent:{
        marginLeft: '1rem',
        fontSize: '1rem',
        flex: 1,
        color: 'gray'
    },
    timeAgo: {
        fontSize: '.75rem',
        color: 'gray',
        marginRight: '.75rem'
    },
    searchIcon: {
        fontSize: '1.1rem',
        marginLeft: '.5rem',
        marginRight: '.5rem'
    },
    searchBackground: {
        backgroundColor: '#ECECEC',
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: '2rem',
    },
    searchInput: {
        width: '90%',
        height: '2.5rem',
        fontSize: '1rem',
        color: 'black'
    },
    searchText: {
        fontSize: '1rem',
        width: '80%',
        paddingVertical: '.7rem',
        color: 'gray'
    }, container: {
        flex: 1,
    },
    scrollView: {
        zIndex: -1,
        marginTop: '.75rem'
    },
    username: {
        fontSize: '1rem',
        fontWeight: 'bold',
        marginRight: '.75rem'
    },
    titleWrapper: {
        flexDirection: 'row',
    },
    xIcon: {
        fontSize: '1rem'
    },
    circle: {
        color: '#0084ff',
        marginLeft: '.5rem',
        alignSelf: 'center'
    }

});

export default MessageList;