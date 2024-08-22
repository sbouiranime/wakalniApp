import { Formik } from 'formik';
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, KeyboardAvoidingView, Platform } from 'react-native';
import * as Yup from 'yup';
import { REACT_APP_PORT } from '../constant/cst';

const resetPasswordValidationSchema = Yup.object().shape({
  email: Yup.string()
    .email('Please enter a valid email')
    .required('Email is required')
});

const ResetPassword = ({ navigation }) => {
  const [linkText, setLinkText] = useState('');

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.gradient}>
        <Formik
          initialValues={{ email: '' }}
          validationSchema={resetPasswordValidationSchema}
          onSubmit={async (values, { setSubmitting }) => {
            try {
              const response = await fetch(`${REACT_APP_PORT}/password/forgotPassword`, {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: values.email }),
              });

              if (response.ok) {
                Alert.alert('Success', `Password reset link has been sent to ${values.email}`);
                setLinkText('An email has been sent to your mail');
              } else {
                Alert.alert('Error', 'Failed to send password reset link');
                setLinkText('Failed to send the email');
              }
            } catch (error) {
              Alert.alert('Error', 'An error occurred while sending the password reset link');
              setLinkText('An error occurred while sending the email');
            } finally {
              setSubmitting(false);
            }
          }}
        >
          {({ handleChange, handleBlur, handleSubmit, values, errors, touched, isValid, isSubmitting }) => (
            <View style={styles.content}>
              <Text style={styles.title}>Reset Password</Text>

              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                onChangeText={handleChange('email')}
                onBlur={handleBlur('email')}
                value={values.email}
                keyboardType="email-address"
              />
              {touched.email && errors.email && <Text style={styles.error}>{errors.email}</Text>}

              <TouchableOpacity
                style={[styles.button, { backgroundColor: isValid ? '#7E57C2' : '#ccc' }]} // Light purple button
                onPress={handleSubmit}
                disabled={!isValid || isSubmitting}
              >
                <Text style={styles.buttonText}>Submit</Text>
              </TouchableOpacity>
              <Text style={styles.infoText}>{linkText}</Text>
              <TouchableOpacity onPress={() => navigation.navigate('LoginScreen')}>
                <Text style={styles.loginLink}>Log in Here</Text>
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
  infoText: {
    fontSize: 16,
    color: '#7E57C2', // Light purple for info text
    textAlign: 'center',
    marginTop: 20,
  },
  loginLink: {
    fontSize: 16,
    color: '#7E57C2', // Light purple for links
    textAlign: 'center',
    marginTop: 20,
  },
});

export default ResetPassword;
