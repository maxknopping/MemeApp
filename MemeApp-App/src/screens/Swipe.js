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
import {Interactable} from 'react-native-redash';

const Swipe = ({
    navigation
}) => {
    const {state} = useContext(Context);
    const {width, height} = Dimensions.get('window');
    const posts = useRef([]).current;
    const [initialRender, setInitialRender] = useState(false);
    const position = useRef(new Animated.ValueXY()).current;
    console.log(posts);
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
    }, [currentIndex]);

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
                posts.push(response.data);
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
            for (var i = 0; i < 5; i++) {
                var response = await getInitialPost(i);
                posts.push(response.data);
            
            }
            setInitialRender(true);
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
        const post = posts[currentIndex];
        return (
            <Animated.View {...panResponder.panHandlers} style={[rotateAndTranslate, 
                {height: width, width: width, padding: 10, position: 'absolute', bottom: '25%'}]}>
                    <Animated.View style={{position: 'absolute', left: 30, top: 30, zIndex: 1000, transform: [{rotate: '-15deg'}], opacity: likeOpacity}}>
                        <Feather style={{borderWidth: 1, borderColor: '#3AE295', color: '#3AE295', fontSize: 32, 
                            fontWeight: 'bold', padding: 10}} name="thumbs-up"/>
                    </Animated.View>
                    <Animated.View style={{opacity: dislikeOpacity, position: 'absolute', right: 30, top: 30, zIndex: 1000, transform: [{rotate: '15deg'}]}}>
                        <Feather style={{borderWidth: 1, borderColor: '#DC143C', color: '#DC143C', fontSize: 32, 
                            fontWeight: 'bold', padding: 10}} name="thumbs-down"/>
                    </Animated.View>
                    <Image source={{uri: post.url}} style={{flex: 1, borderRadius: 20}}/>
            </Animated.View>
        );
    };


    return (
        <View key={initialRender} style={{flex: 1}}>
            {posts.length > 0 ?
                <View style={{flex: 1}}>
                    <View>
                    </View>
                    {renderPosts()}
                    <View style={{flex: 1, position: 'absolute', top: '85%'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', width: width}}>
                            <TouchableOpacity onPress={() => {
                                Animated.spring(position, {
                                    toValue: {x: -width-200, y: 0}
                                }).start(() => {
                                    swipeResult(false);
                                    setCurrentIndex(currentIndex+1);
                                    getNextPost();
                                });
                            }}>
                                <Feather name="x" style={styles.x}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                Animated.spring(position, {
                                    toValue: {x: width+200, y: 0}
                                }).start(() => {
                                    swipeResult(true);
                                    setCurrentIndex(currentIndex+1);
                                    getNextPost();
                                });
                            }}>
                                <Feather name="heart" style={styles.heart}/>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            : null}
        </View>

    );
};

const styles = EStyleSheet.create({
    x: {
        color: '#ec5288',
        fontSize: '2rem'
    },
    heart: {
        color: '#6ee3b4',
        fontSize: '2rem'
    }
});

export default Swipe;
