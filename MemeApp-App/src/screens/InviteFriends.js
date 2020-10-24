import React, { Component, PropTypes } from "react";
import {
  AsyncStorage,
  Modal,
  View,
  Text,
  TouchableOpacity,
} from "react-native";
import EStyleSheet from 'react-native-extended-stylesheet';
import {Overlay} from 'react-native-elements';
import { intlDateTimeFormatSupportedLocale } from "javascript-time-ago";

export default class InviteFriends extends Component {
  constructor(props) {
    super(props);
    this.state = {
        modalVisible: false
    };
  }

  render() {
    return (
          <View>
              
          </View>
    );
  }
}

export const styles = EStyleSheet.create({
ftreContainer:{
		backgroundColor:'black',
		marginLeft:20,
		marginRight:20,
		borderRadius:20,
		borderWidth:4,
        borderColor:'$crimson',
	},
	ftreTitle:{
		color:'white',
        fontWeight:'bold',
		fontSize:20,
		textAlign:'center',
		margin:10,	
	},
	ftreDescription:{
		color:'white',
        fontSize:15,
		    marginRight:20,
        marginLeft:20,
        marginBottom: 10
	},
	ftreCloseIcon:{
		alignSelf:'flex-end',
		flex:0.5,
		marginRight:10
	},
	ftreTitleContainer:{
		flex:1,
		flexDirection:'row',
		justifyContent:'center',
		alignItems:'center'
	},
	ftreDescriptionContainer:{
        flex: 1
	},
	ftreExitContainer:{
		justifyContent:'center',
		alignItems:'center',
	},
	ftreExitButtonContainer:{
		backgroundColor:'$crimson',
		borderRadius:10,
        justifyContent:'center',
        width: '25%',
        alignSelf: 'center'
	},
	ftreExitButtonText:{
		color:'white',
		fontSize:20,
		fontWeight:'bold',
        textAlign:'center',
        padding: 5,
	}
});


