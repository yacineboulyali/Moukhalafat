import React, { Component, ErrorInfo, ReactNode } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('Uncaught error:', error, errorInfo);
  }

  private handleRetry = () => {
    this.setState({ hasError: false, error: null });
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) return this.props.fallback;

      return (
        <View style={styles.container}>
          <MaterialIcons name="error-outline" size={64} color="#FF4B4B" />
          <Text style={styles.title}>Oups ! Quelque chose a mal tourné.</Text>
          <Text style={styles.message}>
            L'application a rencontré une erreur inattendue. Nos ingénieurs (et notre sentinelle) sont sur le coup.
          </Text>
          <TouchableOpacity style={styles.button} onPress={this.handleRetry}>
            <Text style={styles.buttonText}>RÉESSAYER</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return this.props.children;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
    backgroundColor: '#FFFFFF',
  },
  title: {
    fontSize: 22,
    fontWeight: '800',
    marginTop: 24,
    textAlign: 'center',
    color: '#1B2A32',
  },
  message: {
    fontSize: 16,
    color: '#777777',
    textAlign: 'center',
    marginTop: 12,
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#10B981',
    paddingHorizontal: 32,
    paddingVertical: 16,
    borderRadius: 16,
    shadowColor: '#059669',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 0,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: '800',
    fontSize: 16,
  },
});
