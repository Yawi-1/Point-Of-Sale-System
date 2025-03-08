import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useStaff } from "../../context/StaffContext";
const Order = () => {
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { selectedProducts, totalAmount } = useStaff();
  
  const stripe = useStripe();
  const elements = useElements();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const handleCheckOut = async () => {
    if (selectedProducts.length === 0) {
      alert("Please select products");
      return;
    }
    if (!customer.name) {
      alert("Please enter your name");
      return;
    }
    if (!customer.phone) {
      alert("Please enter your phone");
      return;
    }
   
    setShowPaymentForm(true);
  };

  const handleSubmitPayment = async () => {
    setIsSubmitting(true);
    setPaymentError("");
  
    if (!stripe || !elements) {
      return;
    }
  
    const { name, phone } = customer;
  
    try {
      const response = await fetch("http://localhost:5000/api/sale/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount * 100,
        }),
      });
  
      const data = await response.json();
      console.log(data)
      const { clientSecret } = data;
  
      if (!clientSecret) {
        setPaymentError("Failed to receive client secret. Please try again.");
        setIsSubmitting(false);
        return;
      }
  
      // Confirm the payment using Stripe
      const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: {
            name,
            phone,
          },
        },
      });
  
      if (error) {
        setPaymentError(error.message);
        console.log(error);
        setIsSubmitting(false);
      } else {
        // Now, we get the status of the paymentIntent here
        if (paymentIntent.status === "succeeded") {
          alert("Payment Successful!");
          const {id} = paymentIntent;
          const formData = new FormData();
          formData.append('paymentId', id);
          formData.append('totalAmount', totalAmount);
          formData.append('customerName', name);
          formData.append('customerPhone', phone);
          formData.append('products', selectedProducts);
          const response = await fetch('http://localhost:5000/api/sale/add',{
            method: 'POST',
            headers:{
              'Content-Type': 'application/json',
              'Authorization' : `Bearer ${localStorage.getItem('token')}`,

            },
            body: formData
          });
          console.log(response)
          setShowPaymentForm(false); 
        } else {
          setPaymentError("Payment failed. Please try again.");
        }
      }
    } catch (error) {
      setPaymentError("Something went wrong. Please try again later.");
      setIsSubmitting(false);
    }
  };
  

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Current Order</h2>
      <div className="space-y-4">
        {selectedProducts && selectedProducts.length > 0 ? (
          <table className="w-full text-center">
            <thead className="border-b-2 px-2 p-4">
              <tr>
                <th>S.No</th>
                <th>Name</th>
                <th>Price</th>
                <th>Quantity</th>
              </tr>
            </thead>
            <tbody>
              {selectedProducts.map((product, idx) => (
                <tr key={product._id} className="border-b-2 p-2">
                  <td>{idx + 1}.</td>
                  <td>{product.productName}</td>
                  <td>{product.productPrice}</td>
                  <td>{product.quantity}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <div className="bg-gray-50 p-3 rounded-lg">No items in cart</div>
        )}

        <div className="space-y-2">
          <input
            type="text"
            placeholder="Customer Name"
            className="w-full p-2 border rounded-lg"
            name="name"
            value={customer.name}
            onChange={handleChange}
          />
          <input
            type="tel"
            placeholder="Phone Number"
            className="w-full p-2 border rounded-lg"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
          />
        </div>
        <div className="space-y-2">
          <div className="flex justify-between font-bold">
            <span>Total: </span>
            <span>₹{totalAmount}</span>
          </div>
        </div>
      </div>

      <button
        onClick={handleCheckOut}
        className="bg-green-400 px-4 py-2 rounded-full float-right m-4 w-[30%] text-white hover:bg-white hover:border-2 hover:border-green-400 hover:text-green-400"
      >
        Checkout
      </button>

      {/* Payment Modal */}
      {showPaymentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-[400px]">
            <h3 className="text-xl font-semibold mb-4">Complete Payment</h3>

            {/* Show Error Message */}
            {paymentError && (
              <div className="bg-red-100 text-red-800 p-3 mb-4 rounded">
                {paymentError}
              </div>
            )}

            <div className="space-y-4">
              {/* Stripe Card Element */}
              <CardElement options={{ hidePostalCode: true }} />

              <button
                onClick={handleSubmitPayment}
                disabled={!stripe || isSubmitting}
                className="bg-blue-400 px-4 py-2 rounded-full w-full text-white hover:bg-white hover:border-2 hover:border-blue-400 hover:text-blue-400"
              >
                {isSubmitting ? "Processing..." : "Pay Now"}
              </button>
            </div>

            <button
              onClick={() => setShowPaymentForm(false)}
              className="mt-4 w-full py-2 text-center text-gray-600 bg-gray-200 rounded-full hover:bg-gray-300"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Order;
