import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from 'axios';
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../Utils";

function Home() {

  const [showModal, setShowModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);

  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [email, setEmail] = useState('');
  const [password, setPasssword] = useState('');
  const [msg, setMsg] = useState('');
  const [username, setUsername] = useState('');

  const navigate = useNavigate();

  useEffect(()=> {
    getRestaurant();
    checkLogin(setIsLoggedIn);
  }, []);

  function openModal() {
    setShowModal(true);
    setTimeout(() => setAnimateModal(true), 10); // aktifkan animasi
  }

  function closeModal() {
    setAnimateModal(false);
    setTimeout(() => setShowModal(false), 300); // tunggu animasi selesai
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

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password
      }, {
        withCredentials: true
      });

      // Ambil access token dari response (sesuaikan nama properti dengan backend kamu)
      const accessToken = response.data.accessToken;

      // Simpan ke localStorage
      localStorage.setItem("accessToken", accessToken);

      // Update state dengan benar
      setIsLoggedIn(true);
      closeModal();
      console.log("Login Success");
      alert("Login Success!");
      navigate("/"); 
      window.location.reload();
    } catch (error) {
      alert("Username atau Password Salah!");
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };


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

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}/auth/register`, {
        username,
        email,
        password,
        role: 2
      });
      console.log("Register Success");
      alert("Register Success!");
      navigate("/"); 
      window.location.reload();    
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };


  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;
  
  return (
    // awal dari semuanya
    <div style={{ backgroundColor: "white", height: 1000, margin: 0, padding: 0}}>
        {/* navbar */}
        <div style={{backgroundColor: "white", height: 75, display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid rgb(155, 155, 155)", boxShadow: "0px 6px 10px rgb(211, 211, 211)"}}>
          <div style={{backgroundColor:"white", height: 50, width: "86%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <div style={{display: "flex", gap: 10}}>
              <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#8B0000" className="bi bi-egg-fried" viewBox="0 0 16 16">
                <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6"/>
                <path d="M13.997 5.17a5 5 0 0 0-8.101-4.09A5 5 0 0 0 1.28 9.342a5 5 0 0 0 8.336 5.109 3.5 3.5 0 0 0 5.201-4.065 3.001 3.001 0 0 0-.822-5.216zm-1-.034a1 1 0 0 0 .668.977 2.001 2.001 0 0 1 .547 3.478 1 1 0 0 0-.341 1.113 2.5 2.5 0 0 1-3.715 2.905 1 1 0 0 0-1.262.152 4 4 0 0 1-6.67-4.087 1 1 0 0 0-.2-1 4 4 0 0 1 3.693-6.61 1 1 0 0 0 .8-.2 4 4 0 0 1 6.48 3.273z"/>
              </svg>
              <h1 style={{fontSize: 20, color: "#8B0000"}}>MyouiFood</h1>
            </div>
            <div style={{display: "flex", gap: 30}}>
                {
                  isLoggedIn ? (
                    <>
                    <button style={{backgroundColor: "#8B0000", borderRadius: 7, padding: 5, height: "39px", color: "white", border: "2px solid #8B0000"}} onClick={handleLogout}>
                      <h1 style={{fontSize: 20}}>Logout</h1>
                    </button>
                    <Link to="/Profileaja" style={{textDecoration: "none"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#8B0000" className="bi bi-person-circle" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg>
                  </Link>
                    </>
                  ) : (
                      <>
                    <button style={{border: "2px solid #8B0000", borderRadius: 7, padding: 5, height: "39px", color: "#8B0000"}} onClick={()=>{setIsSignUp(false); openModal();}}>
                      <h1 style={{fontSize: 20}}>Log-In</h1>
                    </button>
                    <button style={{backgroundColor: "#8B0000", borderRadius: 7, padding: 5, height: "39px", color: "white", border: "2px solid #8B0000"}} onClick={()=>{setIsSignUp(true); openModal();}}>
                      <h1 style={{fontSize: 20}}>Sign-Up for more</h1>
                    </button>
                      </>
                  )
                }
              
            </div>
          </div>
        </div>
        {/* akhir darir navbar */}
        
        <div style={{height: 1, backgroundColor: "black"}}></div>

          {/* Carouesl */}
          <div id="carouselExample" className="carousel slide" data-bs-ride="carousel" style={{height: 450, backgroundColor: "grey"}}>
            <div className="carousel-inner">
              <div className="carousel-item active">
                <img src="https://assets-a1.kompasiana.com/items/album/2023/06/19/kuliner-2-649050614addee1b710fae73.jpg" className="d-block w-100" alt="Slide 1" style={{height: 450, objectFit: "cover"}}/>              
              </div>
              <div className="carousel-item">
                <img src="https://bisnisukm.com/uploads/2020/02/11-anak-bangsa-ini-sukses-promosikan-kuliner-nusantara-di-luar-negeri.jpg" className="d-block w-100" alt="Slide 2" style={{height: 450, objectFit: "cover"}}/>
              </div>
              <div className="carousel-item">
                <img src="https://wahananews.co/photo/berita/dir022022/menko-marves-minta-hotel-hotel-rajin-kenalkan-kuliner-nusantara_xS7yknZP8p.jpg" className="d-block w-100" alt="Slide 3" style={{height: 450, objectFit: "cover"}}s/>
              </div>
            </div>
            <button
              className="carousel-control-prev"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="prev">
              <span className="carousel-control-prev-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Previous</span>
            </button>
            <button
              className="carousel-control-next"
              type="button"
              data-bs-target="#carouselExample"
              data-bs-slide="next">
              <span className="carousel-control-next-icon" aria-hidden="true"></span>
              <span className="visually-hidden">Next</span>
            </button>
          </div>
          {/* End carousel */}
        <div style={{height: 1, backgroundColor: "black"}}></div>

        {/* Nama Resto */}
        <div style={{height: 75, marginTop: 15, display: "flex", justifyContent: "center", alignItems: "center"}}>
          <div style={{backgroundColor: "white", height: 50, width: "80%", display: "flex", justifyContent: "center", alignItems: "center"}}>
            <h1>Restaurant yee</h1>
          </div>
        </div>

        {/* wadah */}
        <div style={{marginTop: 50, backgroundColor: "none", height: "27%", display: "flex", justifyContent: "center", alignItems: "center", overflowX: "auto", gap: 30, padding: "1rem", width: "83%", margin: "auto", scrollbarWidth: "thin"}}>
          <div style={{height: "90%", width: "100%", display: "flex", justifyContent: "flex-start", alignItems: "center", gap: 20}}>

            {/* Cardboard */}
            { restaurants.map(post => (
              <div key={post.id}>
                <Link to={`/Resto/${post.id}`} state={{restaurants: post}} style={{ display: "inline-block", textDecoration: "none", color: "inherit" }}>
                
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
            </div>
            ))}
            {/* akhir cardbox */}
          </div>
        </div>
        
        {/* About Us */}
        <div style={{height: 75, marginTop: 70, display: "flex", justifyContent: "center", alignItems: "center"}}>
          <div style={{backgroundColor: "white", height: 50, width: "80%", display: "flex", alignItems: "center", justifyContent: "center"}}>
            <h1>About Us</h1>
          </div>
        </div>

        <div style={{backgroundColor: "none", height: "430px", display: "flex", justifyContent: "center", alignItems: "center", gap: 70}}>
          <div style={{backgroundColor: "white", height: "380px", width: "380px", padding: 20, border: "1px solid rgb(155, 155, 155)", boxShadow: "6px 6px 6px grey"}}>
            <div>
              <p style={{fontSize: 32, textAlign:"center"}}>Anggota Kelompok</p>
              <p style={{fontSize: 18, textAlign: "center"}}> 123220119 - Anugraha Galih Saputra <br/> 123220128 - Afrizal Ardhi </p>
            </div>
          </div>

          <div style={{backgroundColor: "white", height: "380px", width: "380px", padding: 20, border: "1px solid rgb(155, 155, 155)", boxShadow: "6px 6px 6px grey"}}>
            <div style={{backgroundColor: "none", height: "100%", width: "100%", justifyContent: "center", alignItems: "center", display: "flex"}}>
              <div>
                <p style={{fontSize: 32, textAlign:"center"}}>Myoui Food</p>
                <p style={{fontSize: 18, textAlign: "center"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut ante et felis semper interdum. Ut tempor ex urna, fringilla condimentum sem gravida quis. Aliquam elementum eleifend libero dictum aliquet. Morbi pulvinar lorem commodo metus placerat placerat. Nullam vitae libero at libero aliquam viverra. Pellentesque varius dictum purus, </p>
              </div>
            </div>
          </div>

          <div style={{backgroundColor: "white", height: "380px", width: "380px", padding: 20, border: "1px solid rgb(155, 155, 155)", boxShadow: "6px 6px 6px grey"}}>
            <div style={{backgroundColor: "none", height: "100%", width: "100%", justifyContent: "center", alignItems: "center", display: "flex"}}>
              <div>
                <p style={{fontSize: 32, textAlign:"center"}}>Best Restaurant</p>
                <p style={{fontSize: 18, textAlign: "center"}}>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque ut ante et felis semper interdum. Ut tempor ex urna, fringilla condimentum sem gravida quis. Aliquam elementum eleifend libero dictum aliquet. Morbi pulvinar lorem commodo metus placerat placerat. Nullam vitae libero at libero aliquam viverra. Pellentesque varius dictum purus, </p>
              </div>
            </div>

          </div>
        </div>

        <div style={{height: 100}}></div>

        {showModal && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)",  display: "flex",  justifyContent: "center",   alignItems: "center",   zIndex: 1000,   transition: "opacity 0.3s ease",   opacity: animateModal ? 1 : 0  }}>
            <div style={{  width: "400px",  backgroundColor: "white",  borderRadius: "15px",  padding: "30px",  boxShadow: "0 5px 20px rgba(0,0,0,0.3)",  position: "relative",  transform: animateModal ? "scale(1)" : "scale(0.8)",  transition: "transform 0.3s ease" }}>
              <button onClick={closeModal} style={{ position: "absolute", top: 10, right: 10, fontSize: 20, border: "none", background: "none", cursor: "pointer" }}>&times;</button>

              <h2 style={{ textAlign: "center", fontSize: 24, marginBottom: 10 }}>Welcome!</h2>
              <p style={{ textAlign: "center", marginBottom: 20 }}>Sign up or log in to continue</p>

              <button   onClick={() => {setShowLoginForm(true); setIsSignUp(false);}} style={{ width: "100%", padding: 10, marginBottom: 10, backgroundColor: "#8B0000", color: "white", borderRadius: 8, border: "none"  }} >
                Log in
              </button>

              <button
                onClick={() => { setShowLoginForm(true); setIsSignUp(true);  }} style={{ width: "100%", padding: 10, backgroundColor: "white",   color: "#8B0000",   borderRadius: 8,   border: "1px solid #8B0000"   }}   >
                Sign up
              </button>

              {showLoginForm && (
                <div style={{ marginTop: 20 }}>
                  <form onSubmit={isSignUp? handleRegister : handleLogin}>
                    {isSignUp && (
                      <input type="text" placeholder="Username" style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #8B0000", borderRadius: 8}} value = {username} onChange={(e) => setUsername(e.target.value)} required/>
                    )}
                      <input type="email" placeholder="Email" style={{ width: "100%",padding: 10, marginBottom: 10, border: "1px solid #8B0000", borderRadius: 8 }} value = {email} onChange={(e) => setEmail(e.target.value)} required />
                      <input type="password" placeholder="Password" style={{ width: "100%", padding: 10, marginBottom: 10, border: "1px solid #8B0000", borderRadius: 8 }} value = {password} onChange={(e) => setPasssword(e.target.value)} required/>
                      <button style={{ width: "100%", padding: 10, backgroundColor: "#8B0000", color: "white", borderRadius: 8, border: "none"}}>
                      {isSignUp ? "Sign up" : "Login"}
                      </button>
                  </form>

                </div>
              )}

            </div>
          </div>
        )}
 
    </div>
  );
}

export default Home;
