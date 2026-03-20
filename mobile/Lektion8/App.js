import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TextInput, Platform } from 'react-native';
import { useState, useEffect } from 'react';
import { database,app } from './firebase';
import { addDoc, collection } from 'firebase/firestore';
import {getAuth, signInWithEmailAndPassword, signOut, signInWithCredential} from 'firebase/auth'
import {createUserWithEmailAndPassword, onAuthStateChanged} from 'firebase/auth'
import {initializeAuth, getReactNativePersistence, GoogleAuthProvider} from 'firebase/auth'
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage'
import * as LocalAuthentication from 'expo-local-authentication'
import * as WebBrowser from 'expo-web-browser'
import * as Google from 'expo-auth-session/providers/google'
import * as AuthSession from 'expo-auth-session'


let auth
if(Platform.OS === "web"){
  auth = getAuth(app)
}else{
  auth = initializeAuth(app, {
    persistence:getReactNativePersistence(ReactNativeAsyncStorage)
  })
}

WebBrowser.maybeCompleteAuthSession()

export default function App() {
const [enteredEmail, setEnteredEmail] = useState("jon@d.dk")
const [enteredPassword, setEnteredPassword] = useState("12345678")
const [userId, setUserId] = useState(null)
const [user, setUser] = useState(null)
const [enteredText, setenteredText] = useState("type here")
//const auth = getAuth(app)


const [request, response, promptAsync] = Google.useAuthRequest({
  scopes:["profile", "email"],
   iosClientId: "366920203555-42ndga1spvql14cdmrkplpn22s87be5j.apps.googleusercontent.com",
   androidClientId: "366920203555-97f4f2onv5d1pu2nqmhn23g2lui65q9c.apps.googleusercontent.com",
   redirectUri: AuthSession.makeRedirectUri({                                                                                               
      native: "com.googleusercontent.apps.366920203555-97f4f2onv5d1pu2nqmhn23g2lui65q9c:/oauth2redirect/google"                                               
    })
})
console.log("redirect URI:", request?.redirectUri)

useEffect(()=>{
  if(response?.type=== "success"){
    const {id_token, access_token} = response.params
    const credential = GoogleAuthProvider.credential(id_token,access_token)
    signInWithCredential(auth, credential)
    .then((userCredential)=> setUserId(userCredential.user.uid))
    .catch((error)=> console.log("Google login error" + error))
  }
},[response])


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

async function handleBioLogin() {
  const hasHardware = await LocalAuthentication.hasHardwareAsync() // step 1
  if(!hasHardware){
    //alert("biometrics not supported")
  }else{
    alert("biometrics ok")
  }
  
  const isEnrolled = await LocalAuthentication.isEnrolledAsync() // step 1
  if(!isEnrolled){
    //alert("biometrics not enrolled")
  }else{
    alert("biometrics enrolled")
  }

  const result = await LocalAuthentication.authenticateAsync({
    promptMessage: "Authenticate to continue"
  })
  if(result.success){
    alert("logget ind: LOKALT")
  }else{
    alert("ikke logget ind med biometrics")
  }


}
() => promptAsync()
return (
<View style={styles.container}>
    { !userId &&
      <>
        <Button
        title='Google Login'
        onPress={() => promptAsync()}
        />

        <Button
        title='Log in with bio'
        onPress={handleBioLogin}
        />
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
  apiKey: ....
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getFirestore(app);
export { database, app }
