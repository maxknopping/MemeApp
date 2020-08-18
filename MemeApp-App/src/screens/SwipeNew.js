import React, {useContext, useEffect, useState, useMemo, useRef} from 'react';
import { Text, View, ScrollView, Image, ActivityIndicator,
        FlatList, Dimensions, RefreshControl, SafeAreaView, TouchableOpacity, Modal, Animated, PanResponder } from 'react-native';
import {Button, Overlay} from 'react-native-elements';
import {Button as NativeButton} from 'native-base';
import {Context} from '../context/AuthContext';
import userService from '../apis/user';
import EStyleSheet from 'react-native-extended-stylesheet';
import {MaterialIcons, Ionicons, Feather} from 'react-native-vector-icons';
import Constants from 'expo-constants';
import PostCard from './PostCard';
import user from '../apis/user';
import {Interactable} from 'react-native-redash';
import Swiper from 'react-native-deck-swiper';

const SwipeNew = ({
    navigation
}) => {
    const {state} = useContext(Context);
    const {width, height} = Dimensions.get('window');
    const posts = useRef([]).current;
    const [initialRender, setInitialRender] = useState(false);
    const swiper = useRef(null);
    const position = useRef(new Animated.ValueXY()).current;
    console.log(posts);
    const cardIndex = useRef(0);

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

    const swipeResult = (liked, index) => {
        userService.post(`/swipe/result/${posts[index].id}/${liked}`, {}, {
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


    return (
        <View key={initialRender} style={{flex: 1}}>
            {posts.length > 0 ?
                <View style={{flex: 1, alignItems: 'center'}}>
                    <Swiper
                        cards={posts}
                        renderCard={(post) => {
                            return (
                                <View style={{height: width - 45, width: width -45, justifyContent: 'center',}}>
                                    <Image source={{uri: post.url}} style={{flex: 1, borderRadius: 20}}/>
                                </View>
                            )
                        }}
                        verticalSwipe={false}
                        stackSize={5}
                        ref={swiper}
                        onSwipedAll={() => {console.log('onSwipedAll')}}
                        cardIndex={cardIndex.current}
                        backgroundColor={'#000000'}
                        containerStyle={{alignItems: 'center'}}
                        useViewOverflow={false}
                        onSwipedLeft={(index) => {
                            swipeResult(false, index);
                            getNextPost();
                        }}
                        onSwipedRight={(index) => {
                            swipeResult(true, index);
                            getNextPost();
                        }}
                        overlayLabels={{
                            left: {
                                element: <Text style={{borderWidth: 1, borderColor: '#DC143C', color: '#DC143C', fontSize: 32, 
                                fontWeight: 'bold', padding: 10}}>NOPE</Text>, /* Optional */
                                title: 'NOPE',
                                style: {
                                  label: {
                                    backgroundColor: 'black',
                                    borderColor: 'black',
                                    color: 'white',
                                    borderWidth: 1
                                  },
                                  wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-end',
                                    justifyContent: 'flex-start',
                                    marginTop: 30,
                                    marginLeft: -30
                                  }
                                }
                              },
                            right: {
                                element: <Text style={{borderWidth: 1, borderColor: '#3AE295', color: '#3AE295', fontSize: 32, 
                                fontWeight: 'bold', padding: 10}}>LIKE</Text>, /* Optional */
                                title: 'NOPE',
                                style: {
                                  label: {
                                    backgroundColor: 'black',
                                    borderColor: 'black',
                                    color: 'white',
                                    borderWidth: 1
                                  },
                                  wrapper: {
                                    flexDirection: 'column',
                                    alignItems: 'flex-start',
                                    justifyContent: 'flex-start',
                                    marginTop: 30,
                                    marginLeft: 30
                                  }
                                }
                            }
                        }}
                        
                        >
                    </Swiper>
                    <View style={{flex: 1, position: 'absolute', top: '85%'}}>
                        <View style={{flexDirection: 'row', justifyContent: 'space-around', width: width}}>
                            <TouchableOpacity onPress={() => {
                                    swiper.current.swipeLeft();
                            }}>
                                <Feather name="x" style={styles.x}/>
                            </TouchableOpacity>
                            <TouchableOpacity onPress={() => {
                                    swiper.current.swipeRight();
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

export default SwipeNew;
