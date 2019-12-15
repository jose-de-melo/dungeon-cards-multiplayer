import { ToastAndroid } from 'react-native'

export function showToastLong(message){
    ToastAndroid.show(message, ToastAndroid.LONG);
}

export function showToastShort(message){
    ToastAndroid.show(message, ToastAndroid.SHORT);
}