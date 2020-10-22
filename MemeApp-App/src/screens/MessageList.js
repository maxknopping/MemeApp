import React, {useEffect, useState, useContext} from 'react';
import { Text, View, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert, Keyboard, ActivityIndicator, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import userService from './../apis/user';
import { Context } from '../context/AuthContext';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem, Overlay, CheckBox, Button } from 'react-native-elements';
import {FontAwesome, Feather, AntDesign} from 'react-native-vector-icons';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

const MessageList = ({
    navigation
}) => {
    const {state} = useContext(Context);
    const [messages, setMessages] = useState([]);
    const [searchInput, setSearchInput] = useState('');
    const [messagesSearch, setMessagesSearch] = useState('');
    const [newMessage, setNewMessage] = useState('');
    const [searchVisible, setSearchVisible] = useState(false);
    const [userIds, setUserIds] = useState([]);
    const [users, setUsers] = useState([]);

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

    function convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
    
        newDate.setHours(hours - offset);
    
        return newDate;   
    }

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

    const search = (text) => {
        userService.get(`/search/${state.id}/${text}/true`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function(response) {
                response.data.forEach(element => {
                    if (userIds.indexOf(element.id) != -1) {
                        element.checked = true;
                    } else {
                        element.checked = false;
                    }
                });
                setList([...response.data]);
                console.log(response.data);
            }
        ).catch(error => console.log(error));
    };

    const searchUsers = (text) => {
        userService.get(`/search/${state.id}/${text}/true`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function(response) {
                setUsers([...response.data]);
            }
        ).catch(error => console.log(error));
    };

    const sendMessageToGroup = () => {
        console.log(userIds);
        if (userIds.length > 1) {
            userService.post(`/${state.id}/messages/group`, {
                groupName: 'Group',
                message: newMessage,
                userIds: userIds
            },{
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            }).then(() => setUserIds([])).catch(error => {console.log(error);
            setUserIds([])});
        } else if (userIds.length == 1) {
            sendMessage();
        }

    };

    const sendMessage = () => {
            let message = {senderId: state.id, content: newMessage, recipientId: userIds[0]};
            userService.post(`/${state.id}/messages`, message , {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            }).then(
                function(response) {
                    setNewMessage('');
                    setUserIds([]);
                    getMessages();
                }
            ).catch(error => {
                console.log(error);
                setNewMessage('');
                setUserIds([]);
                getMessages();
            });
    };

 
    return (
        <>
            {!refreshing  ?
                <ScrollView style={{flex: 1}}>
                    <ListItem 
                        contentContainerStyle={{alignItems: 'center'}}
                        containerStyle={{backgroundColor: EStyleSheet.value('$backgroundColor')}}
                        title={
                            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 10}}>
                            <View style={styles.searchBackground}>
                                <Feather style={styles.searchIcon} name="search" />
                                <TextInput value={messagesSearch} onChangeText={(text) => {
                                        setMessagesSearch(text);
                                        searchUsers(text);
                                    }} style={styles.searchInput} placeholder="Search..." placeholderTextColor="#A9A9A9"/>
                            </View>
                            <TouchableOpacity>
                                <AntDesign style={{fontSize: 30, marginLeft: 5, color: EStyleSheet.value('$textColor')}} onPress={() => setSearchVisible(true)} name="addusergroup"/>
                            </TouchableOpacity>
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
                            <View style={styles.newMessageBackground}>
                                <TextInput value={newMessage} onChangeText={(text) => {
                                    setNewMessage(text);
                                }} style={styles.searchInput} placeholder="Write a message..." placeholderTextColor="#A9A9A9"/>
                            </View>

                            
                        <ScrollView style={styles.scrollView}>
                                {list.map((item, index) => (
                                <View key={index}>
                                    <ListItem
                                    key={index}
                                    leftAvatar={{source: item.photoUrl ? {uri: item.photoUrl} : 
                                        require('./../../assets/user.png')}}
                                    title={
                                        <View style={styles.titleWrapper}>
                                                <Text style={styles.overlayUsername}>{item.username}</Text>
                                        </View>
                                    }
                                    subtitle= {
                                        <Text style={{fontSize: EStyleSheet.value('.75rem'), color: 'gray'}}>{item.name}</Text>
                                    }
                                    chevron={
                                        <CheckBox 
                                            uncheckedIcon="circle-thin" 
                                            size={30} 
                                            checkedIcon="dot-circle-o"
                                            checkedColor="black"
                                            checked={item.checked}
                                            onIconPress={() => {
                                                if (!item.checked) {
                                                    const user = item;
                                                    const newList = list;
                                                    user.checked = true;
                                                    newList[index] = user;
                                                    setList(newList);
                                                    setUserIds([...userIds, item.id]);
                                                } else {
                                                    const user = item;
                                                    user.checked = false;
                                                    const newList = list;
                                                    newList[index] = user;
                                                    setList(newList);
                                                    const newIds = userIds.filter(e => e != item.id);
                                                    setUserIds([...newIds]);
                                                }
                                            }}
                                        />
                                    }
                                    />
                                </View>
                                ))}
                        </ScrollView>
                        <View style={{margin: 10}}>

                            <Button title="Send" disabled={userIds.length == 0 || newMessage.length == 0} 
                                titleStyle={{color: 'white'}} 
                                buttonStyle={styles.sendButton} onPress={() => {
                                    setSearchVisible(false);
                                    sendMessageToGroup();
                                    list.forEach(element => {
                                        element.checked = false;
                                    });
                                }}/>
                        </View>
                        </>
                    } onBackdropPress={() => setSearchVisible(false)}  animationType={'fade'}>
                    </Overlay>

                    
                    {users.length == 0 ? (
                    <View>
                    {messages.map((message, index) => (
                        <View key={index}>
                        {message.groupId == 0 ? (
                            <ListItem
                            key={index}
                            containerStyle={{backgroundColor: EStyleSheet.value('$backgroundColor')}}
                            leftAvatar={{source: message.senderId == state.id ? (message.recipientPhotoUrl ? {uri: message.recipientPhotoUrl} : 
                                require('./../../assets/user.png')) : (message.senderPhotoUrl ? {uri: message.senderPhotoUrl} : 
                                require('./../../assets/user.png'))}
                            }
                            title={
                                <View style={styles.mainLineWrapper}>
                                    <TouchableOpacity onPress={() => navigation.push('Profile', {username: 
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
                                <Text style={styles.timeAgo}>{timeAgo.format(convertUTCDateToLocalDate(new Date(message.messageSent)), 'twitter')}</Text>
                            }
                            onPress={() => navigation.navigate('MessageThread', {username: message.senderId == state.id ?
                                 message.recipientUsername: message.senderUsername, photoUrl: message.senderId == state.id ?
                                 message.recipientPhotoUrl : message.senderPhotoUrl, recipientId: message.senderId == state.id ? 
                                message.recipientId : message.senderId})}
                            />): (
                                <ListItem
                            key={index}
                            containerStyle={{backgroundColor: EStyleSheet.value('$backgroundColor')}}
                            leftAvatar={
                                <View style={styles.avatars}>
                                    <Image source={message.groupPhotoUrls[0].photoUrl ? {uri: message.groupPhotoUrls[0].photoUrl}: require('./../../assets/user.png')} 
                                    style={styles.avatar}/>
                                    <Image source={message.groupPhotoUrls[1].photoUrl ? {uri: message.groupPhotoUrls[1].photoUrl}: require('./../../assets/user.png')} 
                                    style={styles.avatar}/>
                                </View>
                            }
                            title={
                                <View style={styles.mainLineWrapper}>
                                    <TouchableOpacity>
                                        <Text style={styles.usernameText}>{message.groupName}</Text>
                                    </TouchableOpacity>
                                    {!message.isRead && message.senderId != state.id  ? <FontAwesome style={styles.circle} name="circle"/> : null}
                                    <Text numberOfLines={1} style={styles.messageContent}>{message.content}</Text>
                                </View>
                            }
                            subtitle={
                                <Text style={styles.timeAgo}>{timeAgo.format(convertUTCDateToLocalDate(new Date(message.messageSent)), 'twitter')}</Text>
                            }
                            onPress={() => navigation.navigate('GroupMessageThread', {groupId: message.groupId, 
                                groupName: message.groupName, photoUrls: message.groupPhotoUrls})}
                            />
                            )
                        }
                        </View>
                    ))}
                </View>
                     ): (
                         <View>
                             {users.map((item, index) => (
                                 <ListItem
                                 onPress={() => {
                                     navigation.navigate('MessageThread', {username: item.username, photoUrl: item.photoUrl, recipientId: item.id});
                                 }}
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
                                 containerStyle={{backgroundColor: EStyleSheet.value('$backgroundColor')}}
                                 />
                             ))}
                         </View>
                     )}
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
        color: '$textColor'
    },
    mainLineWrapper: {
        flexDirection: 'row'
    },
    messageContent:{
        marginLeft: '1rem',
        fontSize: '1rem',
        flex: 1,
        color: 'gray',
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
        marginLeft: '.5rem'
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
        marginRight: '.75rem',
        color: '$textColor'
    },
    overlayUsername: {
        fontSize: '1rem',
        fontWeight: 'bold',
        marginRight: '.75rem',
        color: 'black'
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
    },
    avatar: {
        marginLeft: -20,
        position: 'relative',
        borderWidth: 3,
        borderColor: '$backgroundColor',
        borderRadius: 50,
        overflow: 'hidden', 
        width: 35,
        height: 35,
    },
    avatars: {
        position: 'relative',
        flexDirection: 'row',
        display: 'flex',
        paddingLeft: 10
    },
    sendButton: {
        backgroundColor: '$crimson'
    },
    newMessageBackground: {
        flexDirection: 'row',
        alignItems: 'center',
        marginLeft: '.5rem',
        borderBottomWidth: '.05rem',
        justifyContent: 'center',
        alignSelf: 'center'
    }

});

export default MessageList;