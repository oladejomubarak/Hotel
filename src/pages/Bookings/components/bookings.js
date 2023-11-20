import React from "react";
import "../style/style.css";
import axios, { HttpStatusCode } from "axios";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const Bookings = () => {
  const [minDate, setMinDate] = useState(() => {
    const today = new Date().toISOString().split("T")[0];
    return today;
  });

  // cancel booking api
  const [cancelData, setCancelData] = useState({
    guestId: "",
  });
  const [cancelResponse, setCancelResponse] = useState("");

  const location = useLocation();
  const roomTyp = location.state.room;
  const roomPrice = location.state.amount;

  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmitCancel = (e) => {
    e.preventDefault();
    try {
      axios
        .delete(
          "https://capstonehotels-production.up.railway.app/capstoneHotels/cancelBooking/"+
            cancelData.guestId,
          cancelData
        )
        .then((response) => {
          console.log(response.data);
          setCancelResponse(response.data.data.message);
          alert(response.data.data.message);
        });
    } catch (error) {
      console.log(error.response);
    }
  };

  const handleChangeCancel = (event) => {
    const { name, value } = event.target;
    setCancelData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  // booking api
  const [userData, setUserData] = useState({
    name: "",
    amount: "",
    description: "",
  });

  const [bookingData, setBookingData] = useState({
    firstName: "",
    lastName: "",
    emailAddress: "",
    checkinDate: "",
    checkoutDate: "",
    telephoneNumber: "",
    roomType: "",
  });

  const [paymentDetails, setPaymentDetails] = useState({
    fullName: "",
    amount: roomPrice,
    phoneNumber: "",
  });
  const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const validNumber = /^\d{11}$/;
  const validName = /^[a-zA-Z]+(([a-zA-Z ])?[a-zA-Z]*)*$/;

  const [emailError, setEmailError] = useState("");
  const [phoneError, setPhoneError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [bookingSuccess, setBookingSuccess] = useState("");
  const [bookingError, setBookingError] = useState("");
  const [descError, setDescError] = useState("");
  const [paymentSuccess, setPaymentSuccess] = useState("");
  const [paymentError, setPaymentError] = useState("");
  const [checkDate, setCheckDate] = useState("");

  const approveMessage = () => {
    setSuccessMessage("Successful");
  };

  const validate = () => {
    if (!validName.test(bookingData.firstName)) {
      setErrorMessage("Invalid name!!");
    } else {
      setErrorMessage("");
    }
    if (!validName.test(bookingData.lastName)) {
      setErrorMessage("Invalid name!!");
    } else {
      setErrorMessage("");
    }

    if (!validEmail.test(bookingData.emailAddress)) {
      setEmailError("invalid email!!");
    } else {
      setEmailError("");
    }
    if (!validNumber.test(bookingData.telephoneNumber)) {
      setPhoneError("invalid phone number!!");
    } else {
      setPhoneError("");
    }
    if (bookingData.checkoutDate < bookingData.checkinDate) {
      setCheckDate("invalid booking date");
    } else {
      setCheckDate("");
    }
  };

  const handleSubmit2 = (e) => {
    bookingData.roomType = roomTyp;
    validate();
    approveMessage();
    e.preventDefault();
    if (bookingData.checkoutDate > bookingData.checkinDate) {
      try {
        axios
          .post("https://capstonehotels-production.up.railway.app/capstoneHotels/bookRoom", bookingData)
          .then((response) => {
            if (response.status === HttpStatusCode.Ok) {
              setBookingSuccess(
                "Room has been booked successfully, please proceed to payment"
              );
            } else {
              setBookingSuccess("");
              setBookingError("An error occured,try again!!");
            }

            console.log(response.data);
            setCancelData(response.data.guestId);
          });
        console.log(bookingData);
        // console.log(userData)
      } catch (error) {
        console.log(error.response);
      }
    }
    setPaymentDetails({
      fullName: bookingData.firstName + " " + bookingData.lastName,
      phoneNumber: bookingData.telephoneNumber,
    });
    setBookingData({
      firstName: "",
      lastName: "",
      emailAddress: "",
      checkinDate: "",
      checkoutDate: "",
      telephoneNumber: "",
      roomType: bookingData.roomType,
    });
  };

  const handleChange2 = (event) => {
    const { name, value } = event.target;
    setBookingData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };
  //Payment api

  // const [amountError,setAmountError] = useState("")

  const validatePayment = () => {
    // if(userData.name != bookingData.firstName && userData.name != bookingData.lastName){
    //     setPaymentError("name must match the one used for booking!!")
    // }else{
    //   setPaymentError("")
    // }
    // if(userData.description !== typeof(String)){
    //   setDescError("this is an invalid description")
    // }else{
    //   setDescError("")
    // }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    try {
      axios.post(
        "https://capstonehotels-production.up.railway.app/capstoneHotels/makePayment/" +
          paymentDetails.phoneNumber,
        userData
      );
      // .then((response) => {
      //   console.log(response)
      //   if(response.status === HttpStatusCode.Ok){
      //     setPaymentSuccess("payment made successfully")
      //   }else{
      //     setPaymentSuccess("")
      //     setPaymentError("something went wrong,try again!!")
      //   }
      //   console.log(response.data);
      // });
      alert("Payment succesful. Please check your email for your booking Id");
    } catch (error) {
      console.log(error.response);
    }
    setPaymentDetails({
      fullName: "",
      amount: "",
    });
  };
  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserData((prevData) => {
      return {
        ...prevData,
        [name]: value,
      };
    });
  };
  return (
    <div className="container pt-7">
      <div className="row justify-content-md-center">
        <div className="card col-lg-8 col-md-8 col-sm-12">
          <h5>Enter Guest Information</h5>
          <p>Please fill out all the forms</p>
          <form
            className="needs-validation"
            onSubmit={handleSubmit2}
            novalidate
          >
            <div className="mb-3 ">
              <label htmlFor="validationTooltip01" className="form-label">
                First Name
              </label>
              <input
                minLength={4}
                name="firstName"
                type="text"
                className="form-control"
                id="validationTooltip01"
                placeholder="Doris"
                value={bookingData.firstName}
                onChange={handleChange2}
                required
              />
              <p className="error">{errorMessage}</p>
            </div>
            <div className="mb-3">
              <label htmlfor="validationTooltip02" className="form-label">
                Last Name
              </label>
              <input
                minLength={4}
                name="lastName"
                type="text"
                placeholder="Olamide"
                className="form-control"
                id="validationTooltip02"
                value={bookingData.lastName}
                onChange={handleChange2}
                required
              />
              <p className="error">{errorMessage}</p>
            </div>
            <div className="mb-3">
              <label className="form-label">Email address</label>

              <input
                name="emailAddress"
                type="text"
                className="form-control "
                id="email"
                placeholder="doris@gmail.com"
                aria-describedby="email"
                value={bookingData.emailAddress}
                onChange={handleChange2}
                required
              />
              <p className="error">{emailError}</p>
              {/* <div id="email" className="form-text">We'll never share your email with anyone else.</div> */}
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input
                minLength={13}
                name="telephoneNumber"
                type="number"
                placeholder="+2348145095567"
                className="form-control"
                id="telephone"
                value={bookingData.telephoneNumber}
                onChange={handleChange2}
                required
              />
              <p className="pt-3 error">{phoneError}</p>
            </div>
            {/* <div className="col-4 my-4">
              <div className="dropdown">
                <button
                  className="btn btn-light shadow-lg dropdown-toggle fs-5 fw-3"
                  type="button"
                  id="dropdownMenuButton"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  Room types
                </button>
                <ul
                  className="dropdown-menu"
                  aria-labelledby="dropdownMenuButton1"
                >
                  <li>
                    <a
                      className="dropdown-item"
                      href="Single"
                      value={bookingData.roomType}
                      onChange={handleChange2}
                    >
                      Single room
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href=".."
                      value={bookingData.roomType}
                      onChange={handleChange2}
                    >
                      Double room
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href=".."
                      value={bookingData.roomType}
                      onChange={handleChange2}
                    >
                      Family room
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href=".."
                      value={bookingData.roomType}
                      onChange={handleChange2}
                    >
                      Executive room
                    </a>
                  </li>
                  <li>
                    <a
                      className="dropdown-item"
                      href=".."
                      value={bookingData.roomType}
                      onChange={handleChange2}
                    >
                      Apartment
                    </a>
                  </li>
                </ul>
              </div>
            </div> */}
            <label className="form-label">Room Type</label>
            <input
              name="roomType"
              type="text"
              className="form-control"
              id="roomType"
              placeholder="SINGLE"
              aria-describedby="roomType"
              value={roomTyp}
              onChange={handleChange2}
              required
            />
            <div className="form-group mb-3">
              <label>Check-in Date:</label>
              <input
                type="date"
                className="form-control"
                id="checkin"
                min={minDate}
                name="checkinDate"
                value={bookingData.checkinDate}
                onChange={handleChange2}
                required
              />
            </div>
            <div className="form-group mb-3">
              <label>Check-out Date:</label>
              <input
                type="date"
                className="form-control"
                id="checkout"
                min={minDate}
                name="checkoutDate"
                value={bookingData.checkoutDate}
                onChange={handleChange2}
                required
              />
              <p className="pt-3 error">{checkDate}</p>
            </div>

            <button type="submit" className="btn btn-danger">
              Proceed to pay
            </button>
            <p className="success">{bookingSuccess}</p>
            <p className="error">{bookingError}</p>
          </form>
          <div className="mt-5"></div>
          {/* <h5>Enter Second Guest Information</h5>
          <p>Please fill out all the forms</p>
          <form>
            <div className="mb-3">
              <label className="form-label">First Name</label>
              <input type="text" className="form-control" id="firstName" />
            </div>
            <div className="mb-3">
              <label className="form-label">Last Name</label>
              <input type="text" className="form-control" id="lastName" />
            </div>
            <div className="mb-3">
              <label className="form-label">Email address</label>
              <input
                type="email"
                className="form-control"
                id="inputEmail"
                aria-describedby="email"
              />
              <div id="email" className="form-text">
                We'll never share your email with anyone else.
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Phone Number</label>
              <input type="number" class="form-control" id="phoneNumber2" />
            </div>
            <div className="dropdown mb-3">
              <button
                className="btn btn-light shadow-lg dropdown-toggle fs-5 fw-3"
                type="button"
                id="dropdownMenuButton1"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Room types
              </button>
              <ul
                className="dropdown-menu"
                aria-labelledby="dropdownMenuButton1"
              >
                <li>
                  <a className="dropdown-item" href="/">
                    Single room
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/">
                    Double room
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/">
                    Family room
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/">
                    Executive room
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="/">
                    Apartment
                  </a>
                </li>
              </ul>
            </div>

            <button type="submit" className="btn btn-danger mb-3">
              Proceed to pay
            </button>
          </form> */}
        </div>
        <div className="col-lg-4 col-md-4 col-sm-12">
          <div className="row ">
            <div className="card col-12">
              <h5>Reservation summary</h5>
              <div className="summary row">
                <div className="text-part col-12"></div>
                <div className="price col-12">
                  <p>Rooms and offer</p>
                </div>
              </div>
            </div>
            <div className="card col-12 mt-5">
              <h5>Payment Detail</h5>
              <form
                className="needs-validation"
                onSubmit={handleSubmit}
                novalidate
              >
                <div className="row">
                  <div className="col-12 mb-3">
                    <label className="form-label">Name</label>
                    <input
                      name="name"
                      type="text"
                      className="form-control"
                      id="fname"
                      value={paymentDetails.fullName}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">Amount</label>
                    <input
                      name="amount"
                      type="number"
                      className="form-control"
                      id="amount"
                      value={paymentDetails.amount}
                      onChange={handleChange}
                      required
                    />
                    {/* <div className="error">{amountError}</div> */}
                  </div>
                  <div className="col-6 mb-3">
                    <label className="form-label">Description</label>
                    <input
                      name="description"
                      type="text"
                      className="form-control"
                      id="desc"
                      value={userData.description}
                      onChange={handleChange}
                      required
                    />
                    <div className="error">{descError}</div>
                  </div>
                </div>

                <button type="submit" className="btn btn-danger mb-3">
                  Pay Now
                </button>
                <p className="success">{paymentSuccess}</p>
                <p className="error">{paymentError}</p>
              </form>
            </div>
            {/* cancel booking */}
            <div className="card col-12 mt-5">
              <h5>Cancel Booking / Update Booking</h5>
              <p className="text-danger">
                Note that there is no refund when you cancel booking!!
              </p>
              <form className="needs-validation" onSubmit={handleSubmitCancel}>
                <div className="row">
                  <div className="col-12 mb-3 ">
                    <label className="form-label">Guest id</label>
                    <input
                      name="guestId"
                      type="text"
                      className="form-control"
                      id="guestId"
                      value={setCancelData.guestId}
                      onChange={handleChangeCancel}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn btn-danger mb-3">
                  Cancel Booking
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default Bookings;
