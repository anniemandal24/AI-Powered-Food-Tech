import { useNavigate } from "react-router-dom";

export default function ScanSection() {
  const navigate = useNavigate();

  const handleClick = () => {
    const user = localStorage.getItem("user");

    if (user) {
      navigate("/scan-fridge");
    } else {
      navigate("/login-signup", { state: { from: "/scan-fridge" } });
    }
  };

  return (
    <button onClick={handleClick}>
      📷 Scan Your Fridge
    </button>
  );
}