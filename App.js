import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ScrollView } from 'react-native';
import { initializeApp } from '@firebase/app';
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged, signOut, sendPasswordResetEmail } from '@firebase/auth';

const firebaseConfig = {
  apiKey: "AIzaSyBXO_AL2OCV3Ts_AosmfrHfBLOg9nZgaLQ",
  authDomain: "fir-auth-tutorial-79b1b.firebaseapp.com",
  projectId: "fir-auth-tutorial-79b1b",
  storageBucket: "fir-auth-tutorial-79b1b.appspot.com",
  messagingSenderId: "885481274711",
  appId: "1:885481274711:web:a40eba6aa1754d932ed212",
  measurementId: "G-7J7BP3HWP3"
};

const app = initializeApp(firebaseConfig);

const AuthScreen = ({ email, setEmail, password, setPassword, isLogin, setIsLogin, handleAuthentication, handlePasswordReset, errorMessage }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>{isLogin ? 'Đăng Nhập' : 'Đăng Ký'}</Text>
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Mật khẩu"
        secureTextEntry
      />
      <View style={styles.buttonContainer}>
        <Button title={isLogin ? 'Đăng Nhập' : 'Đăng Ký'} onPress={handleAuthentication} color="#3498db" />
      </View>
      {isLogin && (
        <Text style={styles.resetText} onPress={handlePasswordReset}>
          Quên mật khẩu?
        </Text>
      )}
      <View style={styles.bottomContainer}>
        <Text style={styles.toggleText} onPress={() => setIsLogin(!isLogin)}>
          {isLogin ? 'Chưa có tài khoản? Đăng Ký' : 'Đã có tài khoản? Đăng Nhập'}
        </Text>
      </View>
    </View>
  );
}

const AuthenticatedScreen = ({ user, handleAuthentication }) => {
  return (
    <View style={styles.authContainer}>
      <Text style={styles.title}>Xin Chào</Text>
      <Text style={styles.emailText}>{user.email}</Text>
      <Button title="Đăng Xuất" onPress={handleAuthentication} color="#e74c3c" />
    </View>
  );
};

export default App = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [user, setUser] = useState(null); 
  const [isLogin, setIsLogin] = useState(true);
  const [errorMessage, setErrorMessage] = useState('');

  const auth = getAuth(app);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, [auth]);

  const handleAuthentication = async () => {
    setErrorMessage('');
    try {
      if (user) {
        await signOut(auth);
      } else {
        if (isLogin) {
          await signInWithEmailAndPassword(auth, email, password);
        } else {
          await createUserWithEmailAndPassword(auth, email, password);
        }
      }
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  const handlePasswordReset = async () => {
    setErrorMessage('');
    try {
      await sendPasswordResetEmail(auth, email);
      setErrorMessage('Kiểm tra email của bạn để đặt lại mật khẩu.');
    } catch (error) {
      setErrorMessage(error.message);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {user ? (
        <AuthenticatedScreen user={user} handleAuthentication={handleAuthentication} />
      ) : (
        <AuthScreen
          email={email}
          setEmail={setEmail}
          password={password}
          setPassword={setPassword}
          isLogin={isLogin}
          setIsLogin={setIsLogin}
          handleAuthentication={handleAuthentication}
          handlePasswordReset={handlePasswordReset}
          errorMessage={errorMessage}
        />
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
  },
  authContainer: {
    width: '80%',
    maxWidth: 400,
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 5,
  },
  title: {
    fontSize: 26,
    marginBottom: 20,
    textAlign: 'center',
    color: '#2c3e50',
  },
  input: {
    height: 45,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 20,
    padding: 10,
    borderRadius: 5,
  },
  buttonContainer: {
    marginBottom: 20,
  },
  toggleText: {
    color: '#2980b9',
    textAlign: 'center',
    fontSize: 16,
  },
  bottomContainer: {
    marginTop: 20,
  },
  emailText: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 20,
  },
  resetText: {
    color: '#2980b9',
    textAlign: 'center',
    marginBottom: 20,
    fontSize: 16,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 16,
    fontSize: 14,
  },
});