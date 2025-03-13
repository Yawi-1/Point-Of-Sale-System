import React, { useState } from "react";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { useStaff } from "../../context/StaffContext";
import PaymentModal from "../../components/Payment/PaymentModal";
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
    showForm: false,
    error: "",
    isSubmitting: false, 
    isSuccess: false,
  });

  const { selectedProducts, setSelectedProducts, totalAmount } = useStaff();
  const stripe = useStripe();
  const elements = useElements();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCustomer((prev) => ({ ...prev, [name]: value }));
  };

  // Form validation before proceeding to checkout
  const validateForm = () => {
    if (selectedProducts.length === 0) return "Please select products";
    if (!customer.name.trim()) return "Please enter your name";
    if (!customer.phone.trim()) return "Please enter your phone number";
    return null;
  };

  const handleCheckOut = () => {
    const error = validateForm();
    if (error) {
      toast(error);
      return;
    }
    setPaymentStatus((prev) => ({ ...prev, showForm: true }));
  };

  const handleSubmitPayment = async () => {
    setPaymentStatus((prev) => ({ ...prev, isSubmitting: true, error: "" }));

    if (!stripe || !elements) return;

    const { name, phone, email } = customer;

    try {
      const response = await fetch("https://pos11.netlify.app/api/sale/pay", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: totalAmount * 100,
          receipt_email: email,
        }),
      });

      const data = await response.json();
      const { clientSecret } = data;

      if (!clientSecret) {
        setPaymentStatus((prev) => ({
          ...prev,
          error: "Failed to receive client secret. Please try again.",
          isSubmitting: false,
        }));
        return;
      }

      const { error, paymentIntent } = await stripe.confirmCardPayment(
        clientSecret,
        {
          payment_method: {
            card: elements.getElement(CardElement),
            billing_details: { name, phone },
          },
        }
      );

      if (error) {
        setPaymentStatus((prev) => ({
          ...prev,
          error: error.message,
          isSubmitting: false,
        }));
      } else {
        if (paymentIntent.status === "succeeded") {
          const { id } = paymentIntent;
          const saleData = {
            paymentId: id,
            totalAmount,
            customerName: name,
            customerPhone: phone,
            customerEmail: email,
            products: selectedProducts,
          };

         await fetch("https://pos11.netlify.app/api/sale/add", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("token")}`,
            },
            body: JSON.stringify(saleData),
          });
         
          setPaymentStatus((prev) => ({
            ...prev,
            showForm: false,
            isSuccess: true,
          }));
          toast('Payment successful');
          localStorage.removeItem("cartItems");
        } else {
          setPaymentStatus((prev) => ({
            ...prev,
            error: "Payment failed. Please try again.",
            isSubmitting: false,
          }));
        }
      }
    } catch (error) {
      setPaymentStatus((prev) => ({
        ...prev,
        error: "Something went wrong. Please try again later.",
        isSubmitting: false,
      }));
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
      })
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-sm max-w-4xl mx-auto">
      <h2 className="text-xl font-semibold mb-4">Current Order</h2>

      {/* Render the order table */}
      <OrderTable setSelectedProducts={setSelectedProducts} selectedProducts={selectedProducts} />

      {/* Render the customer form */}
      <CustomerForm customer={customer} handleChange={handleChange} />

      <div className="mt-4 flex justify-end gap-4 flex-wrap">
        {selectedProducts?.length > 0 && (
          <button onClick={handleCancel} className="btn-danger">
            Cancel Order
          </button>
        )}
        <button onClick={handleCheckOut} className="btn-primary">
          Checkout
        </button>
      </div>

      {/* Payment Modal for Stripe */}
      {paymentStatus.showForm && (
        <PaymentModal
          totalAmount={totalAmount}
          error={paymentStatus.error}
          isSubmitting={paymentStatus.isSubmitting}
          onClose={() =>
            setPaymentStatus((prev) => ({
              ...prev,
              showForm: false,
              isSubmitting: false,
            }))
          }
          onSubmit={handleSubmitPayment}
          stripe={stripe}
        />
      )}

      {/* Payment Success Modal */}
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
            window.location.href='/';
          }}
        />
      )}
    </div>
  );
};

export default Order;
