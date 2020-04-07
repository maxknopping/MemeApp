import React, {useEffect, useState, useContext, useRef} from 'react';
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

const MessageThread = ({
    navigation
}) => {
    const {state} = useContext(Context);
    const [messages, setMessages] = useState([]);
    const [offest, setOffset] = useState(0);
    const [messageInput, changeInput] = useState('');
    const recipientId = navigation.getParam('recipientId');
    const scrollView = useRef(null);
    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo('en-US');

    useEffect(() => {
        scrollView.current && scrollView.current.scrollToEnd({animated: true});
     }, [messages]);

    useEffect(() => {
        userService.get(`/${state.id}/messages/thread/${recipientId}`, {
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
                console.log(response.data);
            }
        ).catch(error => console.log(error));
    }, []);

    const getMessages = () => {
        userService.get(`/${state.id}/messages/thread/${recipientId}`, {
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
                console.log(response.data);
            }
        ).catch(error => console.log(error));
    };

    const sendMessage = (text) => {
        if (text !== '') {
            let message = {senderId: state.id, content: text, recipientId: recipientId};
            userService.post(`/${state.id}/messages`, message , {
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
                if (messages[i-1].senderId != state.id) {
                    array.push(styles.twoRcvdBubbles);
                }
            }

        } else {
            array.push(styles.chatBubbleSent);
            if (i != 0) {
                if (messages[i-1].senderId == state.id) {
                    array.push(styles.twoSentBubbles);
                }
            }
        }

        if (i == (messages.length - 1) || messages[i+1].senderId != message.senderId) {
            array.push(styles.chatBubbleStop);
        }

        return array;
    }

    return (
        <View style={{flex: 1}} onLayout={onLayout}>
        <KeyboardAvoidingView keyboardVerticalOffset={offest} behavior={Platform.OS === "ios" ? "padding" : null} style={{flex: 1}} enabled>
            <ScrollView ref={scrollView} style={{marginTop: 10}}>
                {messages.map((message, i) => (
                    <View key={i} style={renderchatBubbleStyles(message, i)}>
                        {message.post ? (
                            <TouchableOpacity onPress={() => navigation.navigate('SinglePost', {postId: message.post.id})}>
                                <PostCardMessage navigation={navigation} post={message.post}/>
                            </TouchableOpacity>
                        ): (
                        <Text style={[styles.text]}>
                            {message.content}
                        </Text>)}
                    </View>
                ))}
            </ScrollView>
            <View style={styles.bottomBorder}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} value={messageInput} 
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
        backgroundColor: 'white'
    },
    input: {
        fontSize: '1rem',
        borderWidth: '.03rem',
        borderColor: 'black',
        paddingVertical: '.5rem',
        paddingHorizontal: '1rem',
        borderRadius: '2rem',
        flex: 1
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
        marginRight: '.75rem'
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
        color: 'black',
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
        backgroundColor: '#0084ff',
        alignSelf: 'flex-end',
        borderBottomLeftRadius: '1.25rem'

    },
    chatBubbleStop: {
        borderBottomLeftRadius: '1.25rem',
        borderBottomRightRadius: '1.25rem',
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
    }
});

MessageThread.navigationOptions = ({navigation}) => {
    const photoUrl = navigation.getParam('photoUrl');
    const username = navigation.getParam('username');
    console.log(username);
    return {
        headerTitle: () => (
            <View style={styles.headerView}>
                <Image style={styles.profilePicture} source={photoUrl ? {uri: photoUrl} : require('./../../assets/user.png')}/>
                <TouchableOpacity>
                    <Text style={styles.headerText}>{username}</Text>
                </TouchableOpacity>
            </View>
        ),
    };
};

export default MessageThread;