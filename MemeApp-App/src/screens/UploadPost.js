import { Constants} from 'expo';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import React, { Component, useEffect, useState } from 'react';
import ImageEditor from '@react-native-community/image-editor';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, FlatList, Dimensions, Platform } from 'react-native';
import getPermissions from './../helpers/getPermissions';
import EStyleSheet from 'react-native-extended-stylesheet';
import * as FileSystem from 'expo-file-system';
import WelcomeModal from './WelcomeModal';
import Axios from 'axios';
import { ImageManipulator } from 'expo-image-crop';
import Image from 'react-native-image-progress';
import ProgressBar from 'react-native-progress/Bar';


const UploadPost = ({
    navigation,
}) => {
  const [memeTemplates, setMemeTemaplates] = useState([]);
  const {width, height} = Dimensions.get('window');
    const imgflip = Axios.create({
      baseURL: 'https://api.imgflip.com/get_memes'
    });

    useEffect(() => {
      imgflip.get('').then(
        function (response) {
          setMemeTemaplates(response.data.data.memes);
          console.log(response.data.data.memes);
        }
      )
    }, [])

    const theme = EStyleSheet.value('$backgroundColor');
    const options = {
        allowsEditing: false,
        base64: true
      };
      
    const takePhoto = async () => {
      const status = await getPermissions(Permissions.CAMERA);
      if (status) {
        const result = await ImagePicker.launchCameraAsync(options);
        if (!result.cancelled) {
          navigation.navigate('MemeMaker', {url: result.uri});
        }
      }
    };

    const selectPhoto = async () => {
        const status = await getPermissions(Permissions.CAMERA_ROLL);
        if (status) {
          const result = await ImagePicker.launchImageLibraryAsync(options);
          if (!result.cancelled) {
            navigation.navigate('MemeMaker', {url: result.uri});
            /*
            ImageEditor.cropImage(result.uri, {
              offset: {x: 0, y: 0},
              size: {width: 1080, height: 1080},
              resizeMode: 'contain'
            },
            (uri) => {
              let base64 = '';
              FileSystem.readAsStringAsync(uri, {
                encoding: 'base64'
              }).then(
                function (response) {
                  base64 = response;
                  navigation.navigate('NewPost', { image: uri, base64: base64 });
                }
              ).catch(error => console.log(error));
            })
            */
          }
        }
      };


      const renderOverlay = () => {
        return (
          <View style={styles.overlay}>
            <Image
              style={styles.overlayHeart}
            />
          </View>
        );
      }

      const description = "This is the Upload page. Here you can choose a meme to upload. When creating your post, if you opt to include it in Joust and Swipe, it will be shown to other users in Joust and Swipe modes.";


    return (
        <SafeAreaView style={styles.container}>
          <View style={[Platform.OS == "android" ? {marginTop: EStyleSheet.value('1.5rem')} : null]}>
            <Text style={styles.text}>
              Popular Meme Templates
            </Text>
            <Text style={styles.comingSoon}>
              Click one to continue
            </Text>
          </View>
          <View style={styles.memeList}>
            <FlatList style={styles.memeList}
            data={memeTemplates}
            
            keyExtractor={(item) => item.id}
            horizontal={false}
            numColumns={3}
            renderItem={({item, index}) => {
              return (
              <TouchableOpacity key={index} onPress={() => navigation.navigate('MemeMaker', {url: item.url})}>
                <View style={[ {width: width/3} , {height: width/3}, {marginBottom: EStyleSheet.value('.1rem')}, index % 3 !== 0 ? 
                    {paddingLeft: EStyleSheet.value('.1rem')} : {paddingLeft: 0}]} >
                        <Image indicatorProps={{color: EStyleSheet.value('$crimson')}} style={{flex: 1, width: undefined, height: undefined}} source={{uri: item.url}}/>
                </View>
                </TouchableOpacity>);
            }}/>
          </View>
          <View>
                <WelcomeModal pagekey={"UploadPost"} title={"Upload"} description={description}/>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-around', width: '100%', flex: 1}}>
          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center',}} onPress={takePhoto}>
              <Text style={styles.text}>
                Take
              </Text>
              <View style={styles.button}>
                <Text style={styles.text}>
                    Photo
                </Text>
              </View>
          </TouchableOpacity>
          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center'}} onPress={selectPhoto}>
              <Text style={styles.text}>
                Select
              </Text>
              <View style={styles.button}>
                <Text style={styles.text}>
                    Photo
                </Text>
              </View>
          </TouchableOpacity>
          </View>
        </SafeAreaView>
        
    );
};

UploadPost.navigationOptions = () => {
  return {
    headerShown: false
  };
};

const styles = EStyleSheet.create({
    container: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-around',
    },
    text: {
      padding: 7,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '$textColor'
    },
    image: {
      width: '70%',
      aspectRatio: 3.5 /1,
      resizeMode: 'contain'
    },
    comingSoon: {
      fontSize: '.8rem',
      color: '$textColor',
      textAlign: 'center'
    },
    button: {
      backgroundColor: '$crimson',
      marginVertical: '.5rem',
      borderRadius: '.6rem'
    },
    imageCard: {
      width: '2rem',
      height: '2rem',
      resizeMode: 'cover'
    },
    memeList: {
      height: '75%'
    }
  });

export default UploadPost;
