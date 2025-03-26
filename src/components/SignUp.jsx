import React,{useState} from "react";
import {useNavigate} from "react-router-dom";
import axios from "axios";
function SignUp(){
    const navigate=useNavigate();
    const backend=import.meta.env.VITE_API_BACKEND;
    const[email,setEmail]=useState("");
    const[pass,setPass]=useState("");
    const[error,setError]=useState("");
    async function userRegister(e){
        e.preventDefault();
        try{
            const result=await axios.post(`${backend}/register`,{email,pass});
            setError(result.data.message);
            if(result.data.message==="user registered"){
                alert('Register Successful')
                navigate('/detailPage');
                localStorage.setItem("token",result.data.token);
            }else{
                alert('Try again');
            }
        }catch(err){
            setError(err.response?.data?.error || err.message || 'registration failed');
        }
    }
    return(
        <div className="container">
            <div className="name">
                <h2>Algo Root</h2>
            </div>
            <form onSubmit={userRegister} className="form">
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
                        <button type="button" onClick={()=>navigate('/login')}>Already have an Account...</button>
                        <button type="submit">Register</button>
                    </div>
                </div>
                {error && <p className="error">{error}</p>}
            </form>
            {error && <p className="message">{error}</p>}
        </div>
    )
}
export default SignUp;