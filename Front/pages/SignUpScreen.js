import React from 'react';
import { View, Text, TextInput, StyleSheet, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { REACT_APP_PORT } from '../constant/cst';

const signUpValidationSchema = Yup.object().shape({
  username: Yup.string()
    .min(3, 'Username must be at least 3 characters long')
    .required('Username is required'),
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required'),
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters long')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm Password is required')
});

const SignUpScreen = ({ navigation }) => {
  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    resolver: yupResolver(signUpValidationSchema),
    mode: 'onChange'
  });

  const onSubmit = async (data) => {
    try {
      const response = await fetch(`${REACT_APP_PORT}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullname: data["username"],
          email: data["email"],
          password: data["password"]
        })
      });
      if (!response.ok) { throw new Error("error"); }
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.gradient}>
        <View style={styles.content}>
          <Text style={styles.title}>Sign Up</Text>

          <Text style={styles.label}>Username</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
              />
            )}
            name="username"
            defaultValue=""
          />
          {errors.username && <Text style={styles.error}>{errors.username.message}</Text>}

          <Text style={styles.label}>Email</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                keyboardType="email-address"
              />
            )}
            name="email"
            defaultValue=""
          />
          {errors.email && <Text style={styles.error}>{errors.email.message}</Text>}

          <Text style={styles.label}>Password</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
            name="password"
            defaultValue=""
          />
          {errors.password && <Text style={styles.error}>{errors.password.message}</Text>}

          <Text style={styles.label}>Confirm Password</Text>
          <Controller
            control={control}
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                style={styles.input}
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                secureTextEntry
              />
            )}
            name="confirmPassword"
            defaultValue=""
          />
          {errors.confirmPassword && <Text style={styles.error}>{errors.confirmPassword.message}</Text>}

          <TouchableOpacity
            style={[styles.button, { backgroundColor: isValid ? '#7E57C2' : '#ccc' }]} // Light purple button
            onPress={handleSubmit(onSubmit)}
            disabled={!isValid}
          >
            <Text style={styles.buttonText}>Sign Up</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
            <Text style={styles.loginLink}>Already have an account? Log in</Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#C5CAE9', // Light purple background
    backgroundImage: 'linear-gradient(0deg, #E8EAF6 0%, #C5CAE9 100%)', // Gradient from light to darker purple
    width: '100%',
    height: '100%',
  },
  content: {
    width: '90%',
    padding: 20,
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // Slightly lighter overlay
    borderRadius: 10,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#4A148C', // Darker purple for the title
  },
  label: {
    fontSize: 18,
    marginBottom: 5,
    color: '#4A148C', // Darker purple for labels
  },
  input: {
    height: 40,
    borderColor: '#D1C4E9', // Light purple border
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 8,
    borderRadius: 8,
    backgroundColor: '#FFFFFF',
  },
  error: {
    fontSize: 14,
    color: '#E91E63', // Light red for errors
    marginBottom: 10,
  },
  button: {
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  buttonText: {
    fontSize: 18,
    color: '#FFFFFF',
  },
  loginLink: {
    fontSize: 16,
    color: '#7E57C2', // Light purple for links
    textAlign: 'center',
    marginTop: 20,
  },
});

export default SignUpScreen;
