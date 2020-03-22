import React, {useEffect, useState, useContext} from 'react';
import { Text, View, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert, Keyboard } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import userService from './../apis/user';
import { Context } from '../context/AuthContext';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem } from 'react-native-elements';
import {FontAwesome} from 'react-native-vector-icons';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

const Comments = ({
    navigation
}) => {
    const {state} = useContext(Context);
    const [comments, setComments] = useState([]);
    const postId = navigation.getParam('postId');
    const myPost = navigation.getParam('myPost');
    const [commentInput, changeInput] = useState('');
    console.log(comments);
    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo('en-US');

    useEffect(() => {
        userService.get(`/comments/${postId}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                response.data.forEach(element => {
                    element.likes = element.likeList.length;
                    if (element.commenterId == state.id || myPost) {
                        element.deleteable = true;
                    }
                    element.liked = false;
                    element.likeList.forEach(e => {
                        if (e.commenterId == state.id) {
                          element.liked = true;
                        }
                    });
                });
                setComments(response.data);
            }).catch(error => {
                console.log(error);
            });
    }, []);

    const getComments = () => {
        userService.get(`/comments/${postId}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                response.data.forEach(element => {
                    element.likes = element.likeList.length;
                    if (element.commenterId == state.id || myPost) {
                        element.deleteable = true;
                    }
                    element.liked = false;
                    element.likeList.forEach(e => {
                        if (e.commenterId == state.id) {
                          element.liked = true;
                        }
                    });
                });
                setComments(response.data);
            }).catch(error => {
                console.log(error);
            });
    }

    const deleteComment = (id) => {
        userService.delete(`/${id}/deleteComment`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        })
        .then(
            function (response) {
                setComments(comments.filter((item) => item.id !== id));
            }
        ).catch(error => console.log(error));
    };

    const likeComment = (comment) => {
        userService.post(`/${state.id}/comment/like/${comment.id}/${postId}`, {} , {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                comment.liked = true;
                comment.likes++;
                const old = comments.filter((item) => item.id !== comment.id)
                setComments([...old, comment]);
            }
        ).catch(error => console.log(error));
    }

    const unlikeComment = (comment) => {
        userService.post(`/${state.id}/comment/unlike/${comment.id}/${postId}`, {} , {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                comment.liked = false;
                comment.likes--;
                const old = comments.filter((item) => item.id !== comment.id)
                setComments([...old, comment]);
            }
        ).catch(error => console.log(error));
    }

    const sendComment = (text) => {
        if (text !== '') {
            let comment = {postId: postId, text: text, commenterId: state.id};
            userService.post(`/comment`, comment , {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            }).then(
                function(response) {
                    getComments();
                    changeInput('');
                }
            ).catch(error => console.log(error));
        }
    };

    return (
        <KeyboardAvoidingView keyboardVerticalOffset={60} behavior={Platform.OS === "ios" ? "height" : null} style={{flex: 1}} enabled>
            <ScrollView>
                {comments.map((comment, index) => (
                    <ListItem
                    key={index}
                    leftAvatar={{source: {uri: comment.photoUrl}}}
                    title={
                        <View style={styles.commentWrapper}>
                            <TouchableOpacity onPress={() => navigation.navigate('Profile', {username: comment.username})}>
                                <Text style={styles.username}>{comment.username}</Text>
                            </TouchableOpacity>
                            <Text style={styles.commentText}>{comment.text}</Text>
                        </View>
                    }
                    chevron={
                        !comment.liked ? 
                            (
                                <TouchableOpacity onPress={() => likeComment(comment)} style={styles.touchableOpacityLike}>
                                    <FontAwesome style={styles.likeButtonO} name="heart-o"></FontAwesome>
                                </TouchableOpacity>) :
                            (
                                <TouchableOpacity onPress={() => unlikeComment(comment)} style={styles.touchableOpacityLike}>
                                    <FontAwesome style={styles.likeButton} name="heart"></FontAwesome>
                                </TouchableOpacity>)
                    }
                    subtitle={
                        <View style={styles.secondLineWrapper}>
                            <Text style={styles.timeAgo}>{timeAgo.format(Date.parse(comment.created), 'twitter')}</Text>
                            {comment.likes > 0 ? <TouchableOpacity onPress={() => 
                                navigation.navigate('List', {type: 'commentLikers', identifier: comment.id})}>
                                    <Text style={styles.timeAgo}>{comment.likes} Likes</Text>
                                </TouchableOpacity> : null}
                            <TouchableOpacity>
                                <Text style={styles.timeAgo}>Reply</Text>
                            </TouchableOpacity>
                            {comment.deleteable ?
                            <TouchableOpacity onPress={() => {
                                Alert.alert(
                                    'Delete Comment',
                                    'Are you sure you want to delete this comment?',
                                    [
                                      {
                                        text: 'Cancel',
                                        style: 'cancel',
                                      },
                                      {text: 'Yes', onPress: () => deleteComment(comment.id)},
                                    ],
                                    {cancelable: false},
                                  );
                            }}>
                                <FontAwesome style={styles.trashIcon} name="trash-o"/>
                            </TouchableOpacity> : null
                            }
                        </View>
                    }
                    />
                ))}
            </ScrollView>
            <View style={styles.bottomBorder}>
                <View style={styles.inputContainer}>
                    <TextInput style={styles.input} value={commentInput} 
                        onChangeText={(text) => changeInput(text)} onSubmitEditing={() => sendComment(commentInput)} 
                        returnKeyType="send" placeholder="Leave a comment..."/>
                    <TouchableOpacity onPress={() => sendComment(commentInput)}>
                        <Text style={styles.postButton}>Post</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </KeyboardAvoidingView>
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
    username: {
        fontSize: '1rem',
        fontWeight: 'bold',
        marginRight: '.75rem'
    },
    commentWrapper: {
        flexDirection: 'row',
    },
    commentText: {
        fontSize: '1rem'
    },
    likeButton: {
        fontSize: '1rem',
        color: '$crimson'
    },
    likeButtonO: {
        fontSize: '1rem',
        color: '$crimson'
    },
    touchableOpacityLike: {
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
    trashIcon: {
        fontSize: '1rem'
    }
});

export default Comments;