import React, {useState, useEffect, useContext} from 'react';
import { Text, View, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Context } from '../context/AuthContext';
import EStyleSheet from 'react-native-extended-stylesheet';
import {ListItem, Button, Overlay} from 'react-native-elements';
import userService from '../apis/user';
import {Feather} from 'react-native-vector-icons';

const Blocked = ({
    navigation,
}) => { 
    const groupId = navigation.getParam('groupId');
    const groupName = navigation.getParam('groupName');
    const {state} = useContext(Context);
    const [list, setList] = useState([]);
    const [name, setName] = useState(groupName);
    const [searchVisible, setSearchVisible] = useState(false);
    const [searchInput, setSearchInput] = useState('');
    const [searchList, setSearchList] = useState([]);

    useEffect(() => {
        userService.get(`/blocked/${state.id}/`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                setList(response.data);
            }
        ).catch(error => console.log(error));
        }, []);

    const removeUser = (user) => {
        userService.post(`/${state.id}/unblock/${user.id}`, {
        }, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(() => {
            var newList = list.filter(u => u.id != user.id);
            setList(newList);
            Alert.alert('Successfully unblocked user!');
            }
        ).catch(error => console.log(error));
    }

    return (
        <View style={{flex: 1}}>
            <ScrollView style={{flex: 1}}>
                    {list.map((item, index) => (
                        <ListItem
                        key={index}
                        containerStyle={{backgroundColor: EStyleSheet.value('$backgroundColor')}}
                        leftAvatar={{source: item.photoUrl ? {uri: item.photoUrl} : 
                            require('./../../assets/user.png')}}
                        title={
                            <View style={styles.titleWrapper}>
                                <TouchableOpacity onPress={() => {
                                    if (listType == 'followers' || listType == 'following')
                                    {
                                        navigation.push('OtherProfile', {username: item.username});
                                    } else {
                                        navigation.push('Profile', {username: item.username});
                                    }
                                    
                                    }}>
                                    <Text style={styles.username}>{item.username}</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        subtitle= {
                            <Text style={{fontSize: EStyleSheet.value('.75rem'), color: 'gray'}}>{item.name}</Text>
                        }
                        chevron={
                            <View>
                                <Button buttonStyle={styles.removeButton} title="Unblock" onPress={() => {
                                   removeUser(item);
                                }}/>
                            </View>
                        }
                        />
                    ))}
                </ScrollView>
            </View>
    );
};

const styles = EStyleSheet.create({
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
    removeButton: {
        backgroundColor: '$crimson'
    },
    headerView: {
        backgroundColor: '$backgroundColor',
        padding: '1rem'
    },
    nameLabel: {
        fontWeight: 'bold',
        fontSize: '1rem',
        color: '$crimson'
    },
    nameInput: {
        paddingVertical: '.5rem',
        width: '100%',
        fontSize: '1rem',
        color: '$textColor'
    },
    addUser: {
        color: '$crimson',
        marginRight: '.3rem',
        fontSize: '1rem'

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
    }
});


export default Blocked;