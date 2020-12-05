import React, {useContext, useEffect, useState, useRef} from 'react';
import { Text, View, ScrollView, Image, ActivityIndicator,
        FlatList, Dimensions, RefreshControl, SafeAreaView, TouchableOpacity, Modal, Animated } from 'react-native';
import {Button, Overlay} from 'react-native-elements';
import {Button as NativeButton} from 'native-base';
import {Context} from './../context/AuthContext';
import userService from './../apis/user';
import EStyleSheet from 'react-native-extended-stylesheet';
import {MaterialIcons, Ionicons, Feather} from 'react-native-vector-icons';
import Constants from 'expo-constants';
import PostCard from './PostCard';

const Joust = ({
    navigation
}) => {

    const {state} = useContext(Context);
    const {width, height} = Dimensions.get('window');
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [leftmodalVisible, setLeftModalVisible] = useState(false);
    const [rightmodalVisible, setRightModalVisible] = useState(false);
    const animatedLeft = useRef(new Animated.Value(0));
    const animatedRight = useRef(new Animated.Value(width/2));

    useEffect(() => {
        getNewPosts();
    }, []);

    const getNewPosts = () => {
        userService.get('/joust/NewPosts', {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                setPosts(response.data);
                Animated.spring(animatedLeft.current, {toValue: 0, useNativeDriver: false}).start();
                Animated.spring(animatedRight.current, {toValue: width/2, useNativeDriver: false}).start();
                setRefreshing(false);
            }
        ).catch(err => {
            console.log(err);
            setRefreshing(false);
        });
    }

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        getNewPosts();
    });

    const sendResult = (index) => {
        const loserIndex = index === 0 ? 1 : 0;
        Animated.spring(animatedLeft.current, {toValue: -500, useNativeDriver: false}).start();
        Animated.spring(animatedRight.current, {toValue: 500, useNativeDriver: false}).start();
        userService.post(`/joust/result/${posts[index].id}/${posts[loserIndex].id}`, {}, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(() => getNewPosts()).catch(err => console.log(err));
    };

    let imageStyles = {

    };

    return (
        <ScrollView style={{flex: 1}} refreshControl={
            <RefreshControl refreshing={refreshing} colors={[EStyleSheet.value('$textColor')]} tintColor={EStyleSheet.value('$textColor')} onRefresh={onRefresh} />
        }>
            {posts.length > 0 ?<View style={{marginTop: '35%'}}>
                <View style={styles.containerView}>
                    {posts.map((post, index) => {
                        return (
                            <Animated.View key={index} style={{position: 'absolute', left: index == 1 ? animatedRight.current: animatedLeft.current, width: width/2}}>
                                <View style={styles.headerWrapper}>
                                    <Image style={styles.profilePicture} source={post.profilePictureUrl ? {uri: post.profilePictureUrl} : 
                                        require('./../../assets/user.png')} />
                                    <Text style={styles.headerUsername}>{post.username}</Text>
                                </View>
                                <TouchableOpacity onPress={() => navigation.push('SinglePost', {postId: post.id})}>
                                    <Image style={styles.mainImage} source={{uri: post.url}}/>
                                </TouchableOpacity>
                                <Overlay animated animationType={"slide"} onBackdropPress={() => {
                                    setLeftModalVisible(false);
                                    setRightModalVisible(false);
                                }} isVisible={index == 0 ? leftmodalVisible: rightmodalVisible} fullScreen={true}>
                                    <PostCard post={post} navigation={navigation}/>
                                </Overlay>
                            </Animated.View>
                        )
                    })}
                </View>
                <View style={styles.selectionContainer}>
                    <Button containerStyle={{width: '40%'}} style={{marginRight: '10%'}} buttonStyle={[styles.leftButton, {paddingVertical: 20}]} titleStyle={{color: 'black'}} 
                        title="Left" onPress={() => sendResult(0)}/>
                    <Button containerStyle={{width: '40%'}} style={{marginLeft: '10%'}} buttonStyle={[styles.rightButton, {paddingVertical: 20}]} title="Right" onPress={() => sendResult(1)}/>
                </View>
            </View>
                :
                <ActivityIndicator size="large" color={EStyleSheet.value("$crimson")}/>
            }

        </ScrollView>
    );
};

const styles = EStyleSheet.create({
    profilePicture: {
        width: '2rem',
        aspectRatio: 1/1,
        borderRadius: '3rem',
        marginHorizontal: '2%'
    },
    headerWrapper: {
        margin: '.5rem',
        flexDirection: 'row',
        alignItems: 'center',
    },
    headerUsername: {
        marginLeft: '.5rem',
        color: '$textColor',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    mainImage: {
        width: '100%',
        aspectRatio: 1
    },
    bottomView: {
        flexDirection: 'row',
        margin: '.5rem',
        flexWrap: 'wrap'
    },
    bottomUsername: {
        color: '$textColor',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    caption: {
        color: '$textColor',
        fontSize: '1rem'
    },
    containerView: {
        flexDirection: 'row'
    },
    selectionContainer: {
        flexDirection: 'row',
        margin: '1rem',
        justifyContent: 'center',
        marginTop: '70%'
    },
    leftButton: {
        backgroundColor: '#D4AF37',
        borderRadius: '.5rem'
    },
    rightButton: {
        backgroundColor: '$crimson',
        borderRadius: '.5rem'
    }
});

export default Joust;
