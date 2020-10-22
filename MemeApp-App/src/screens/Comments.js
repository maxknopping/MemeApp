import React, {useEffect, useState, useContext, useRef} from 'react';
import { Text, View, ScrollView, TextInput, KeyboardAvoidingView, TouchableOpacity, Alert, Keyboard, Dimensions } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import userService from './../apis/user';
import { Context } from '../context/AuthContext';
import { FlatList } from 'react-native-gesture-handler';
import { ListItem } from 'react-native-elements';
import {FontAwesome, Feather} from 'react-native-vector-icons';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';

const { height: fullHeight } = Dimensions.get('window');

const Comments = ({
    navigation
}) => {
    const {state} = useContext(Context);
    const [comments, setComments] = useState([]);
    const postId = navigation.getParam('postId');
    const myPost = navigation.getParam('myPost');
    const [offest, setOffset] = useState(0);
    const [commentInput, changeInput] = useState('');
    const textInput = useRef(null);
    const [replying, setReplying] = useState(false);
    const [replyingComment, setReplyingComment] = useState(null);
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
                    element.replies.forEach(reply => {
                        reply.likes = reply.likeList.length;
                        if (reply.commenterId == state.id || myPost) {
                            reply.deleteable = true;
                        }
                        reply.liked = false;
                        reply.likeList.forEach(e => {
                            if (e.likerId == state.id) {
                              reply.liked = true;
                            }
                        });
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
                    element.replies.forEach(reply => {
                        reply.likes = reply.likeList.length;
                        if (reply.commenterId == state.id || myPost) {
                            reply.deleteable = true;
                        }
                        reply.liked = false;
                        reply.likeList.forEach(e => {
                            if (e.commenterId == state.id) {
                              reply.liked = true;
                            }
                        });
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

    //comment is the reply
    const deleteReply = (comment) => {
        userService.delete(`/${comment.id}/deleteReply`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        })
        .then(
            function (response) {
                var fullComment = comments.find(item => item.id == comment.commentId);
                var reply = fullComment.replies.find(item => item.id == comment.id);
                var repliesNew = fullComment.replies.filter(item => item.id !== reply.id);
                fullComment.replies = repliesNew;
                const old = comments.filter((item) => item.id !== comment.commentId);
                setComments([...old, fullComment]);
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
                const old = comments.filter((item) => item.id !== comment.id);
                setComments([...old, comment]);
            }
        ).catch(error => console.log(error));
    }

    const likeReply = (comment) => {
        userService.post(`/${state.id}/reply/like/${comment.id}/${postId}/${comment.commentId}`, {} , {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                var fullComment = comments.find(item => item.id == comment.commentId);
                var reply = fullComment.replies.find(item => item.id == comment.id);
                reply.liked = true;
                reply.likes++;
                var repliesNew = fullComment.replies.filter(item => item.id !== reply.id);
                repliesNew.push(reply);
                fullComment.replies = repliesNew;
                console.log(fullComment);
                const old = comments.filter((item) => item.id !== comment.commentId);
                setComments([...old, fullComment]);
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
                const old = comments.filter((item) => item.id !== comment.id);
                setComments([...old, comment]);
            }
        ).catch(error => console.log(error));
    };

    const unlikeReply = (comment) => {
        userService.post(`/${state.id}/reply/unlike/${comment.id}/${postId}/${comment.commentId}`, {} , {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                var fullComment = comments.find(item => item.id == comment.commentId);
                var reply = fullComment.replies.find(item => item.id == comment.id);
                reply.liked = false;
                reply.likes--;
                var repliesNew = fullComment.replies.filter(item => item.id !== reply.id);
                repliesNew.push(reply);
                fullComment.replies = repliesNew;
                console.log(fullComment);
                const old = comments.filter((item) => item.id !== comment.commentId);
                setComments([...old, fullComment]);
            }
        ).catch(error => console.log(error));
    };

    const sendComment = (text) => {
        console.log(replying);
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

    const sendReply = (text) => {
        console.log('replying');
        if (text !== '') {
            let comment = {postId: postId, text: text, commentId: replyingComment.id, commenterId: state.id};
            userService.post(`/reply`, comment , {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            }).then(
                function(response) {
                    getComments();
                    changeInput('');
                    setReplying(false);
                    setReplyingComment(null);
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

    const onReplyPress = (comment) => {
        if (textInput.current != null) {
            setReplying(true);
            setReplyingComment(comment);
            textInput.current.focus();
        }
    };

    const onXPress = () => {
        setReplying(false);
        setReplyingComment(null);
    };

    return (
        <View style={{flex: 1}} onLayout={onLayout}>
        <KeyboardAvoidingView keyboardVerticalOffset={offest} behavior={Platform.OS === "ios" ? "padding" : null} style={{flex: 1}} enabled>
            <ScrollView>
                {comments.map((comment, index) => (
                    <>
                    <ListItem
                    key={index}
                    containerStyle={{backgroundColor: EStyleSheet.value('$backgroundColor')}}
                    leftAvatar={{source: comment.photoUrl ? {uri: comment.photoUrl} : 
                        require('./../../assets/user.png')}}
                    title={
                        <View style={styles.commentWrapper}>
                            <TouchableOpacity onPress={() => navigation.push('Profile', {username: comment.username})}>
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
                                navigation.push('List', {type: 'commentLikers', identifier: comment.id})}>
                                    <Text style={styles.timeAgo}>{comment.likes} Likes</Text>
                                </TouchableOpacity> : null}
                            <TouchableOpacity onPress={() => onReplyPress(comment)}>
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
                    {comment.replies.map((comment, index) => (
                        <ListItem
                        key={comment.id}
                        containerStyle={{backgroundColor: EStyleSheet.value('$backgroundColor'), marginLeft: 30}}
                        leftAvatar={{source: comment.photoUrl ? {uri: comment.photoUrl} : 
                            require('./../../assets/user.png')}}
                        title={
                            <View style={styles.commentWrapper}>
                                <TouchableOpacity onPress={() => navigation.push('Profile', {username: comment.username})}>
                                    <Text style={styles.username}>{comment.username}</Text>
                                </TouchableOpacity>
                                <Text style={styles.commentText}>{comment.text}</Text>
                            </View>
                        }
                        chevron={
                            !comment.liked ? 
                                (
                                    <TouchableOpacity onPress={() => likeReply(comment)} style={styles.touchableOpacityLike}>
                                        <FontAwesome style={styles.likeButtonO} name="heart-o"></FontAwesome>
                                    </TouchableOpacity>) :
                                (
                                    <TouchableOpacity onPress={() => unlikeReply(comment)} style={styles.touchableOpacityLike}>
                                        <FontAwesome style={styles.likeButton} name="heart"></FontAwesome>
                                    </TouchableOpacity>)
                        }
                        subtitle={
                            <View style={styles.secondLineWrapper}>
                                <Text style={styles.timeAgo}>{timeAgo.format(Date.parse(comment.created), 'twitter')}</Text>
                                {comment.likes > 0 ? <TouchableOpacity onPress={() => 
                                    navigation.push('List', {type: 'replyLikers', identifier: comment.id})}>
                                        <Text style={styles.timeAgo}>{comment.likes} Likes</Text>
                                    </TouchableOpacity> : null}
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
                                          {text: 'Yes', onPress: () => deleteReply(comment)},
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
                    </>
                ))}
            </ScrollView>
            <View style={styles.bottomBorder}>
                {replying ? <View style={{backgroundColor: 'gray', width: '100%', padding: 10, flexDirection: 'row', alignItems: 'center'}}>
                <Text>Replying to {replyingComment.username}'s comment</Text>
                <TouchableOpacity onPress={() => onXPress()} style={{marginLeft: 'auto'}}>
                    <Feather style={{fontSize: 20}} name="x"/>
                </TouchableOpacity>
                </View>: null}
                <View style={styles.inputContainer}>
                    <TextInput ref={textInput} placeholderTextColor="gray" style={styles.input} value={commentInput} 
                        onChangeText={(text) => changeInput(text)} onSubmitEditing={() => replying ? sendReply(commentInput) : sendComment(commentInput)} 
                        returnKeyType="send" placeholder="Leave a comment..."/>
                    <TouchableOpacity onPress={() => replying ? sendReply(commentInput) : sendComment(commentInput)}>
                        <Text style={styles.postButton}>Post</Text>
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
        borderWidth: '.03rem',
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
    username: {
        fontSize: '1rem',
        fontWeight: 'bold',
        marginRight: '.75rem',
        color: '$textColor'
    },
    commentWrapper: {
        flexDirection: 'row',
    },
    commentText: {
        fontSize: '1rem',
        color: '$textColor'
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
        marginRight: '1rem'
    },
    secondLineWrapper: {
        flexDirection: 'row',
        marginTop: '.5rem'
    },
    trashIcon: {
        fontSize: '1rem',
        color: 'gray'
    }
});

export default Comments;