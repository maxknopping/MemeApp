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

export default class WelcomeModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
        modalVisible: false
    };
  }

  componentDidMount() {
    AsyncStorage.getItem(this.props.pagekey, (err, result) => {
      if (err) {
      } else {
        if (result == null) {
          console.log("null value recieved", result);
          this.setModalVisible(true);
        } else {
          console.log("result", result);
        }
      }
    });
    AsyncStorage.setItem(this.props.pagekey, JSON.stringify({"value":"true"}), (err,result) => {
            console.log("error",err,"result",result);
            });
  }


  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }

  render() {
    return (
        <View>
        <Overlay
          animationType={"slide"}
          transparent={true}
          isVisible={this.state.modalVisible}
          height={'auto'}
          overlayStyle={[{backgroundColor: 'black'}, styles.ftreContainer]}
          
            children={
          <>
              <Text style={styles.ftreTitle}>{this.props.title}</Text>
              <Text style={styles.ftreDescription} allowFontScaling={true}>
                {this.props.description}
              </Text>
                <TouchableOpacity
                    onPress={() => {
                    this.setModalVisible(!this.state.modalVisible);
                    }}
                >
                    <View style={styles.ftreExitButtonContainer}>
                        <Text style={styles.ftreExitButtonText}>Exit</Text>
                    </View>
                </TouchableOpacity>
          </>
            }>
        </Overlay>
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


