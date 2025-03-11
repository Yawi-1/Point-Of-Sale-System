import React from 'react'
import { CardElement} from "@stripe/react-stripe-js";
import {
  LockClosedIcon,
  XMarkIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

const PaymentModal = ({totalAmount,onClose,error,onSubmit,stripe,isSubmitting}) => {
  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
    <div className="bg-gradient-to-br from-blue-900 to-blue-600 p-8 rounded-2xl w-[480px] shadow-2xl text-white relative">
      {/* Card-like decoration elements */}
      <div className="absolute top-6 right-6 flex space-x-2 opacity-75">
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
      {error && (
        <div className="flex items-center bg-red-100/20 p-3 mb-4 rounded-lg">
          <ExclamationCircleIcon className="w-5 h-5 mr-2 text-red-300" />
          <span className="text-red-300 text-sm">{error}</span>
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
                  fontSize: "16px",
                  color: "#ffffff",
                  "::placeholder": { color: "#a0aec0" },
                },
              },
            }}
          />
        </div>

        {/* Payment Button */}
        <button
          onClick={onSubmit}
          disabled={!stripe || isSubmitting}
          className="w-full py-4 bg-white/10 hover:bg-white/20 rounded-xl transition-all duration-200 flex items-center justify-center font-medium disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <span className="w-5 h-5 border-4 animate-spin rounded-full p-4 m-2 border-dashed"></span>
          ) : (
            <LockClosedIcon className="w-5 h-5 mr-2" />
          )}
          {isSubmitting ? "Processing Payment..." : "Confirm Payment"}
        </button>
      </div>

      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 p-2 hover:bg-white/10 rounded-full"
      >
        <XMarkIcon className="w-6 h-6" />
      </button>
    </div>
  </div>
  )
}

export default PaymentModal