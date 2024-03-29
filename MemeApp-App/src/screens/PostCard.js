import React, {useState, useEffect, useContext, useRef} from 'react';
import { Text, View, TouchableOpacity, Dimensions, TextInput, ScrollView, 
    ActivityIndicator, Alert, TouchableWithoutFeedback, Share, Platform, Image as RNImage, Animated } from 'react-native';
import {Overlay, ListItem, CheckBox, Button} from 'react-native-elements';
import {Context} from './../context/AuthContext';
import userService from './../apis/user';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Entypo, FontAwesome, Feather, SimpleLineIcons, EvilIcons} from 'react-native-vector-icons';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import * as MediaLibrary from 'expo-media-library';
import * as Permissions from 'expo-permissions';
import getPermissions from './../helpers/getPermissions';
import Image from 'react-native-image-progress';
import * as Progress from 'react-native-progress';
import {MaterialCommunityIcons} from 'react-native-vector-icons'
import { rgbaToInt } from 'jimp';


const PostCard = ({
    post, navigation
}) => {
    const {state} = useContext(Context);
    const {width, height} = Dimensions.get('window');
    const [liked, setLiked] = useState(false);
    const [postState, setPost] = useState(null);
    const [myPost, setMyPost] = useState(false);
    const [likes, setLikes] = useState(0);
    const [searchInput, setSearchInput] = useState('');
    const [list, setList] = useState([]);
    const [groupIds, setGroupIds] = useState([]);
    const [searchVisible, setSearchVisible] = useState(false);
    const [postOptionsVisible, setOptionsVisible] = useState(false);
    const [userIds, setUserIds] = useState([]);
    const [editCaptionVisible, setEditCaptionVisible] = useState(false);
    const [caption, setCaption] = useState('');
    let lastTap = null;

    TimeAgo.addLocale(en)
    const timeAgo = new TimeAgo('en-US');
    var animatedValue = useRef(new Animated.Value(0));

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
        if (state.username === post.username || state.isAdmin) {
            setMyPost(true);
        }
    }, []);

    function convertUTCDateToLocalDate(date) {
        var newDate = new Date(date.getTime()+date.getTimezoneOffset()*60*1000);
    
        var offset = date.getTimezoneOffset() / 60;
        var hours = date.getHours();
    
        newDate.setHours(hours - offset - 24);
    
        return newDate;   
    }

    const renderOverlay = () => {

        const imageStyles = [
            styles.heartOverlay,
            {
              opacity: animatedValue.current,
              transform: [
                {
                  scale: animatedValue.current.interpolate({
                    inputRange: [0, 1],
                    outputRange: [0.7, 1.5],
                  }),
                },
              ],
            },
          ];
      
        return (
          <Animated.View style={styles.heartOverlayContainer}>
            <Animated.Image style={imageStyles} source={require('./../../assets/heart.png')}/>
          </Animated.View>
        );
      }

    const getWatermarkedImage = async () => {
            console.log('started');
            const Jimp = require('jimp');
            const image = await Jimp.read(post.url);
            const logo = await Jimp.read('https://res.cloudinary.com/memehub/image/upload/v1589479228/logo_3x_yjchiz.png');

            logo.resize(image.bitmap.width / 5, Jimp.AUTO);
            const LOGO_MARGIN_PERCENTAGE = .5;
            const xMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
            const yMargin = (image.bitmap.width * LOGO_MARGIN_PERCENTAGE) / 100;
            const X = image.bitmap.width - logo.bitmap.width - xMargin;
            const Y = image.bitmap.height - logo.bitmap.height - yMargin;


            var markedImage = image.composite(logo, X, Y, [{
                mode: Jimp.BLEND_SCREEN,
                opacitySource: 0.1,
                opacityDest: 1
            }]);
            
            var base64 = await markedImage.getBase64Async(Jimp.AUTO);

            return base64;
    };

    const likePost = () => {
        setTimeout(()=> null, 0);
            userService.post(`/${state.id}/like/${post.id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            })
            .then(
                function (response) {
                    setLiked(true);
                    setLikes(likes + 1);
                    Animated.sequence([
                        Animated.spring(animatedValue.current, { toValue: 1, useNativeDriver: true}),
                        Animated.spring(animatedValue.current, { toValue: 0, useNativeDriver: true}),
                      ]).start();
                }
            ).catch(error => console.log(error));
    };
    
    const unlikePost = () => {
            userService.post(`/${state.id}/unlike/${post.id}`, {}, {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            })
            .then(
                function (response) {
                    setTimeout(()=> null, 0);
                    setLiked(false);
                    setLikes(likes - 1);
                }
            ).catch(error => console.log(error));
    };

    const reportPost = () => {
        userService.post(`/${state.id}/posts/report/${post.id}`, {}, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        })
        .then(
            function (response) {
                Alert.alert(
                    'Successfully Reported Post', '', [{text: 'Ok', style: 'default', onPress: () => setOptionsVisible(false)}]
                );
            }
        ).catch(error => console.log(error));
};

    const search = (text) => {
        userService.get(`/search/${state.id}/${text}/false`, {
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
                    element.groupId = 0;
                });
                setList([...response.data]);
                console.log(response.data);
            }
        ).catch(error => console.log(error));
    };

   const getInitialUsers = () => {
        userService.get(`/${state.id}/messages/users`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                response.data.forEach(element => {
                    element.checked = false;
                });
                setList(response.data);
            }
        ).catch(err => console.log(err));
    };

    const sendMessages = () => {
        userIds.forEach(element => {
            userService.post(`/${state.id}/messages/withPost`, {
                senderId: state.id, 
                recipientId: element, 
                postId: postState.id
            },
            {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            }).catch(error => console.log(error));
        });

        groupIds.forEach(element => {
            userService.post(`/${state.id}/messages/group/${element}`, {
                senderId: state.id,
                groupId: element,
                postId: postState.id
            }, {
                headers: {
                    'Authorization': `Bearer ${state.token}`
                }
            }).catch(error => console.log(error));
        });
    };

    const deletePhoto = async () => {
        const response = await userService.delete(`/${state.id}/posts/${post.id}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(() => {onDelete();
            
        }).catch(error => console.log(error));
        
    };

    const onDelete = () => {
        console.log('method called');
        Alert.alert(
            'Post has been deleted',
            '',
            [
              {
                text: 'Ok',
                style: 'default',
                onPress: () => setOptionsVisible(false)
              }
            ],
            {cancelable: true},
          );
    };

    const handleDoubleTap = () => {
        const now = Date.now();
        const DOUBLE_PRESS_DELAY = 300;
        if (lastTap && (now - lastTap) < DOUBLE_PRESS_DELAY) {
            lastTap = null;
            if (!liked) {
                likePost();
            } else {
                unlikePost();
            }
        } else {
          lastTap = now;
        }
      }

    const onShare = async () => {
        const baseUrl = 'https://memeclub.co/post';
        if (Platform.OS === 'ios') {
            Share.share({
                url: `${baseUrl}/${postState.id}`
            }, {
                excludedActivityTypes: [
                    'com.apple.UIKit.activity.AirDrop'
                ]
            });
        } else {
            Share.share({
                message: `${baseUrl}/${postState.id}`
            });
        }
    };

    const onSaveImage = async () => {
        const status = await getPermissions(Permissions.CAMERA_ROLL);
        if (status) {
            MediaLibrary.saveToLibraryAsync(post.url).then(() => setOptionsVisible(false));
        }
    }

    const sendNewCaption = () => {
        userService.put(`/${state.id}/posts/${post.id}`,{
            caption: caption,
            inJoust: postState.inJoust
        }, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(() => {
            setPost({...postState, caption: caption});
            setCaption('');
            setEditCaptionVisible(false);
            setOptionsVisible(false);
        }).catch(err => console.log(err));
    }
    
    return (
        <View style={{flex: 1}}>
            {postState ?
                <View style={{flex: 1}}>
                <View style={styles.headerContainerView}>
                    <RNImage style={styles.profilePicture} source={postState.profilePictureUrl ? {uri: postState.profilePictureUrl} : 
                        require('./../../assets/user.png')} />
                    <View style={styles.usernameWrapper}>
                        <TouchableOpacity onPress={() => navigation.push('Profile', {username: postState.username})}>
                            <Text style={styles.headerUsername}>{postState.username}</Text>
                        </TouchableOpacity>
                        <TouchableOpacity onPress={() => setOptionsVisible(true)}>
                            <Entypo style={styles.ellipsis} name="dots-three-horizontal"/>
                        </TouchableOpacity>
                        <Overlay isVisible={postOptionsVisible} children={
                            <>
                            <Text style={styles.text} onPress={reportPost}>
                                Report
                            </Text>
                            <Text onPress={onSaveImage} style={styles.text}>
                                Save Image
                            </Text>
                            {myPost ? <>
                            <Text onPress={() => setEditCaptionVisible(true)} style={styles.text}>
                                Edit Caption
                            </Text>
                            
                            <Text onPress={() => {
                                Alert.alert(
                                    'Delete Post',
                                    'Are you sure you want to delete this post?',
                                    [
                                      {
                                        text: 'Cancel',
                                        style: 'cancel',
                                      },
                                      {text: 'Yes', onPress: () => {deletePhoto();}},
                                    ],
                                    {cancelable: false},
                                  );
                            }} style={[styles.text, {color: '#DC143C'}]}>
                                Delete Post
                            </Text></> : null}
                            <Text onPress={() => setOptionsVisible(false)} style={[styles.text, {color: '#DC143C'}]}>
                                Cancel
                            </Text>
                            <Overlay isVisible={editCaptionVisible} onBackdropPress={() => {
                                setEditCaptionVisible(false); 
                                setOptionsVisible(false);
                                }} height={'auto'} width={'auto'} animationType={'fade'}>
                                <Text style={styles.text}>Edit Caption</Text>
                                <TextInput style={styles.textInput} placeholderTextColor="gray" placeholder="Add a caption..." multiline 
                                    value={caption}
                                    onChangeText={(text) => setCaption(text)}/>
                                <TouchableOpacity onPress={() => sendNewCaption()}>
                                    <Text style={styles.text}>OK</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={() => {
                                    setEditCaptionVisible(false);
                                    }}>
                                    <Text style={[styles.text, {color: '#DC143C'}]}>
                                        Cancel
                                    </Text>
                                </TouchableOpacity>
                            </Overlay>
                            </>
                            } onBackdropPress={() => setOptionsVisible(false)} height={'auto'} width={'auto'} animationType={'fade'}>
                        </Overlay>
                    </View>
                </View>
                <TouchableWithoutFeedback onPress={() => handleDoubleTap()}>
                    <View style={{justifyContent: 'center', alignItems: 'center'}}>
                        <Image indicator={Progress.Bar} indicatorProps={{color: EStyleSheet.value('$crimson')}} style={[{width: width, height: width}]}
                        blurRadius={postState.isReported ? 30: 0} source={{uri: postState.url}}>
                            <View style={postState.isReported ? {backgroundColor: 'rgba(0,0,0,0.7)', flex: 1}: null}>

                            </View>
                        </Image>
                        {renderOverlay()}
                        {postState.isReported ? <View style={{position: 'absolute', justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: 'white', fontSize: EStyleSheet.value('1rem'), textAlign: 'center'}}>This post may contain offensive content and is under review.</Text>
                            <TouchableOpacity style={{borderColor: 'white', borderWidth: 1, borderRadius: 10, padding: 7, marginTop: 10}} onPress={() => {
                                //let newPost = postState;
                                //console.log(postState);
                                //newPost.isReported = false;
                                setPost({...postState, isReported: false});
                            }}>
                                <Text style={{color: 'white', fontSize: EStyleSheet.value('1rem'), textAlign: 'center'}}>
                                    View Anyway 
                                </Text></TouchableOpacity>
                        </View>: null}
                    </View>
                </TouchableWithoutFeedback>
                <View style={styles.iconsContainer}>
                    {!liked ? 
                        (
                            <TouchableOpacity onPress={likePost}>
                                <Feather style={styles.likeButtonO} name="heart"></Feather>
                            </TouchableOpacity>) :
                        (
                            <TouchableOpacity onPress={unlikePost}>
                                <FontAwesome style={styles.likeButton} name="heart"></FontAwesome>
                            </TouchableOpacity>)}
                    <TouchableOpacity onPress={() => navigation.push('Comments', {postId: post.id, myPost: myPost})}>
                        <Feather style={styles.commentIcon} name="message-square"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => setSearchVisible(true)}>
                        <Feather style={styles.planeIcon} name="send"/>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onShare()}>
                        <Feather style={styles.shareIcon} name="external-link"/>
                    </TouchableOpacity>
                    <Overlay isVisible={searchVisible} onShow={() => {
                        getInitialUsers();
                    }} children={
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
                                {list.length !== 0 ? list.map((item, index) => (
                                    <View key={index}>
                                    {item.groupId == 0 ? (
                                    <ListItem
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
                                    />) : (
                                        <ListItem
                                    key={index}
                                    leftAvatar={
                                        <View style={styles.avatars}>
                                            <Image source={item.groupPhotoUrls[0] ? {uri: item.groupPhotoUrls[0]}: require('./../../assets/user.png')} 
                                                style={styles.avatar}/>
                                            <Image source={item.groupPhotoUrls[1] ? {uri: item.groupPhotoUrls[1]}: require('./../../assets/user.png')} 
                                                style={styles.avatar}/>
                                        </View>
                                    }
                                    title={
                                        <View style={styles.titleWrapper}>
                                                <Text style={styles.username}>{item.username}</Text>
                                        </View>
                                    }
                                    subtitle= {
                                        <Text numberOfLines={1} style={{fontSize: EStyleSheet.value('.75rem'), color: 'gray', flexWrap: 'wrap'}}>{item.groupUsernames.join(', ')}</Text>
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
                                                    setGroupIds([...groupIds, item.groupId]);
                                                } else {
                                                    const user = item;
                                                    user.checked = false;
                                                    const newList = list;
                                                    newList[index] = user;
                                                    setList(newList);
                                                    const newIds = groupIds.filter(e => e != item.groupId);
                                                    setGroupIds([...newIds]);
                                                }
                                            }}
                                        />
                                    }
                                    />
                                    )}
                                    </View>
                                )): null}
                        </ScrollView>
                        <Button title="Send" disabled={userIds.length == 0} titleStyle={{color: 'white'}} 
                            buttonStyle={styles.sendButton} onPress={() => {
                                setSearchVisible(false);
                                setUserIds([]);
                                sendMessages();
                                list.forEach(element => {
                                    element.checked = false;
                                });
                            }}/>
                        </>
                    } onBackdropPress={() => setSearchVisible(false)} animationType={'fade'}>
                    </Overlay>

                </View>
                <View style={{flexDirection: 'row', marginLeft: '3%'}}>
                    <TouchableOpacity onPress={() => navigation.push('List', {type: 'likers', identifier: post.id})}>
                        <Text style={styles.likeCount}>{likes} Likes</Text>
                    </TouchableOpacity>
                    {postState.inJoust ? (<><MaterialCommunityIcons style={styles.trophyIcon} name="sword-cross"/>
                        <Text style={[styles.caption, {color: '#D4AF37'}]}>{' '}{postState.joustRating}</Text></>): null}
                </View>
                <View style={styles.captionWrapper}>
                        
                        <Text style={styles.caption}>
                            <Text onPress={() => navigation.push('Profile', {username: postState.username})} style={styles.captionUsername}>
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
                        <Text style={styles.timeAgo}>{timeAgo.format(convertUTCDateToLocalDate(new Date(postState.created)))}</Text>
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
        fontSize: '1rem',
        color: '$textColor'
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
        fontWeight: 'bold',
        color: '$textColor'
    },
    iconsContainer: { 
        flexDirection: 'row',
        marginTop: '3%',
        marginLeft: '3%',
        height: '2rem'
    },
    likeButton: {
        color: '$crimson',
        fontSize: '1.5rem'
    },
    likeButtonO: {
        color: '$textColor',
        fontSize: '1.5rem'
    },
    commentIcon: {
        fontSize: '1.5rem', 
        marginHorizontal: '1.4rem',
        color: '$textColor'
    },
    planeIcon: {
        fontSize: '1.5rem',
        color: '$textColor',
        marginRight: '1.4rem'
    },
    shareIcon: {
        fontSize: '1.5rem',
        color: '$textColor'
    },
    likeCount: {
        fontSize: '1rem',
        fontWeight: 'bold',
        marginLeft: '3%',
        marginTop: '2%',
        color: '$textColor'
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
        marginRight: '.5rem',
        color: '$textColor'
    },
    caption: {
        fontSize: '1rem',
        color: '$textColor'
    },
    comments: {
        fontSize: '1rem',
        fontWeight: 'bold',
        color: '$textColor'
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
    sendButton: {
        backgroundColor: '$crimson'
    },
    text: {
        fontSize: '1rem',
        fontWeight: 'bold',
        alignSelf: 'center',
        margin: '1rem'
    },
    avatar: {
        marginLeft: -20,
        position: 'relative',
        borderWidth: 3,
        borderColor: '#fff',
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
    trophyIcon: {
        fontSize: '1.5rem',
        color: '#D4AF37',
        marginLeft: '.25rem'
    },
    heartOverlay: {
    },
    heartOverlayContainer: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0
    },
    textInput: {
        width: '60%',
        aspectRatio: 1.7143/1,
        marginLeft: '1rem',
        color: '$textColor'
    }
});

export default PostCard;