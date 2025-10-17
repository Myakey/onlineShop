import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

//REACT COMPONENTS
import Navbar from "../components/layout/Navbar";
import Footer from "../components/layout/Footer";
import OrderAddress from "../components/order/OrderAddress";
import OrderProducts from "../components/order/OrderProducts";
import OrderShipping from "../components/order/OrderShipping";
import OrderPayment from "../components/order/OrderPayment";
import OrderVoucher from "../components/order/OrderVoucher";
import OrderSummary from "../components/order/OrderSummary";

//API SERVICES
import authService from "../services/authService";
import kurirService from "../services/kurirService";
import orderService from "../services/orderService";

//ICONS
import { Loader2 } from "lucide-react";
import { useCart } from "../context/cartContext";

/**
 * Preferences and keywords (case-insensitive checks)
 */
const PREFERRED_COURIER_CODES = [
  "jne",
  "jnt",
  "sicepat",
  "anteraja",
  "pos",
  "tiki",
  "lion",
  "ninja",
  "ide",
];

const REGULAR_SERVICE_KEYWORDS = [
  "REG",
  "EZ",
  "STANDARD",
  "STD",
  "EKONOMIS",
  "REGULER",
  "REGULAR SERVICE",
];

const PREMIUM_SERVICE_KEYWORDS = ["NEXTDAY", "ONS", "BEST", "BOSSPACK"];

