import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import { BASE_URL } from "../Utils";

function Profilereview() {
  const navigate = useNavigate();
  const [token, setToken] = useState();
  const [usernameFromJwt, setUsernameFromJwt] = useState(''); 
  const [idFromJwt, setidFromJwt] = useState(''); 
  const [reviewResto, setReviewResto] = useState([]);
  const [reviewId, setReviewId] = useState(null);
  const [foodReview, setFoodReview] = useState("");
  const [rating, setRating] = useState("");
  const [restoId, setRestoId] = useState("");
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [animateReviewModal, setAnimateReviewModal] = useState(false);


  // ini coba anu
  useEffect(()=>{
      getData();
      getReview();
      checkLogin(setIsLoggedIn);
  }, []);

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


  function openReviewModal(post) {
    setReviewId(post.id);                // Simpan ID review untuk update
    setFoodReview(post.foodReview);      // Isi teks review
    setRating(post.rating);          
    setRestoId(post.restaurant_id);          
    setShowReviewModal(true);
    setTimeout(() => setAnimateReviewModal(true), 10);
  }

  function closeReviewModal() {
    setAnimateReviewModal(false);
    setTimeout(() => setShowReviewModal(false), 300);
  }

  // ini

  

  const getData = async() => {
    const response = localStorage.getItem("accessToken"); 
    if (response) {
      try {
        const decoded = jwtDecode(response);
        console.log("Decoded JWT:", decoded);
        setUsernameFromJwt(decoded.name);
        setidFromJwt(decoded.userId);
        setToken(response);
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }

  const getReview = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/review`, {
        user_id : idFromJwt
      });
      setReviewResto(response.data);
      console.log(response);
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
    }
  };

  const handleDelete = async (reviewId) => {
    try {
      const response = await axios.delete(`${BASE_URL}/review/${reviewId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      // Setelah berhasil hapus, update state atau reload data
      console.log("Delete successful:", response.data);
      alert("Review deleted successfully!");
      window.location.reload();               
    } catch (err) {
      console.error('Failed to delete review:', err);
    }
  }


  const handleEdit = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.put(`${BASE_URL}/review/${reviewId}`, {    
        user_id: idFromJwt,
        username: usernameFromJwt,
        foodReview: foodReview,
        rating: rating,
        restaurant_id: restoId,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true 
      }
    );
    alert("Review Edit successfully!");
    closeReviewModal();               
    window.location.reload();               
    console.log("Review Edit successfully:", response.data);
  } catch (error) {
    console.error("Error posting review:", error);
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
          <Link to="/Profileaja" style={{textDecoration: "none"}}>
            <div style={{backgroundColor: "none", width: "100%", height: "50px", marginTop: "60px", display:"flex", alignItems: "center", gap: "15px", paddingLeft: "25px", borderTopRightRadius: "35px", borderBottomRightRadius: "35px"}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="black" className="bi bi-person-circle" viewBox="0 0 16 16">
                <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
              </svg>
              <p style={{fontSize: "22px", marginTop: "13px", color: "black"}}>Profile</p>            
            </div>
          </Link>
          <div style={{backgroundColor: "rgba(139, 0, 0, 0.2)", width: "100%", height: "50px", marginTop: "5px", display:"flex", alignItems: "center", gap: "15px", paddingLeft: "25px", borderTopRightRadius: "35px", borderBottomRightRadius: "35px"}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
              <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
            </svg>
            <p style={{fontSize: "22px", marginTop: "13px"}}>Review</p>            
          </div>
        </div>

        <div style={{backgroundColor: "none", width: "75%", height: "100%", display:"flex", alignItems: "center", justifyContent: "center", marginTop: "40px"}}>
          <div style={{ backgroundColor: "none", width: "600px"}}>
            <p style={{fontSize: "28px", marginTop: "11px", fontWeight: "bold"}}>My Review</p>
            
            {
              reviewResto.map(post=> (
              <div key= {post.id}>
              <div style={{ backgroundColor: "none", height: "auto",  width: "100%",  border: "1px solid rgb(155, 155, 155)", padding: "10px", marginTop: "20px" }}>
                {/* Header - Username */}
                <div style={{ display: "flex", alignItems: "center" }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor"
                    className="bi bi-person-circle" viewBox="0 0 16 16">
                    <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                    <path fillRule="evenodd"
                      d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 
                      11.37C3.242 11.226 4.805 10 8 10s4.757 
                      1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                  </svg>
                  <p style={{ fontSize: 18, color: "black", marginTop: 0, marginLeft: 10 }}>
                    {post.username}
                  </p>
                </div>

                {/* Body - Review Text */}
                <div style={{ backgroundColor: "none", minHeight: "60px", width: "100%" }}>
                  <p style={{ fontSize: 15, color: "black", marginTop: 0, paddingRight: "15px", textAlign: "justify" }}> {post.foodReview} </p>
                </div>

                {/* Rating Stars */}
                <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px" }}>
                  {[...Array(5)].map((_, index) => (
                    <svg  key={index}  xmlns="http://www.w3.org/2000/svg"  width="25"  height="25"  fill={index < post.rating ? "gold" : "lightgray"}  className="bi bi-star-fill" viewBox="0 0 16 16"    >
                      <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 
                      6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 
                      0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 
                      3.356.83 4.73c.078.443-.36.79-.746.592L8 
                      13.187l-4.389 2.256z" />
                    </svg>
                  ))}
                  <p style={{ fontSize: 17, color: "grey", margin: 0, paddingLeft: 10, display:"flex", alignItems:"center"}}>
                      {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>

                {/* Buttons */}
                <div style={{ display: "flex", gap: "10px" }}>
                  <button onClick={()=> openReviewModal(post)} style={{   padding: "6px 12px",   fontSize: "14px",   backgroundColor: "#f0ad4e",   color: "white",   border: "none",   borderRadius: "4px",   cursor: "pointer"   }}  >
                    Edit
                  </button>
                  <button  onClick={() => handleDelete(post.id)}  style={{   padding: "6px 12px",   fontSize: "14px",   backgroundColor: "#d9534f",   color: "white",   border: "none",  borderRadius: "4px",  cursor: "pointer"   }}  >
                    Hapus
                  </button>
                </div>
              </div>
            </div>
            ))
            }
          </div>
        </div>
      </div>
      
      {showReviewModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center",  zIndex: 1000,  transition: "opacity 0.3s ease",  opacity: animateReviewModal ? 1 : 0  }}>
          <div style={{  width: "400px",  backgroundColor: "white",  borderRadius: "15px",  padding: "30px",  boxShadow: "0 5px 20px rgba(0,0,0,0.3)",  position: "relative",  transform: animateReviewModal ? "scale(1)" : "scale(0.8)",   transition: "transform 0.3s ease"  }}>
            <button onClick={closeReviewModal} style={{ position: "absolute", top: 10, right: 10, fontSize: 20, border: "none", background: "none", cursor: "pointer" }}>&times;</button>
            <h2 style={{ textAlign: "center", fontSize: 24, marginBottom: 10 }}>Write a Review</h2>
            <form 
            onSubmit={handleEdit}
            >
              <input 
                type="text" 
                value={usernameFromJwt} 
                readOnly 
                style={{ 
                  width: "100%", 
                  padding: 10, 
                  marginBottom: 10,   
                  border: "1px solid #8B0000", 
                  borderRadius: 8,
                  backgroundColor: "#f8f8f8"
                }} 
              />
              
              {/* Review Text */}
              <textarea 
                placeholder="Your Review" 
                style={{ 
                  width: "100%",  
                  padding: 10, 
                  height: 100, 
                  marginBottom: 10, 
                  border: "1px solid #8B0000", 
                  borderRadius: 8,
                  resize: "vertical" // Allows vertical resizing only
                }} 
                value={foodReview} 
                onChange={(e) => setFoodReview(e.target.value)} 
                required 
                minLength="10" // Minimum character requirement
              />
              
              {/* Rating Select */}
              <select style={{ 
                  width: "100%", 
                  padding: 10, 
                  marginBottom: 10, 
                  border: "1px solid #8B0000", 
                  borderRadius: 8,
                  cursor: "pointer"
                }}
                value={rating}
                onChange={(e) => setRating(Number(e.target.value))}
                required
              >
                <option value="">Rate</option>
                <option value="5">⭐ 5 - Excellent</option>
                <option value="4">⭐ 4 - Good</option>
                <option value="3">⭐ 3 - Average</option>
                <option value="2">⭐ 2 - Poor</option>
                <option value="1">⭐ 1 - Terrible</option>
              </select>
              
              {/* Submit Button */}
              <button 
                type="submit" 
                style={{ 
                  width: "100%", 
                  padding: 10, 
                  backgroundColor: "#8B0000", 
                  color: "white", 
                  borderRadius: 8, 
                  border: "none",
                  cursor: "pointer",
                  fontWeight: "bold",
                  transition: "background-color 0.3s",
                  ":hover": {
                    backgroundColor: "#A52A2A" // Darker red on hover
                  }
                }}
              >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default Profilereview;
