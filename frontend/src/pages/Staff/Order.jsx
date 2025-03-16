import React, { useState } from "react";
import { useStaff } from "../../context/StaffContext";
import PaymentSuccess from "../../components/Payment/PaymentSuccess";
import CustomerForm from "../../components/Order/CustomerForm";
import OrderTable from "../../components/Order/OrderTable";
import toast from "react-hot-toast";

const Order = () => {
  // Customer state management
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  // Payment status state
  const [paymentStatus, setPaymentStatus] = useState({
    error: "",
    isSubmitting: false,
    isSuccess: false,
  });

  // Context hooks for products and total
  const { selectedProducts, setSelectedProducts, totalAmount } = useStaff();

  // Handle customer form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Form validation logic
  const validateForm = () => {
    if (selectedProducts.length === 0) return "Please select products";
    if (!customer.name.trim()) return "Please enter your name";
    if (!customer.phone.trim()) return "Please enter your phone number";
    return null;
  };

  // Main checkout handler
  const handleCheckOut = async () => {
    // Validate form inputs
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    // Validate total amount
    if (totalAmount <= 0) {
      toast.error("Invalid order total");
      return;
    }

    setPaymentStatus((prev) => ({ ...prev, isSubmitting: true, error: "" }));

    try {
      // Step 1: Create Razorpay order
      const orderResponse = await fetch(
        "http://localhost:3000/api/sale/pay",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            amount: totalAmount , 
            currency: "INR",
          }),
        }
      );

      // Handle order creation errors
      if (!orderResponse.ok) {
        const errorData = await orderResponse.json();
        throw new Error(errorData.message || 'Failed to create payment order');
      }

      const orderData = await orderResponse.json();

      // Step 2: Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID,
        amount: orderData.data.amount,
        currency: orderData.data.currency,
        name: "Point Of Sale",
        description: "Purchase Transaction",
        order_id: orderData.data.id, 
        handler: async (response) => {
          try {
            // Validate payment response parameters
            if (!response.razorpay_payment_id || 
                !response.razorpay_order_id || 
                !response.razorpay_signature) {
              throw new Error("Payment failed - missing transaction IDs");
            }

            // Step 3: Verify payment signature
            const verificationResponse = await fetch(
              "http://localhost:3000/api/sale/verify",
              {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({
                  // Match parameter names with backend expectations
                  razorpay_payment_id: response.razorpay_payment_id,
                  razorpay_order_id: response.razorpay_order_id,
                  razorpay_signature: response.razorpay_signature,
                }),
              }
            );

            // Handle verification errors
            if (!verificationResponse.ok) {
              const errorData = await verificationResponse.json();
              throw new Error(errorData.message || 'Verification failed');
            }

            const verificationData = await verificationResponse.json();

            if (verificationData.success) {
              // Step 4: Save sale record
              const saleData = {
                paymentId: response.razorpay_payment_id,
                totalAmount,
                customerName: customer.name,
                customerPhone: customer.phone,
                customerEmail: customer.email,
                products: selectedProducts
              };

              const saleResponse = await fetch("http://localhost:3000/api/sale/add", {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(saleData),
              });

              // Handle sale record errors
              if (!saleResponse.ok) {
                const errorData = await saleResponse.json();
                throw new Error(errorData.message || 'Failed to save sale record');
              }

              // Success handling
              setPaymentStatus((prev) => ({ ...prev, isSuccess: true }));
              toast.success("Payment successful!");
              localStorage.removeItem("cartItems");
              setSelectedProducts([]);
              setCustomer({ name: "", phone: "", email: "" });
            } else {
              throw new Error("Payment verification failed");
            }
          } catch (error) {
            console.log(error)
            toast.error(error.message);
            setPaymentStatus(prev => ({ ...prev, isSubmitting: false }));
          }
        },
        // Prefill customer details
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: { color: "#3399cc" },
        modal: {
          ondismiss: () => {
            setPaymentStatus((prev) => ({ ...prev, isSubmitting: false }));
            toast.error("Payment cancelled");
          },
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.error("Payment error:", error);
      toast.error(error.message || "Payment processing failed");
      setPaymentStatus(prev => ({
        ...prev,
        isSubmitting: false,
        error: error.message,
      }));
    }
  };

  // Order cancellation handler
  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel the order?")) {
      localStorage.removeItem("cartItems");
      setSelectedProducts([]);
      setCustomer({ name: "", phone: "", email: "" });
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm mx-auto">
      <h2 className="text-xl font-semibold mb-4">Current Order</h2>

      <OrderTable
        setSelectedProducts={setSelectedProducts}
        selectedProducts={selectedProducts}
      />

      {selectedProducts?.length > 0 && (
        <>
          <CustomerForm customer={customer} handleChange={handleChange} />
          <div className="mt-4 flex justify-end gap-4 flex-wrap">
            <button onClick={handleCancel} className="btn-danger">
              Cancel Order
            </button>

            <button
              onClick={handleCheckOut}
              className="btn-primary"
              disabled={paymentStatus.isSubmitting}
            >
              {paymentStatus.isSubmitting ? "Processing..." : "Checkout"}
            </button>
          </div>
        </>
      )}

      {/* Payment success modal */}
      {paymentStatus.isSuccess && (
        <PaymentSuccess
          customer={customer}
          products={selectedProducts}
          totalAmount={totalAmount}
          onClose={() => {
            localStorage.removeItem("cartItems");
            setSelectedProducts([]);
            setCustomer({ name: "", email: "", phone: "" });
            window.location.href = "/";
          }}
        />
      )}
    </div>
  );
};

export default Order;