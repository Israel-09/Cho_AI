import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, Linking } from 'react-native';

import logo from '../assets/logo.png';

const SignupScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const handleDeepLink = ({ url }) => {
      if (url.startsWith('myapp://auth')) {
        const token = new URL(url).searchParams.get('token');
        signInWithCustomToken(auth, token)
          .then((userCredential) => {
            console.log('Signed in:', userCredential.user);
            navigation.navigate('Home'); // Adjust to your app’s home screen
          })
          .catch((error) => {
            console.error('Sign-in error:', error);
          });
      }
    };

    Linking.addEventListener('url', handleDeepLink);
    return () => Linking.removeAllListeners('url');
  }, [navigation]);

  const openAuthInBrowser = async () => {
    try {
      await InAppBrowser.openAuth(
        'https://yourapp.com/signup',
        'myapp://auth',
        { ephemeralWebSession: true }
      );
    } catch (error) {
      console.error('InAppBrowser error:', error);
    }
  };

  return (
    <View className="flex-1 bg-white justify-center items-center px-4">
      <Image source={logo} className="h-[90px] w-[90px] mb-6" />
      <View className="w-full max-w-[90%]">
        <Text className="text-center text-xl font-medium">
          Create new account
        </Text>
        <Text className="text-center text-base font-light mt-2">
          Welcome to AskCho, your on-the-go personal assistant.
        </Text>
      </View>

      <View className="w-full max-w-[95%] mt-6">
        <TouchableOpacity
          className="bg-blue-500 rounded-lg py-3 mb-4"
          onPress={openAuthInBrowser}
        >
          <Text className="text-white text-center text-base font-semibold">
            Sign Up
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          className="bg-blue-500 rounded-lg py-3 flex-row items-center justify-center"
          onPress={openAuthInBrowser}
        >
          <GoogleIcon />
          <Text className="text-white text-base font-semibold ml-2">
            Continue with Google
          </Text>
        </TouchableOpacity>

        <Text className="text-center text-base mt-4">
          Already have an account?{' '}
          <Text
            className="text-blue-500 font-semibold"
            onPress={() => navigation.navigate('SignIn')}
          >
            Sign in
          </Text>
        </Text>
      </View>
    </View>
  );
};

export default SignupScreen
;