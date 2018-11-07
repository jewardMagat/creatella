import {createStackNavigator} from 'react-navigation';
import Main from '@screens/main/Main';

export default Root = createStackNavigator(
  {
    Main: {screen: Main}
  },
  {
    initialRouteName: 'Main',
    headerMode: 'none'
  }
)
