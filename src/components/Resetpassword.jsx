import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { confirmPasswordReset, getAuth } from "firebase/auth";
//import { Button } from "./Button";

export function ResetPassword() {
  const [searchParams] = useSearchParams();
  const actionCode = searchParams.get("oobCode"); // Get the reset code from the URL
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const auth = getAuth();

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");
    setIsLoading(true);

    try {
      await confirmPasswordReset(auth, actionCode, password);
      setMessage("Password has been reset successfully. You can now log in.");
      setTimeout(() => navigate("/login"));
    } catch (err) {
      setError("Error: Unable to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="md:w-[80%] max-w-md space-y-8">
        <h2 className="text-3xl font-bold text-center">Set New Password</h2>
        {message && (
          <div className="p-4 bg-green-500 text-white">{message}</div>
        )}
        {error && <div className="p-4 bg-red-500 text-white">{error}</div>}
        <form onSubmit={handleResetPassword} className="space-y-6">
          <input
            className="w-full px-4 py-2 rounded-lg bg-gray-800 border border-gray-700',
          'focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent',
          'placeholder-gray-500"
            label="Enter new password"
            type="password"
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit" disabled={isLoading}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
