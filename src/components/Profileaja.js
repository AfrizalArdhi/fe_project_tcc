import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../Utils";

function Profileaja() {
  const navigate = useNavigate();
    const [token, setToken] = useState();
    const [usernameFromJwt, setUsernameFromJwt] = useState(''); 
    const [emailFromJwt, setEmailFromJwt] = useState(''); 
    const [idFromJwt, setidFromJwt] = useState(''); 
  
  useEffect(()=> {
    getData();
    checkLogin(setIsLoggedIn);
  }, []);

  const getData = async() => {
      const response = localStorage.getItem("accessToken"); 
      if (response) {
        try {
          const decoded = jwtDecode(response);
          console.log("Decoded JWT:", decoded);
          setUsernameFromJwt(decoded.name);
          setEmailFromJwt(decoded.mail);
          setidFromJwt(decoded.userId);
          setToken(response);
        } catch (error) {
          console.error("Invalid token", error);
        }
      }
    }
  const [isLoggedIn, setIsLoggedIn] = React.useState(false);

  function checkLogin(setIsLoggedIn) {
    const accessToken = localStorage.getItem("accessToken");

    if (accessToken) {
      try {
        const decoded = jwtDecode(accessToken);
        const currentTime = Date.now() / 1000;
        console.log(decoded.exp);

        if (decoded.exp < currentTime) {
          // Token kadaluarsa, lakukan logout
          logoutExpiredSession();
          setIsLoggedIn(false);
        } else {
          setIsLoggedIn(true);
        }
      } catch (error) {
        console.error("Token error:", error);
        logoutExpiredSession();
        setIsLoggedIn(false);
      }
    } else {
      setIsLoggedIn(false);
    }

    // Fungsi logout ketika token expired
    async function logoutExpiredSession() {
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
  }
  return (

    <div style={{ backgroundColor: "none", height: 1000, margin: 0, padding: 0}}>
      
      {/* Navbar ya */}
      <div style={{backgroundColor: "none", height: 75, display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid rgb(155, 155, 155)", boxShadow: "0px 6px 10px rgb(211, 211, 211)"}}>
        <div style={{backgroundColor:"none", height: 50, width: "86%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          <div style={{display: "flex", gap: 10}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#8B0000" className="bi bi-egg-fried" viewBox="0 0 16 16">
              <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
              <path d="M13.997 5.17a5 5 0 0 0-8.101-4.09A5 5 0 0 0 1.28 9.342a5 5 0 0 0 8.336 5.109 3.5 3.5 0 0 0 5.201-4.065 3.001 3.001 0 0 0-.822-5.216zm-1-.034a1 1 0 0 0 .668.977 2.001 2.001 0 0 1 .547 3.478 1 1 0 0 0-.341 1.113 2.5 2.5 0 0 1-3.715 2.905 1 1 0 0 0-1.262.152 4 4 0 0 1-6.67-4.087 1 1 0 0 0-.2-1 4 4 0 0 1 3.693-6.61 1 1 0 0 0 .8-.2 4 4 0 0 1 6.48 3.273z"/>
            </svg>
            <Link to="/" style={{textDecoration: "none"}}>
              <h1 style={{fontSize: 20, color: "#8B0000"}}>MyouiFood</h1>
            </Link>
          </div>
          <div style={{display: "flex", gap: 30}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#8B0000" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg>
          </div>
        </div>
      </div>
      {/* navbar abis */}

      <div style={{display: "flex"}}>
        <div style={{backgroundColor: "none", width: "18%", height: "100%"}}>
          <div style={{backgroundColor: "rgba(139, 0, 0, 0.2)", width: "100%", height: "50px", marginTop: "60px", display:"flex", alignItems: "center", gap: "15px", paddingLeft: "25px", borderTopRightRadius: "35px", borderBottomRightRadius: "35px"}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="black" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg>
            <p style={{fontSize: "22px", marginTop: "13px"}}>Profile</p>            
          </div>
          <Link to="/Profilereview" style={{textDecoration: "none"}}>
            <div style={{backgroundColor: "none", width: "100%", height: "50px", marginTop: "5px", display:"flex", alignItems: "center", gap: "15px", paddingLeft: "25px", borderTopRightRadius: "35px", borderBottomRightRadius: "35px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="black" className="bi bi-star-fill" viewBox="0 0 16 16">
                <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
              </svg>
              <p style={{fontSize: "22px", marginTop: "13px", color: "black"}}>Review</p>            
            </div>
          </Link>
        </div>

        <div style={{backgroundColor: "none", width: "75%", height: "100%", display:"flex", alignItems: "center", justifyContent: "center", marginTop: "40px"}}>
          <div style={{ backgroundColor: "none", width: "600px"}}>
            <p style={{fontSize: "28px", marginTop: "11px", fontWeight: "bold"}}>My Profile</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
              <label style={{ fontSize: "15px", color: "#555", fontWeight: "500" }}>Username</label>
              <input style={{height: "50px", width: "100%", borderRadius: "15px", padding: "10px"}} readOnly placeholder="Anugraha" value={usernameFromJwt}></input>            
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", marginTop: "10px"}}>
              <label style={{ fontSize: "15px", color: "#555", fontWeight: "500" }}>Email</label>
              <input style={{height: "50px", width: "100%", borderRadius: "15px", padding: "10px"}} readOnly placeholder="anugraha@gmail.com" value={emailFromJwt}></input>            
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", marginTop: "10px"}}>
              <label style={{ fontSize: "15px", color: "#555", fontWeight: "500" }}>Password</label>
              <input style={{height: "50px", width: "100%", borderRadius: "15px", padding: "10px"}} readOnly placeholder="*******"></input>            
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Profileaja;
