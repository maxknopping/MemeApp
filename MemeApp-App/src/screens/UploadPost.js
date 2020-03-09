import { Constants} from 'expo';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import React, { Component } from 'react';
import { StyleSheet, Text, View, SafeAreaView } from 'react-native';
import getPermissions from './../helpers/getPermissions';
import EStyleSheet from 'react-native-extended-stylesheet';


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
          navigation.navigate('NewPost', { image: result.uri });
        }
      }
    };

    const selectPhoto = async () => {
        const status = await getPermissions(Permissions.CAMERA_ROLL);
        if (status) {
          const result = await ImagePicker.launchImageLibraryAsync(options);
          if (!result.cancelled) {
            navigation.navigate('NewPost', { image: result.uri });
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
    },
  });

export default UploadPost;
