import React, {useState, useEffect, useContext} from 'react';
import { Text, View, Image, TouchableOpacity, Dimensions } from 'react-native';
import {Context} from './../context/AuthContext';
import userService from './../apis/user';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Entypo, FontAwesome, EvilIcons, SimpleLineIcons} from 'react-native-vector-icons';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';


const PostCard = ({
    post, navigation
}) => {
    const {state} = useContext(Context);
    const {width, height} = Dimensions.get('window');
    const [liked, setLiked] = useState(false);
    const [postState, setPost] = useState(null);
    const [myPost, setMyPost] = useState(false);
    const [likes, setLikes] = useState(0);

    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo('en-US');

    useEffect(() => {
        setPost(post);
        if (post.likeList.length > 0) {
            setLikes(post.likeList.length);
            for (let item in post.likeList) {
                if (post.likeList[item].likerId === state.id) {
                    setLiked(true);
                }
            }
        }
        if (state.username === post.username) {
            setMyPost(true);
        }
    }, []);

    likePost = () => {
            userService.post(`/${state.id}/like/${post.id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            })
            .then(
                function (response) {
                    setLiked(true);
                    setLikes(likes + 1);
                }
            ).catch(error => console.log(error));
    };
    
    unlikePost = () => {
            userService.post(`/${state.id}/unlike/${post.id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            })
            .then(
                function (response) {
                    setLiked(false);
                    setLikes(likes - 1);
                }
            ).catch(error => console.log(error));
    };
    

    return (
        <View style={{flex: 1}}>
            {postState ?
                <View style={{flex: 1}}>
                <View style={styles.headerContainerView}>
                    <Image style={styles.profilePicture} source={postState.profilePictureUrl ? {uri: postState.profilePictureUrl} : 
                        require('./../../assets/user.png')} />
                    <View style={styles.usernameWrapper}>
                        <TouchableOpacity onPress={() => navigation.navigate('Profile', {username: postState.username})}>
                            <Text style={styles.headerUsername}>{postState.username}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity>
                            <Entypo style={styles.ellipsis} name="dots-three-horizontal"/>
                        </TouchableOpacity>
                    </View>
                </View>
                <Image style={{width: width, height: width}} source={{uri: postState.url}}/>
                <View style={styles.iconsContainer}>
                    {!liked ? 
                        (
                            <TouchableOpacity onPress={likePost}>
                                <FontAwesome style={styles.likeButtonO} name="heart-o"></FontAwesome>
                            </TouchableOpacity>) :
                        (
                            <TouchableOpacity onPress={unlikePost}>
                                <FontAwesome style={styles.likeButton} name="heart"></FontAwesome>
                            </TouchableOpacity>)}
                    <TouchableOpacity onPress={() => navigation.navigate('Comments', {postId: post.id, myPost: myPost})}>
                        <FontAwesome style={styles.commentIcon} name="comment-o"/>
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <SimpleLineIcons style={styles.planeIcon} name="paper-plane"/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity onPress={() => navigation.navigate('List', {type: 'likers', identifier: post.id})}>
                    <Text style={styles.likeCount}>{likes} Likes</Text>
                </TouchableOpacity>
                <View style={styles.captionWrapper}>
                        
                        <Text style={styles.caption}>
                            <Text onPress={() => navigation.navigate('Profile', {username: postState.username})} style={styles.captionUsername}>
                                {postState.username}
                            </Text>
                        {' '}{postState.caption}
                        </Text>
                </View>
                { postState.comments.length > 0 ?
                    <View style={styles.commentWrapper}>
                        <TouchableOpacity onPress={() => navigation.navigate('Comments', {postId: postState.id, myPost: myPost})}>
                            <Text style={styles.comments}>View all {postState.comments.length} comments</Text>
                        </TouchableOpacity>
                    </View>
                    : null
                }
                <View style={styles.timeAgoWrapper}>
                        <Text style={styles.timeAgo}>{timeAgo.format(Date.parse(postState.created))}</Text>
                </View>
                </View>
                : null}
        </View>
        
    );

};

const styles = EStyleSheet.create({
    profilePicture: {
        width: '10%',
        aspectRatio: 1/1,
        borderRadius: '3rem',
        marginHorizontal: '2%'
    },
    headerContainerView: {
        marginTop: '1rem',
        flexDirection: 'row',
        flex: 1,
        marginBottom: '.5rem'
    },
    headerUsername: {
        marginTop: '.5rem',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    usernameWrapper: {
        justifyContent: 'space-between',
        flexDirection: 'row',
        flex: 1
    },
    ellipsis: {
        fontSize: '1rem',
        marginRight: '1rem',
        marginTop: '.5rem',
        fontWeight: 'bold'
    },
    iconsContainer: { 
        flexDirection: 'row',
        marginTop: '1%',
        marginLeft: '3%'
    },
    likeButton: {
        color: '$crimson',
        fontSize: '1.5rem'
    },
    likeButtonO: {
        color: 'black',
        fontSize: '1.5rem'
    },
    commentIcon: {
        fontSize: '1.5rem', 
        marginHorizontal: '1.4rem'
    },
    planeIcon: {
        fontSize: '1.5rem'
    },
    likeCount: {
        fontSize: '1rem',
        fontWeight: 'bold',
        marginHorizontal: '3%',
        marginTop: '2%'
    },
    captionWrapper: {
        marginHorizontal: '3%',
        marginTop: '1%',
        flexDirection: 'row',
        flex: 1,
        flexWrap: 'wrap',
    },
    captionUsername: {
        fontWeight: 'bold',
        fontSize: '1rem',
        marginRight: '.5rem'
    },
    caption: {
        fontSize: '1rem'
    },
    comments: {
        fontSize: '1rem',
        fontWeight: 'bold'
    },
    commentWrapper: {
        marginHorizontal: '3%',
        marginTop: '.5rem'
    },
    timeAgo: {
        fontSize: '1rem',
        color: 'gray'
    },
    timeAgoWrapper: {
        marginTop: '.5rem',
        marginHorizontal: '3%'
    }
});

export default PostCard;