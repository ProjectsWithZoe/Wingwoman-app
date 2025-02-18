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

export function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const firebaseAuth = getAuth(); // Correctly initialize auth

  useEffect(() => {
    const unsubscribe = firebaseAuth.onAuthStateChanged((user) => {
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
        firebaseAuth,
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
        firebaseAuth,
        email,
        password
      );
      const user = userCredential.user;

      await sendEmailVerification(user);
      setSuccess(true);

      setIsLoading(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      setIsLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center p-4 "
      //style={{ fontFamily: '"Poppins", sans-serif', fontSize: "20px" }}
    >
      <div className="md:w-[80%] max-w-md space-y-8">
        <div className="text-center">
          <img
            src="logo3.png"
            className="mx-auto h-auto w-16 text-primary-500 text-center"
          ></img>
          <h2 className="mt-2 text-3xl font-bold">
            Welcome to{" "}
            <div
              className="text-primary-500 mt-2"
              /*style={{
                fontFamily: '"Lavishly Yours", sans-serif',
                fontSize: "52px",
              }}*/
            >
              WingWoman
            </div>
          </h2>
          <p className="mt-4 text-gray-400">
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
