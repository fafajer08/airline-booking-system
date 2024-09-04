// import Banner from "../components/Banner";
// import Highlights from "../components/Highlights";
// import Course from "../components/Course"
import React from 'react';
import NavBar from "../components/NavBar";
import Carousel from "../components/Carousel";
import { BackButton, ContinueButton, SubmitButton } from '../components/Buttons';


export default function Payment() {
  return (
    <div>
    <NavBar />
      <div className="container">
        <h5 className="" > How would you like to pay?</h5>
        <h2 className="">Payment Method</h2>
        <div className='px-5 py-3'>
              <div>
                  <h3>Credit or Debit Card</h3>
              </div>
              <div className=''>
                  <input className='' type="radio" name="paymentMethod" id="creditCard" value="alipay" />
                  <label className='px-5 py-3'for="creditCard">Credit, Debit or Prepaid Cards</label>
              </div>

        </div>


        <div className='px-5 py-3'>
              <div>
                <h3>E-Wallet</h3>
              </div>
              <div className=''>
                  <input className='' type="radio" name="paymentMethod" id="creditCard" value="alipay" />
                  <label className='px-5 py-3'for="creditCard">Alipay</label>
              </div>
              <div>
                  <input type="radio" name="paymentMethod" id="creditCard" value="applepay" />
                  <label className='px-5 py-3' for="creditCard">Apple Pay</label>
              </div>
              <div>
                  <input type="radio" name="paymentMethod" id="creditCard" value="googlepay" />
                  <label className='px-5 py-3' for="creditCard">Google Pay</label>
              </div>
              <div>
                  <input type="radio" name="paymentMethod" id="creditCard" value="paypal" />
                  <label className='px-5 py-3' for="creditCard">Paypal</label>
              </div>
        </div>
        
        <div>
          <p>By click ‘Continue’ button below, I confirm that I have read, understood, and accept all the Conditions set by the airline. </p>
        </div>

        <div className='d-flex '>
            <div className='ms-auto'>
              <BackButton link="http://localhost:3000/guestdetails" />
              <SubmitButton />
            </div>
        </div>
      </div>
    </div>
  );
}