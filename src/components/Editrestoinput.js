import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import { BASE_URL } from "../Utils";
import { checkLogin } from "../utils/auth";


function Editrestoinput() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const restaurant = location.state?.restaurants;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    restaurant_name: "",
    type: "",
    description: "",
    image_url: "",
    address: "",
  });

  useEffect(() => {
    const fetchDataAndCheckLogin = async () => {
      try {
        if (!restaurant) {
          axios.get(`${BASE_URL}/restaurant/${id}`)
            .then((res) => setFormData(res.data))
            .catch((err) => console.error("Gagal fetch data:", err));
        } else {
          setFormData(restaurant);
        }

        await checkLogin(navigate, setIsLoggedIn);  // Cek login di sini
      } catch (error) {
        console.error("Error fetching data or checking login:", error);
      }
    };

    fetchDataAndCheckLogin();
  }, [restaurant, id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${BASE_URL}/restaurant/${id}`, formData)
      .then(() => {
        alert("Data berhasil diperbarui!");
        navigate("/Editresto");
      })
      .catch((err) => {
        console.error("Gagal update:", err);
        alert("Gagal memperbarui data.");
      });
  };

  return (
    <div style={{ backgroundColor: "none", height: 1000, margin: 0, padding: 0 }}>
      {/* Navbar */}
      <div style={{ backgroundColor: "none", height: 75, display: "flex", justifyContent: "center", alignItems: "center", border: "1px solid rgb(155, 155, 155)", boxShadow: "0px 6px 10px rgb(211, 211, 211)" }}>
        <div style={{ backgroundColor: "none", height: 50, width: "86%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div style={{ display: "flex", gap: 10 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="#8B0000" className="bi bi-egg-fried" viewBox="0 0 16 16">
              <path d="M8 11a3 3 0 1 0 0-6 3 3 0 0 0 0 6" />
              <path d="M13.997 5.17a5 5 0 0 0-8.101-4.09A5 5 0 0 0 1.28 9.342a5 5 0 0 0 8.336 5.109 3.5 3.5 0 0 0 5.201-4.065 3.001 3.001 0 0 0-.822-5.216z" />
            </svg>
            <Link to="/" style={{ textDecoration: "none" }}>
              <h1 style={{ fontSize: 20, color: "#8B0000" }}>MyouiFood</h1>
            </Link>
          </div>
          <div style={{ display: "flex", gap: 30 }}>
            <svg xmlns="http://www.w3.org/2000/svg" width="35" height="35" fill="#8B0000" className="bi bi-person-circle" viewBox="0 0 16 16">
              <path d="M11 6a3 3 0 1 1-6 0 3 3 0 0 1 6 0" />
              <path fillRule="evenodd" d="M0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8m8-7a7 7 0 0 0-5.468 11.37C3.242 11.226 4.805 10 8 10s4.757 1.225 5.468 2.37A7 7 0 0 0 8 1" />
            </svg>
          </div>
        </div>
      </div>
      {/* Navbar end */}

      <div style={{ display: "flex" }}>
        <div style={{ backgroundColor: "none", width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", marginTop: "40px" }}>
          <div style={{ backgroundColor: "none", width: "600px" }}>
            <form onSubmit={handleSubmit}>
              <p style={{ fontSize: "28px", marginTop: "11px", fontWeight: "bold" }}>Edit Restaurant</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                <label style={{ fontSize: "15px", color: "#555", fontWeight: "500" }}>Restaurant Name</label>
                <input
                  name="restaurant_name"
                  value={formData.restaurant_name}
                  onChange={handleChange}
                  style={{ height: "50px", width: "100%", borderRadius: "15px", padding: "10px" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", marginTop: "20px" }}>
                <label style={{ fontSize: "15px", color: "#555", fontWeight: "500" }}>Type</label>
                <input
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  style={{ height: "50px", width: "100%", borderRadius: "15px", padding: "10px" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", marginTop: "20px" }}>
                <label style={{ fontSize: "15px", color: "#555", fontWeight: "500" }}>Description</label>
                <input
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  style={{ height: "50px", width: "100%", borderRadius: "15px", padding: "10px" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", marginTop: "20px" }}>
                <label style={{ fontSize: "15px", color: "#555", fontWeight: "500" }}>Image Url</label>
                <input
                  name="image_url"
                  value={formData.image_url}
                  onChange={handleChange}
                  style={{ height: "50px", width: "100%", borderRadius: "15px", padding: "10px" }}
                />
              </div>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%", marginTop: "20px" }}>
                <label style={{ fontSize: "15px", color: "#555", fontWeight: "500" }}>Address</label>
                <input
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  style={{ height: "50px", width: "100%", borderRadius: "15px", padding: "10px" }}
                />
              </div>

              <button
                type="submit"
                style={{
                  backgroundColor: "#8B0000",
                  borderRadius: 7,
                  padding: 5,
                  height: "39px",
                  color: "white",
                  border: "2px solid #8B0000",
                  marginTop: "20px"
                }}
              >
                <h1 style={{ fontSize: 20 }}>Submit</h1>
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Editrestoinput;
