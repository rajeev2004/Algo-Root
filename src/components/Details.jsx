import React,{useState,useEffect} from "react";
import mockData from "./mockData.js";
import PersonIcon from "@mui/icons-material/Person";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import axios from "axios";
import { Link } from "react-router-dom";
import {useNavigate} from "react-router-dom";
function Details(){
    const backend=import.meta.env.VITE_API_BACKEND;
    const navigate=useNavigate();
    const [data,setData]=useState([]);
    const limit=5;
    const [user,setUser]=useState({});
    const [error,setError]=useState('');
    const [page,setPage]=useState(1);
    const [order,setOrder]=useState('asc');
    const [search,setSearch]=useState('')
    useEffect(()=>{
        async function Authenticate_And_Fetch_Data(){
            try{
                const token=localStorage.getItem('token');
                if(!token){
                    alert('You are not Authenticated');
                    window.location.href='/';
                    return;
                }
                const checkAuthentication=await axios.get(`${backend}/checkAuthentication`,{
                    headers:{
                        Authorization:`Bearer ${token}`
                    }
                })
                if(checkAuthentication.data.message==='User verified'){
                    setData(mockData);
                    setUser(checkAuthentication.data.detail);
                }else{
                    window.location.href='/';
                }
            }catch(err){
                setError(err.response?.data?.error || err.message || 'failed to fetch data');
            }
        }
        Authenticate_And_Fetch_Data();
    },[]);
    useEffect(()=>{
        setPage(1);
    },[search]);
    function logout(){
        localStorage.removeItem('token');
        navigate('/');
    }
    async function deleteAccount(){
        try{
            if (window.confirm("Are you sure you want to delete your account?")){
                const accountDelete=await axios.delete(`${backend}/delete`,{
                    headers:{
                        Authorization:`Bearer ${localStorage.getItem('token')}`
                    }
                })
                if(accountDelete.data.message==='account deleted'){
                    localStorage.removeItem("token");
                    navigate("/");
                }
            }
        }catch(err){
            setError(err.response?.data?.error || err.message || 'error deleting account');
        }
    }
    const filteredData=data.filter((item)=>item.name.toLowerCase().includes(search.toLowerCase().trim()));
    const sortedData=[...filteredData].sort((a,b)=>{
        if(order==="asc"){
            return a.age-b.age||a.id-b.id;
        }else{
            return b.age-a.age||a.id-b.id; 
        }
    });
    const indexOfLastRow=page*limit;
    const indexOfFirstRow=indexOfLastRow-limit;
    const currentData=sortedData.slice(indexOfFirstRow,indexOfLastRow);
    return(
        <div className="detailContainer">
            <div className="name">
                <h2>Algo Root</h2>
            </div>
            <nav class="navbar navbar-dark bg-dark">
                <div class="container-fluid">
                <button 
                    className="navbar-toggler" 
                    type="button" 
                    data-bs-toggle="offcanvas" 
                    data-bs-target="#offcanvasDarkNavbar" 
                    aria-controls="offcanvasDarkNavbar"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                    <div class="offcanvas offcanvas-end text-bg-dark" tabindex="-1" id="offcanvasDarkNavbar" aria-labelledby="offcanvasDarkNavbarLabel">
                        <div class="offcanvas-header">
                            <h5 class="offcanvas-title" id="offcanvasDarkNavbarLabel">Sidebar</h5>
                            <button type="button" class="btn-close btn-close-white" data-bs-dismiss="offcanvas" aria-label="Close"></button>
                        </div>
                        <div class="offcanvas-body">
                            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
                                <li class="nav-item">
                                    <Link className="nav-link active" to="/detailPage">Details</Link>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </nav>
            <nav class="navbar navbar-expand-lg bg-body-tertiary">
                <div class="container-fluid d-flex justify-content-between align-items-center">
                    <a class="navbar-brand">Navbar</a>
                    <ul className="navbar-nav ms-auto align-items-center">
                        <li className="nav-item dropdown">
                            <a className="nav-link dropdown-toggle d-flex align-items-center" href="#" role="button" data-bs-toggle="dropdown" aria-expanded="false">
                                <PersonIcon />
                            </a>
                            <ul className="dropdown-menu dropdown-menu-end">
                                <li><span className="dropdown-item">{user.email}</span></li>
                                <li><button className="dropdown-item" onClick={logout}>Logout</button></li>
                                <li><button className="dropdown-item" onClick={deleteAccount}>Delete Account</button></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </nav>
            <div className="searchField">
                <input
                    type="text"
                    placeholder="Search by name..."
                    onChange={(e)=>setSearch(e.target.value)}
                />
                <select
                    onChange={(e)=>setOrder(e.target.value)}
                    value={order}
                >
                    <option value="asc">Sort by Age (Ascending)</option>
                    <option value="desc">Sort by Age (Descending)</option>
                </select>
            </div>
            <table className="detailsTable">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Age</th>
                    </tr>
                </thead>
                <tbody>
                    {currentData.map((item)=>(
                        <tr key={item.id}>
                            <td>{item.id}</td>
                            <td>{item.name}</td>
                            <td>{item.email}</td>
                            <td>{item.age}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className="PaginationbuttonClass">
                <button
                    onClick={()=>setPage((prev)=>Math.max(prev-1,1))}
                    disabled={page===1}
                >
                    <ArrowBackIcon />
                </button>
                <span>Page {page}</span>
                <button
                    onClick={()=>setPage((prev)=>prev+1)}
                    disabled={indexOfLastRow>=filteredData.length}
                >
                    <ArrowForwardIcon />
                </button>
            </div>
            {error && <p className="message">{error}</p>}
        </div>
    )
}
export default Details;