const Order = () => {
  const navigate = useNavigate();

  const { removeProduct } = useCart();

  // Loading & error states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingShipping, setIsLoadingShipping] = useState(false);
  const [error, setError] = useState(null);

  // Addresses and selection
  const [addresses, setAddresses] = useState([]);
  const [selectedAddress, setSelectedAddress] = useState(null);

  // Cart products
  const [products, setProducts] = useState([]);

  // Shipping options & selection
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);

  // Payments
  const [paymentMethods] = useState([
    { id: 1, name: "Transfer Bank" },
    { id: 2, name: "COD (Bayar di Tempat)" },
    { id: 3, name: "E-Wallet (OVO, GoPay, DANA)" },
  ]);
  const [selectedPayment, setSelectedPayment] = useState(paymentMethods[0]);

  // Voucher
  const [voucher, setVoucher] = useState("");

  /**
   * Load order data (cart + user profile)
   */
  const loadOrderData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Read checkout data from sessionStorage
      const checkoutDataRaw = sessionStorage.getItem("checkoutData");
      if (!checkoutDataRaw) {
        setError("No items selected for checkout");
        navigate("/cart");
        return;
      }

      const checkoutData = JSON.parse(checkoutDataRaw);

      // Profile (addresses)
      const profileResponse = await authService.getProfile();
      const user = profileResponse?.user || {};
      const rawAddresses = Array.isArray(user.addresses) ? user.addresses : [];

      const formattedAddresses = rawAddresses.map((addr) => ({
        id: addr.address_id,
        title: addr.label || "Alamat",
        name: addr.recipient_name || "",
        phone: addr.phone_number || "",
        text: [
          addr.street_address || "",
          addr.district?.district_name || "",
          addr.city?.city_name || "",
          addr.province?.province_name || "",
          addr.postal_code || "",
        ]
          .filter(Boolean)
          .join(", "),
        fullAddress: addr,
        isDefault: !!addr.is_default,
      }));

      setAddresses(formattedAddresses);

      // Choose default address (if any)
      const defaultAddr =
        formattedAddresses.find((a) => a.isDefault) ||
        formattedAddresses[0] ||
        null;
      setSelectedAddress(defaultAddr);

      // Products from checkoutData (safe parsing)
      const selectedItems = Array.isArray(checkoutData.selectedItems)
        ? checkoutData.selectedItems
        : [];

      const formattedProducts = selectedItems.map((item) => ({
        id: item.cart_item_id,
        productId: item.product?.product_id,
        name: item.product?.name || "",
        description: item.product?.description || "",
        price: Number(item.product?.price) || 0,
        quantity: Number(item.quantity) || 1,
        image: item.product?.image_url || "https://via.placeholder.com/100",
        stock: Number(item.product?.stock) || 0,
      }));

      setProducts(formattedProducts);

      // Voucher if present
      if (checkoutData.appliedVoucher) {
        setVoucher(checkoutData.appliedVoucher.code || "");
      }
    } catch (err) {
      console.error("Failed to load order data:", err);
      setError(err?.message || "Failed to load order data");
    } finally {
      setIsLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    loadOrderData();
  }, [loadOrderData]);

  /**
   * Calculate shipping whenever selectedAddress changes
   */
  useEffect(() => {
    if (!selectedAddress) {
      // Reset shipping when no selected address
      setShippingOptions([]);
      setSelectedShipping(null);
      return;
    }

    const districtId = selectedAddress?.fullAddress?.district_id;
    if (!districtId) {
      setShippingOptions([]);
      setSelectedShipping(null);
      return;
    }

    // Fire off calculation
    calculateShippingCost(districtId).catch((err) =>
      console.error("calculateShippingCost uncaught error:", err)
    );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedAddress]);

  /**
   * Calculate shipping cost (safe, robust)
   * Accepts districtId param for easier testing and decoupling from selectedAddress
   */
  const calculateShippingCost = async (districtIdParam) => {
    const districtId =
      districtIdParam || selectedAddress?.fullAddress?.district_id || null;
    if (!districtId) {
      console.log("No district ID to calculate shipping");
      return;
    }

    setIsLoadingShipping(true);
    try {
      const payload = { districtId, weight: 1000 }; // 1kg default
      console.log("Calculating shipping for:", payload);

      const response = await kurirService.calculateShipping(payload);
      // response may be Axios response (with .data) or raw object
      const raw = response?.data ?? response;
      const options = Array.isArray(raw?.data)
        ? raw.data
        : Array.isArray(raw)
        ? raw
        : [];

      const meta = raw?.meta ?? {};
      const successFlag =
        raw?.success === true ||
        String(meta?.status).toLowerCase() === "success";

      if (!successFlag || !Array.isArray(options) || options.length === 0) {
        console.warn(
          "Shipping API returned no usable options:",
          meta?.message || null
        );
        // fallback
        const fallback = [
          {
            id: "jne-reg",
            name: "JNE - REG",
            duration: "2-4 hari",
            price: 20000,
            description: "Layanan Reguler",
          },
          {
            id: "jnt-ez",
            name: "J&T - EZ",
            duration: "1-3 hari",
            price: 25000,
            description: "Reguler",
          },
        ];
        setShippingOptions(fallback);
        setSelectedShipping(fallback[0]);
        return;
      }

      // Filter preferred couriers + service keywords
      const filtered = options.filter((opt) => {
        const code = (opt?.code || "").toString().toLowerCase();
        const service = (opt?.service || "").toString().toUpperCase();
        if (!PREFERRED_COURIER_CODES.includes(code)) return false;

        const isRegular = REGULAR_SERVICE_KEYWORDS.some((kw) =>
          service.includes(kw)
        );
        const isPremium = PREMIUM_SERVICE_KEYWORDS.some((kw) =>
          service.includes(kw)
        );
        return isRegular || isPremium;
      });

      const useList = filtered.length > 0 ? filtered : options.slice(0, 5);

      // Format consistently
      const mapped = useList.map((opt, idx) => {
        // price may be at opt.cost or opt.costs etc.
        const rawPrice =
          Number(opt?.cost) ||
          Number(opt?.cost?.value) ||
          Number(opt?.price) ||
          0;

        const etd = opt?.etd ?? opt?.etd_range ?? "";
        const duration = etd && etd !== "-" ? String(etd) : "1-3 hari";

        const courierNameRaw =
          opt?.name || opt?.courier || opt?.courier_name || "";
        const serviceName = opt?.service || "";

        return {
          id: `${opt?.code || "courier"}-${serviceName}-${idx}`,
          code: opt?.code || "",
          name: `${String(courierNameRaw)
            .split("(")[0]
            .trim()} - ${serviceName}`.trim(),
          description: opt?.description || "",
          service: serviceName,
          duration,
          price: Number(rawPrice) || 0,
          raw: opt,
        };
      });

      // Sort by price ascending
      mapped.sort((a, b) => a.price - b.price);

      setShippingOptions(mapped);
      setSelectedShipping((prev) => prev ?? mapped[0] ?? null);
    } catch (err) {
      console.error("Error fetching shipping:", err);
      const fallback = [
        {
          id: "jne-reg",
          name: "JNE - REG",
          duration: "2-4 hari",
          price: 20000,
          description: "Layanan Reguler",
        },
        {
          id: "jnt-ez",
          name: "J&T - EZ",
          duration: "1-3 hari",
          price: 25000,
          description: "Reguler",
        },
      ];
      setShippingOptions(fallback);
      setSelectedShipping(fallback[0]);
    } finally {
      setIsLoadingShipping(false);
    }
  };

  /**
   * Update product quantity
   */
  const updateQuantity = (id, qty) => {
    setProducts((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              quantity: Math.max(
                1,
                Math.min(Number(qty) || 1, p.stock || Infinity)
              ),
            }
          : p
      )
    );
  };

  /**
   * Remove product
   */
  const removeProducts = (id) => {
    if (!window.confirm("Remove this item from order?")) return;
    setProducts((prev) => {
      const updated = prev.filter((p) => p.id !== id);
      if (updated.length === 0) {
        window.alert("No items left in order. Redirecting to cart...");
        navigate("/cart");
      }
      return updated;
    });
  };

  /**
   * Delete address
   */
  const deleteAddress = async (id) => {
    if (!window.confirm("Are you sure you want to delete this address?"))
      return;
    try {
      await authService.deleteAddress(id);
      setAddresses((prev) => {
        const updated = prev.filter((a) => a.id !== id);
        if (selectedAddress?.id === id) {
          setSelectedAddress(updated[0] ?? null);
        }
        return updated;
      });
      window.alert("Address deleted successfully!");
    } catch (err) {
      console.error("Failed to delete address:", err);
      window.alert("Failed to delete address");
    }
  };

  /**
   * Edit address (store pending order state then redirect)
   */
  const editAddress = (id) => {
    const pending = {
      products,
      selectedShipping,
      selectedPayment,
      voucher,
    };
    sessionStorage.setItem("pendingOrderData", JSON.stringify(pending));
    navigate("/profile");
  };

  const makeOrder = async () => {
  if (products.length === 0) {
    window.alert("No products in order");
    return;
  }
  if (!selectedAddress) {
    window.alert("Please select a delivery address");
    return;
  }
  if (!selectedShipping) {
    window.alert("Please select a shipping option");
    return;
  }
  if (!selectedPayment) {
    window.alert("Please select a payment method");
    return;
  }

  try {
    // Build request payload according to backend
    const payload = {
      address_id: selectedAddress.id,
      payment_method: selectedPayment.name,
      notes: "",
      items: products.map((p) => ({
        product_id: p.productId,
        quantity: p.quantity,
        price: p.price,
      })),
      shipping_cost: selectedShipping.price || 0,
      voucher_discount: voucher ? 5000 : 0,
    };

    // Send to backend
    const response = await orderService.createOrder(payload);
    const resData = response;

    if (resData?.success) {
      window.alert(
        "Order created successfully! Please upload payment proof."
      );
      
      // ✅ Remove only the selected items from cart
      const cartItemIds = products.map(p => p.id); // Get cart_item_ids
      await removeProduct(cartItemIds);
      
      // Clear session storage
      sessionStorage.removeItem("checkoutData");
      sessionStorage.setItem("newOrderId", resData?.data?.order_id);
      
      // Redirect to payment page with order ID
      navigate(`/payment`);
    } else {
      throw new Error(resData?.message || "Order creation failed");
    }
  } catch (err) {
    console.error("Error creating order:", err);
    window.alert(err?.message || "Failed to create order. Please try again.");
  }
  };

  //=======================================================================================
  // Derived UI states
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50">
        <Navbar currentPage="order" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-16 h-16 text-pink-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">
              Loading order details...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50">
        <Navbar currentPage="order" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="bg-red-100 text-red-700 p-6 rounded-2xl mb-4 max-w-md">
              <p className="font-semibold mb-2">Error loading order</p>
              <p className="text-sm">{error}</p>
            </div>
            <button
              onClick={() => navigate("/cart")}
              className="px-6 py-3 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600"
            >
              Back to Cart
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (addresses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50">
        <Navbar currentPage="order" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="bg-yellow-100 text-yellow-800 p-6 rounded-2xl mb-4 max-w-md">
              <p className="font-semibold mb-2">No delivery address found</p>
              <p className="text-sm">Please add a delivery address first</p>
            </div>
            <button
              onClick={() => navigate("/profile")}
              className="px-6 py-3 bg-pink-500 text-white rounded-xl font-semibold hover:bg-pink-600"
            >
              Add Address
            </button>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  // While shipping is loading or there is no shipping selected, show a calculation state
  if (isLoadingShipping || !selectedShipping) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50">
        <Navbar currentPage="order" />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <Loader2 className="w-10 h-10 text-pink-500 animate-spin mx-auto mb-4" />
            <p className="text-gray-600 font-semibold">
              Calculating shipping cost...
            </p>
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-sky-50">
      <Navbar currentPage="order" />

      <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="space-y-6 lg:col-span-2">
          <OrderAddress
            addresses={addresses}
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            deleteAddress={deleteAddress}
            editAddress={editAddress}
          />

          <OrderProducts
            products={products}
            updateQuantity={updateQuantity}
            removeProduct={removeProducts}
          />

          <OrderShipping
            shippingOptions={shippingOptions}
            selectedShipping={selectedShipping}
            setSelectedShipping={setSelectedShipping}
            isLoading={isLoadingShipping}
          />

          <OrderPayment
            paymentMethods={paymentMethods}
            selectedPayment={selectedPayment}
            setSelectedPayment={setSelectedPayment}
          />

          <OrderVoucher voucher={voucher} setVoucher={setVoucher} />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            products={products}
            selectedShipping={selectedShipping || { price: 0 }}
            voucher={voucher}
            makeOrder={makeOrder}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Order;
