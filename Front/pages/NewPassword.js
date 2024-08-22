import { Formik } from 'formik';
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import axios from 'axios';
import * as Yup from 'yup';
import { REACT_APP_PORT } from '../constant/cst';

const newPasswordValidationSchema = Yup.object().shape({
  password: Yup.string()
    .min(8, 'Password must be at least 8 characters')
    .required('Password is required'),
  confirmPassword: Yup.string()
    .oneOf([Yup.ref('password'), null], 'Passwords must match')
    .required('Confirm password is required')
});

const NewPassword = ({ navigation, route }) => {
  const { email } = route.params;

  const resetPassword = async (values, setSubmitting) => {
    try {
      const response = await axios.post(`${REACT_APP_PORT}/password/resetPassword/${email}`, {
        password: values.password,
      });

      if (response.status === 200) {
        Alert.alert('Success', 'Your password has been reset successfully');
        navigation.navigate('LoginScreen');
      } else {
        Alert.alert('Error', 'Failed to reset password');
      }
    } catch (error) {
      Alert.alert('Error', 'An error occurred while resetting the password');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.gradient}>
        <Formik
          initialValues={{ password: '', confirmPassword: '' }}
          validationSchema={newPasswordValidationSchema}
          onSubmit={(values, { setSubmitting }) => {
            resetPassword(values, setSubmitting);
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, isSubmitting }) => (
            <View style={styles.content}>
              <Text style={styles.title}>Set New Password</Text>

              <Text style={styles.label}>New Password</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('password')}
                onBlur={handleBlur('password')}
                value={values.password}
                secureTextEntry
              />
              {touched.password && errors.password && <Text style={styles.error}>{errors.password}</Text>}

              <Text style={styles.label}>Confirm New Password</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('confirmPassword')}
                onBlur={handleBlur('confirmPassword')}
                value={values.confirmPassword}
                secureTextEntry
              />
              {touched.confirmPassword && errors.confirmPassword && (
                <Text style={styles.error}>{errors.confirmPassword}</Text>
              )}

              <TouchableOpacity
                style={[styles.button, { backgroundColor: isValid ? '#7E57C2' : '#ccc' }]} // Light purple button
                onPress={handleSubmit}
                disabled={!isValid || isSubmitting}
              >
                <Text style={styles.buttonText}>Reset password</Text>
              </TouchableOpacity>
            </View>
          )}
        </Formik>
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
});

export default NewPassword;
