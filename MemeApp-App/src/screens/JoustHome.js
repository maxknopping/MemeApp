import React, {useContext, useEffect, useState, useRef} from 'react';
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
import * as Font from 'expo-font';


const JoustHome = ({
    navigation
}) => {
    const {state} = useContext(Context);
    const [activeIndex, setActiveIndex] = useState(0);
    const {width, height} = Dimensions.get('window');
    const [postIndex, setPostIndex] = useState(0);
    const [posts, setPosts] = useState([]);
    const [loadingMore, setLoadingMore] = useState(false);
    const flatList = useRef(null);
    const index = useRef(0);
    Font.loadAsync({Tinder: require('./../../assets/fonts/ChaletNewYorkNineteenSeventy.ttf')});
    Font.loadAsync({Montserrat: require('./../../assets/fonts/Montserrat-Black.ttf')});

    const segmentClicked = (index) => {
        setActiveIndex(index);
    };


    const [refreshing, setRefreshing] = React.useState(false);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        async function load() {
            let newPosts = [];
            for (var i = 0; i < 15; i++) {
                try {

                var response = await loadInitialPost(i);

                newPosts.push(response.data);
                }
                catch (e) {
                    console.log(e);
                }
            }
            setPosts(newPosts);
            index.current = 15;
            setRefreshing(false);
        }

        load();
    });
        
    
    useEffect( () => {
        navigation.setParams({scrollToTop: scrollToTop});
        async function load() {
            let newPosts = [];
            for (var i = 0; i < 12; i++) {
                var response = await loadInitialPost(i);
                newPosts.push(response.data);
            }
            setPosts(newPosts);
            index.current = 12;
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
    };

    const loadInitialPost = (index) => {
        return userService.get(`/joust/top/${index}`,  {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        });
    }

    const scrollToTop = () => {
        // Scroll to top, in this case I am using FlatList
        if (!!flatList.current) {
          flatList.current.scrollToOffset({ offset: 0, animated: true });
        }
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
        ref={flatList}
        refreshControl={
            <RefreshControl refreshing={refreshing} colors={EStyleSheet.value('$textColor')} tintColor={EStyleSheet.value('$textColor')} onRefresh={onRefresh} />
        }
        ListHeaderComponentStyle={{flex: 1}}
        ListHeaderComponent={(
            <View style={{flex: 1}}>
                <View style={{flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: '5%'}}>
                    <Button 
                        linearGradientProps={{
                            colors: ['#D4AF37', '#ffffff'],
                            start: { x: .4, y: .4 },
                            end: { x: 1, y: 1 },

                        }}
                        buttonStyle={{borderRadius: EStyleSheet.value('.8rem'), padding: 30}} 
                        titleStyle={{color: 'black'}}
                        style={[styles.followButton, {marginTop: '15%', marginRight: 15}]} 
                        title="Joust"
                        titleStyle={{fontFamily: Font.isLoaded('Tinder') ? 'Tinder': 'Arial', fontSize: 30, color: 'black'}}
                        onPress={() => {
                            navigation.navigate('Joust');
                        }}
                        />
                    <Button 
                        linearGradientProps={{
                            colors: ['#FD3177', '#FE6D61'],
                            start: { x: .4, y: .4 },
                            end: { x: 1, y: 1 },

                        }}
                        buttonStyle={{borderRadius: EStyleSheet.value('.8rem'), padding: 30}} 
                        style={[styles.followButton, {marginTop: '15%', marginLeft: 15}]} 
                        title="Swipe"
                        titleStyle={{fontFamily: Font.isLoaded('Tinder') ? 'Tinder': 'Arial', fontSize: 30}}
                        onPress={() => {
                            navigation.navigate('Swipe');
                        }}
                        />
                </View>
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
        onMomentumScrollBegin={async () => {

            async function load() {
                
                let newPosts = posts;
                const responseOne = await loadPost(index.current);
                if (typeof responseOne !== 'undefined') {
                    newPosts.push(responseOne.data);
                }
                const responseTwo = await loadPost(index.current + 1);
                if (typeof responseTwo !== 'undefined') {
                    newPosts.push(responseTwo.data);
                }
                const responseThree = await loadPost(index.current+2);
                if (typeof responseThree !== 'undefined') {
                    newPosts.push(responseThree.data);
                }
                console.log(`index: at end: ${index.current}`);
                index.current += 3;
            }

            await load();
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
    },
    text : {
        fontSize: '1.1rem',
        color: '$textColor',
        fontWeight: 'bold',
        marginBottom: 10
    }
});

JoustHome.navigationOptions = ({navigation}) => {
    return {
        headerTitle: () => (
            <TouchableOpacity onPress={() => navigation.getParam('scrollToTop')()}>
                <Text style={styles.text}>Joust</Text>
            </TouchableOpacity>
        )

    }
}

export default JoustHome;
