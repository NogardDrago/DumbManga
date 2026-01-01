import 'react-native-gesture-handler';
import { registerRootComponent } from 'expo';
import App from './App';

console.log('✅ Gesture handler initialized');
console.log('✅ Index.js loaded successfully');

registerRootComponent(App);
