import { supabase } from "./supabaseClient";

export const handleLogin = async (email: string, password: string) => {
  const response = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (response.error) {
    console.error("Login error:", response.error.message);
  } else {
    console.log("Logged in:", response.data.user);
  }

  return response
};

export const handleSignUp = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) {
    console.error("Sign-up error:", error.message);
  } else {
    console.log("Check your email for a confirmation link:", data);
  }
};

export const handleLogout = async () => {
  await supabase.auth.signOut();
  // supabase clears persistence; your app state listener will update user -> null
};