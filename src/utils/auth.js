import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../Utils";

export async function checkLogin(navigate, setIsLoggedIn) {
  let accessToken = localStorage.getItem("accessToken");

  if (accessToken) {
    try {
      let decoded = jwtDecode(accessToken);
      const currentTime = Date.now() / 1000;

      // Cek jika token expired
      if (decoded.exp < currentTime) {
        const newAccessToken = await refreshAccessToken();

        if (newAccessToken) {
          localStorage.setItem("accessToken", newAccessToken);
          decoded = jwtDecode(newAccessToken);
        } else {
          await logoutExpiredSession(navigate);
          setIsLoggedIn(false);
          return;
        }
      }

      // Cek role
      if (decoded.role !== 1) {
        alert("Anda tidak memiliki akses ke halaman ini.");
        navigate("/");
      } else {
        setIsLoggedIn(true);
      }

    } catch (error) {
      console.error("Token error:", error);
      await logoutExpiredSession(navigate);
      setIsLoggedIn(false);
    }
  } else {
    setIsLoggedIn(false);
    navigate("/");
  }
}

async function refreshAccessToken() {
  try {
    const response = await axios.get(`${BASE_URL}/auth/token`, {
      withCredentials: true, // jika refresh token disimpan sebagai cookie
    });

    return response.data.accessToken;
  } catch (error) {
    console.error("Gagal refresh token:", error);
    return null;
  }
}

async function logoutExpiredSession(navigate) {
  try {
    await axios.delete(`${BASE_URL}/auth/logout`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error("Logout error:", error);
  } finally {
    localStorage.removeItem("accessToken");
    alert("Sesi anda telah habis!");
    navigate("/");
    window.location.reload();
  }
}
