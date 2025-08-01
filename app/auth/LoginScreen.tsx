import api, { getCsrfToken, resetSession } from '@/services/api';
import { useAuthStore } from '@/store/useAuthStore';
import { Feather } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import { useCallback, useState } from 'react';
import {
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const user = useAuthStore(store=>store.user)
  const setUser = useAuthStore(store=>store.setUser)

  useFocusEffect(
    useCallback(() => {
      console.log('no hay usuario',user )
      if(user){
        router.replace('/(tabs)/home')
      }
    }, [])
  );


  const handleLogin = async () => {
    setError("");

    // Validar que los campos no estén vacíos
    if (!username.trim()) {
      setError("Por favor ingresa tu nombre de usuario");
      return;
    }

    if (!password.trim()) {
      setError("Por favor ingresa tu contraseña");
      return;
    }

    try {
      console.log("0. Reseteando sesión completamente...");
      await resetSession();

      console.log("1. Obteniendo token CSRF...");

      // 1. Obtener un token CSRF fresco
      const token = await getCsrfToken(true);

      if (token) {
        console.log("2. Token CSRF obtenido, enviando credenciales...");
      } else {
        console.log("2. No se pudo obtener token CSRF, intentando sin él...");
      }

      console.log({username,password})
      // 2. Hacer la solicitud de login
      console.log("2. Enviando credenciales:", {
        name_usuario: username,
        password: password ? "[OCULTA]" : "[VACÍA]",
      });

      const response = await api.post("login", {
        name_usuario: username,
        password: password,
      });


      console.log('3. Respuesta del servidor:', response.data);

      // Verificar si la respuesta contiene datos del usuario (login exitoso)
      if (response.data && response.data.idusuario) {
        // Guardar los datos del usuario en AsyncStorage
        setUser(response.data)

        // await AsyncStorage.setItem('userData', JSON.stringify(response.data));

        console.log("Login exitoso!");
        console.log("Usuario:", response.data.nombres, response.data.apellidos);
        console.log("ID Usuario:", response.data.idusuario);
        console.log("Navegando al loading screen...");

        // Navegar al loading screen
        router.replace("/plugins/loading");
      } else if (response.data && response.data.status === "ok") {
        // Fallback para el formato con status
        if (response.data.token) {
          setUser(response.data)
          // await AsyncStorage.setItem('userToken', response.data.token);
        }
        if (response.data.datos) {
          setUser(response.data)

          // await AsyncStorage.setItem(
          //   'userData',
          //   JSON.stringify(response.data.datos)
          // );
        }
        router.replace("/plugins/loading");
      } else {
        setError("Respuesta inválida del servidor");
      }
    } catch (err: any) {
      console.log("Error en login:", err?.response?.data || err);

      if (err?.response?.status === 419) {
        setError(
          "Error de token CSRF. Configura el servidor para excluir 'login' del middleware CSRF."
        );
      } else if (err?.response?.status === 401) {
        // Manejar respuesta de credenciales incorrectas del servidor
        const errorMessage =
          err?.response?.data?.message || "Credenciales incorrectas";
        setError(errorMessage);
      } else if (err?.response?.status === 412) {
        setError(err?.response?.data?.errors || "Error de validación");
      } else {
        setError("Error de conexión");
      }
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black px-6 justify-center">
      <View className="items-center mb-12">
        <Image
          source={require("@/assets/images/Escudo_Fuerza_Aerea_Ecuador.png")}
          className="w-[150px] h-[150px] mb-4"
          resizeMode="contain"
        />
        <Text className="text-3xl font-bold text-white text-center">
          Fuerzas Armadas del Ecuador
        </Text>
      </View>

      <View className="flex flex-col gap-2 ">
        <TextInput
          placeholder="Username"
          placeholderTextColor="#aaa"
          value={username}
          onChangeText={setUsername}
          className="bg-neutral-900 text-white p-4 rounded-md"
        />
        <View style={{ position: "relative" }}>
          <TextInput
            placeholder="Password"
            placeholderTextColor="#aaa"
            secureTextEntry={!showPassword}
            value={password}
            onChangeText={setPassword}
            className="bg-neutral-900 text-white p-4 rounded-md pr-12"
          />
          <Pressable
            onPress={() => setShowPassword((prev) => !prev)}
            style={{
              position: "absolute",
              right: 10,
              top: 0,
              height: "100%",
              justifyContent: "center",
            }}
            accessibilityLabel={
              showPassword ? "Ocultar contraseña" : "Mostrar contraseña"
            }
          >
            <Feather
              name={showPassword ? "eye-off" : "eye"}
              size={22}
              color="#aaa"
            />
          </Pressable>
        </View>
        <TouchableOpacity
          className="bg-neutral-700 p-4 rounded-md items-center mt-2 "
          onPress={handleLogin}
        >
          <Text className="text-white font-bold">LOG IN</Text>
        </TouchableOpacity>

        {error ? (
          <Text style={{ color: "red", marginTop: 8 }}>{error}</Text>
        ) : null}
      </View>

      {/* <Pressable className="mt-6 items-center">
        <Text className="text-neutral-400">Forgot password?</Text>
      </Pressable> */}
    </SafeAreaView>
  );
}
