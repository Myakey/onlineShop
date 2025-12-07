import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";

//REACT COMPONENTS
import Navbar from "../../components/layout/Navbar";
import Footer from "../../components/layout/Footer";
import OrderAddress from "../../components/order/OrderAddress";
import OrderProducts from "../../components/order/OrderProducts";
import OrderShipping from "../../components/order/OrderShipping";
import OrderPaymentChannel from "../../components/order/OrderPaymentChannel";
import OrderVoucher from "../../components/order/OrderVoucher";
import OrderSummary from "../../components/order/OrderSummary";

//API SERVICES
import authService from "../../services/authService";
import shippingMethodService from "../../services/shippingMethod";
import orderService from "../../services/orderService";

//ICONS
import { Loader2 } from "lucide-react";
import { useCart } from "../../context/cartContext";

// ZONE-BASED PRICING (Fallback if API doesn't calculate)
const ZONE_MULTIPLIERS = {
  // Based on province or city patterns
  'DKI JAKARTA': 1.0,
  'JAWA BARAT': 1.0,
  'JAWA TENGAH': 1.2,
  'JAWA TIMUR': 1.3,
  'BALI': 1.4,
  'SUMATERA': 1.8,
  'KALIMANTAN': 2.0,
  'SULAWESI': 2.2,
  'PAPUA': 3.0,
  'MALUKU': 2.8,
  'NUSA TENGGARA': 2.5,
};

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

  // Payment Channel States
  const [paymentChannel, setPaymentChannel] = useState("full_transfer");
  const [splitAmount, setSplitAmount] = useState({ transfer: 0, marketplace: 0 });
  const [marketplaceLink, setMarketplaceLink] = useState("");
  const [selectedMarketplace, setSelectedMarketplace] = useState("shopee");

  // Voucher
  const [voucher, setVoucher] = useState("");

  // Load order data
  const loadOrderData = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
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

      const defaultAddr =
        formattedAddresses.find((a) => a.isDefault) ||
        formattedAddresses[0] ||
        null;
      setSelectedAddress(defaultAddr);

      // Products from checkoutData
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
        weight: Number(item.product?.weight) || 500, // Add weight field (in grams)
        image: item.product?.images[0].image_url || "https://via.placeholder.com/100",
        stock: Number(item.product?.stock) || 0,
      }));

      setProducts(formattedProducts);

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

  // Run loadOrderData
  useEffect(() => {
    loadOrderData();
  }, [loadOrderData]);

  /**
   * Calculate shipping whenever selectedAddress or paymentChannel changes
   */
  useEffect(() => {
    if (paymentChannel === "marketplace") {
      setShippingOptions([]);
      setSelectedShipping(null);
      return;
    }

    if (!selectedAddress) {
      setShippingOptions([]);
      setSelectedShipping(null);
      return;
    }

    calculateShippingCost().catch((err) =>
      console.error("calculateShippingCost uncaught error:", err)
    );
  }, [selectedAddress, paymentChannel, products]);

  /**
   * HELPER: Determine zone multiplier based on province
   */
  const getZoneMultiplier = (provinceName) => {
    if (!provinceName) return 1.5;
    
    const province = provinceName.toUpperCase();
    
    // Direct match
    if (ZONE_MULTIPLIERS[province]) {
      return ZONE_MULTIPLIERS[province];
    }
    
    // Pattern matching
    if (province.includes('JAKARTA')) return ZONE_MULTIPLIERS['DKI JAKARTA'];
    if (province.includes('JAWA')) {
      if (province.includes('BARAT')) return ZONE_MULTIPLIERS['JAWA BARAT'];
      if (province.includes('TENGAH')) return ZONE_MULTIPLIERS['JAWA TENGAH'];
      if (province.includes('TIMUR')) return ZONE_MULTIPLIERS['JAWA TIMUR'];
    }
    if (province.includes('BALI')) return ZONE_MULTIPLIERS['BALI'];
    if (province.includes('SUMATERA') || province.includes('SUMATRA')) return ZONE_MULTIPLIERS['SUMATERA'];
    if (province.includes('KALIMANTAN')) return ZONE_MULTIPLIERS['KALIMANTAN'];
    if (province.includes('SULAWESI')) return ZONE_MULTIPLIERS['SULAWESI'];
    if (province.includes('PAPUA')) return ZONE_MULTIPLIERS['PAPUA'];
    if (province.includes('MALUKU')) return ZONE_MULTIPLIERS['MALUKU'];
    if (province.includes('NUSA TENGGARA')) return ZONE_MULTIPLIERS['NUSA TENGGARA'];
    
    // Default for unknown regions
    return 1.5;
  };

  /**
   * Calculate total package weight
   */
  const calculateTotalWeight = () => {
    const totalGrams = products.reduce((sum, p) => {
      return sum + (p.weight || 500) * p.quantity;
    }, 0);
    
    // Convert to kg, minimum 1kg
    return Math.max(1, Math.ceil(totalGrams / 1000));
  };

  /**
   * Calculate shipping cost from database shipping methods
   */
  const calculateShippingCost = async () => {
    if (!selectedAddress || paymentChannel === "marketplace") {
      return;
    }

    setIsLoadingShipping(true);
    try {
      // Fetch shipping methods from your API
      const response = await shippingMethodService.getAllShippingMethods();
      const shippingMethods = response?.data || [];

      if (!Array.isArray(shippingMethods) || shippingMethods.length === 0) {
        throw new Error("No shipping methods available");
      }

      // Get destination province for zone calculation
      const provinceName = selectedAddress?.fullAddress?.province?.province_name || "";
      const zoneMultiplier = getZoneMultiplier(provinceName);
      
      // Calculate total weight
      const totalWeightKg = calculateTotalWeight();
      const weightMultiplier = Math.max(1, totalWeightKg); // Per kg pricing

      // Format shipping options with dynamic pricing
      const formattedOptions = shippingMethods.map((method) => {
        const baseCost = Number(method.base_cost) || 20000;
        
        // Apply zone and weight multipliers
        const adjustedCost = Math.round(baseCost * zoneMultiplier * weightMultiplier);
        
        // Add estimated days variation based on zone
        const baseEstimatedDays = Number(method.estimated_days) || 3;
        const additionalDays = zoneMultiplier > 1.5 ? Math.floor(zoneMultiplier) : 0;
        const estimatedDays = baseEstimatedDays + additionalDays;

        return {
          id: `method-${method.shipping_method_id}`,
          shipping_method_id: method.shipping_method_id,
          name: method.name || `${method.courier} ${method.name}`,
          courier: method.courier,
          description: `${estimatedDays} hari kerja • ${totalWeightKg} kg`,
          service: method.name,
          duration: `${estimatedDays} hari`,
          price: adjustedCost,
          basePrice: baseCost,
          estimatedDays: estimatedDays,
          raw: method,
        };
      });

      // Sort by price (cheapest first)
      formattedOptions.sort((a, b) => a.price - b.price);

      setShippingOptions(formattedOptions);
      
      // Auto-select cheapest option if none selected
      if (!selectedShipping || !formattedOptions.find(opt => opt.id === selectedShipping.id)) {
        setSelectedShipping(formattedOptions[0]);
      }

    } catch (err) {
      console.error("Error fetching shipping methods:", err);
      
      // Fallback options if API fails
      const fallbackOptions = [
        {
          id: "fallback-regular",
          name: "Pengiriman Reguler",
          courier: "Regular",
          duration: "3-5 hari",
          price: 25000,
          description: "Layanan pengiriman standar",
        },
      ];
      
      setShippingOptions(fallbackOptions);
      setSelectedShipping(fallbackOptions[0]);
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
   * Edit address
   */
  const editAddress = (id) => {
    const pending = {
      products,
      selectedShipping,
      paymentChannel,
      splitAmount,
      marketplaceLink,
      selectedMarketplace,
      voucher,
    };
    sessionStorage.setItem("pendingOrderData", JSON.stringify(pending));
    navigate("/profile");
  };

  /**
   * Make Order
   */
  const makeOrder = async () => {
    if (products.length === 0) {
      window.alert("No products in order");
      return;
    }
    if (!selectedAddress) {
      window.alert("Please select a delivery address");
      return;
    }

    // Validation based on payment channel
    if (paymentChannel === "full_transfer" || paymentChannel === "split_payment") {
      if (!selectedShipping) {
        window.alert("Please select a shipping option");
        return;
      }
    }

    if (paymentChannel === "split_payment") {
      const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
      const totalSplit = splitAmount.transfer + splitAmount.marketplace;
      
      if (totalSplit !== subtotal) {
        window.alert("Split payment amounts must equal product subtotal");
        return;
      }
      
      if (splitAmount.transfer <= 0 || splitAmount.marketplace <= 0) {
        window.alert("Both transfer and marketplace amounts must be greater than 0");
        return;
      }
    }

    if (paymentChannel === "marketplace") {
      if (!marketplaceLink.trim()) {
        window.alert("Please enter the marketplace product link");
        return;
      }
      if (!selectedMarketplace) {
        window.alert("Please select marketplace (Shopee or TikTok)");
        return;
      }
    }

    try {
      // Calculate amounts
      const subtotal = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
      const shippingCost = (paymentChannel === "marketplace") ? 0 : (selectedShipping?.price || 0);
      const voucherDiscount = voucher ? 5000 : 0;

      // Build payment data based on channel
      const paymentData = {
        payment_channel: paymentChannel,
      };

      if (paymentChannel === "full_transfer") {
        paymentData.payment_type = "transfer";
        paymentData.method_name = "BCA";
        paymentData.payment_amount = subtotal + shippingCost - voucherDiscount;
      } else if (paymentChannel === "split_payment") {
        paymentData.payment_type = "split";
        paymentData.split_transfer_amount = splitAmount.transfer;
        paymentData.split_marketplace_amount = splitAmount.marketplace;
        paymentData.marketplace_platform = selectedMarketplace;
        paymentData.payment_amount = subtotal + shippingCost - voucherDiscount;
      } else if (paymentChannel === "marketplace") {
        paymentData.payment_type = selectedMarketplace;
        paymentData.method_name = selectedMarketplace === "shopee" ? "Shopee" : "TikTok Shop";
        paymentData.marketplace_link = marketplaceLink;
        paymentData.marketplace_platform = selectedMarketplace;
        paymentData.payment_amount = subtotal;
      }

      // Build request payload
      const payload = {
        address_id: selectedAddress.id,
        shipping_method_id: selectedShipping?.shipping_method_id || null,
        notes: "",
        items: products.map((p) => ({
          product_id: p.productId,
          quantity: p.quantity,
          price: p.price,
        })),
        shipping_cost: shippingCost,
        voucher_discount: voucherDiscount,
        payment_data: paymentData,
      };

      // Send to backend
      const response = await orderService.createOrder(payload);
      const resData = response;

      if (resData?.success) {
        let message = "Order created successfully!";
        
        if (paymentChannel === "marketplace") {
          message = `Order created! Please complete payment at: ${marketplaceLink}`;
        } else {
          message = "Order created successfully! Please upload payment proof.";
        }
        
        window.alert(message);
        
        // Remove items from cart
        const cartItemIds = products.map(p => p.id);
        await removeProduct(cartItemIds);
        
        // Clear session storage
        sessionStorage.removeItem("checkoutData");
        
        // Redirect to payment page
        navigate(`/payment/${resData.data?.order?.secure_token}`);
      } else {
        throw new Error(resData?.message || "Order creation failed");
      }
    } catch (err) {
      console.error("Error creating order:", err);
      window.alert(err?.message || "Failed to create order. Please try again.");
    }
  };

  // Loading state
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

  // Error state
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

  // No addresses
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

  // Loading shipping (only for non-marketplace)
  if ((paymentChannel !== "marketplace") && (isLoadingShipping || !selectedShipping)) {
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

      <div className="p-6 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6 pt-28">
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

          <OrderPaymentChannel
            paymentChannel={paymentChannel}
            setPaymentChannel={setPaymentChannel}
            splitAmount={splitAmount}
            setSplitAmount={setSplitAmount}
            marketplaceLink={marketplaceLink}
            setMarketplaceLink={setMarketplaceLink}
            selectedMarketplace={selectedMarketplace}
            setSelectedMarketplace={setSelectedMarketplace}
            productTotal={products.reduce((sum, p) => sum + p.price * p.quantity, 0)}
          />

          {paymentChannel !== "marketplace" && (
            <OrderShipping
              shippingOptions={shippingOptions}
              selectedShipping={selectedShipping}
              setSelectedShipping={setSelectedShipping}
              isLoading={isLoadingShipping}
            />
          )}

          <OrderVoucher voucher={voucher} setVoucher={setVoucher} />
        </div>

        <div className="lg:col-span-1">
          <OrderSummary
            products={products}
            selectedShipping={paymentChannel === "marketplace" ? { price: 0 } : (selectedShipping || { price: 0 })}
            voucher={voucher}
            makeOrder={makeOrder}
            paymentChannel={paymentChannel}
          />
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Order;