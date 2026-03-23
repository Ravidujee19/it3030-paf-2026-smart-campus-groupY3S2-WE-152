import { useAuth } from "../../context/AuthContext";

function LoginPage() {
  const { login } = useAuth();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Login</h1>
      <button onClick={login}>Login with Google</button>
    </div>
  );
}

export default LoginPage;