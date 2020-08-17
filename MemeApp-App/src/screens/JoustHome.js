import React, {useContext, useEffect, useState} from 'react';
import { Text, View, ScrollView, ActivityIndicator,
        FlatList, Dimensions, RefreshControl, SafeAreaView, TouchableOpacity, Modal, Animated } from 'react-native';
import {Button, Overlay} from 'react-native-elements';
import {Button as NativeButton} from 'native-base';
import {Context} from './../context/AuthContext';
import userService from './../apis/user';
import EStyleSheet from 'react-native-extended-stylesheet';
import {MaterialIcons, Ionicons, Feather} from 'react-native-vector-icons';
import Constants from 'expo-constants';
import PostCard from './PostCard';
import WelcomeModal from './WelcomeModal';
import Image from 'react-native-image-progress';


const JoustHome = ({
    navigation
}) => {
    const {state} = useContext(Context);
    const [activeIndex, setActiveIndex] = useState(0);
    const {width, height} = Dimensions.get('window');
    const [postIndex, setPostIndex] = useState(0);
    const [posts, setPosts] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);

    const segmentClicked = (index) => {
        setActiveIndex(index);
    };


    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        async function load() {
            let newPosts = [];
            for (var i = 0; i < 12; i++) {
                try {

                var response = await loadInitialPost(i);

                newPosts.push(response.data);
                }
                catch (e) {
                    console.log(e);
                }
            }
            setPosts(newPosts);
            setRefreshing(false);
        }

        load();
    });
        
    
    useEffect( () => {

        async function load() {
            let newPosts = [];
            for (var i = 0; i < 12; i++) {
                var response = await loadInitialPost(i);
                newPosts.push(response.data);
            }
            setPosts(newPosts);
            setRefreshing(false);
        }

        load();
    }, []);

    const loadPost = (index) => {
         return userService.get(`/joust/top/${index}`,  {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).catch(error => console.log(error));
    }

    const loadInitialPost = (index) => {
        return userService.get(`/joust/top/${index}`,  {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        });
    }

    const description = "This is the Joust Home page, a place where you can interact with popular posts. Under Top Ranked Posts, you will see the posts with the highest amount of trophies. Trophies are a metric to measure how popular a post is." +
        " Every post starts at 1000 trophies, which can go up or down.\n\n" +
        " Here you can also enter Joust mode and Swipe mode. In Joust mode, you are shown two posts, and you can decide which one is better." +
        " In Swipe mode, you can like a post or dislike a post by swiping, similar to Tinder. If a post gets liked in either of these modes, its trophies will increase, and if it's disliked, its trophies will decrease.";

    return (
        <View style={{flex: 1}}>
            <View>
                <WelcomeModal pagekey={"JoustHome"} title={"Joust Home"} description={description}/>
            </View>
        <FlatList
        style={{flex: 1}} 
        refreshControl={
            <RefreshControl refreshing={refreshing} colors={EStyleSheet.value('$textColor')} tintColor={EStyleSheet.value('$textColor')} onRefresh={onRefresh} />
        }
        ListHeaderComponentStyle={{flex: 1}}
        ListHeaderComponent={(
            <View style={{flex: 1}}>
                <Button 
                    linearGradientProps={{
                        colors: ['gold', '#A2790E'],
                        start: { x: .6, y: .75 },
                        end: { x: 1, y: 1 },

                    }}
                    buttonStyle={{borderRadius: EStyleSheet.value('.8rem')}} 
                    titleStyle={{color: 'black'}}
                    style={[styles.followButton, {marginTop: '5%'}]} 
                    title="Start Jousting"
                    onPress={() => {
                        navigation.navigate('Joust');
                    }}
                    />
                <Button 
                    linearGradientProps={{
                        colors: ['#FD3177', '#FE6D61'],
                        start: { x: .5, y: .75 },
                        end: { x: 1, y: 1 },

                    }}
                    buttonStyle={{borderRadius: EStyleSheet.value('.8rem')}} 
                    style={styles.followButton} 
                    title="Start Swiping"
                    onPress={() => {
                        navigation.navigate('Swipe');
                    }}
                    />
                <Text style={styles.headerLabel}>Top Ranked Posts</Text>
                <View style={styles.tabView}>
                    <NativeButton onPress={() => segmentClicked(0)} active={activeIndex === 0} transparent>
                        <MaterialIcons style={[styles.icons, activeIndex === 0 ?
                            {color: EStyleSheet.value('$crimson')} : {color: EStyleSheet.value('$textColor')}]} name="apps"></MaterialIcons>
                    </NativeButton>
                    <NativeButton onPress={() => segmentClicked(1)} active={activeIndex === 1} transparent>
                        <MaterialIcons style={[styles.icons, activeIndex === 1 ? 
                            {color: EStyleSheet.value('$crimson')} : {color: EStyleSheet.value('$textColor')}]} name="format-list-bulleted"></MaterialIcons>
                    </NativeButton>
                </View>
            </View>
        )}
        renderItem={({item, index}) => {
            if (activeIndex === 1) {
                return <PostCard post={item} navigation={navigation}/>
            } else {
                return (
                    <TouchableOpacity onPress={() => navigation.navigate('SinglePost', {postId: item.id})}>
                        <View style={[ {width: width / 3} , {height: width/3}, {marginBottom: EStyleSheet.value('.1rem')}, index % 3 !== 0 ? 
                            {paddingLeft: EStyleSheet.value('.1rem')} : {paddingLeft: 0}]} >
                                <Image style={{flex: 1, width: undefined, height: undefined}} source={{uri: item.url}}/>
                        </View>
                    </TouchableOpacity>
                )
            }
        }}
        data={posts}
        numColumns={activeIndex === 0 ? 3 : 1}
        key={activeIndex === 0 ? '0' : '1'}
        keyExtractor={(item, i) => item.id.toString()}
        onEndReached={() => {

            async function load() {
                let newPosts = posts;
                const responseOne = await loadPost(posts.length);
                if (typeof responseOne !== 'undefined') {
                    newPosts.push(responseOne.data);
                }
                const responseTwo = await loadPost(posts.length+1);
                if (typeof responseTwo !== 'undefined') {
                    newPosts.push(responseTwo.data);
                }
                const responseThree = await loadPost(posts.length+2);
                if (typeof responseThree !== 'undefined') {
                    newPosts.push(responseThree.data);
                }
                setPosts(newPosts);
                console.log(newPosts);
            }

            load();
        }}
        loadingMore={loadingMore}
        
        />
        </View>
    );
}

