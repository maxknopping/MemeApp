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

const theme = Appearance.getColorScheme();

const switchNavigator = createSwitchNavigator({
  Loading: LoadingScreen,
  authFlow: {screen: createStackNavigator({
    SignIn: SignIn,
    SignUp: SignUp,
    ForgotUsername: ForgotUsername,
    ForgotPassword: ForgotPassword,
    TemporaryPassword: TemporaryPassword,
    AuthSinglePost: AuthSinglePost,
  }, {
    initialRouteName: 'SignIn',
    defaultNavigationOptions: ({navigation}) => ({
    headerBackImage: () => {
      return <Ionicons style={styles.backIcon} name="ios-arrow-back"/>
    },
    headerBackTitleVisible: false
  })}),
  path: ''},
  mainFlow: {screen: createBottomTabNavigator({
    feedFlow: {screen: createStackNavigator({
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
    path: ''},
    featuredFlow: createStackNavigator({
        Featured: Featured,
        List: List,
        Profile: Profile,
        Comments: Comments,
        JoustHome: JoustHome,
        SinglePost: SinglePost,
        Joust: Joust,
        Swipe: Swipe
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
      ChangePassword: ChangePassword
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
      activeBackgroundColor: theme === "light" ? 'white' : 'black',
      inactiveBackgroundColor: theme === "light" ? 'white' : 'black',
      activeTintColor: '#DC143C',
      inactiveTintColor: theme === "light" ? 'black' : 'white',
      showIcons: true,
      showLabel: false

    }
  }), path: ''}
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
    fontSize: '1.7rem',
    marginLeft: '.5rem',
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

export default () => {
  return (
    <AppearanceProvider>
      <AuthProvider>
        <App theme={theme} uriPrefix={prefix} ref={(navigator) => {setNavigator(navigator)}}/>
      </AuthProvider>
    </AppearanceProvider>
  );
};
