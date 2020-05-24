import { Constants} from 'expo';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import React, { Component } from 'react';
import ImageEditor from '@react-native-community/image-editor';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import getPermissions from './../helpers/getPermissions';
import EStyleSheet from 'react-native-extended-stylesheet';
import * as FileSystem from 'expo-file-system';
import WelcomeModal from './WelcomeModal';


const UploadPost = ({
    navigation,
}) => {
    const theme = EStyleSheet.value('$backgroundColor');
    const options = {
        allowsEditing: true,
        base64: true
      };
      
    const takePhoto = async () => {
      const status = await getPermissions(Permissions.CAMERA);
      if (status) {
        const result = await ImagePicker.launchCameraAsync(options);
        if (!result.cancelled) {
          navigation.navigate('NewPost', { image: result.uri, base64: result.base64 });
        }
      }
    };

    const selectPhoto = async () => {
        const status = await getPermissions(Permissions.CAMERA_ROLL);
        if (status) {
          const result = await ImagePicker.launchImageLibraryAsync(options);
          if (!result.cancelled) {
            navigation.navigate('NewPost', { image: result.uri, base64: result.base64 });
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

      const description = "This is the Upload page. Here you can choose a meme to upload. When creating your post, if you opt to include it in Joust and Swipe, it will be shown to other users in Joust and Swipe modes.";


    return (
        <SafeAreaView style={styles.container}>
          <View>
            <Image style={styles.image} source={theme === 'white' ? require('./img/logo.png') : require('./img/MemeClub.png')}/>
            <Text style={styles.comingSoon}>Meme creation coming soon!</Text>
          </View>
          <View>
                <WelcomeModal pagekey={"UploadPost"} title={"Upload"} description={description}/>
          </View>
          <View>
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
    }
  });

export default UploadPost;
