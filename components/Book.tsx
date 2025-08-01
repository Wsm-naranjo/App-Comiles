import React from 'react';
import { StyleSheet, useColorScheme, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';

interface Params {
  init: string | string[];
  final: string | string[];
  idasignatura: string | string[];
  nombreLibro: string | string[];
}

export default function Book({
  init,
  final,
  idasignatura,
  nombreLibro,
}: Params) {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === 'dark';

  return (
    <>
      <SafeAreaView
        style={[
          styles.container,
          { backgroundColor: isDark ? 'black' : 'white' },
        ]}>
        <View
          style={[
            styles.container,
            { backgroundColor: isDark ? 'black' : 'white' },
          ]}>
          <WebView
            source={{
              uri: `https://data.prolipadigital.com.ec/archivos/upload/libro/${nombreLibro}/?init=${init}&final=${final}&idasignatura=${idasignatura}`,
            }}
            style={styles.webview}
            originWhitelist={['*']}
            javaScriptEnabled
            domStorageEnabled
            startInLoadingState
          />
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
  },
  webview: {
    flex: 1,
  },
});
