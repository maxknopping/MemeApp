import React, {useContext, useEffect, useState, useMemo, useRef} from 'react';
import { Text, View, ScrollView, Image, ActivityIndicator,
        FlatList, Dimensions, RefreshControl, SafeAreaView, TouchableOpacity, Modal, Animated, PanResponder } from 'react-native';
import {Button, Overlay} from 'react-native-elements';
import {Button as NativeButton} from 'native-base';
import {Context} from './../context/AuthContext';
import userService from './../apis/user';
import EStyleSheet from 'react-native-extended-stylesheet';
import {MaterialIcons, Ionicons, Feather} from 'react-native-vector-icons';
import Constants from 'expo-constants';
import PostCard from './PostCard';
import user from './../apis/user';

const Swipe = ({
    navigation
}) => {
    const {state} = useContext(Context);
    const {width, height} = Dimensions.get('window');
    const [posts, setPosts] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const position = useRef(new Animated.ValueXY()).current;
    let rotate = position.x.interpolate({
        inputRange: [-width/2, 0, width/2],
        outputRange: ['-10deg', '0deg', '10deg'],
        extrapolate: 'clamp'
    });
    let likeOpacity = position.x.interpolate({
        inputRange: [-width/2, 0, width/2],
        outputRange: [0, 0, 1],
        extrapolate: 'clamp'
    });
    let dislikeOpacity = position.x.interpolate({
        inputRange: [-width/2, 0, width/2],
        outputRange: [1, 0, 0],
        extrapolate: 'clamp'
    });
    let nextCardOpacity = position.x.interpolate({
        inputRange: [-width/2, 0, width/2],
        outputRange: [1, 0, 1],
        extrapolate: 'clamp'
    });
    let nextCardSize = position.x.interpolate({
        inputRange: [-width/2, 0, width/2],
        outputRange: [1, 0.8, 1],
        extrapolate: 'clamp'
    });
    const [currentIndex, setCurrentIndex] = useState(0);
    const panResponder = useMemo(() => PanResponder.create({
        onStartShouldSetPanResponder: (evt, gestureState) => true,
        onPanResponderMove: (evt, gestureState) => {
            position.setValue({x: gestureState.dx, y: gestureState.dy});
        },
        onPanResponderRelease: (evt, gestureState) => {
            if (gestureState.dx > 120) {
                Animated.spring(position, {
                    toValue: {x: width+200, y: gestureState.dy}
                }).start(() => {
                    swipeResult(true);
                    setCurrentIndex(currentIndex+1);
                    getNextPost();
                })
            } else if (gestureState.dx < -120) {
                Animated.spring(position, {
                    toValue: {x: -width-200, y: gestureState.dy}
                }).start(() => {
                    swipeResult(false);
                    setCurrentIndex(currentIndex+1);
                    getNextPost();
                })
            } else {
                Animated.spring(position, {
                    toValue:{x: 0, y: 0},
                    friction: 4
                }).start();
            }
        }

    }));

    useEffect(()=> {
        position.setValue({x: 0, y: 0});
    }, [currentIndex])

    let rotateAndTranslate = {
        transform:[{
            rotate: rotate
            },
            ...position.getTranslateTransform()]
    };

    const getNextPost = () => {
        userService.get(`/swipe/nextPost`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                setPosts([...posts, response.data]);
            }
        ).catch(err => console.log(err));
    };

    const swipeResult = (liked) => {
        userService.post(`/swipe/result/${posts[currentIndex].id}/${liked}`, {}, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).catch((err) => console.log(err));
    }

    useEffect( () => {

        async function load() {
            let newPosts = [];
            for (var i = 0; i < 5; i++) {
                var response = await getInitialPost(i);
                newPosts.push(response.data);
            }
            setPosts(newPosts);
        }

        load();
    }, []);

    const getInitialPost = () => {
        return userService.get(`/swipe/nextPost`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        });
    };
    
    const renderPosts = () => {

        return posts.map((post, i) => {
            if (i < currentIndex) {
                return null
            } else if (i == currentIndex) {
                return (
                    <Animated.View {...panResponder.panHandlers} key={i} style={[rotateAndTranslate, 
                        {height: width, width: width, padding: 10, position: 'absolute', bottom: '25%'}]}>
                            <Animated.View style={{position: 'absolute', left: 30, top: 30, zIndex: 1000, transform: [{rotate: '-15deg'}], opacity: likeOpacity}}>
                                <Text style={{borderWidth: 1, borderColor: '#3AE295', color: '#3AE295', fontSize: 32, 
                                    fontWeight: 'bold', padding: 10}}>LIKE</Text>
                            </Animated.View>
                            <Animated.View style={{opacity: dislikeOpacity, position: 'absolute', right: 30, top: 30, zIndex: 1000, transform: [{rotate: '15deg'}]}}>
                                <Text style={{borderWidth: 1, borderColor: '#DC143C', color: '#DC143C', fontSize: 32, 
                                    fontWeight: 'bold', padding: 10}}>Nope</Text>
                            </Animated.View>
                            <Image source={{uri: post.url}} style={{flex: 1, borderRadius: 20}}/>
                    </Animated.View>
                );
            } else {
                return (
                    <Animated.View key={i} style={
                        {height: width, width: width, padding: 10, position: 'absolute', bottom: '25%', opacity: nextCardOpacity, transform: [{scale: nextCardSize}]}}>
                            <Image source={{uri: post.url}} style={{flex: 1, borderRadius: 20}}/>
                    </Animated.View>
                );
            }
        }).reverse();
    };


    return (
        <View style={{flex: 1}}>
            {posts.length > 0 ?
                <View style={{flex: 1}}>
                    <View>
                    </View>
                    {renderPosts()}
                    <View>

                    </View>
                </View>
            : null}
        </View>

    );
};

const styles = EStyleSheet.create({
    bottomView: {
        flexDirection: 'row',
        margin: '.5rem',
        flexWrap: 'wrap'
    },
    bottomUsername: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: '1rem'
    },
    caption: {
        color: 'white',
        fontSize: '1rem'
    },
});

export default Swipe;
