import { FormEvent, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendEmailVerification,
} from "firebase/auth";

import { Button } from "../components/Button";
import { Input } from "../components/Input";
import { addDoc, collection } from "firebase/firestore";
import { db } from "../lib/firebase";

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const auth = getAuth(); // Correctly initialize auth

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      if (user && user.emailVerified) {
        navigate("/chat");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  async function handleSubmit(e) {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      if (!user.emailVerified) {
        setError("Please verify your email before logging in.");
        setIsLoading(false);
        return;
      }

      navigate("/chat");
    } catch (err) {
      setError(
        "Error: No account found with this email and password. Please sign up or click forgot password"
      );
      setIsLoading(false);
    }
  }

  const handleSignUp = async () => {
    setIsLoading(true);
    setError("");

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);
      setSuccess(true);
      setIsLoading(false);
      await addDoc(collection(db, "users"), {
        userId: auth.currentUser.uid,
        email: user.email,
        hasAccess: false,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="md:w-[80%] max-w-md space-y-8">
        <div className="text-center">
          <i className="fa-solid fa-robot fa-2x mx-auto h-12 w-12 text-primary-500"></i>
          <h2 className="mt-6 text-3xl font-bold">Welcome to WingWoman</h2>
          <p className="mt-2 text-gray-400">
            Sign up to get sassy dating advice!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && (
            <div className="p-4 bg-red-900/50 border border-red-800 rounded-lg text-sm">
              {error}
            </div>
          )}
          {!error && success && (
            <div className="p-4 bg-green-900/50 border border-green-800 rounded-lg text-sm">
              {"A verification email has been sent. Please check your inbox."}
            </div>
          )}

          <Input
            label="Email address"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <Input
            label="Password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <div className="flex gap-4">
            <Button type="submit" className="flex-1" disabled={isLoading}>
              Sign in
            </Button>
            <Button
              type="button"
              variant="secondary"
              className="flex-1"
              onClick={handleSignUp}
              disabled={isLoading}
            >
              Sign up
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
