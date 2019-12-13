import { ToastAndroid } from 'react-native'

export function showToastLong(message){
    ToastAndroid.show(message, ToastAndroid.LONG);
}