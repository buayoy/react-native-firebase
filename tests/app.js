/* eslint-disable import/extensions,import/no-unresolved,import/first,import/no-extraneous-dependencies */
import React, { Component } from 'react';
import {
  AppRegistry,
  NativeModules,
  Text,
  View,
  Image,
  StyleSheet,
  NativeEventEmitter,
} from 'react-native';

import firebase from 'react-native-firebase';

import jet from 'jet/platform/react-native';

class Root extends Component {
  constructor(props) {
    super(props);
    this.state = {
      currentTest: null,
    };

    console.warn(JSON.stringify(Object.keys(NativeModules.RNFBAnalytics)));
    console.warn(JSON.stringify(Object.keys(NativeModules.RNFBApp)));
    console.warn(JSON.stringify(Object.keys(NativeModules.RNFBUtils)));
    jet.exposeContextProperty('root', this);
    jet.exposeContextProperty('module', firebase);
    jet.exposeContextProperty('NativeModules', NativeModules);
    jet.exposeContextProperty('NativeEventEmitter', NativeEventEmitter);
  }

  render() {
    const { currentTest } = this.state;
    if (!currentTest) {
      return (
        <View style={[styles.container, styles.horizontal]}>
          <Image
            source={{
              uri:
                'https://github.com/invertase/react-native-firebase-starter/raw/master/assets/ReactNativeFirebase.png',
            }}
            style={[styles.logo]}
          />
          <Text style={[styles.item, styles.module]} testID="module">
            {'No Tests Started'}
          </Text>
          <Text style={styles.item} testID="group">
            {'N/A'}
          </Text>
          <Text style={styles.item} testID="title">
            {"Ensure you're running the Jet Packager together with the Detox test command."}
          </Text>
        </View>
      );
    }

    const module = (() => {
      if (currentTest.parent && currentTest.parent.parent) {
        return currentTest.parent.parent.title;
      }
      return currentTest.parent.title;
    })();

    const group = (() => {
      if (currentTest.parent && currentTest.parent.parent) {
        return currentTest.parent.title;
      }
      return '';
    })();

    const retrying = (() => {
      const retry = currentTest.currentRetry();
      if (retry > 0) {
        return `⚠️ Test failed, retrying... (${retry})`;
      }
      return null;
    })();

    return (
      <View style={[styles.container, styles.horizontal]}>
        <Image
          source={{
            uri:
              'https://github.com/invertase/react-native-firebase-starter/raw/master/assets/RNFirebase.png',
          }}
          style={[styles.logo]}
        />
        <Text style={[styles.item, styles.module]} testID="module">
          {module}
        </Text>
        <Text style={styles.item} testID="group">
          {group}
        </Text>
        <Text style={styles.item} testID="title">
          {currentTest.title}
        </Text>
        {retrying && (
          <Text style={[styles.retry, styles.item]} testID="title">
            {retrying}
          </Text>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  horizontal: {
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
  },
  item: {
    marginBottom: 10,
    textAlign: 'center',
  },
  retry: {
    marginTop: 10,
    fontSize: 20,
    color: '#cccc33',
  },
  module: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  group: {
    fontSize: 16,
    color: 'grey',
  },
  logo: {
    height: 120,
    marginBottom: 16,
    width: 135,
  },
});

AppRegistry.registerComponent('testing', () => Root);
