import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { database,app } from './firebase';
import { addDoc, collection } from 'firebase/firestore';
import {getAuth, signInWithEmailAndPassword, signOut} from 'firebase/auth'
import {createUserWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth'
import {initializeAuth, getReactNativePersistence} from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'

let auth
if(Platform.OS === "web"){
  auth = getAuth(app)
}else{
  auth = initializeAuth(app, {
    persistence:getReactNativePersistence(ReactNativeAsyncStorage)
  })
}


export default function App() {
const [enteredEmail, setEnteredEmail] = useState("jon@d.dk")
const [enteredPassword, setEnteredPassword] = useState("12345678")
const [userId, setUserId] = useState(null)
const [enteredText, setenteredText] = useState("type here")
//const auth = getAuth(app)

useEffect(()=>{
  const auth_ = getAuth(app)
  const unsubscribe = onAuthStateChanged(auth_, (user)=>{
    if(user){
      setUserId(user.uid)
    }else{
      setUserId(null)
    }
  })
  return ()=>unsubscribe()
},[])

async function addDocument(){
try{
await addDoc(collection(database, "users", userId, "messages"),{
text:enteredText
})
}catch(error){
console.log("error addDocument " + error)
}
}

async function login(){
  try {
    const credentials = await signInWithEmailAndPassword(auth, enteredEmail, enteredPassword)
    console.log("logget ind som: " + credentials.user.uid)
    setUserId(credentials.user.uid)
  } catch (error) {
    console.log("fejl i login: " + JSON.stringify(error))
  }
}

async function signup(){
  try {
    const credentials = await createUserWithEmailAndPassword(auth, enteredEmail, enteredPassword)
    console.log("Signet op som: " + credentials.user.uid)
    setUserId(credentials.user.uid)
  } catch (error) {
    console.log("fejl i createUser...: " + JSON.stringify(error))
  }
}

async function signOut_() {
  await signOut(auth)
  //setUserId(null)
}


return (
<View style={styles.container}>
    { !userId &&
      <>
        <Text>Login</Text>
        <TextInput
        onChangeText={newText => setEnteredEmail(newText)}
        value={enteredEmail}
        />
        <TextInput
        onChangeText={newText => setEnteredPassword(newText)}
        value={enteredPassword}
        />
        <Button
        title='Log in'
        onPress={login}
        />
        <TextInput
        onChangeText={newText => setEnteredEmail(newText)}
        value={enteredEmail}
        />
        <TextInput
        onChangeText={newText => setEnteredPassword(newText)}
        value={enteredPassword}
        />
        <Button
        title='Signup'
        onPress={signup}
        />
      </>
    }
  {userId &&
    <>  
      <TextInput
      onChangeText={newText => setenteredText(newText)}
      value={enteredText}
      />
      <Button
      title='Add new Document'
      onPress={addDocument}
      />
      <Button
      title='Log ud'
      onPress={signOut_}
      />
    </>
  }
</View>
);
}


const styles = StyleSheet.create({
container: {
flex: 1,
backgroundColor: '#fff',
alignItems: 'center',
justifyContent: 'center',
},
});


// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import {getFirestore} from 'firebase/firestore';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
....
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
export { database, app }

