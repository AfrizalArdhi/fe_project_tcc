import axios from "axios";
import { jwtDecode } from "jwt-decode";
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../Utils";
import { checkLogin } from "../utils/auth";

function Tambahresto() {
  const navigate = useNavigate();
  const [token, setToken] = useState();
  const [restaurantName, setRestaurantName] = useState('');
  const [type, setType] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [adress, setAddress] = useState('');
  const [rating, setRating] = useState('');
  const [msg, setMsg] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(()=> {
    checkLogin(navigate, setIsLoggedIn);
  }, []);

  const handleInsert = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/restaurant`, {
        restaurant_name : restaurantName,
        type,
        description,
        rating,
        image_url : imageUrl,
        adadress : adress
      });
      console.log("Adding Restaurant Success");
      alert("Adding restauranat Successs!");  
      navigate("/Editresto");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
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

        <div style={{backgroundColor: "none", width: "100%", height: "100%", display:"flex", alignItems: "center", justifyContent: "center", marginTop: "40px"}}>
          <div style={{ backgroundColor: "none", width: "600px"}}>
          <form onSubmit={handleInsert}>

            <p style={{fontSize: "28px", marginTop: "11px", fontWeight: "bold"}}>Add Restaurant</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
              <label style={{ fontSize: "15px", color: "#555", fontWeight: "500" }}>Restaurant Name</label>
              <input style={{height: "50px", width: "100%", borderRadius: "15px", padding: "10px"}} value = {restaurantName} onChange={(e) => setRestaurantName(e.target.value)} required></input>            
            </div>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", marginTop: "20px"}}>
              <label style={{ fontSize: "15px", color: "#555", fontWeight: "500" }}>Type</label>
              <input style={{height: "50px", width: "100%", borderRadius: "15px", padding: "10px"}} value = {type} onChange={(e) => setType(e.target.value)} required></input>            
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", marginTop: "20px" }}>
              <label style={{ fontSize: "15px", color: "#555", fontWeight: "500" }}>Description</label>
              <input style={{height: "50px", width: "100%", borderRadius: "15px", padding: "10px"}} value = {description} onChange={(e) => setDescription(e.target.value)} required></input>            
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", marginTop: "20px" }}>
              <label style={{ fontSize: "15px", color: "#555", fontWeight: "500" }}>Rating</label>
              <input style={{height: "50px", width: "100%", borderRadius: "15px", padding: "10px"}} value = {rating} onChange={(e) => setRating(e.target.value)} required></input>            
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", marginTop: "20px" }}>
              <label style={{ fontSize: "15px", color: "#555", fontWeight: "500" }}>Image Url</label>
              <input style={{height: "50px", width: "100%", borderRadius: "15px", padding: "10px"}} value = {imageUrl} onChange={(e) => setImageUrl(e.target.value)} required></input>            
            </div>

            <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", marginTop: "20px" }}>
              <label style={{ fontSize: "15px", color: "#555", fontWeight: "500" }}>Address</label>
              <input style={{height: "50px", width: "100%", borderRadius: "15px", padding: "10px"}} value = {adress} onChange={(e) => setAddress(e.target.value)} required></input>            
            </div>

            <button style={{backgroundColor: "#8B0000", borderRadius: 7, padding: 5, height: "39px", color: "white", border: "2px solid #8B0000", marginTop: "20px"}}>
              <h1 style={{fontSize: 20}}>Submit</h1>
            </button>

          </form>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Tambahresto;
