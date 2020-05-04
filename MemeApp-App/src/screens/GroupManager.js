import React, {useState, useEffect, useContext} from 'react';
import { Text, View, ScrollView, TouchableOpacity, Alert, TextInput } from 'react-native';
import { Context } from '../context/AuthContext';
import EStyleSheet from 'react-native-extended-stylesheet';
import {ListItem, Button, Overlay} from 'react-native-elements';
import userService from '../apis/user';
import {Feather} from 'react-native-vector-icons';

const GroupManager = ({
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
        userService.get(`/${state.id}/group/${groupId}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                setList(response.data);
            }
        ).catch(error => console.log(error));
        }, []);

    const updateName = () => {
        userService.put(`/${state.id}/messages/group`, {
            groupId: groupId,
            groupName: name,
            usersToAdd: [],
            usersToRemove: []
        }, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).catch(error => console.log(error));
    }

    const removeUser = (user) => {
        userService.put(`/${state.id}/messages/group`, {
            groupId: groupId,
            groupName: name,
            usersToAdd: [],
            usersToRemove: [user.id]
        }, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(() => {
            var newList = list.filter(u => u.id != user.id);
            setList(newList);
            }
        ).catch(error => console.log(error));
    }

    const addUser = (user) => {
        userService.put(`/${state.id}/messages/group`, {
            groupId: groupId,
            groupName: name,
            usersToAdd: [user.id],
            usersToRemove: []
        }, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(() => {
            var newList = list;
            newList.push(user);
            setList(newList);
            setSearchVisible(false);
            }
        ).catch(error => console.log(error));
    }

    search = (text) => {
        userService.get(`/search/${state.id}/${text}/true`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function(response) {
                setSearchList([...response.data]);
                console.log(response.data);
            }
        ).catch(error => console.log(error));
    };

    return (
        <View>
            <View style={styles.headerView}>
                <Text style={styles.nameLabel}>Name</Text>
                <TextInput style={styles.nameInput} value={name} onSubmitEditing={() => updateName()} onChangeText={(text) => setName(text)} blurOnSubmit returnKeyType='done'/>
            </View>
            <ScrollView>
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
                                        navigation.navigate('OtherProfile', {username: item.username});
                                    } else {
                                        navigation.navigate('Profile', {username: item.username});
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
                                <Button buttonStyle={styles.removeButton} title="Remove" onPress={() => {
                                    Alert.alert('Remove User', 'Are you sure you want to remove this user from the group?', [
                                        {
                                            text: 'Cancel',
                                            style: 'cancel',
                                        },
                                        {text: 'Yes', onPress: () => removeUser(item), style: 'destructive'},
                                    ], {cancelable: true})
                                }}/>
                            </View>
                        }
                        />
                    ))}
                    <ListItem title={
                        <View >
                            <TouchableOpacity onPress={() => setSearchVisible(true)} style={{flexDirection: 'row', alignItems: 'center'}}>
                                <Text style={styles.addUser}>Add User</Text>
                                <Feather style={styles.addUser} name="plus"/>
                            </TouchableOpacity>
                        </View>
                    }
                    containerStyle={{backgroundColor: EStyleSheet.value('$backgroundColor')}}
                    />
                </ScrollView>
                <Overlay isVisible={searchVisible} children={
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
                                {searchList.map((item, index) => (
                                    <ListItem
                                    onPress={() => {
                                        addUser(item);
                                    }
                                    }
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
                                    />
                                ))}
                        </ScrollView>
                        </>
                    } onBackdropPress={() => setSearchVisible(false)} animationType={'fade'}>
                    </Overlay>
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

GroupManager.navigationOptions = ({navigation}) => {
    return {
        title: 'Group'
    };
};

export default GroupManager;
