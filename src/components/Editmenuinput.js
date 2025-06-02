import { useEffect, useState } from "react";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../Utils";
import { checkLogin } from "../utils/auth";


function Editmenuinput() {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const menu = location.state?.menu;
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    food_name: "",
    food_description: "",
    image: "",
    price: "",
    categories: "",
    restaurant_id: "", // default jika tidak berubah
  });

  useEffect(() => {
  // Fungsi async di dalam useEffect
  const fetchDataAndCheckLogin = async () => {
    try {
      if (!menu) {
        const res = await axios.get(`${BASE_URL}/food/${id}/foodId`);
        setFormData(res.data);
      } else {
        setFormData(menu);
      }

      await checkLogin(navigate, setIsLoggedIn);  // Cek login di sini
    } catch (err) {
      console.error("Error fetching data or checking login:", err);
    }
  };

  fetchDataAndCheckLogin();
}, [menu, id]);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    axios.put(`${BASE_URL}/food/${id}`, formData)
      .then(() => {
        alert("Menu berhasil diperbarui!");
        navigate(`/Editmenu/${formData.restaurant_id}`);
      })
      .catch((err) => console.error("Gagal update menu:", err));
  };

  return (
    <div style={{ backgroundColor: "none", height: 1000, margin: 0, padding: 0 }}>

      {/* Navbar */}
      {/* (kode navbar tetap seperti sebelumnya) */}

      {/* Content */}
      <div style={{ display: "flex" }}>
        <div style={{
          backgroundColor: "none", width: "100%", height: "100%", display: "flex",
          alignItems: "center", justifyContent: "center", marginTop: "40px"
        }}>
          <div style={{ backgroundColor: "none", width: "600px" }}>
            <form onSubmit={handleSubmit}>

              <p style={{ fontSize: "28px", marginTop: "11px", fontWeight: "bold" }}>Edit Food</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "6px", width: "100%" }}>
                <label>Food Name</label>
                <input name="food_name" value={formData.food_name} onChange={handleChange}
                  style={{ height: "50px", borderRadius: "15px", padding: "10px" }} required />
              </div>

              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <label>Food Description</label>
                <input name="food_description" value={formData.food_description} onChange={handleChange}
                  style={{ height: "50px", borderRadius: "15px", padding: "10px" }} required />
              </div>

              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <label>Food Image</label>
                <input name="image" value={formData.image} onChange={handleChange}
                  style={{ height: "50px", borderRadius: "15px", padding: "10px" }} required />
              </div>

              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <label>Price</label>
                <input name="price" type="number" value={formData.price} onChange={handleChange}
                  style={{ height: "50px", borderRadius: "15px", padding: "10px" }} required />
              </div>

              <div style={{ marginTop: "20px", display: "flex", flexDirection: "column", gap: "6px" }}>
                <label>Categories</label>
                <input name="categories" value={formData.categories} onChange={handleChange}
                  style={{ height: "50px", borderRadius: "15px", padding: "10px" }} required />
              </div>

              <button style={{
                backgroundColor: "#8B0000", borderRadius: 7, padding: 5, height: "39px",
                color: "white", border: "2px solid #8B0000", marginTop: "20px"
              }}>
                <h1 style={{ fontSize: 20 }}>Submit</h1>
              </button>

            </form>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Editmenuinput;
