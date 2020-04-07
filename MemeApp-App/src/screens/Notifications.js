import React, {useState, useContext, useEffect} from 'react';
import { Text, View, ScrollView, RefreshControl, Image } from 'react-native';
import {ListItem} from 'react-native-elements';
import EStyleSheet from 'react-native-extended-stylesheet';
import { Context } from '../context/AuthContext';
import userService from './../apis/user';
import { ActivityIndicator } from 'react-native';
import { TouchableOpacity } from 'react-native-gesture-handler';



const Notifications = ({
    navigation,
}) => {
    const {state} = useContext(Context);
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(false);
    const [refreshing, setRefreshing] = useState(false);

    console.log(list);
    useEffect(() => {
        setLoading(true);
        userService.get(`/notifications/${state.id}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                setLoading(false);
                setList([...response.data]);
                userService.post(`/notifications/${state.id}/read`, {} , {
                    headers: {
                        'Authorization': `Bearer ${state.token}`
                    }
                }).catch(error => console.log(error));
            } 
        ).catch(error => console.log(error));
    }, []);

    const onRefresh = React.useCallback(() => {
        setRefreshing(true);
        setList([]);
        userService.get(`/notifications/${state.id}`, {
            headers: {
                'Authorization': `Bearer ${state.token}`
            }
        }).then(
            function (response) {
                setList([...response.data]);
                setRefreshing(false);
            }).catch(error => {
                console.log(error);
                setRefreshing(false);
            });
    }, [refreshing]);


    return (
        <ScrollView style={{flex: 1}} refreshControl={
            <RefreshControl onRefresh={onRefresh} refreshing={refreshing}/>
        }>
            {list.length !== 0 && !loading ? list.map((item, index) => (
                <ListItem 
                key={index}
                title={
                    <View style={styles.titleWrapper}>
                        <TouchableOpacity>
                            <Text style={styles.username}>{'@'}{item.causerUsername}</Text>
                        </TouchableOpacity>
                        <Text>{' '}{item.message}</Text>
                {item.commentText ? <Text>{"\""}{item.commentText}{"\""}</Text>: null}
                    </View>
                }
                leftAvatar={{source: item.causerPhotoUrl ? {uri: item.causerPhotoUrl} : 
                require('./../../assets/user.png')}}

                chevron={
                    <>
                    {item.postUrl ? <Image style={styles.post} source={{uri: item.postUrl}}/> : null}
                    </>
                }
                
                
                />
            )) : <ActivityIndicator size="small" animating/>}
        </ScrollView>);
};

const styles = EStyleSheet.create({
    titleWrapper: {
        flexDirection: 'row',
        flexWrap: 'wrap'
    },
    username: {
        color: '$crimson',
        fontWeight: 'bold'
    },
    post: {
        width: '3rem',
        height: '3rem'
    }
});


export default Notifications;
