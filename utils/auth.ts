import * as AppleAuthentication from 'expo-apple-authentication';
import { supabase } from './supabase';

export async function signInWithApple() {
  try {
    const credential = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });

    // If user cancelled, credential will be null
    if (!credential) {
      return null;
    }

    // Sign in with Supabase using the Apple credential
    const { data, error } = await supabase.auth.signInWithIdToken({
      provider: 'apple',
      token: credential.identityToken,
    });

    if (error) throw error;
    return data;

  } catch (error) {
    // Handle various cancellation messages
    if (
      error.code === 'ERR_CANCELED' || 
      error.message === 'The user canceled the authorization attempt' ||
      error.message?.includes('canceled') ||
      error.message?.includes('cancelled')
    ) {
      return null;
    }
    console.error('Error signing in with Apple:', error);
    throw error;
  }
}

export async function signOut() {
  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  } catch (error) {
    console.error('Error signing out:', error);
    throw error;
  }
}

export async function getCurrentUser() {
  try {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) return null;
    
    const { data: { user }, error } = await supabase.auth.getUser();
    if (error) throw error;
    return user;
  } catch (error) {
    console.log('Error getting current user:', error);
    return null;
  }
} 