/** @format */

import {AppRegistry} from 'react-native';
import App from './src';
import Root from '@navigation/Root'
import {name as appName} from './app.json';

AppRegistry.registerComponent(appName, () => App);
