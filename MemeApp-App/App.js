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
import LoadingScreen from './src/screens/LoadingScreen';
import {Feather, Ionicons, MaterialCommunityIcons} from 'react-native-vector-icons';
import NewPost from './src/screens/NewPost';
import EditProfile from './src/screens/EditProfile'
import MessageList from './src/screens/MessageList';
import MessageThread from './src/screens/MessageThread';
import SinglePost from './src/screens/SinglePost';
import ChangePassword from './src/screens/ChangePassword';
import ForgotUsername from './src/screens/ForgotUsername';
import ForgotPassword from './src/screens/ForgotPassword';
import TemporaryPassword from './src/screens/TemporaryPassword';
import GroupMessageThread from './src/screens/GroupMessageThread';
import GroupManager from './src/screens/GroupManager';
import {AppearanceProvider, Appearance} from 'react-native-appearance';
import JoustHome from './src/screens/JoustHome';
import Joust from './src/screens/Joust';
import Swipe from './src/screens/Swipe';
import { Linking } from 'expo';
import AuthSinglePost from './src/screens/AuthSinglePost';
import Banned from './src/screens/Banned';
import MemeMaker from './src/screens/MemeMaker';
import SwipeNew from './src/screens/SwipeNew';
import { Clipboard, Text, TextInput } from 'react-native';
import * as Analytics from 'expo-firebase-analytics';
import Blocked from './src/screens/Blocked';


const theme = Appearance.getColorScheme();

Text.defaultProps = Text.defaultProps || {};
Text.defaultProps.allowFontScaling = false;

Text.defaultProps = {};
Text.defaultProps.maxFontSizeMultiplier = 1.0;

TextInput.defaultProps = {};
TextInput.defaultProps.maxFontSizeMultiplier = 1.0;

const authFlow = {screen: createStackNavigator({
  SignIn: SignIn,
  SignUp: SignUp,
  ForgotUsername: ForgotUsername,
  ForgotPassword: ForgotPassword,
  TemporaryPassword: TemporaryPassword,
  AuthSinglePost: AuthSinglePost,
  Banned: Banned
}, {
  initialRouteName: 'SignIn',
  defaultNavigationOptions: ({navigation}) => ({
  headerBackImage: () => {
    return <Ionicons style={styles.backIcon} name="ios-arrow-back"/>
  },
  headerBackTitleVisible: false
})}),
path: ''};

const feedFlow = {screen: createStackNavigator({
  Feed: Feed,
  List: List,
  Profile: Profile,
  Comments: Comments,
  Messages: MessageList,
  MessageThread: MessageThread,
  SinglePost: {
    screen: SinglePost,
    path: 'post/:postId'},
  Notifications: Notifications,
  GroupMessageThread: GroupMessageThread,
  GroupManager: GroupManager
},{
initialRouteName: 'Feed',
defaultNavigationOptions: ({navigation}) => ({
  headerBackImage: () => {
    return <Ionicons style={styles.backIcon} name="ios-arrow-back"/>
  },
  headerBackTitleVisible: false
})
}),
path: ''};


