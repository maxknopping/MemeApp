import { Constants} from 'expo';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import React, { Component } from 'react';
import ImageEditor from '@react-native-community/image-editor';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import getPermissions from './../helpers/getPermissions';
import EStyleSheet from 'react-native-extended-stylesheet';
import * as FileSystem from 'expo-file-system';


const UploadPost = ({
    navigation,
}) => {

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


    return (
        <SafeAreaView style={styles.container}>
          <Text onPress={selectPhoto} style={styles.text}>
            Select Photo
          </Text>
          <Text onPress={takePhoto} style={styles.text}>
            Take Photo
          </Text>
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
      justifyContent: 'center',
    },
    text: {
      padding: 24,
      fontSize: 18,
      fontWeight: 'bold',
      textAlign: 'center',
      color: '$textColor'
    }
  });

export default UploadPost;
