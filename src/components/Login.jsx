import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
function Login(){
    const backend=import.meta.env.VITE_API_BACKEND;
    const navigate=useNavigate();
    const[email,setEmail]=useState("");
    const[pass,setPass]=useState("");
    const[error,setError]=useState("");
    async function userLogin(e){
        e.preventDefault();
        try{
            const result=await axios.post(`${backend}/login`,{email,pass});
            if(result.data.message==="login successful"){
                alert('Login Successful');
                navigate('/detailPage');
                localStorage.setItem("token",result.data.token);
            }else{
                alert('try again');
            }
        }catch(err){
            setError(err.response?.data?.error || err.message || 'login failed');
        }
    }
    return(
        <div className="container">
            <div className="name">
                <h2>Algo Root</h2>
            </div>
            <form onSubmit={userLogin} className="form">
                <div className="formComponents">
                    <label>
                        Email:
                    </label>
                    <input type="email" name="email" value={email} onChange={(e)=>setEmail(e.target.value)} required/>
                </div>
                <div className="formComponents">
                    <label>
                        Password:
                    </label>
                    <input type="password" name="password" value={pass} onChange={(e)=>setPass(e.target.value)} required/>
                </div>
                <div className="formComponents">
                    <label></label>
                    <div className="buttonClass">
                        <button type="submit">Login</button>
                        <button type="button" onClick={()=>navigate('/')}>Register</button>
                    </div>
                </div>
            </form>
            {error && <p className="message">{error}</p>}
        </div>
    )
}
export default Login;