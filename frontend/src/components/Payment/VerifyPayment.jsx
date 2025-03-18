import React from "react";

const VerifyPayment = () => {
  return (
    <div className="fixed inset-0 h-screen w-full bg-black/30 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="relative w-full max-w-2xl rounded-2xl shadow-2xl overflow-hidden">
        {/* Background Image with Overlay */}
        <div 
          className="absolute inset-0 bg-[url('/public/PaymentConfirmation.jpg')] bg-cover bg-center"
          style={{ backgroundImage: "url('/public/PaymentConfirmation.jpg')" }}
          loading="lazy"
        />
        <div className="absolute inset-0 bg-black/60" />
        
        {/* Content Container */}
        <div className="relative z-10 flex flex-col items-center gap-6 p-8 text-center">
          {/* Animated Header */} 
          <div className="space-y-4 animate-pulse-slow">
            <h1 className="text-3xl font-bold text-white drop-shadow-md">
              Please Wait a Moment
            </h1>
            <div className="h-1 w-12 mx-auto bg-yellow-400/80 rounded-full" />
          </div>

          {/* Status Text */}
          <p className="text-xl font-medium text-white/90 leading-relaxed">
            We're verifying your payment details with our secure gateway.
            This will just take a few seconds...
          </p>

          {/* Modern Spinner */}
          <div className="h-16 w-16 animate-spin rounded-full border-4 border-white/25 border-dashed" />

          {/* Additional Status Message */}
          <p className="text-sm font-medium text-white/80 mt-4">
            Do not close this window or refresh the page
          </p>
        </div>
      </div>
    </div>
  );
};

export default VerifyPayment;