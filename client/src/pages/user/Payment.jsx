import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import { 
  Upload, 
  CheckCircle, 
  AlertCircle, 
  Loader2,
  CreditCard,
  Building2,
  Wallet,
  Image as ImageIcon
} from "lucide-react";
import orderService from "../../services/orderService";

const Payment = () => {
  const navigate = useNavigate();
  const { token }= useParams();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);

  // Bank account details (move to env/config if needed)
  const bankAccounts = [
    { name: "BCA", accountNumber: "1234567890", accountName: "Toko Boneka Lucu" },
    { name: "Mandiri", accountNumber: "0987654321", accountName: "Toko Boneka Lucu" },
    { name: "BNI", accountNumber: "5555666677", accountName: "Toko Boneka Lucu" },
  ];

  // Load order details
  useEffect(() => {
    loadOrderDetails();
  }, [token]);

  const loadOrderDetails = async () => {
    try {
      setLoading(true);
      const data = await orderService.getOrderByToken(token);
      setOrder(data?.data);

      if (data.payment_status === "paid") {
        navigate(`/orders/${token}`);
      }
    } catch (err) {
      console.error("Error loading order:", err);
      setError("Failed to load order details");
    } finally {
      setLoading(false);
    }
  };

  // Handle file selection
  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const validTypes = ["image/jpeg", "image/jpg", "image/png", "image/webp"];
    if (!validTypes.includes(file.type)) {
      alert("Please select a valid image file (JPEG, PNG, or WebP)");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      alert("File size must be less than 5MB");
      return;
    }

    setSelectedFile(file);

    const reader = new FileReader();
    reader.onloadend = () => setPreviewUrl(reader.result);
    reader.readAsDataURL(file);
  };

  // Upload payment proof
  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select a payment proof image");
      return;
    }

    try {
      setUploading(true);
      setError(null);

      await orderService.uploadPaymentProof(token, selectedFile);

      setSuccess(true);
      setTimeout(() => {
        navigate(`/orders/${token}`);
      }, 2000);
    } catch (err) {
      console.error("Error uploading payment proof:", err);
      setError(err.response?.data?.message || "Failed to upload payment proof");
    } finally {
      setUploading(false);
    }
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("Account number copied to clipboard!");
  };

  // ================== UI States ==================
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50">
        <Navbar currentPage="payment" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-pink-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">Loading payment details...</p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error && !order) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50">
        <Navbar currentPage="payment" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <AlertCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
            <p className="text-red-600 font-semibold mb-4">{error}</p>
            <button
              onClick={() => navigate("/order-list")}
              className="px-6 py-3 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600"
            >
              Back to Orders
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50">
        <Navbar currentPage="payment" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center bg-white p-8 rounded-3xl shadow-lg max-w-md">
            <CheckCircle className="w-20 h-20 text-green-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-gray-800 mb-3">
              Payment Proof Uploaded!
            </h2>
            <p className="text-gray-600 mb-6">
              Your payment proof has been submitted successfully.
              Our admin will verify it shortly.
            </p>
            <div className="text-sm text-gray-500">
              Redirecting to order details...
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // ================== Main Layout ==================
  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50">
      <Navbar currentPage="payment" />

      <div className="container mx-auto px-6 py-8 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-pink-600 to-cyan-500 bg-clip-text text-transparent mb-2 flex items-center gap-3">
            <CreditCard className="w-10 h-10 text-pink-500" />
            Payment Confirmation
          </h1>
          <p className="text-gray-600">Order #{order?.order_number}</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Payment Instructions */}
          <div className="space-y-6">
            {/* Order Summary */}
            <div className="bg-white rounded-3xl shadow-md p-6 border-2 border-pink-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between text-gray-700">
                  <span>Order Number</span>
                  <span className="font-semibold">{order?.order_number}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Total Amount</span>
                  <span className="font-bold text-pink-600 text-xl">
                    Rp {parseFloat(order?.total_amount || 0).toLocaleString("id-ID")}
                  </span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Payment Method</span>
                  <span className="font-semibold">{order?.payment_method || "Bank Transfer"}</span>
                </div>
                <div className="flex justify-between text-gray-700">
                  <span>Status</span>
                  <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-sm font-semibold">
                    {order?.payment_status}
                  </span>
                </div>
              </div>
            </div>

            {/* Bank Accounts */}
            <div className="bg-white rounded-3xl shadow-md p-6 border-2 border-pink-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Building2 className="w-6 h-6 text-pink-500" />
                Bank Account Details
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Please transfer to one of the following bank accounts:
              </p>
              <div className="space-y-4">
                {bankAccounts.map((bank, index) => (
                  <div
                    key={index}
                    className="p-4 bg-gradient-to-br from-pink-50 to-cyan-50 rounded-2xl border-2 border-pink-200"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="font-bold text-gray-800">{bank.name}</span>
                      <Wallet className="w-5 h-5 text-cyan-500" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Account Number:</span>
                        <button
                          onClick={() => copyToClipboard(bank.accountNumber)}
                          className="font-mono font-bold text-pink-600 hover:text-pink-700 text-sm"
                        >
                          {bank.accountNumber} 📋
                        </button>
                      </div>
                      <div className="text-sm text-gray-600">
                        Account Name: <span className="font-semibold">{bank.accountName}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-gradient-to-br from-cyan-50 to-pink-50 rounded-3xl shadow-md p-6 border-2 border-cyan-200">
              <h3 className="font-bold text-gray-800 mb-3">Payment Instructions:</h3>
              <ol className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="font-bold text-pink-500">1.</span>
                  <span>Transfer the exact amount to one of the bank accounts above</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-pink-500">2.</span>
                  <span>Take a screenshot or photo of the transfer receipt</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-pink-500">3.</span>
                  <span>Upload the payment proof using the form on the right</span>
                </li>
                <li className="flex gap-2">
                  <span className="font-bold text-pink-500">4.</span>
                  <span>Wait for admin verification (usually within 24 hours)</span>
                </li>
              </ol>
            </div>
          </div>

          {/* Upload Form */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl shadow-md p-6 border-2 border-pink-100">
              <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Upload className="w-6 h-6 text-pink-500" />
                Upload Payment Proof
              </h2>

              {error && (
                <div className="mb-4 p-4 bg-red-50 border-2 border-red-200 rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-5 h-5 text-red-500" />
                  <span className="text-red-700 text-sm">{error}</span>
                </div>
              )}

              <div className="mb-6">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Select Payment Proof Image
                </label>
                <input
                  type="file"
                  accept="image/jpeg,image/jpg,image/png,image/webp"
                  onChange={handleFileSelect}
                  disabled={uploading}
                  className="w-full px-4 py-3 border-2 border-pink-200 rounded-xl focus:outline-none focus:border-cyan-400 disabled:opacity-50 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-pink-100 file:text-pink-700 file:font-semibold hover:file:bg-pink-200"
                />
                <p className="text-xs text-gray-500 mt-2">
                  Accepted formats: JPEG, PNG, WebP (Max 5MB)
                </p>
              </div>

              {previewUrl && (
                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Preview
                  </label>
                  <div className="rounded-2xl overflow-hidden border-2 border-pink-200">
                    <img
                      src={previewUrl}
                      alt="Payment proof preview"
                      className="w-full h-64 object-contain bg-gray-50"
                    />
                  </div>
                </div>
              )}

              <button
                onClick={handleUpload}
                disabled={!selectedFile || uploading}
                className="w-full py-4 bg-gradient-to-r from-pink-500 to-cyan-500 text-white rounded-2xl font-bold text-lg hover:from-pink-600 hover:to-cyan-600 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2"
              >
                {uploading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="w-5 h-5" />
                    Upload Payment Proof
                  </>
                )}
              </button>

              <p className="text-xs text-center text-gray-500 mt-4">
                By uploading, you confirm that the payment has been made
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-100 to-cyan-100 rounded-2xl shadow-md p-6 border-2 border-pink-200">
              <h3 className="font-bold text-gray-800 mb-3 flex items-center gap-2">
                <ImageIcon className="w-5 h-5 text-pink-500" />
                Tips for Good Payment Proof:
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex gap-2">
                  <span className="text-pink-500">✓</span>
                  <span>Make sure the image is clear and readable</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-500">✓</span>
                  <span>Include transaction date, time, and amount</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-500">✓</span>
                  <span>Show the recipient's account number</span>
                </li>
                <li className="flex gap-2">
                  <span className="text-pink-500">✓</span>
                  <span>Ensure good lighting when taking photo</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Payment;
