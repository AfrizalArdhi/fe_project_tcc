import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { BASE_URL } from "../Utils";

function Resto() {
  const {id} = useParams();
  const {state} = useLocation();
  const navigate = useNavigate();

  // modal untuk login signup
  const [showModal, setShowModal] = useState(false);
  const [animateModal, setAnimateModal] = useState(false);
  const [showLoginForm, setShowLoginForm] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [animateReviewModal, setAnimateReviewModal] = useState(false);

  //data login/signup
  const [email, setEmail] = useState('');
  const [password, setPasssword] = useState('');
  const [username, setUsername] = useState('');

  //data review
  const [foodReview, setFoodReview] = useState("");
  const [rating, setRating] = useState("");

  const [msg, setMsg] = useState('');
  const [error, setError] = useState();

  const [groupedMenu, setGroupedMenu] = useState({});
  const [loading, setLoading] = useState(true);
  
  const [restaurantGet, setRestaurantGet] = useState(null);

  const [reviewResto, setReviewResto] = useState([]);
  const [token, setToken] = useState();

  const [usernameFromJwt, setUsernameFromJwt] = useState(''); 
  const [idFromJwt, setidFromJwt] = useState(''); 

  const [totalReviews, setTotalReviews] = useState(0);

  useEffect(()=>{
    getData();
    fetchMenu();
    checkLogin(setIsLoggedIn);
    getReview();
    getRestaurantById();
  }, [id]);

  const getRestaurantById = async() => {
    try {
      const response = await axios.get(`${BASE_URL}/restaurant/${id}`);
      setRestaurantGet(response.data);
      console.log("ini id :", response);
    } catch (error) {
      console.error("Error fetching restaurant:", error);
        setError("Failed to load restaurant data");
    }
  }
  
  const getData = async() => {
    const response = localStorage.getItem("accessToken"); // contoh ambil dari localStorage
    if (response) {
      try {
        const decoded = jwtDecode(response);
        console.log("Decoded JWT:", decoded);
        setUsernameFromJwt(decoded.name);
        setidFromJwt(decoded.userId);
        setToken(decoded);
        console.log({msg: token});
      } catch (error) {
        console.error("Invalid token", error);
      }
    }
  }

  // Fetch food by id restaurant
  const fetchMenu = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/food/${id}/food`);
      const menuData = response.data;

      // Mengelompokkan menu berdasarkan kategori
      const grouped = menuData.reduce((acc, item) => {
        const category = item.categories;
        if (!acc[category]) {
          acc[category] = [];
        }
        acc[category].push(item);
        return acc;
      }, {});

      setGroupedMenu(grouped);
      console.log(grouped);
    } catch (error) {
      console.error('Error fetching Menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const getReview = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/restaurant/${id}/review`);
      setReviewResto(response.data);
      console.log(response);
      setTotalReviews(response.data.length);
    } catch (err) {
      console.error('Failed to fetch restaurants:', err);
      setError('Failed to load restaurants. Please try again later.');
    } finally {
      setLoading(false);
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
      setShowModal(false);
      // Navigasi ke halaman utama setelah login berhasil
      console.log("Login Success");
      alert("Login Success!");
      navigate("/"); 
      window.location.reload();

    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  const handleCategoryClick = (category) => {
    const section = document.getElementById(category);
    if (section) {
      section.scrollIntoView({ behavior: "smooth", block: "start" });
      window.history.pushState(null, "", `#${category}`);
    }
  };

  // modal untuk review
    function openModal() {
    setShowModal(true);
    setTimeout(() => setAnimateModal(true), 10); // aktifkan animasi
  }

  function closeModal() {
    setAnimateModal(false);
    setTimeout(() => setShowModal(false), 300); // tunggu animasi selesai
  }

  function openReviewModal() {
    setShowReviewModal(true);
    setTimeout(() => setAnimateReviewModal(true), 10);
  }

  function closeReviewModal() {
    setAnimateReviewModal(false);
    setTimeout(() => setShowReviewModal(false), 300);
  }

  // cek login
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

  //anuin logout
  const handleLogout = async (e) => {
    e.preventDefault();
    try {
      await axios.delete(`${BASE_URL}/auth/logout`, {
        withCredentials: true
      });
      localStorage.removeItem("accessToken");
      navigate("/");
      window.location.reload();
      alert("Logout Success!");
      console.log("Logout Success");
    } catch (error) {
      if (error.response) {
        setMsg(error.response.data.msg);
      }
    }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    const aksestoken = localStorage.getItem("accessToken"); // contoh ambil dari localStorage
    console.log(aksestoken);
    try {
      const response = await axios.post(`${BASE_URL}/review`, {    
        user_id: idFromJwt,
        username: usernameFromJwt,
        foodReview,
        rating,
        restaurant_id: id,
      },
      {
        headers: {
          Authorization: `Bearer ${aksestoken}`,
          'Content-Type': 'application/json',
        },
        withCredentials: true 
      }
    );
    alert("Review submitted successfully!");
    closeReviewModal();               
    window.location.reload();               
    console.log("Review posted successfully:", response.data);
  } catch (error) {
        console.error("Error posting review:", error);
      if(error.response) {
        setMsg(error.response.data.msg);
      }
    }
  }
  
  return (

    <div style={{ backgroundColor: "none", height: 1000, margin: 0, padding: 0}}>
      
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

      {/* <div style={{height: "75px"}}></div> */}

    {/* Detail restoran */}
      <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <div style={{backgroundColor: "none", width: "86%", height: "330px"}}>
          <div style={{display: "flex", marginTop: "30px", gap: 7}}>
            <Link to="/" style={{color: "inherit"}}>
              <p style={{fontSize: 16}}>Homepage</p>
            </Link>
            <p style={{fontSize: 16}}>-</p>
            <p style={{fontSize: 16}}>{restaurantGet ? restaurantGet.restaurant_name : "Loading..."}</p>
          </div>
          
          <div style={{backgroundColor: "none", display: "flex"}}>
            <div style={{backgroundColor: "grey", width: "230px", height: "200px", borderRadius: 15}}>
              {restaurantGet && restaurantGet.image_url ? (
                <img  src={restaurantGet.image_url}  alt="Restaurant"  style={{  width: "100%",  height: "100%",  objectFit: "cover",  borderTopLeftRadius: 15,  borderTopRightRadius: 15  }} />
              ) : (
                <p>Loading image...</p>  // atau bisa kasih placeholder / spinner
              )}
            </div>
            <div style={{backgroundColor: "none", width: "100%", height: "200px", paddingLeft: 25, paddingTop: 10}}>
              <div>
                <p style={{fontSize: 17, color: "grey"}}>{restaurantGet ? restaurantGet.type : "Loading..."}</p>
              </div>
              <div style={{marginTop: -5}}>
                <p style={{fontSize: 32, color: "black", fontWeight: "bold"}}>{restaurantGet ? restaurantGet.restaurant_name : "Loading..."} ({restaurantGet ? restaurantGet.address : "Loading..."})</p>
              </div>
              <div style={{marginTop: -5, display: "flex", alignItems: "center", height: 10, gap: 5}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-clock" viewBox="0 0 16 16">
                  <path d="M8 3.5a.5.5 0 0 0-1 0V9a.5.5 0 0 0 .252.434l3.5 2a.5.5 0 0 0 .496-.868L8 8.71z"/>
                  <path d="M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16m7-8A7 7 0 1 1 1 8a7 7 0 0 1 14 0"/>
                </svg>
                <p style={{fontSize: 14, color: "black", marginTop: 16}}>Open 10:00 Am</p>
                <p style={{fontSize: 14, color: "black", marginTop: 16, marginLeft: 3}}>-</p>
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" fill="currentColor" className="bi bi-currency-dollar" viewBox="0 0 16 16">
                  <path d="M4 10.781c.148 1.667 1.513 2.85 3.591 3.003V15h1.043v-1.216c2.27-.179 3.678-1.438 3.678-3.3 0-1.59-.947-2.51-2.956-3.028l-.722-.187V3.467c1.122.11 1.879.714 2.07 1.616h1.47c-.166-1.6-1.54-2.748-3.54-2.875V1H7.591v1.233c-1.939.23-3.27 1.472-3.27 3.156 0 1.454.966 2.483 2.661 2.917l.61.162v4.031c-1.149-.17-1.94-.8-2.131-1.718zm3.391-3.836c-1.043-.263-1.6-.825-1.6-1.616 0-.944.704-1.641 1.8-1.828v3.495l-.2-.05zm1.591 1.872c1.287.323 1.852.859 1.852 1.769 0 1.097-.826 1.828-2.2 1.939V8.73z"/>
                </svg>
                <p style={{fontSize: 14, color: "black", marginTop: 16}}>
                  Price Rp10,000.00
                </p>
              </div>
              <div style={{marginTop: 20, display: "flex", alignItems: "center", height: 30, gap: 10}}>
                <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-star-fill" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327 4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                </svg>
                <p style={{fontSize: 25, color: "black", marginTop: 16}}>
                  {restaurantGet ? restaurantGet.rating : "Loading..."}
                </p>
                <div style={{display: "flex", gap: 5}}>
                <p style={{fontSize: 18, color: "black", marginTop: 20}}>
                  ({totalReviews})
                </p>
                {/* tombol add review */}
                {
              isLoggedIn ? (
                      <button style={{border: "none", borderRadius: 7, padding: 5, height: "39px", color: "#8B0000", marginTop: 15, backgroundColor: "white"}} onClick={openReviewModal}>
                    <p style={{fontSize: 18, color: "black", textDecoration: "underline"}}>
                      add reviews
                    </p>
                </button>
                ) : (
                    <>
                  <button style={{border: "none", borderRadius: 7, padding: 5, height: "39px", color: "#8B0000", marginTop: 15, backgroundColor: "white"}} onClick={()=>{setIsSignUp(true); openModal();}}>
                    <p style={{fontSize: 18, color: "black", textDecoration: "underline"}}>
                      add reviews
                    </p>
                  </button>
                    </>
                )
              }
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

       {/* Masuk Menu */}
      <div style={{backgroundColor: "white", height: 75, display: "flex", justifyContent: "center", alignItems: "center", boxShadow: "0px 6px 10px rgb(211, 211, 211)"}}>
        <div style={{backgroundColor:"white", height: 50, width: "86%", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
          {/* Buat pencet pencet kategori */}
           <div className="mb-4">
              {Object.keys(groupedMenu).map((category) => (
                <button
                  key={category}
                  onClick={() => handleCategoryClick(category)}
                  className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-semibold py-2 px-4 rounded mr-2 mb-2"
                  style={{border: "none", backgroundColor:"white", marginTop: "30px", fontSize: "20px"}}
                >
                  {category}
                </button>
              ))}
            </div>
          <div style={{display: "flex", gap: 20}}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" className="bi bi-search" viewBox="0 0 16 16">
              <path d="M11.742 10.344a6.5 6.5 0 1 0-1.397 1.398h-.001q.044.06.098.115l3.85 3.85a1 1 0 0 0 1.415-1.414l-3.85-3.85a1 1 0 0 0-.115-.1zM12 6.5a5.5 5.5 0 1 1-11 0 5.5 5.5 0 0 1 11 0"/>
            </svg>
            <input style={{borderRadius: 7, height: 30}} />
          </div>
        </div>
      </div>
      
      <div style={{display: "flex", justifyContent: "center", alignItems: "center"}}>
        <div style={{backgroundColor: "none", width: "86%", display: "flex"}}>
          <div>
            {/* awal dari kategori */}
            {Object.keys(groupedMenu).map((category) => (
              <div key={category} id={category} style={{ marginTop: 30 }}>
                {/* Header Kategori */}
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="red" className="bi bi-fire" viewBox="0 0 16 16">
                    <path d="M8 16c3.314 0 6-2 6-5.5 0-1.5-.5-4-2.5-6 .25 1.5-1.25 2-1.25 2C11 4 9 .5 6 0c.357 2 .5 4-2 6-1.25 1-2 2.729-2 4.5C2 14 4.686 16 8 16m0-1c-1.657 0-3-1-3-2.75 0-.75.25-2 1.25-3C6.125 10 7 10.5 7 10.5c-.375-1.25.5-3.25 2-3.5-.179 1-.25 2 1 3 .625.5 1 1.364 1 2.25C11 14 9.657 15 8 15"/>
                  </svg>
                  <p style={{ fontSize: 35, color: "black", marginTop: 20, fontWeight: "bold" }}>
                    {category}
                  </p>
                </div>
              
                {/* Daftar makanan per kategori */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', width: '100%', marginTop: "20px" }}>
                  {groupedMenu[category].map((food) => (
                    <div key={food.id} style={{ width: "450px", backgroundColor: "white", height: "150px", borderRadius: 15, border: "1px solid grey", flexShrink: 0, display: "flex", justifyContent: "space-between"}}>
                      <div style={{ padding: 10 }}>
                        <p style={{ fontSize: 18, color: "black", marginTop: 0, fontWeight: "bold" }}>
                          {food.food_name}
                        </p>
                        <p style={{ fontSize: 15, color: "black", marginTop: -10 }}>
                          {food.price}
                        </p>
                        <div style={{ width: "260px", height: "50px", marginTop: "30px" }}>
                          <p style={{ fontSize: 15, color: "black", marginTop: -10, textAlign: "justify" }}>
                            {food.food_description}
                          </p>
                        </div>
                      </div>
                      <div style={{ backgroundColor: "grey", height: "100%", width: "160px", borderBottomRightRadius: 15, borderTopRightRadius: 15, flexShrink: 0}}>
                        <img src={food.image} alt="Food" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
            {/* akhir dari kategori */}
          </div>

          {/* Review */}
          <div style={{backgroundColor: "none", width: "40%", marginLeft: "30px", marginTop: "40px", padding: "20px", border: "1px solid black"}}>
            <p style={{fontSize: 35, color: "black", marginTop: 0, fontWeight: "bold"}}>
              Costumer Review
            </p>

            {/* <div style={{backgroundColor:"none", width:"100%", height: "10px", display: "flex", justifyContent: "center", alignItems: "center"}}>
              <div style={{backgroundColor:"grey", width:"100%", height: "1px"}}></div>
            </div> */}
          
            {
              reviewResto.map(post=> (
              <div key={post.id}>
                <div style={{backgroundColor: "none", height:"200px", width:"100%", border: "1px solid rgb(155, 155, 155)", padding: "10px", marginTop: "20px"}}>
                  <div style={{display: "flex", alignContent: "center"}}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-person-circle" viewBox="0 0 16 16">
                      <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
                      <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
                    </svg>
                    <p style={{fontSize: 18, color: "black", marginTop: 0, marginLeft: 10}}>
                      {post.username}
                    </p>
                  </div>

                  <div style={{backgroundColor: "none", height: "106px", width: "100%"}}>
                    <p style={{fontSize: 15, color: "black", marginTop: 0, paddingRight: "15px", textAlign:"justify"}}>
                      {post.foodReview}
                    </p>
                  </div>

                  {/* Rating Stars */}
                  <div style={{ display: "flex", alignItems: "center", gap: "5px", marginBottom: "10px"}}>
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
                </div>
              </div>
            ))
            }
          </div>
        </div>
      </div>
      <div style={{height:"500px"}}></div>
      
      {/* Modal Akun */}
      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 1000, transition: "opacity 0.3s ease", opacity: animateModal ? 1 : 0 }}>
          <div style={{ width: "400px", backgroundColor: "white", borderRadius: "15px", padding: "30px", boxShadow: "0 5px 20px rgba(0,0,0,0.3)", position: "relative", transform: animateModal ? "scale(1)" : "scale(0.8)", transition: "transform 0.3s ease" }}>
            <button onClick={closeModal} style={{ position: "absolute", top: 10, right: 10, fontSize: 20, border: "none", background: "none", cursor: "pointer" }}>&times;</button>

            <h2 style={{ textAlign: "center", fontSize: 24, marginBottom: 10 }}>Welcome!</h2>
            <p style={{ textAlign: "center", marginBottom: 20 }}>Sign up or log in to continue</p>

            <button onClick={() => { setShowLoginForm(true); setIsSignUp(false); }} style={{ width: "100%", padding: 10, marginBottom: 10, backgroundColor: "#8B0000", color: "white", borderRadius: 8, border: "none"}}>
              Log in
            </button>

            <button onClick={() => { setShowLoginForm(true); setIsSignUp(true); }} style={{ width: "100%", padding: 10, backgroundColor: "white", color: "#8B0000", borderRadius: 8, border: "1px solid #8B0000" }} >
              Sign 
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

      {showReviewModal && (
        <div style={{ position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh", backgroundColor: "rgba(0,0,0,0.5)", display: "flex", justifyContent: "center", alignItems: "center",  zIndex: 1000,  transition: "opacity 0.3s ease",  opacity: animateReviewModal ? 1 : 0  }}>
          <div style={{  width: "400px",  backgroundColor: "white",  borderRadius: "15px",  padding: "30px",  boxShadow: "0 5px 20px rgba(0,0,0,0.3)",  position: "relative",  transform: animateReviewModal ? "scale(1)" : "scale(0.8)",   transition: "transform 0.3s ease"  }}>
            <button onClick={closeReviewModal} style={{ position: "absolute", top: 10, right: 10, fontSize: 20, border: "none", background: "none", cursor: "pointer" }}>&times;</button>
            <h2 style={{ textAlign: "center", fontSize: 24, marginBottom: 10 }}>Write a Review</h2>
            <form onSubmit={handleReview}>
              <input  type="text"  value={usernameFromJwt}  readOnly  style={{  width: "100%",  padding: 10,  marginBottom: 10,    border: "1px solid #8B0000",  borderRadius: 8, backgroundColor: "#f8f8f8" }}  />
              
              {/* Review Text */}
              <textarea  placeholder="Your Review"  style={{  width: "100%",  padding: 10,  height: 100,  marginBottom: 10,  border: "1px solid #8B0000",  borderRadius: 8, resize: "vertical"  }}  value={foodReview}  onChange={(e) => setFoodReview(e.target.value)}  required  minLength="10"  />
              
              {/* Rating Select */}
              <select style={{  width: "100%",  padding: 10,  marginBottom: 10,  border: "1px solid #8B0000",  borderRadius: 8, cursor: "pointer" }} value={rating} onChange={(e) => setRating(Number(e.target.value))} required  >
                <option value="">Rate</option>
                <option value="5">⭐ 5 - Excellent</option>
                <option value="4">⭐ 4 - Good</option>
                <option value="3">⭐ 3 - Average</option>
                <option value="2">⭐ 2 - Poor</option>
                <option value="1">⭐ 1 - Terrible</option>
              </select>
              
              {/* Submit Button */}
              <button  type="submit"  style={{  width: "100%",  padding: 10,  backgroundColor: "#8B0000",  color: "white",  borderRadius: 8,  border: "none", cursor: "pointer", fontWeight: "bold", transition: "background-color 0.3s", ":hover": {   backgroundColor: "#A52A2A"  } }}  >
                Submit Review
              </button>
            </form>
          </div>
        </div>
      )}


    </div>
  );
}

export default Resto;
