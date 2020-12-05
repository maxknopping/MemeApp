import React, {useEffect, useState, useContext, useRef, useLayoutEffect} from 'react';
import { Text, View, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert, Keyboard, Dimensions, Image } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import userService from './../apis/user';
import { Context } from '../context/AuthContext';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem } from 'react-native-elements';
import {FontAwesome} from 'react-native-vector-icons';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import PostCardMessage from './PostCardMessage';

const { height: fullHeight } = Dimensions.get('window');

const GroupMessageThread = ({
    navigation
}) => {
    const {state} = useContext(Context);
    const [messages, setMessages] = useState([]);
    const [offest, setOffset] = useState(0);
    const [messageInput, changeInput] = useState('');
    const groupId = navigation.getParam('groupId');
    const scrollView = useRef(null);
    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo('en-US');

    useEffect(() => {
       scrollView.current && scrollView.current.scrollToEnd({animated: true});
    }, [messages]);

    useEffect(() => {
        userService.get(`/${state.id}/messages/thread/group/${groupId}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].isRead == false && response.data[i].recipientId == state.id) {
                        userService.post(`/${state.id}/messages/${response.data[i].id}/read`, {}, {
                            headers: {
                                'Authorization': `Bearer ${state.token}`
                            }
                        }).catch(error => console.log(error));
                    }
                  }

                setMessages(response.data);
            }
        ).catch(error => console.log(error));
    }, []);

    const getMessages = () => {
        userService.get(`/${state.id}/messages/thread/group/${groupId}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                for (let i = 0; i < response.data.length; i++) {
                    if (response.data[i].isRead == false && response.data[i].recipientId == state.id) {
                        userService.post(`/${state.id}/messages/${response.data[i]}/read`, {}, {
                            headers: {
                                'Authorization': `Bearer ${state.token}`
                            }
                        }).catch(error => console.log(error));
                    }
                  }

                setMessages(response.data);
            }
        ).catch(error => console.log(error));
    };

    const sendMessage = (text) => {
        if (text !== '') {
            let message = {senderId: state.id, content: text, groupId: groupId};
            userService.post(`/${state.id}/messages/group/${groupId}`, message , {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            }).then(
                function(response) {
                    getMessages();
                    changeInput('');
                }
            ).catch(error => console.log(error));
        }
    };

    const onLayout = ({
        nativeEvent: { layout: { height } },
      }) => {
        const off = fullHeight - height;
        setOffset(off);
      }

    const renderchatBubbleStyles = (message, i) => {
        let array = [];

        if (message.post == null) {
            array.push(styles.chatBubble);
        } else {
            array.push(styles.chatBubblePost);
        }
        
        if (message.senderId != state.id) {
            array.push(styles.chatBubbleRcvd);
            if (i != 0) {
                if (messages[i-1].senderId != state.id && messages[i-1].senderId == message.senderId &&
                        Date.parse(messages[i-1].messageSent) - Date.parse(message.messageSent)  > -1 * 2 * 60 * 60 * 1000) {
                    array.push(styles.twoRcvdBubbles);
                }
            }

        } else {
            array.push(styles.chatBubbleSent);
            if (i != 0) {
                if (messages[i-1].senderId == state.id && Date.parse(messages[i-1].messageSent) - Date.parse(message.messageSent)  > -1 * 2 * 60 * 60 * 1000) {
                    array.push(styles.twoSentBubbles);
                }
            }
        }

        if (i == (messages.length - 1) || messages[i+1].senderId != message.senderId || 
            Date.parse(messages[i+1].messageSent) - Date.parse(message.messageSent)  > 2 * 60 * 60 * 1000) {
            array.push(styles.chatBubbleStop);
        }

        return array;
    }

    function convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
    
        newDate.setHours(hours - offset - 24);
    
        return newDate;   
    }

    const styleOfCenterDates = {
        flavour: 'long',
        gradation: [
            {
                factor: 60 * 60,
                threshold: 0,
                format: (value, locale) => {
                    var d = new Date(value);
                    var time = d.toLocaleTimeString(locale);
                    var timeToReturn = time.substring(0, time.length - 6).concat(` ${time.substring(time.length - 2)}`);
                    return timeToReturn;
                }

            },
            {
                factor: 60 * 60,
                threshold: (now, future) => {
                    var midnight = (new Date(now)).setHours(0,0,0,0);
                    return (now - midnight)/ 3600;
                },
                format: (value, locale) => {
                    var stringToReturn = 'Yesterday ';
                    var d = new Date(value);
                    var time = d.toLocaleTimeString(locale);
                    var timeToReturn = time.substring(0, time.length - 6).concat(` ${time.substring(time.length - 2)}`);
                    return stringToReturn + timeToReturn;
                }
            },
            {
                factor: 60 * 60,
                threshold: (now, future) => {
                    var midnight = (new Date(now)).setHours(0,0,0,0);
                    var dateToday = (new Date(now)).getDate();
                    var yesterdayMidnight = (new Date(midnight).setDate(dateToday - 2));
                    return (now - yesterdayMidnight)/ 3600;
                },
                format: (value, locale) => {
                    var d = new Date(value);
                    var dayOftheWeek = d.getDay();
                    var stringToReturn;
                    if (dayOftheWeek == 0)
                        stringToReturn = 'Sunday ';
                    else if (dayOftheWeek == 1)
                        stringToReturn = 'Monday ';
                    else if (dayOftheWeek == 2)
                        stringToReturn = 'Tuesday ';
                    else if (dayOftheWeek == 3)
                        stringToReturn = 'Wednesday ';
                    else if (dayOftheWeek == 4)
                        stringToReturn = 'Thursday ';
                    else if (dayOftheWeek == 5)
                        stringToReturn = 'Friday ';
                    else 
                        stringToReturn = 'Saturday ';
                    var time = d.toLocaleTimeString(locale);
                    var timeToReturn = time.substring(0, time.length - 6).concat(` ${time.substring(time.length - 2)}`);
                    return stringToReturn + timeToReturn;
                }
            },
            {
                factor: 60 * 60,
                threshold: (now, future) => {
                    var midnight = (new Date(now)).setHours(0,0,0,0);
                    var dateToday = (new Date(now)).getDate();
                    var dateMidnight = (new Date(midnight).setDate(dateToday - 7));
                    return (now - dateMidnight)/ 3600;
                },
                format: (value, locale) => {
                    var d = new Date(value);
                    var dayOftheWeek = d.getDay();
                    var dateNumber = d.getDate();
                    var monthNumber = d.getMonth();
                    var month = 'Jan';
                    if (monthNumber == 1)
                        month = 'Feb';
                    else if (monthNumber == 2)
                        month = 'Mar';
                    else if (monthNumber == 3)
                        month = 'Apr';
                    else if (monthNumber == 4)
                        month = 'May';
                    else if (monthNumber == 5)
                        month = 'Jun';
                    else if (monthNumber == 6)
                        month = 'Jul';
                    else if (monthNumber == 7)
                        month = 'Aug';
                    else if (monthNumber == 8)
                        month = 'Sep';
                    else if (monthNumber == 9)
                        month = 'Oct';
                    else if (monthNumber == 10)
                        month = 'Nov';
                    else
                        month = 'Dec';
                    
                    var stringToReturn;
                    if (dayOftheWeek == 0)
                        stringToReturn = `Sun, ${month} ${dateNumber}, `;
                    else if (dayOftheWeek == 1)
                        stringToReturn = `Mon, ${month} ${dateNumber}, `;
                    else if (dayOftheWeek == 2)
                        stringToReturn = `Tue, ${month} ${dateNumber}, `;
                    else if (dayOftheWeek == 3)
                        stringToReturn = `Wed, ${month} ${dateNumber}, `;
                    else if (dayOftheWeek == 4)
                        stringToReturn = `Thu, ${month} ${dateNumber}, `;
                    else if (dayOftheWeek == 5)
                        stringToReturn = `Fri, ${month} ${dateNumber}, `;
                    else 
                        stringToReturn = `Sat, ${month} ${dateNumber}, `;
                    var time = d.toLocaleTimeString(locale);
                    var timeToReturn = time.substring(0, time.length - 6).concat(` ${time.substring(time.length - 2)}`);
                    return stringToReturn + timeToReturn;
                }
            },
            {
                factor: 60 * 60,
                threshold: (now, future) => {
                    var midnight = (new Date(now)).setHours(0,0,0,0);
                    var d = new Date(now);
                    var dateToday = (new Date(now)).getFullYear();
                    var dateMidnight = (new Date(midnight).setFullYear(dateToday - 1, d.getMonth(), d.getDate()));
                    return (now - dateMidnight)/ 3600;
                },
                format: (value, locale) => {
                    var d = new Date(value);
                    var dayOftheWeek = d.getDay();
                    var dateNumber = d.getDate();
                    var monthNumber = d.getMonth();
                    var year = d.getFullYear();
                    var month = 'Jan';
                    if (monthNumber == 1)
                        month = 'Feb';
                    else if (monthNumber == 2)
                        month = 'Mar';
                    else if (monthNumber == 3)
                        month = 'Apr';
                    else if (monthNumber == 4)
                        month = 'May';
                    else if (monthNumber == 5)
                        month = 'Jun';
                    else if (monthNumber == 6)
                        month = 'Jul';
                    else if (monthNumber == 7)
                        month = 'Aug';
                    else if (monthNumber == 8)
                        month = 'Sep';
                    else if (monthNumber == 9)
                        month = 'Oct';
                    else if (monthNumber == 10)
                        month = 'Nov';
                    else
                        month = 'Dec';
                    
                    var stringToReturn;
                    if (dayOftheWeek == 0)
                        stringToReturn = `Sun, ${month} ${dateNumber}, ${year}, `;
                    else if (dayOftheWeek == 1)
                        stringToReturn = `Mon, ${month} ${dateNumber}, ${year}, `;
                    else if (dayOftheWeek == 2)
                        stringToReturn = `Tue, ${month} ${dateNumber}, ${year}, `;
                    else if (dayOftheWeek == 3)
                        stringToReturn = `Wed, ${month} ${dateNumber}, ${year}, `;
                    else if (dayOftheWeek == 4)
                        stringToReturn = `Thu, ${month} ${dateNumber}, ${year}, `;
                    else if (dayOftheWeek == 5)
                        stringToReturn = `Fri, ${month} ${dateNumber}, ${year}, `;
                    else 
                        stringToReturn = `Sat, ${month} ${dateNumber}, ${year}, `;
                    var time = d.toLocaleTimeString(locale);
                    var timeToReturn = time.substring(0, time.length - 6).concat(` ${time.substring(time.length - 2)}`);
                    return stringToReturn + timeToReturn;
                }
            },
        ]
    };

    const renderTimeText = (message, i) => {
            var d = convertUTCDateToLocalDate(new Date(message.messageSent));
            var time = d.toLocaleTimeString(en);
            var timeToReturn = time.substring(0, time.length - 6).concat(` ${time.substring(time.length - 2)}`);
            return <Text style={[styles.timeAgo, message.senderId == state.id ? {alignSelf: 'flex-end'}:
            {alignSelf: 'flex-start'}]}>{timeToReturn}</Text>
            
    };

    return (
        <View style={{flex: 1}} onLayout={onLayout}>
        <KeyboardAvoidingView keyboardVerticalOffset={offest} behavior={Platform.OS === "ios" ? "padding" : null} style={{flex: 1}} enabled>
            <ScrollView ref={scrollView} style={{marginTop: 10}}>
                {messages.map((message, i) => (
                    <View key={i}>
                        {i == 0 || Date.parse(messages[i-1].messageSent) - Date.parse(message.messageSent)  < -1 * 2 * 60 * 60 * 1000 ? 
                            <Text style={{color: 'gray', alignSelf: 'center', marginBottom: 10}}>{timeAgo.format(convertUTCDateToLocalDate(new Date(message.messageSent)), styleOfCenterDates)}</Text>: null}
                        {message.senderId != state.id && i > 0 && messages[i - 1].senderId != message.senderId ? <Text style={styles.nameText}>
                            {message.senderUsername}
                        </Text>: null}
                        <View style={renderchatBubbleStyles(message, i)}>
                            {message.post ? (
                                <TouchableOpacity onPress={() => navigation.push('SinglePost', {postId: message.post.id})}>
                                    <PostCardMessage navigation={navigation} post={message.post}/>
                                </TouchableOpacity>
                            ): (
                            <Text style={[styles.text]}>
                                {message.content}
                            </Text>)}
                        </View>
                        {i == (messages.length - 1) || messages[i+1].senderId != message.senderId  || 
                            Date.parse(messages[i+1].messageSent) - Date.parse(message.messageSent)  > 2 * 60 * 60 * 1000 ? renderTimeText(message, i) : null}
                        
                    </View>
                ))}
            </ScrollView>
            <View style={styles.bottomBorder}>
                <View style={styles.inputContainer}>
                    <TextInput placeholderTextColor="gray" style={styles.input} value={messageInput} 
                        onChangeText={(text) => changeInput(text)} onSubmitEditing={() => sendMessage(messageInput)} 
                        returnKeyType="send" placeholder="Message..."/>
                    <TouchableOpacity onPress={() => sendMessage(messageInput)}>
                        <Text style={styles.postButton}>Send</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
        </View>
    );
};

