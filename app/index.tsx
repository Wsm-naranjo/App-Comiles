import { useState } from 'react';
import { Image, Pressable, Text, TextInput, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from 'react-native-safe-area-context';





export default function Index() {

  const [ username, setUsername ] = useState( '' );
  const [ password, setPassword ] = useState( '' );



  return (
    <SafeAreaView className="flex-1 bg-black px-6 justify-center">
      <View className="items-center mb-12">
        <Image
          source={require('../assets/images/Escudo_Fuerza_Aerea_Ecuador.png')} 
          className="w-[150px] h-[150px] mb-4"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-white text-center">Fuerzas Armadas del Ecuador</Text>
      </View>

      <View className="flex flex-col gap-2 ">
        <TextInput
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={ username }
          onChangeText={ setUsername }
          className="bg-neutral-900 text-white p-4 rounded-md"
        />
        <TextInput
          placeholder="Password"
          placeholderTextColor="#aaa"
          secureTextEntry
          value={ password }
          onChangeText={ setPassword }
          className="bg-neutral-900 text-white p-4 rounded-md"
        />
        <TouchableOpacity className="bg-neutral-700 p-4 rounded-md items-center mt-2 ">
          <Text className="text-white font-bold">LOG IN</Text>
        </TouchableOpacity>
      </View>

      <Pressable className="mt-6 items-center">
        <Text className="text-neutral-400">Forgot password?</Text>
      </Pressable>
    </SafeAreaView>
  );
}
