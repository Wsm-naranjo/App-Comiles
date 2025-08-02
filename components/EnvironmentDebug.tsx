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

      <View style={{ borderTopWidth: 1, borderTopColor: "#333", paddingTop: 12, marginTop: 8 }}>
        <Text style={{ color: "white", fontSize: 12, fontWeight: "bold", marginBottom: 8 }}>
          🧪 DEBUGGING TOOLS
        </Text>
        
        <TouchableOpacity
          onPress={async () => {
            const { debugInstitutionValidation } = await import("@/utils/institutionDebug");
            debugInstitutionValidation();
          }}
          style={{
            backgroundColor: "#1f2937",
            padding: 8,
            borderRadius: 6,
            marginBottom: 6,
          }}
        >
          <Text style={{ color: "#60a5fa", fontSize: 11, textAlign: "center" }}>
            🏛️ Debug Validación Institución
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={async () => {
            const { testInstitutionEndpoint } = await import("@/utils/institutionDebug");
            testInstitutionEndpoint();
          }}
          style={{
            backgroundColor: "#1f2937",
            padding: 8,
            borderRadius: 6,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: "#10b981", fontSize: 11, textAlign: "center" }}>
            🌐 Test Conectividad API
          </Text>
        </TouchableOpacity>
      </View>

      <Text style={{ color: "#888", fontSize: 10, textAlign: "center" }}>
        💡 Tip: Toca 3 veces el escudo para abrir este debug
      </Text>
    </View>
  );
};
