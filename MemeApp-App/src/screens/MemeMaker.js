import { Constants} from 'expo';
import * as Permissions from 'expo-permissions';
import * as ImagePicker from 'expo-image-picker';
import React, { Component, useEffect, useState, useRef } from 'react';
import ImageEditor from '@react-native-community/image-editor';
import {Overlay} from 'react-native-elements';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Image, FlatList, Dimensions, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TextInput } from 'react-native';
import getPermissions from './../helpers/getPermissions';
import EStyleSheet from 'react-native-extended-stylesheet';
import * as FileSystem from 'expo-file-system';
import WelcomeModal from './WelcomeModal';
import {DragResizeBlock, DragResizeContainer} from 'react-native-drag-resize';
import {Feather} from 'react-native-vector-icons';
import DropDownPicker from 'react-native-dropdown-picker';
import * as Font from 'expo-font';
import HsvColorPicker from 'react-native-hsv-color-picker';
import *  as ColorConvert from 'color-convert';
import ViewShot, {captureRef} from "react-native-view-shot";


const MemeMaker = ({
    navigation,
}) => {
    const url = navigation.getParam('url');
    const [modalVisible, setModalVisible] = useState(false); 
    Font.loadAsync({Impact: require('./../../assets/fonts/impact.ttf')});
    const [fontValue, setFontValue] = useState('Arial');
    const [currentColor, setCurrentColor] = useState('#000000');
    const [fontSize, setFontSize] = useState(14);
    const [isBold, setIsBold] = useState(false);
    const [newText, setNewText] = useState('');
    const [boxes, setBoxes] = useState([]);
    const viewShot = useRef(null);
    const id = useRef(null);
    const xPos = useRef(0);
    const yPos = useRef(0);
    const wPos = useRef(0);
    const hPos = useRef(0);
    const uriTemp = useRef('');
    const image = useRef(null);
    console.log(url);
    const nextButtonClicked = useRef(false);
    const [loading, setLoading] = useState(false);


    const [isResizeHidden, setResizeHidden] = useState(false);

    const saveSettings = () => {
        let currentBoxes = boxes;
        console.log(id.current);
        if (id.current != null) {

            var newData = currentBoxes.map(el => {
                if(el.id == id.current)
                   return Object.assign({}, el, {font: fontValue, color: currentColor, fontSize: fontSize, isBold: isBold, text: newText});
                return el
            });
            setBoxes(newData);
        } else {
            const newBox = {id:  boxes.length + 1, font: fontValue, color: currentColor, fontSize: fontSize, isBold: isBold, text: newText};
            currentBoxes.push(newBox);
            setBoxes(currentBoxes);
        }
        setFontValue('Arial');
        setCurrentColor('#000000');
        setFontSize(14);
        setIsBold(false);
        setNewText('');
        setModalVisible(false);
        id.current = null;
    };

    const onDragPress = (item) => {
        id.current = item.id;
        setFontValue(item.font);
        setCurrentColor(item.color);
        setFontSize(item.fontSize);
        setIsBold(item.isBold);
        setNewText(item.text);
        setModalVisible(true);
    };

    const onSavePicture = () => {
        let base64 = null;
        let uri = null;
        captureRef(viewShot, {
                format: 'png',
                result: 'tmpfile'
            }).then(uriResult => {
                nextButtonClicked.current = false;
                setResizeHidden(false);
                navigation.navigate('NewPost', {image: uriResult});
            });
    };

    const onClickNext = () => {
        setResizeHidden(true);
        nextButtonClicked.current = true;
    };

    useEffect(() => {
        if (nextButtonClicked.current) {
            onSavePicture();
        }
    }, [isResizeHidden]);

    const onDragResizeInit = ({x, y, w, h}) => {
        xPos.current = x;
        yPos.current = y;
        wPos.current = w;
        hPos.current = h;
    }

    const renderText = boxes.map((item, index) => {
            return (
                
                <DragResizeBlock onPress={() => onDragPress(item)} isDisabled={isResizeHidden} limitation={{x: xPos.current, y: yPos.current, w: wPos.current, h: hPos.current}} key={index} x={0} y={0}>
                    <Text style={[ isBold ? {fontWeight: 'bold'} : null, {fontSize: item.fontSize, color: item.color, fontFamily: item.font, flexWrap: 'wrap', flex: 1}]}>{item.text}</Text>
                </DragResizeBlock>
            )
        });
    
    console.log(boxes);
    return ( <KeyboardAvoidingView 
        behavior="padding" 
        enabled
        keyboardVerticalOffset={0}
        style={{
            flex: 1,
            flexDirection: 'column', 
            justifyContent: 'space-around',
        }}
        >
            <DragResizeContainer ref={viewShot} style={{flex: 1}} onInit={onDragResizeInit}>
                <Image ref={image}  source={{uri: url}} style={styles.image}/>
                {boxes.length > 0 ? renderText : null}
            </DragResizeContainer>
            
            <View>
            <TouchableOpacity onPress={() => setModalVisible(true)} style={{flexDirection: 'row', alignItems: 'center', alignSelf: 'center', 
            backgroundColor: EStyleSheet.value('$crimson'), borderRadius: 12}}>
                <Text style={styles.text}>
                    Add Text
                </Text>
                <Feather style={styles.plusIcon} name="plus"/>
            </TouchableOpacity>
            <TouchableOpacity onPress={onClickNext} style={{backgroundColor: '#4ABF73', alignSelf: 'center', borderRadius: 12, marginTop: 15, marginBottom: 15, paddingHorizontal: 4}}>
                <Text style={styles.text}>Next</Text>
            </TouchableOpacity>
            </View>





            <Overlay isVisible={modalVisible} height={'auto'} onBackdropPress={() => setModalVisible(false)} animationType={'fade'} 
                overlayStyle={{borderRadius: 30}}
                children={
                <View>
                    <TextInput style={[ isBold ? {fontWeight: 'bold'} : null, {
                        height: EStyleSheet.value('20rem'), width: '100%', fontFamily: fontValue, color: currentColor, 
                        fontSize: fontSize, backgroundColor: 'lightgray', borderRadius: 20, padding: 20}]} 
                        autoCorrect={false}
                        autoCapitalize={'none'}
                        value={newText}
                        onChangeText={(text) => setNewText(text)}
                        onTouchCancel={() => Keyboard.dismiss()}
                        
                        />
                    <View style={{flexDirection: 'row', justifyContent: 'center', paddingTop: 5}}>
                        <TouchableOpacity onPress={() => setIsBold(!isBold)} style={[{marginRight: 15, alignSelf: 'center', 
                            paddingHorizontal: 6, borderRadius: 5}, isBold ? {backgroundColor: 'lightgray'} : null]}>
                            <Text style={{fontWeight: 'bold', fontSize: 25}}>B</Text>
                        </TouchableOpacity>
                         <DropDownPicker
                                defaultValue={fontValue}
                                labelStyle={{fontSize: 20}}
                                placeholder="Arial" 
                                containerStyle={{height: 50, width: 100}}
                                onChangeItem={item => setFontValue(item.value)}
                                items={[
                                    {label: 'Arial', value: 'Arial'},
                                    {value: 'Impact', icon: () => <Text style={{fontFamily: 'Impact', fontSize:  20}}>Impact</Text>},
                                ]}
                            >
                            </DropDownPicker>
                            <DropDownPicker
                                defaultValue={currentColor}
                                containerStyle={{height: 50, width: 60, borderWidth: 0}}
                                onChangeItem={item => setCurrentColor(item.value)}
                                items={[
                                    {value: '#000000', icon: () => <View style={{width: 20, height: 20, backgroundColor: '#000000'}}></View>},
                                    {value: '#ffffff', icon: () => <View style={{width: 20, height: 20, borderWidth: 1, backgroundColor: '#ffffff'}}></View>},
                                    {value: '#ff3333', icon: () => <View style={{width: 20, height: 20, backgroundColor: '#ff3333'}}></View>},
                                ]}
                            >
                            </DropDownPicker>
                            <DropDownPicker
                                defaultValue={fontSize}
                                containerStyle={{height: 50, width: 100, borderWidth: 0}}
                                onChangeItem={item => setFontSize(item.value)}
                                dropDownStyle={{height: 400}}
                                items={[
                                    {value: 10, icon: () => <Text style={{fontSize: 20}}>10 pt</Text>},
                                    {value: 12, icon: () => <Text style={{fontSize: 20}}>12 pt</Text>},
                                    {value: 14, icon: () => <Text style={{fontSize: 20}}>14 pt</Text>},
                                    {value: 18, icon: () => <Text style={{fontSize: 20}}>18 pt</Text>},
                                    {value: 24, icon: () => <Text style={{fontSize: 20}}>24 pt</Text>},
                                    {value: 36, icon: () => <Text style={{fontSize: 20}}>36 pt</Text>},
                                ]}
                            >
                            </DropDownPicker>
                    </View>
                    <TouchableOpacity onPress={() => saveSettings()} style={{alignSelf: 'center', marginTop: 10}}>
                        <Feather style={{fontSize: 30}} name="check-circle"></Feather>
                    </TouchableOpacity>
                </View>
            }>
                    </Overlay>

            

            
    </KeyboardAvoidingView>
    
    );
};

export default MemeMaker;

const styles = EStyleSheet.create({
    image: {
        maxHeight: '100%',
        maxWidth: '100%',
        width: '100%',
        height: '100%',
        resizeMode: 'contain',
    },
    text: {
        padding: 7,
        fontSize: 18,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '$textColor'
      },
      plusIcon: {
          color: '$textColor',
          fontSize: '1rem',
          paddingRight: 7
      }
});