const styles = EStyleSheet.create({
    profilePicture: {
        width: '27%',
        aspectRatio: 1/1,
        borderRadius: '20rem',
    },
    spinner: {
    },
    headerView: {
        flex: 1,
        flexDirection: 'row',
        marginHorizontal: '5%',
        marginTop: '5%',
    },
    infoView: {
        marginVertical: '7%',
        marginHorizontal: '7%',
        flexDirection: 'row',
        justifyContent: 'space-around',
        flex: 1
    },
    follow: {
        fontWeight: 'bold',
        fontSize: '1.4rem',
        color: '$textColor'
    },
    followView: {
        alignItems: 'center',
        height: '50%'
    },
    bioView: {
        marginHorizontal: '5%',
        marginTop: '3%',
        flexWrap: 'wrap',
        flexDirection: 'row'
    },
    bioText: {
        fontSize: '1rem',
        color: '$textColor'
    },
    followButton: {
        marginHorizontal: '5%',
        marginBottom: '5%'
    },
    tabView: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        borderTopWidth: '.05rem',
        borderTopColor: '#eae5e5'
    },
    icons: {
        fontSize: '1.7rem',
        color: '$textColor'
    },
    gridView: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    container: {
        flex: 1,
        marginTop: Constants.statusBarHeight,
    },
    gearIcon: {
        fontSize: '1.7rem',
        color: '$textColor'
    },
    label: {
        color: '$textColor'
    },
    headerLabel: {
        color: '$textColor',
        fontSize: '1.1rem',
        marginHorizontal: '5%'
    }
});

JoustHome.navigationOptions = ({navigation}) => {
    return {
        title: 'Joust'
    }
}

export default JoustHome;
