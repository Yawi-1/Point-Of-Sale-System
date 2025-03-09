import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useStaff } from "../../context/StaffContext";
import { 
  LockClosedIcon,
  XMarkIcon,
  ExclamationCircleIcon,
  ArrowPathIcon 
} from "@heroicons/react/24/outline";
const Order = () => {
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
  });
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [paymentError, setPaymentError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { selectedProducts,setSelectedProducts, totalAmount } = useStaff();
  
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
  
  const handleCancel = ()=>{
     const response = confirm('Are you sure you want to cancel the order?');
     if(response){
      localStorage.removeItem('cartItems');
      setSelectedProducts([]);
      alert('Order canceled')
     }
  }

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
        className="bg-green-400 px-4 py-2 rounded-full float-end  m-4 w-[30%] text-white hover:bg-white hover:border-2 hover:border-green-400 hover:text-green-400"
      >
        Checkout
      </button>

      {selectedProducts.length > 0 && <button
        onClick={handleCancel}
        className="bg-red-400 px-4 py-2 rounded-full float-end m-4 w-[30%] text-white hover:bg-white hover:border-2 hover:border-red-400 hover:text-red-400"
      >
        Cancel
      </button>}
      

      {/* Payment Modal */}
      {showPaymentForm && (
  <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-gradient-to-br from-blue-900 to-blue-600 p-8 rounded-2xl w-[480px] shadow-2xl text-white relative">
      {/* Card-like decoration elements */}
      <div className="absolute top-6 right-6 flex space-x-2 opacity-75">
        <div className="w-12 h-8 bg-yellow-300 rounded-md" />
        <div className="w-12 h-8 bg-gray-200 rounded-md" />
      </div>
      
      <div className="mb-8">
        <h3 className="text-2xl font-bold mb-2">Payment Gateway</h3>
        <p className="opacity-80">Secure SSL encrypted payment</p>
      </div>

      {/* Amount Display */}
      <div className="bg-black/20 p-4 rounded-xl mb-6">
        <div className="text-sm opacity-80">Total Amount</div>
        <div className="text-3xl font-bold">₹{totalAmount}</div>
      </div>

      {/* Error Message */}
      {paymentError && (
        <div className="flex items-center bg-red-100/20 p-3 mb-4 rounded-lg">
          <ExclamationCircleIcon className="w-5 h-5 mr-2 text-red-300" />
          <span className="text-red-300 text-sm">{paymentError}</span>
        </div>
      )}

      {/* Card Input Section */}
      <div className="space-y-6">
        <div className="bg-white/10 p-4 rounded-xl">
          <CardElement 
            options={{
              hidePostalCode: true,
              style: {
                base: {
                  fontSize: '16px',
                  color: '#ffffff',
                  '::placeholder': { color: '#a0aec0' }
                }
              }
            }}
          />
        </div>

        {/* Payment Button */}
        <button
          onClick={handleSubmitPayment}
          disabled={!stripe || isSubmitting}
          className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <Spinner className="w-5 h-5 mr-2 animate-spin" />
          ) : (
            <LockClosedIcon className="w-5 h-5 mr-2" />
          )}
          {isSubmitting ? "Processing Payment..." : "Confirm Payment"}
        </button>
      </div>

      {/* Close Button */}
      <button
        onClick={() => setShowPaymentForm(false)}
        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>
    </div>
  </div>
)}
    </div>
  );
};

export default Order;
