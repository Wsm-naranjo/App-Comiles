import { EnvironmentDebug } from "@/components/EnvironmentDebug";
import { TapIndicator } from "@/components/TapIndicator";
import { useDebugTap } from "@/hooks/useDebugTap";
import api, { /* getCsrfToken, */ resetSession } from "@/services/api";
import { useUser } from "@/services/UserContext";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Pressable,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function LoginScreen() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { setUserData } = useUser();
  const { tapCount, isDebugVisible, handleTap, hideDebug } = useDebugTap(3, 2000);

  const handleLogin = async () => {
    // Prevenir múltiples clics
    if (isLoading) return;

    setError("");
    setIsLoading(true);

    try {
      // Validar que los campos no estén vacíos
      if (!username.trim()) {
        setError("Por favor ingresa tu nombre de usuario");
        setIsLoading(false);
        return;
      }

      if (!password.trim()) {
        setError("Por favor ingresa tu contraseña");
        setIsLoading(false);
        return;
      }

      // PRIMERO: Reset completo de sesión ANTES del try-catch
      console.log("0. Reseteando sesión completamente...");
      try {
        await resetSession();
        console.log("Reset de sesión exitoso");
        // Delay mínimo
        await new Promise((resolve) => setTimeout(resolve, 100));
      } catch (resetError) {
        console.log("Error en reset (continuando):", resetError);
      }

      // Proceso principal de login
      console.log("1. Iniciando proceso de login con la nueva API...");

      /* Ya no es necesario obtener token CSRF para la nueva API
      // 1. Obtener un token CSRF fresco
      const token = await getCsrfToken(true);

      if (token) {
        console.log("2. Token CSRF obtenido, enviando credenciales...");
      } else {
        console.log("2. No se pudo obtener token CSRF, intentando sin él...");
      }
      */

      // 2. Hacer la solicitud de login
      console.log("2. Enviando credenciales:", {
        name_usuario: username,
        password: password ? "[OCULTA]" : "[VACÍA]",
      });

      const response = await api.post("/api/mobile/login", {
        name_usuario: username,
        password: password,
      });

      console.log("3. Respuesta del servidor:", response.data);

      // Verificar si la respuesta está vacía o es inválida
      if (!response.data || Object.keys(response.data).length === 0) {
        console.log(
          "Respuesta vacía del servidor - esperando y reintentando..."
        );

        // Esperar un poco y reintentar una vez
        await new Promise((resolve) => setTimeout(resolve, 500));

        console.log("Reintentando login...");
        const retryResponse = await api.post("/api/mobile/login", {
          name_usuario: username,
          password: password,
        });

        console.log("Respuesta del reintento:", retryResponse.data);

        if (
          !retryResponse.data ||
          Object.keys(retryResponse.data).length === 0
        ) {
          setError("Error del servidor. Por favor intenta más tarde.");
          return;
        }

        // Usar la respuesta del reintento
        response.data = retryResponse.data;
      }

      // Verificar si la respuesta contiene el nuevo formato con token JWT
      if (response.data && response.data.token && response.data.user) {
        console.log("Formato nuevo detectado con token JWT");

        // Guardar el token JWT en AsyncStorage
        await AsyncStorage.setItem("userToken", response.data.token);
        console.log("Token JWT guardado exitosamente");
        console.log(
          "Token (primeros 20 caracteres):",
          response.data.token.substring(0, 20) + "..."
        );

        // Guardar los datos del usuario usando el contexto
        setUserData(response.data.user);

        console.log("Login exitoso!");
        console.log(
          "Usuario:",
          response.data.user.nombres,
          response.data.user.apellidos
        );
        console.log("Navegando al loading screen...");

        // Navegar al loading screen
        router.replace("/plugins/loading");
      }
      // Verificar si la respuesta contiene datos del usuario en formato antiguo (login exitoso)
      else if (response.data && response.data.idusuario) {
        // Guardar los datos del usuario usando el contexto
        setUserData(response.data);

        console.log("Login exitoso!");
        console.log("Usuario:", response.data.nombres, response.data.apellidos);
        console.log("ID Usuario:", response.data.idusuario);
        console.log("Navegando al loading screen...");

        // Navegar al loading screen
        router.replace("/plugins/loading");
      } else if (response.data && response.data.status === "ok") {
        // Fallback para el formato con status
        if (response.data.token) {
          await AsyncStorage.setItem("userToken", response.data.token);
          console.log(
            "Token JWT guardado (formato status):",
            response.data.token
          );
        }
        if (response.data.datos) {
          setUserData(response.data.datos);
        } else if (response.data.user) {
          // Formato alternativo que podría venir con user en lugar de datos
          setUserData(response.data.user);
        }
        router.replace("/plugins/loading");
      } else {
        setError("Respuesta inválida del servidor");
      }
    } catch (err: any) {
      console.log("Error en login:", err?.response?.data || err);

      /* Ya no es necesario manejar errores de CSRF
      if (err?.response?.status === 419) {
        setError(
          "Error de token CSRF. Configura el servidor para excluir 'login' del middleware CSRF."
        );
      } else */
      if (err?.response?.status === 401) {
        // Manejar respuesta de credenciales incorrectas del servidor
        const errorMessage =
          err?.response?.data?.message || "Credenciales incorrectas";
        setError(errorMessage);
      } else if (err?.response?.status === 412) {
        setError(err?.response?.data?.errors || "Error de validación");
      } else {
        setError("Error de conexión");
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-black px-6 justify-center">
      <EnvironmentDebug 
        visible={isDebugVisible} 
        onClose={hideDebug} 
      />
      <View className="items-center mb-12">
        <TouchableOpacity onPress={handleTap} activeOpacity={0.8}>
          <Image
            source={require("@/assets/images/Escudo_Fuerza_Aerea_Ecuador.png")}
            className="w-[150px] h-[150px] mb-4"
            resizeMode="contain"
          />
          <TapIndicator tapCount={tapCount} maxTaps={3} />
        </TouchableOpacity>
        <Text className="text-3xl font-bold text-white text-center">
          Fuerzas Navales
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
          className={`p-4 rounded-md items-center mt-2 ${
            isLoading ? "bg-neutral-600" : "bg-neutral-700"
          }`}
          onPress={handleLogin}
          disabled={isLoading}
        >
          <View className="flex-row items-center">
            {isLoading && (
              <ActivityIndicator
                size="small"
                color="white"
                style={{ marginRight: 8 }}
              />
            )}
            <Text className="text-white font-bold">
              {isLoading ? "INICIANDO SESIÓN..." : "LOG IN"}
            </Text>
          </View>
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
