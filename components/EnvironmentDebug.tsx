import { getCurrentEnvironment } from "@/services/config";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

interface EnvironmentDebugProps {
  visible: boolean;
  onClose: () => void;
}

export const EnvironmentDebug: React.FC<EnvironmentDebugProps> = ({
  visible,
  onClose,
}) => {
  const envInfo = getCurrentEnvironment();

  if (!visible) {
    return null;
  }

  return (
    <View
      style={{
        position: "absolute",
        top: 60,
        left: 10,
        right: 10,
        backgroundColor: "rgba(0,0,0,0.95)",
        padding: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: envInfo.isProduction ? "#ef4444" : "#22c55e",
        zIndex: 1000,
      }}
    >
      <TouchableOpacity
        onPress={onClose}
        style={{ alignSelf: "flex-end", marginBottom: 8 }}
      >
        <Text style={{ color: "white", fontSize: 16 }}>✕</Text>
      </TouchableOpacity>

      <Text style={{ color: "white", fontWeight: "bold", marginBottom: 12, fontSize: 16 }}>
        🌍 DEBUG - ENTORNO ACTUAL
      </Text>

      <View style={{ marginBottom: 8 }}>
        <Text style={{ color: "white", fontSize: 14, fontWeight: "bold" }}>
          Entorno:{" "}
          <Text style={{ color: envInfo.isProduction ? "#ef4444" : "#22c55e" }}>
            {envInfo.environment.toUpperCase()}
          </Text>
        </Text>
      </View>

      <View style={{ marginBottom: 8 }}>
        <Text style={{ color: "white", fontSize: 12 }}>
          🌐 URL: {envInfo.baseURL}
        </Text>
      </View>

      <View style={{ marginBottom: 8 }}>
        <Text style={{ color: "white", fontSize: 12 }}>
          🔧 __DEV__: {envInfo.debug.__DEV__ ? "true" : "false"}
        </Text>
      </View>

      <View style={{ marginBottom: 8 }}>
        <Text style={{ color: "white", fontSize: 12 }}>
          📱 App: {envInfo.debug.appOwnership || "standalone"}
        </Text>
      </View>

      <View style={{ marginBottom: 12 }}>
        <Text style={{ color: "white", fontSize: 12 }}>
          ⚙️ ENV: {envInfo.debug.processEnv || "default"}
        </Text>
      </View>

      <Text style={{ color: "#888", fontSize: 10, textAlign: "center" }}>
        💡 Tip: Toca 3 veces el escudo para abrir este debug
      </Text>
    </View>
  );
};
