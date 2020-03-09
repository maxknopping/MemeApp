import React, { useEffect, useState, useContext } from 'react';
import { Text, View, SafeAreaView, ScrollView, TouchableOpacity } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import SearchHeader from 'react-native-search-header';
import userService from './../apis/user';
import { Context } from '../context/AuthContext';
import {ListItem, Button} from 'react-native-elements';

const Search = ({
    navigation
}) => {
    const {state} = useContext(Context);
    const [inputValue, setInputValue] = useState('');
    const [list, setList] = useState([]);

    search = (text) => {
        userService.get(`/search/${text}/true`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function(response) {

                response.data.forEach(element => {
                    element.followButton = 'Follow';
                    if (element.id == state.id) {
                        element.followButton = 'Myself'
                    }
                    element.followers.forEach(e => {
                        if (e.followerId == state.id) {
                          element.followButton = 'Following';
                        }
                    });
                });
                setList([...response.data]);
                console.log(response.data);
            }
        ).catch(error => console.log(error));
    };

    follow = (user) => {
        userService.post(`/${state.id}/follow/${user.id}`, {}, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        })
        .then(
            function (response) {
                let index = list.indexOf(user);
                let newUser = user;
                newUser.followButton = 'Following';
                let old = list;
                old[index] = newUser;
                console.log(old);
                setList([...old]);
            }
        ).catch(error => console.log(error));
    };

    unfollow = (user) => {
        userService.post(`/${state.id}/unfollow/${user.id}`, {}, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        })
        .then(
            function (response) {
                let index = list.indexOf(user);
                let newUser = user;
                newUser.followButton = 'Follow';
                let old = list;
                old[index] = newUser;
                console.log(old);
                setList([...old]);
            }
        ).catch(error => console.log(error));
    };

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.headerContainer}>
                <SearchHeader
                    autoCorrect={false}
                    autoCapitalize="none"
                    placeholder="Search..."
                    placeholderColor="gray"
                    enableSuggestion={false}
                    topOffset={EStyleSheet.value('0rem')}
                    persistent={true}
                    onSearch={(text) => search(text.nativeEvent.text)}
                />
            </View>
            <ScrollView style={styles.scrollView}>
                {list.map((item, index) => (
                    <ListItem
                    key={index}
                    leftAvatar={{source: item.photoUrl ? {uri: item.photoUrl} : 
                        require('./../../assets/user.png')}}
                    title={
                        <View style={styles.titleWrapper}>
                            <TouchableOpacity onPress={() => navigation.navigate('Profile', {username: item.username})}>
                                <Text style={styles.username}>{item.username}</Text>
                            </TouchableOpacity>
                        </View>
                    }
                    chevron={
                        <>
                        {item.followButton === 'Follow' ? <Button buttonStyle={{backgroundColor: EStyleSheet.value('$crimson'), 
                        borderRadius: EStyleSheet.value('.8rem')}} style={styles.followButton} title={item.followButton} 
                        onPress={() => follow(item)}/> :
                        item.followButton === 'Following' ? <Button buttonStyle={{backgroundColor: 'gray', 
                        borderRadius: EStyleSheet.value('.8rem')}} onPress={() => unfollow(item)} style={styles.followButton}
                         title={item.followButton}/> :
                        null
                        }
                        </>
                    }
                    />
                ))}
            </ScrollView>
        </SafeAreaView>
    );
};

Search.navigationOptions = ({navigation}) => {
    return {
        headerShown: false
    };
};

const styles = EStyleSheet.create({
    container: {
        flex: 1,
    },
    headerContainer: {
        flex: 1
    },
    scrollView: {
        zIndex: -1,
        marginTop: '4rem',
    },
    searchInput: {
    },
    username: {
        fontSize: '1rem',
        fontWeight: 'bold',
        marginRight: '.75rem'
    },
    titleWrapper: {
        flexDirection: 'row',
    },
    followButton: {
        marginHorizontal: '5%',
        marginVertical: '5%',
    }
});

export default Search;
