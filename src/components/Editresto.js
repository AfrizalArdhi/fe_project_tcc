import { Link, useNavigate } from "react-router-dom";
import { BASE_URL } from "../Utils";
import axios from "axios";
import React, { useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import { checkLogin } from "../utils/auth";


function Editresto() {
  const [msg, setMsg] = useState('');
  const navigate = useNavigate();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(()=>{
    getRestaurant();
    checkLogin(navigate, setIsLoggedIn);
  }, []);

  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`${BASE_URL}/auth/logout`, {
        withCredentials: true
      });
      localStorage.removeItem("accessToken");
      console.log("Logout Success");
      alert("Logout Success!");
      navigate("/"); 
      window.location.reload();
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  const handleTambah = async() => {
    try {
    navigate("/Tambahresto"); // Pastikan rute ini tersedia
    } catch (error) {
      console.log(error);
    }
  }

  const handleEdit = async (id) => {
    try {
      navigate(`/Editrestoinput/${id}`);
    } catch (error) {
      console.error("Edit failed:", error);
    }
  };


  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this restaurant?")) {
      try {
        await axios.delete(`${BASE_URL}/restaurant/${id}`);
        setRestaurants(restaurants.filter(r => r.id !== id));
        alert("Restaurant deleted successfully");
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete restaurant");
      }
    }
  };


  const getRestaurant = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/restaurant`);
      setRestaurants(response.data);
      console.log(response);
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
      setError('Failed to load restaurants. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

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
          <div style={{backgroundColor:"none", height: 50, display: "flex", justifyContent: "space-between", alignItems: "center", gap: "20px"}}>
          <button style={{backgroundColor: "#8B0000", borderRadius: 7, padding: 5, height: "39px", color: "white", border: "2px solid #8B0000"}} onClick={handleTambah}>
            <h1 style={{fontSize: 20}}>Tambah Restoran</h1>
          </button>
          <button style={{backgroundColor: "#8B0000", borderRadius: 7, padding: 5, height: "39px", color: "white", border: "2px solid #8B0000"}} onClick={handleLogout}>
            <h1 style={{fontSize: 20}}>Logout</h1>
          </button>
          <div style={{display: "flex", gap: 30}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#8B0000" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg>
          </div>
          </div>
        </div>
      </div>
      {/* navbar abis */}


      {/* wadah */}

      <div style={{ marginTop: 50, backgroundColor: "none", height: "auto", display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem", width: "83%", margin: "auto" }}>
        <div style={{height: "90%", width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "flex-start", alignItems: "flex-start", gap: 70}}>

          {/* Cardboard */}
          { restaurants.map(post => (
            <div key={post.id} style={{display: "flex"}}>
              <Link to={`/Editmenu/${post.id}`} state={{restaurants: post}} style={{ display: "inline-block", textDecoration: "none", color: "inherit" }}>
              
              <div style={{backgroundColor: "white", width: "280px", height: "220px", borderRadius: 15, border: "1px solid grey", flexShrink: 0, marginRight: "10px"}}>
                <img src={post.image_url} alt="Restaurant" style={{ width: "100%", height: "60%", objectFit: "cover", borderTopLeftRadius: 15, borderTopRightRadius: 15}}/>
                <div style={{padding: "3%", height: "40%", backgroundColor: "white", borderBottomLeftRadius: 15, borderBottomRightRadius: 15}}>

                  <div style={{display: "flex", justifyContent: "space-between", alignItems: "center"}}>
                    <p style={{fontSize: 20, marginTop: -5}}>{post.restaurant_name}</p> 
                    <div style={{display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: -5}}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16" style={{marginTop: -15}}>
                        <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                      </svg>
                      <p style={{fontSize: 20}}>{post.rating}</p>
                    </div>
                  </div>

                  <div style={{marginTop: "2%"}}>
                    <p style={{fontSize: 14, marginTop: -20}}>{post.type}</p>
                  </div>

                  <div style={{marginTop: -10, display: "flex", alignItems: "center", gap: "1%"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16" style={{marginTop: -15}}>
                      <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                      <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                    </svg>

                    <p style={{fontSize: 14, marginRight: 10}}>10-15 min</p>

                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-currency-dollar" viewBox="0 0 16 16" style={{marginTop: -15}}>
                      <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z"/>
                    </svg>
                  
                    <p style={{fontSize: 14}}>Rp10,000.00</p>
                  </div>
                </div>
              </div>
            </Link>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button style={{ backgroundColor: "#8B0000", color: "white", border: "none", borderRadius: 8, padding: "10px" }} onClick={() => handleEdit(post.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                  <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                </svg>
              </button>

              <button style={{ backgroundColor: "#8B0000", color: "white", border: "none", borderRadius: 8, padding: "10px" }} onClick={() => handleDelete(post.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="currentColor" className="bi bi-trash-fill" viewBox="0 0 16 16">
                  <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                </svg>
              </button>
            </div>
          </div>
          ))}
    {/* akhir cardbox */}
        </div>
      </div>
      {/* wadah abis */}
    </div>
  );
}

export default Editresto;
