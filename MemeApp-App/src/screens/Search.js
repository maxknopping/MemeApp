import React, { useEffect, useState, useContext } from 'react';
import { Text, View, SafeAreaView, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import EStyleSheet from 'react-native-extended-stylesheet';
import userService from './../apis/user';
import { Context } from '../context/AuthContext';
import {ListItem, Button} from 'react-native-elements';
import {Feather} from 'react-native-vector-icons';
import WelcomeModal from './WelcomeModal';

const Search = ({
    navigation
}) => {
    const {state} = useContext(Context);
    const [inputValue, setInputValue] = useState('');
    const [list, setList] = useState([]);

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

    search = (text) => {
        userService.get(`/search/${state.id}/${text}/true`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function(response) {
                setList([...response.data]);
                console.log(response.data);
            }
        ).catch(error => console.log(error));
    };

    const description = "Here you can search for users by typing their username in the search box.";


    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.searchView}>
                <Feather name="search" style={styles.searchIcon}/>
                <TextInput value={inputValue} onChangeText={(text) => {
                    setInputValue(text);
                    search(text);
                }} style={styles.searchInput}
                    placeholder="Search..." autoCapitalize="none" returnKeyType="search" onSubmitEditing={() => search(inputValue)}/>
            </View>
            <ScrollView style={styles.scrollView}>
                {list.map((item, index) => (
                    <ListItem
                    key={index}
                    containerStyle={{backgroundColor: EStyleSheet.value('$backgroundColor')}}
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
                    subtitle= {
                        <Text style={{fontSize: EStyleSheet.value('.75rem'), color: 'gray'}}>{item.name}</Text>
                    }
                    />
                ))}
            </ScrollView>
            <View>
                <WelcomeModal pagekey={"Search"} title={"Search"} description={description}/>
            </View>
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
    scrollView: {
        zIndex: -1,
        marginTop: '.75rem'
    },
    searchInput: {
        flex: 1,
        marginLeft: '1rem',
        fontSize: '1rem',
        color: 'black'
    },
    username: {
        fontSize: '1rem',
        fontWeight: 'bold',
        marginRight: '.75rem',
        color: '$textColor'
    },
    titleWrapper: {
        flexDirection: 'row',
    },
    followButton: {
        marginHorizontal: '5%',
        marginVertical: '5%',
    },
    searchView: {
        flexDirection: 'row',
        backgroundColor: 'white',
        borderRadius: '1rem',
        padding: '1rem',
        marginHorizontal: '.5rem'
    },
    searchIcon: {
        fontSize: '1.7rem'
    }
});

export default Search;
