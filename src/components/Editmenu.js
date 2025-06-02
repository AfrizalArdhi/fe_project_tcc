import axios from "axios";
import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../Utils";
import { checkLogin } from "../utils/auth";


function Editmenu() {
  const {id} = useParams();
  const {state} = useLocation();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [menu, setMenu] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [msg, setMsg] = useState('');

  useEffect(()=> {
    fetchMenu();
    checkLogin(navigate, setIsLoggedIn);
  }, [id]);

  const fetchMenu = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/food/${id}/food`);
      setMenu(response.data);
      console.log(response);
    } catch (error) {
      console.error('Error fetching Menu:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTambahMenu = () => {
    navigate(`/Tambahmenu/${id}`);
  };

  const handleEdit = async (id) => {
    try {
      navigate(`/Editmenuinput/${id}`);
    } catch (error) {
      console.error("Edit failed:", error);
    }
  }

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this Menu?")) {
      try {
        await axios.delete(`${BASE_URL}/food/${id}`);
        setMenu(menu.filter(r => r.id !== id));
        alert("Menu deleted successfully");
      } catch (err) {
        console.error("Delete failed:", err);
        alert("Failed to delete menu");
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
            <Link to="/Editresto" style={{textDecoration: "none"}}>
              <h1 style={{fontSize: 20, color: "#8B0000"}}>MyouiFood</h1>
            </Link>
          </div>
          <div style={{display: "flex", gap: 30}}>
            <button style={{backgroundColor: "#8B0000", borderRadius: 7, padding: 5, height: "39px", color: "white", border: "2px solid #8B0000", marginTop: "-2px"}} onClick={handleTambahMenu}>
              <h1 style={{fontSize: 20}}>Tambah Menu</h1>
            </button>
            <button style={{backgroundColor: "#8B0000", borderRadius: 7, padding: 5, height: "39px", color: "white", border: "2px solid #8B0000"}} onClick={handleLogout}>
              <h1 style={{fontSize: 20}}>Logout</h1>
            </button>
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#8B0000" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0"/>
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1"/>
            </svg>
          </div>
        </div>
      </div>
      {/* navbar abis */}

      {/* wadah */}

        <div style={{ marginTop: 50, backgroundColor: "none", height: "auto", display: "flex", justifyContent: "center", alignItems: "center", padding: "1rem", width: "83%", margin: "auto" }}>
          <div style={{height: "90%", width: "100%", display: "flex", flexWrap: "wrap", justifyContent: "flex-start", alignItems: "flex-start", gap: "10px"}}>

          {/* menu */}
          {menu.map(post => (
            <div key = {post.id}>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: "20px" }}>
                  <div style={{ width: "450px", backgroundColor: "white", height: "150px", borderRadius: 15, border: "1px solid grey", flexShrink: 0, display: "flex", justifyContent: "space-between"}}>
                    <div style={{ padding: 10 }}>
                      <p style={{ fontSize: 18, color: "black", marginTop: 0, fontWeight: "bold" }}>
                        {post.food_name}
                      </p>
                      <div style={{display: "flex", gap: "20px"}}>
                        <p style={{ fontSize: 15, color: "black", marginTop: -10 }}>
                          {post.price}
                        </p>
                        <p style={{ fontSize: 15, color: "black", marginTop: -10 }}>
                          {post.categories}
                        </p>
                      </div>
                      <div style={{ width: "260px", height: "50px", marginTop: "30px" }}>
                        <p style={{ fontSize: 15, color: "black", marginTop: -10, textAlign: "justify" }}>
                          {post.food_description}
                        </p>
                      </div>
                    </div>
                    <div style={{ backgroundColor: "grey", height: "100%", width: "160px", borderBottomRightRadius: 15, borderTopRightRadius: 15, flexShrink: 0}}>
                      <img src={post.image} alt="Food" style={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: "10px" }} />
                    </div>
                  </div>
                  {/* tombol edit dan buang (vertikal) */}
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    <button style={{ backgroundColor: "white", color: "white", border: "1px solid #8B0000", borderRadius: 8, padding: "10px",  }} onClick={() => handleEdit(post.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#8B0000" className="bi bi-pencil-fill" viewBox="0 0 16 16">
                        <path d="M12.854.146a.5.5 0 0 0-.707 0L10.5 1.793 14.207 5.5l1.647-1.646a.5.5 0 0 0 0-.708zm.646 6.061L9.793 2.5 3.293 9H3.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.5h.5a.5.5 0 0 1 .5.5v.207zm-7.468 7.468A.5.5 0 0 1 6 13.5V13h-.5a.5.5 0 0 1-.5-.5V12h-.5a.5.5 0 0 1-.5-.5V11h-.5a.5.5 0 0 1-.5-.5V10h-.5a.5.5 0 0 1-.175-.032l-.179.178a.5.5 0 0 0-.11.168l-2 5a.5.5 0 0 0 .65.65l5-2a.5.5 0 0 0 .168-.11z"/>
                      </svg>
                    </button>

                    <button style={{ backgroundColor: "white", color: "white", border: "1px solid #8B0000", borderRadius: 8, padding: "10px",  }} onClick={() => handleDelete(post.id)}>
                      <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#8B0000" className="bi bi-trash-fill" viewBox="0 0 16 16">
                        <path d="M2.5 1a1 1 0 0 0-1 1v1a1 1 0 0 0 1 1H3v9a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2V4h.5a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1H10a1 1 0 0 0-1-1H7a1 1 0 0 0-1 1zm3 4a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 .5-.5M8 5a.5.5 0 0 1 .5.5v7a.5.5 0 0 1-1 0v-7A.5.5 0 0 1 8 5m3 .5v7a.5.5 0 0 1-1 0v-7a.5.5 0 0 1 1 0"/>
                      </svg>
                    </button>
                  </div>
                </div>
            </div>
            ))
          }
            
          {/* menu */}
            
          </div>
        </div>

        {/* wadah abis */}

    </div>
  );
}

export default Editmenu;
