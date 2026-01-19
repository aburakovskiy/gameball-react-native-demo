/**
 * GameballHello App
 * React Native App with Gameball SDK Integration
 *
 * @format
 */

import React, {useEffect, useState} from 'react';
import {
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useColorScheme,
} from 'react-native';
import gameballService from './src/services/gameball';

type InitStatus = 'idle' | 'initializing' | 'initialized' | 'error';

function App(): React.JSX.Element {
  const isDarkMode = useColorScheme() === 'dark';
  const [initStatus, setInitStatus] = useState<InitStatus>('idle');
  const [statusMessage, setStatusMessage] = useState<string>('Not initialized');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    initializeGameball();
  }, []);

  const initializeGameball = async () => {
    try {
      setInitStatus('initializing');
      setStatusMessage('Initializing Gameball SDK...');
      setErrorMessage(null);

      console.log('[App] Starting Gameball initialization...');
      await gameballService.initGameball();

      setStatusMessage('SDK initialized. Initializing customer...');
      await gameballService.initCustomer();

      setInitStatus('initialized');
      setStatusMessage('Gameball SDK and customer initialized successfully');
      console.log('[App] Gameball initialization completed');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setInitStatus('error');
      setStatusMessage('Initialization failed');
      setErrorMessage(errorMsg);
      console.error('[App] Gameball initialization error:', error);
    }
  };

  const handleOpenGuestProfile = async () => {
    try {
      setErrorMessage(null);
      console.log('[App] Opening guest profile...');
      await gameballService.openGuestProfile();
      setStatusMessage('Guest profile opened');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(`Failed to open guest profile: ${errorMsg}`);
      console.error('[App] Failed to open guest profile:', error);
    }
  };

  const handleOpenCustomerProfile = async () => {
    try {
      setErrorMessage(null);
      console.log('[App] Opening customer profile...');
      await gameballService.openCustomerProfile();
      setStatusMessage('Customer profile opened');
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : 'Unknown error';
      setErrorMessage(`Failed to open customer profile: ${errorMsg}`);
      console.error('[App] Failed to open customer profile:', error);
    }
  };

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000000' : '#FFFFFF',
  };

  const textColor = {
    color: isDarkMode ? '#FFFFFF' : '#000000',
  };

  const secondaryTextColor = {
    color: isDarkMode ? '#CCCCCC' : '#666666',
  };

  return (
    <SafeAreaView style={[styles.container, backgroundStyle]}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <View style={styles.content}>
        <Text style={[styles.title, textColor]}>GameballHello</Text>

        <View style={styles.statusContainer}>
          <Text style={[styles.statusLabel, secondaryTextColor]}>Status:</Text>
          <Text style={[styles.statusText, textColor]}>{statusMessage}</Text>
        </View>

        {errorMessage && (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>{errorMessage}</Text>
          </View>
        )}

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[
              styles.button,
              initStatus !== 'initialized' && styles.buttonDisabled,
            ]}
            onPress={handleOpenGuestProfile}
            disabled={initStatus !== 'initialized'}>
            <Text style={styles.buttonText}>Open Guest Profile</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.button,
              styles.buttonSecondary,
              initStatus !== 'initialized' && styles.buttonDisabled,
            ]}
            onPress={handleOpenCustomerProfile}
            disabled={initStatus !== 'initialized'}>
            <Text style={styles.buttonText}>Open Customer Profile</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 32,
  },
  statusContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.05)',
    borderRadius: 8,
  },
  statusLabel: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
  },
  statusText: {
    fontSize: 16,
  },
  errorContainer: {
    marginBottom: 24,
    padding: 16,
    backgroundColor: '#FFEBEE',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#EF5350',
  },
  errorText: {
    color: '#C62828',
    fontSize: 14,
  },
  buttonContainer: {
    gap: 16,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  buttonSecondary: {
    backgroundColor: '#34C759',
  },
  buttonDisabled: {
    backgroundColor: '#CCCCCC',
    opacity: 0.6,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default App;
