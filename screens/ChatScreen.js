import React, { useLayoutEffect, useState } from 'react';
import { StyleSheet, SafeAreaView, Text, TouchableOpacity, View, StatusBar, KeyboardAvoidingView, Platform, ScrollView, TextInput, Keyboard } from 'react-native';
import { Avatar } from 'react-native-elements';
import { AntDesign, FontAwesome, Ionicons } from '@expo/vector-icons';
import { TouchableWithoutFeedback } from 'react-native';
import firebase from 'firebase';
import { auth, db } from '../firebase';

const ChatScreen = ({ navigation, route }) => {
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    useLayoutEffect(() => {
        navigation.setOptions({
            title: 'Chat',
            headerBackTitleVisible: false,
            headerTitleAlign: 'left',
            headerTitle: () => (
                <View 
                  style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                  }}
                >
                    <Avatar
                        rounded
                        source={{
                            uri: messages[0]?.data.photoURL,
                        }}
                    />
                    <Text style={{ color: 'white', marginLeft: 10, fontWeight: 700 }}
                    >
                        {route.params.chatName}</Text>
                </View>
            ),
            headerLeft: () => (
                <TouchableOpacity
                   style={{ marginLeft: 10 }}
                   onPress={navigation.goBack}
                >
                    <AntDesign name="arrowleft" size={24} color='white' />
                </TouchableOpacity>
            ),
            headerRight: () => (
                <View 
                    style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        width: 80,
                        marginRight: 20,
                    }}
                    >
                    <TouchableOpacity>
                        <FontAwesome name="video-camera" size={24} color='white' />
                    </TouchableOpacity>
                    <TouchableOpacity>
                        <Ionicons name="call" size={24} color='white' />
                    </TouchableOpacity>
                </View>
            ),
        });
    }, [navigation, messages]);

    const sendMessage = () => {
        Keyboard.dismiss();

        db.collection('chats').doc(route.params.id).collection('messages').add({
            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
            message: input,
            displayName: auth.currentUser.displayName,
            email: auth.currentUser.email,
            photoURL: auth.currentUser.photoURL,
        });

        setInput('');
    };

    useLayoutEffect(() => {
        const unsubscribe = db
            .collection('chats')
            .doc(route.params.id)
            .collection('messages')
            .orderBy('timestamp', 'desc')
            .onSnapshot((snapshot) => 
              setMessages(
                snapshot.docs.map(doc => ({
                    id: doc.id,
                    data: doc.data(),
                }))
            ));

            return unsubscribe;
    }, [route])

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: 'white' }}>
            <StatusBar style='light' />
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                style={styles.container}
                KeyboardVerticalOffset={90}
            >
                <TouchableWithoutFeedback onpress={Keyboard.dismiss} >
                    <>
                    <ScrollView contentContainerStyle={{ paddingTop: 15 }}>
                        {messages.map(({ id, data }) => 
                           data.email === auth.currentUser.email ? (
                               <View key={id} style={styles.reciever}>
                                   <Avatar 
                                      position="absolute"
                                      rounded
                                      // WEB
                                      containerStyle={{
                                          position: 'absolute',
                                          bottom: -15,
                                          right: -5,
                                      }}
                                      bottom={-12}
                                      right={-5}
                                      size={30}
                                      source={{ 
                                        uri: data.photoURL,
                                    }}
                                   />
                                   <Text style={styles.recieverText}>{data.message}</Text>
                               </View>
                           ) : (
                               <View style={styles.sender}>
                                   <Avatar 
                                      position="absolute"
                                      rounded
                                      containerStyle={{
                                          position: 'absolute',
                                          bottom: -15,
                                          right: -5,
                                      }}
                                      bottom={-12}
                                      right={-5}
                                      size={30}
                                      source={{ 
                                        uri: data.photoURL,
                                    }}
                                   />
                                   <Text style={styles.senderText}>{data.message}</Text>
                                   <Text style={styles.senderName}>{data.displayName}</Text>
                               </View>
                           )
                        )}
                    </ScrollView>
                    <View style={styles.footer}>
                        <TextInput 
                        value={input}
                        onChangeText={(text) => setInput(text)}
                        onSubmitEditing={sendMessage}
                        placeholder="IELTS Message" 
                        style={styles.textInput} 
                        />
                        <TouchableOpacity 
                        onPress={sendMessage} 
                        activeOpacity={0.5}
                        >
                            <Ionicons name="send" size={24} color="#2B68E6" />

                        </TouchableOpacity>
                    </View>
                    </>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    )
}

export default ChatScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    footer: {
        flexDirection: 'row',
        alignItems: 'center',
        width: '100%',
        padding: 15,
    },
    textInput: {
        bottom: 0,
        height: 40,
        flex: 1,
        marginRight: 15,
        borderColor: 'transparent',
        backgroundColor: '#ECECEC',
        padding: 10,
        color: 'grey',
        borderRadius: 30,
    },
    reciever: {
        padding: 15,
        backgroundColor: '#CACAFF',
        alignSelf: 'flex-end',
        borderRadius: 20,
        marginRight: 15,
        marginBottom: 20,
        maxWidth: '80%',
        position: 'relative',
    },
    sender: {
        padding: 15,
        backgroundColor: '#ADFFAD',
        alignSelf: 'flex-start',
        borderRadius: 20,
        margin: 15,
        maxWidth: '80%',
        position: 'relative',
    },
    senderText: {
        color: 'black',
        fontWeight: '500',
        marginLeft: 10,
        marginBottom: 15,
    },
    recieverText: {
        color: 'black',
        fontWeight: '500',
        marginLeft: 10,
    },
    senderName: {
        left: 10,
        paddingRight: 10,
        fontSize: 10,
        color: '#5C5C5C',
    }
})