const switchNavigator = createSwitchNavigator({
  Loading: {screen: LoadingScreen, path: ''},
  authFlow: authFlow,
  mainFlow: {screen: createBottomTabNavigator({
    feedFlow: feedFlow,
    featuredFlow: createStackNavigator({
        Featured: Featured,
        List: List,
        Profile: Profile,
        Comments: Comments,
        JoustHome: JoustHome,
        SinglePost: SinglePost,
        Joust: Joust,
        Swipe: SwipeNew
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
    joustFlow: createStackNavigator({
      Profile: Profile,
      List: List,
      Settings: Settings,
      Comments: Comments,
      EditProfile: EditProfile,
      OtherProfile: Profile,
      SinglePost: SinglePost,
      JoustHome: JoustHome,
      SinglePost: SinglePost,
      Joust: Joust,
      Swipe: SwipeNew
      
    },
    {
      initialRouteName: 'JoustHome',
      defaultNavigationOptions: ({navigation}) => ({
        headerBackImage: () => {
          return <Ionicons style={styles.backIcon} name="ios-arrow-back"/>
        },
        headerBackTitleVisible: false
      })
    }),
    uploadFlow: createStackNavigator({
      UploadPost: UploadPost,
      MemeMaker: MemeMaker,
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
    },
    {
      initialRouteName: 'Search',
      defaultNavigationOptions: ({navigation}) => ({
        headerBackImage: () => {
          return <Ionicons style={styles.backIcon} name="ios-arrow-back"/>
        },
        headerBackTitleVisible: false
      })
    }),
    profileFlow: createStackNavigator({
      Profile: Profile,
      List: List,
      Settings: Settings,
      Comments: Comments,
      EditProfile: EditProfile,
      OtherProfile: Profile,
      SinglePost: SinglePost,
      ChangePassword: ChangePassword,
      Blocked: Blocked
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
        } else if (routeName === 'joustFlow') {
          return <MaterialCommunityIcons color={tintColor} style={styles.icon} name="sword-cross"/>
        }
        return <Feather color={tintColor} style={styles.icon} name={`${iconName}`} />;
      },
      tabBarOnPress: ({navigation, defaultHandler}) => {
        let routeName = navigation.state.key;
        console.log(navigation.state);
        defaultHandler();
        if (routeName === 'feedFlow' || routeName === 'featuredFlow' || routeName === 'profileFlow' || routeName === 'joustFlow') {
          const navigationInRoute = navigation.state.routes[0];
          if (!!navigationInRoute && !!navigationInRoute.params && !!navigationInRoute.params.scrollToTop) {
            const scrollToTop = navigation.state.routes[0].params.scrollToTop;
            if (typeof(scrollToTop) != "undefined") {
              scrollToTop();
            }
          }
        }
      }
    }),
    tabBarOptions: {
      activeBackgroundColor: theme === "light" ? 'white' : 'black',
      inactiveBackgroundColor: theme === "light" ? 'white' : 'black',
      activeTintColor: '#DC143C',
      inactiveTintColor: theme === "light" ? 'black' : 'white',
      showIcons: true,
      showLabel: false

    }
  }), path: ''}
}, {
  initialRouteName: 'Loading'
});

const crimson = '#DC143C';

GLOBAL.XMLHttpRequest = GLOBAL.originalXMLHttpRequest || GLOBAL.XMLHttpRequest;


EStyleSheet.build({ // always call EStyleSheet.build() even if you don't use global variables!
  $crimson: '#DC143C',
  $textColor: theme === "light" ? 'black' : 'white',
  $backgroundColor: theme === "light" ? 'white' : 'black',
});

const styles = EStyleSheet.create({
  icon: {
    fontSize: '1.7rem'
  },
  backIcon: {
    fontSize: '1.85rem',
    marginLeft: '.85rem',
    paddingRight: '1rem',
    color: '$textColor'
  }
});

if (theme === "light") {
  StatusBar.setBarStyle('dark-content', true);
} else {
  StatusBar.setBarStyle('light-content', true);
}

const App = createAppContainer(switchNavigator);

const prefix = Linking.makeUrl('/');

if (__DEV__) {
  Clipboard.setString('')
}

function getActiveRouteName(navigationState) {
  if (!navigationState) return null;
  const route = navigationState.routes[navigationState.index];
  // Parse the nested navigators
  if (route.routes) return getActiveRouteName(route);
  return route.routeName;
}

export default () => {
  return (
    <AppearanceProvider>
      <AuthProvider>
        <App onNavigationStateChange={(prevState, currentState) => {
      const currentScreen = getActiveRouteName(currentState);
      const prevScreen = getActiveRouteName(prevState);
      if (prevScreen !== currentScreen) {
        // Update Firebase with the name of your screen
        Analytics.setCurrentScreen(currentScreen);
      }
    }} theme={theme} uriPrefix={prefix} ref={(navigator) => {setNavigator(navigator)}}/>
      </AuthProvider>
    </AppearanceProvider>
  );
};