const styles = EStyleSheet.create({
    inputContainer: {
        marginHorizontal: '1rem',
        marginVertical: '1rem',
        flexDirection: 'row',
    },
    bottomBorder: {
        borderTopWidth: '.03rem',
        borderColor: 'gray',
        backgroundColor: '$backgroundColor'
    },
    input: {
        fontSize: '1rem',
        borderWidth: 1,
        borderColor: '$textColor',
        paddingVertical: '.5rem',
        paddingHorizontal: '1rem',
        borderRadius: '2rem',
        flex: 1,
        color: '$textColor'
    },
    postButton: {
        color: '$crimson',
        paddingTop: '.6rem',
        paddingHorizontal: '.5rem',
        fontSize: '1rem'
    },
    timeAgo: {
        fontSize: '.75rem',
        color: 'gray',
        marginHorizontal: '1rem',
        marginBottom: '2rem'
    },
    secondLineWrapper: {
        flexDirection: 'row',
        marginTop: '.5rem'
    },
    headerView: {
        flexDirection: 'row',
        alignItems: 'center'
    },
    profilePicture: {
        width: '2rem',
        aspectRatio: 1,
        borderRadius: '2rem',
        marginRight: '.5rem',
        paddingBottom: '1rem'
    },
    headerText: {
        color: '$textColor',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    chatBubble: {
        marginVertical: '.1rem',
        paddingHorizontal: '1rem',
        paddingVertical: '.3rem',
        marginHorizontal: '1rem',
        borderTopLeftRadius: '1.25rem',
        borderTopRightRadius: '1.25rem',
        borderBottomLeftRadius: '.2rem',
        borderBottomRightRadius: '.2rem',
        maxWidth: '15rem'
    },
    chatBubblePost: {
        marginVertical: '.1rem',
        marginHorizontal: '1rem',
        borderTopLeftRadius: '1.25rem',
        borderTopRightRadius: '1.25rem',
        borderBottomLeftRadius: '.2rem',
        borderBottomRightRadius: '.2rem',
        maxWidth: '75%'
    },
    chatBubbleRcvd: {
        backgroundColor: 'gray',
        alignSelf: 'flex-start',
        borderBottomRightRadius: '1.25rem'
    },
    chatBubbleSent: {
        backgroundColor: '$crimson',
        alignSelf: 'flex-end',
        borderBottomLeftRadius: '1.25rem',

    },
    chatBubbleStop: {
        borderBottomLeftRadius: '1.25rem',
        borderBottomRightRadius: '1.25rem'
    },
    text: {
        color: 'white',
        fontSize: '1.25rem'
    },
    twoSentBubbles: {
        borderTopRightRadius: '.2rem'
    },
    twoRcvdBubbles: {
        borderTopLeftRadius: '.2rem'
    },
    avatar: {
        marginLeft: -15,
        position: 'relative',
        borderWidth: 3,
        borderColor: 'transparent',
        borderRadius: 50,
        overflow: 'hidden', 
        width: '2rem',
        height: '2rem',
    },
    avatars: {
        position: 'relative',
        flexDirection: 'row',
        display: 'flex',
        paddingLeft: 20,
        marginRight: '.5rem'
    },
    nameText: {
        marginHorizontal: '2rem',
        fontWeight: 'bold',
        color: 'gray'
    }
});

GroupMessageThread.navigationOptions = ({navigation}) => {
    const photoUrls = navigation.getParam('photoUrls');
    const groupName = navigation.getParam('groupName');
    const groupId = navigation.getParam('groupId');
    return {
        headerTitle: () => (
            <View style={styles.headerView}>
                <View style={styles.avatars}>
                    {photoUrls.map((user, i) => (
                        <Image key={i} style={styles.avatar} source={user.photoUrl ? {uri: user.photoUrl} : 
                            require('./../../assets/user.png')}/>
                    ))}
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('GroupManager', {groupId: groupId, groupName})}>
                    <Text style={styles.headerText}>{groupName}</Text>
                </TouchableOpacity>
            </View>
        ),
    };
};

export default GroupMessageThread;