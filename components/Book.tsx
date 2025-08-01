import React from 'react';
import { StyleSheet, View } from 'react-native';
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
  return (
    <View style={styles.container}>
      <WebView
        source={{
          uri: `https://data.prolipadigital.com.ec/archivos/upload/libro/${nombreLibro}/?init=${init}&final=${final}&idasignatura=${idasignatura}`,
        }}
        style={styles.webview}
        originWhitelist={['*']}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        startInLoadingState={true}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    width: '100%',
    height: 500,
  },
  webview: {
    flex: 1,
  },
});
