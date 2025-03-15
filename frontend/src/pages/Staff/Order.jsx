import React, { useState } from "react";
import { useStaff } from "../../context/StaffContext";
import PaymentSuccess from "../../components/Payment/PaymentSuccess";
import CustomerForm from "../../components/Order/CustomerForm";
import OrderTable from "../../components/Order/OrderTable";
import toast from "react-hot-toast";

const Order = () => {
  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    email: "",
  });

  const [paymentStatus, setPaymentStatus] = useState({
    error: "",
    isSubmitting: false,
    isSuccess: false,
  });

  const { selectedProducts, setSelectedProducts, totalAmount } = useStaff();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    if (selectedProducts.length === 0) return "Please select products";
    if (!customer.name.trim()) return "Please enter your name";
    if (!customer.phone.trim()) return "Please enter your phone number";
    return null;
  };

  const handleCheckOut = async () => {
    const error = validateForm();
    if (error) {
      toast.error(error);
      return;
    }

    setPaymentStatus((prev) => ({ ...prev, isSubmitting: true, error: "" }));

    try {
      // Create Razorpay order
      const orderResponse = await fetch(
        "http://localhost:3000/api/sale/pay",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({
            amount: totalAmount * 100, 
            currency: "INR",
          }),
        }
      );
      const orderData = await orderResponse.json();

      // Initialize Razorpay payment
      const options = {
        key: import.meta.env.VITE_APP_RAZORPAY_KEY_ID,
        amount: orderData.amount,
        currency: orderData.currency,
        name: "Point Of Sale ",
        description: "Purchase Transaction",
        order_id: orderData.id,
        handler: async (response) => {
          // Verify payment signature
          const verificationResponse = await fetch(
            "http://localhost:3000/api/sale/verify",
            {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify({
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_signature: response.razorpay_signature,
              }),
            }
          );

          const verificationData = await verificationResponse.json();
          console.log(verificationData)

          if (verificationData.success) {
            // Save sale record
            const saleData = {
              paymentId: response.razorpay_payment_id,
              totalAmount,
              customerName: customer.name,
              customerPhone: customer.phone,
              customerEmail: customer.email,
              products: selectedProducts,
            };

            await fetch("http://localhost:3000/api/sale/add", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("token")}`,
              },
              body: JSON.stringify(saleData),
            });

            // Update state and clear cart
            setPaymentStatus((prev) => ({ ...prev, isSuccess: true }));
            toast.success("Payment successful!");
            localStorage.removeItem("cartItems");
            setSelectedProducts([]);
            setCustomer({ name: "", phone: "", email: "" });
          } else {
            toast.error("Payment verification failed");
          }
        },
        prefill: {
          name: customer.name,
          email: customer.email,
          contact: customer.phone,
        },
        theme: {
          color: "#3399cc",
        },
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
      console.log(error)
      toast.error(error.message || "Payment processing failed");
      setPaymentStatus((prev) => ({
        ...prev,
        isSubmitting: false,
        error: error.message,
      }));
    } finally {
      setPaymentStatus((prev) => ({ ...prev, isSubmitting: false }));
    }
  };

  const handleCancel = () => {
    if (window.confirm("Are you sure you want to cancel the order?")) {
      localStorage.removeItem("cartItems");
      setSelectedProducts([]);
      setCustomer({
        name: "",
        phone: "",
        email: "",
      });
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

      {paymentStatus.isSuccess && (
        <PaymentSuccess
          customer={customer}
          products={selectedProducts}
          totalAmount={totalAmount}
          onClose={() => {
            localStorage.removeItem("cartItems");
            setSelectedProducts([]);
            setCustomer({
              name: "",
              email: "",
              phone: "",
            });
            window.location.href = "/";
          }}
        />
      )}
    </div>
  );
};

export default Order;