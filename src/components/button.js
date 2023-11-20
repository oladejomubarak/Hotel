import React from "react"
import { useNavigate } from 'react-router-dom';

const Button = () => {
    const navigate = useNavigate()

    const navToBooking = () =>{
            navigate("/Bookings")
    }
    return (
        <button type="button" onClick={navToBooking} class="btn btn-danger w-25" disabled>CLICK ON ROOMS TO BOOK ROOM</button>
    );
}
export default Button;