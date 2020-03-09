import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import {createStackNavigator} from 'react-navigation-stack';
import SignIn from './src/screens/SignIn';
import SignUp from './src/screens/SignUp';
import Feed from './src/screens/Feed';
import Search from './src/screens/Search';
import Settings from './src/screens/Settings';
import Notifications from './src/screens/Notifications';
import Profile from './src/screens/Profile';
import UploadPost from './src/screens/UploadPost';
import Featured from './src/screens/Featured';
import Comments from './src/screens/Comments';
import List from './src/screens/List';
import EStyleSheet from 'react-native-extended-stylesheet';
import {Provider as AuthProvider} from './src/context/AuthContext';
import React from 'react';
import {setNavigator} from './src/helpers/navigationRef';
import {StatusBar} from 'react-native';
import LoadingScreen from './src/screens/LoadingScren';
import {Feather, Ionicons} from 'react-native-vector-icons';
import NewPost from './src/screens/NewPost';


const switchNavigator = createSwitchNavigator({
  Loading: LoadingScreen,
  authFlow: createStackNavigator({
    SignIn: SignIn,
    SignUp: SignUp
  }),
  mainFlow: createBottomTabNavigator({
    feedFlow: createStackNavigator({
        Feed: Feed,
        List: List,
        Profile: Profile,
        Comments: Comments
    },{
      initialRouteName: 'Feed',
      defaultNavigationOptions: ({navigation}) => ({
        headerBackImage: () => {
          return <Ionicons style={styles.backIcon} name="ios-arrow-back"/>
        },
        headerBackTitleVisible: false
      })
    }),
    featuredFlow: createStackNavigator({
        Featured: Featured,
        List: List,
        Profile: Profile,
        Comments: Comments
    },
    {
      initialRouteName: 'Featured',
      defaultNavigationOptions: ({navigation}) => ({
        headerBackImage: () => {
          return <Ionicons style={styles.backIcon} name="ios-arrow-back"/>
        },
        headerBackTitleVisible: false
      })
    }),
    uploadFlow: createStackNavigator({
      UploadPost: UploadPost,
      NewPost: NewPost
  },
  {
    initialRouteName: 'UploadPost',
    defaultNavigationOptions: ({navigation}) => ({
      headerBackImage: () => {
        return <Ionicons style={styles.backIcon} name="ios-arrow-back"/>
      },
      headerBackTitleVisible: false
    })
  }),
    searchFlow: createStackNavigator({
      Search: Search,
      List: List,
      Profile: Profile,
      Comments: Comments
    }),
    profileFlow: createStackNavigator({
      Profile: Profile,
      List: List,
      Settings: Settings,
      Comments: Comments
    },
    {
      initialRouteName: 'Profile',
      defaultNavigationOptions: ({navigation}) => ({
        headerBackImage: () => {
          return <Ionicons style={styles.backIcon} name="ios-arrow-back"/>
        },
        headerBackTitleVisible: false
      })
    })
  },
  {
    initialRouteName: 'feedFlow',
    defaultNavigationOptions: ({navigation}) => ({
      tabBarIcon: ({tintColor}) => {
        let {routeName} = navigation.state;
        let iconName;
        if (routeName === 'feedFlow') {
          iconName = 'home';
        } else if (routeName === 'featuredFlow') {
          iconName = 'star';
        } else if (routeName === 'uploadFlow') {
          iconName = 'plus-circle';
        } else if (routeName === 'searchFlow') {
          iconName = 'search';
        } else if (routeName === 'profileFlow') {
          iconName = 'user';
        }
        return <Feather color={tintColor} style={styles.icon} name={`${iconName}`} />;
      }
    }),
    tabBarOptions: {
      activeBackgroundColor: 'white',
      inactiveBackgroundColor: 'white',
      activeTintColor: '#DC143C',
      inactiveTintColor: 'black',
      showIcons: true,
      showLabel: false

    }
  })
});

const crimson = '#DC143C';

const _XHR = GLOBAL.originalXMLHttpRequest ?  
    GLOBAL.originalXMLHttpRequest :           
    GLOBAL.XMLHttpRequest                     

XMLHttpRequest = _XHR

EStyleSheet.build({ // always call EStyleSheet.build() even if you don't use global variables!
  $crimson: '#DC143C'
});

const styles = EStyleSheet.create({
  icon: {
    fontSize: '1.7rem'
  },
  backIcon: {
    fontSize: '1.7rem',
    marginLeft: '.5rem'
  }
});

StatusBar.setBarStyle('dark-content', true);

const App = createAppContainer(switchNavigator);

export default () => {
  return (
      <AuthProvider>
        <App ref={(navigator) => {setNavigator(navigator)}}/>
      </AuthProvider>
  );
};
