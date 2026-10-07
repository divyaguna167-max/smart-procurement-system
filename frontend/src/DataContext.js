import React, { createContext, useContext, useEffect, useState } from "react";

const DataContext = createContext();

const businessProducts = {
  electronics: [
    {
      id: 1,
      name: "Laptop",
      category: "Electronics",
      price: 45000,
      stock: 15,
      minStock: 5,
    },
    {
      id: 2,
      name: "Keyboard",
      category: "Electronics",
      price: 1200,
      stock: 4,
      minStock: 5,
    },
    {
      id: 3,
      name: "Mouse",
      category: "Electronics",
      price: 700,
      stock: 25,
      minStock: 5,
    },
    {
      id: 4,
      name: "Monitor",
      category: "Electronics",
      price: 15000,
      stock: 3,
      minStock: 5,
    },
  ],

  supermarket: [
    {
      id: 1,
      name: "Rice 5kg",
      category: "Groceries",
      price: 350,
      stock: 40,
      minStock: 10,
    },
    {
      id: 2,
      name: "Milk",
      category: "Dairy",
      price: 60,
      stock: 8,
      minStock: 10,
    },
    {
      id: 3,
      name: "Biscuits",
      category: "Food",
      price: 30,
      stock: 50,
      minStock: 15,
    },
    {
      id: 4,
      name: "Shampoo",
      category: "Personal Care",
      price: 180,
      stock: 6,
      minStock: 10,
    },
  ],

  clothing: [
    {
      id: 1,
      name: "Men's Shirt",
      category: "Clothing",
      price: 1200,
      stock: 20,
      minStock: 5,
    },
    {
      id: 2,
      name: "T-Shirt",
      category: "Clothing",
      price: 700,
      stock: 30,
      minStock: 8,
    },
    {
      id: 3,
      name: "Jeans",
      category: "Clothing",
      price: 1500,
      stock: 7,
      minStock: 8,
    },
    {
      id: 4,
      name: "Saree",
      category: "Clothing",
      price: 2500,
      stock: 15,
      minStock: 5,
    },
  ],

  pharmacy: [
    {
      id: 1,
      name: "Paracetamol",
      category: "Medicine",
      price: 50,
      stock: 100,
      minStock: 20,
    },
    {
      id: 2,
      name: "Cough Syrup",
      category: "Medicine",
      price: 120,
      stock: 15,
      minStock: 10,
    },
    {
      id: 3,
      name: "Vitamin Tablets",
      category: "Medicine",
      price: 250,
      stock: 8,
      minStock: 10,
    },
    {
      id: 4,
      name: "Hand Sanitizer",
      category: "Personal Care",
      price: 90,
      stock: 30,
      minStock: 10,
    },
  ],

  restaurant: [
    {
      id: 1,
      name: "Rice",
      category: "Food",
      price: 60,
      stock: 50,
      minStock: 15,
    },
    {
      id: 2,
      name: "Cooking Oil",
      category: "Food",
      price: 150,
      stock: 12,
      minStock: 10,
    },
    {
      id: 3,
      name: "Chicken",
      category: "Food",
      price: 250,
      stock: 5,
      minStock: 8,
    },
    {
      id: 4,
      name: "Vegetables",
      category: "Food",
      price: 80,
      stock: 25,
      minStock: 10,
    },
  ],

  hardware: [
    {
      id: 1,
      name: "Hammer",
      category: "Tools",
      price: 450,
      stock: 20,
      minStock: 5,
    },
    {
      id: 2,
      name: "Screwdriver Set",
      category: "Tools",
      price: 650,
      stock: 8,
      minStock: 10,
    },
    {
      id: 3,
      name: "PVC Pipe",
      category: "Hardware",
      price: 300,
      stock: 30,
      minStock: 10,
    },
    {
      id: 4,
      name: "Paint",
      category: "Hardware",
      price: 1200,
      stock: 4,
      minStock: 5,
    },
  ],

  mobile: [
    {
      id: 1,
      name: "Smartphone",
      category: "Mobile",
      price: 20000,
      stock: 10,
      minStock: 5,
    },
    {
      id: 2,
      name: "Fast Charger",
      category: "Accessories",
      price: 1200,
      stock: 25,
      minStock: 10,
    },
    {
      id: 3,
      name: "Earphones",
      category: "Accessories",
      price: 900,
      stock: 7,
      minStock: 10,
    },
    {
      id: 4,
      name: "Mobile Cover",
      category: "Accessories",
      price: 500,
      stock: 40,
      minStock: 10,
    },
  ],
};

const defaultSuppliers = [
  {
    id: 1,
    name: "ABC Suppliers",
    contact: "1234567899",
    email: "abc@gmail.com",
    location: "Chennai",
    status: "Active",
  },
  {
    id: 2,
    name: "Global Supply Solutions",
    contact: "9876543210",
    email: "global@gmail.com",
    location: "Coimbatore",
    status: "Active",
  },
  {
    id: 3,
    name: "Smart Distribution",
    contact: "9876501234",
    email: "smartdistribution@gmail.com",
    location: "Bangalore",
    status: "Active",
  },
];

export function DataProvider({ children, selectedBusiness }) {
  const businessId = selectedBusiness?.id || "electronics";

  const [products, setProducts] = useState(
    businessProducts[businessId] || businessProducts.electronics
  );

  const [suppliers, setSuppliers] = useState(defaultSuppliers);

  const [billingHistory, setBillingHistory] = useState([]);

  const [purchaseOrders, setPurchaseOrders] = useState([]);

  /* =====================================================
     CHANGE PRODUCTS WHEN BUSINESS TYPE CHANGES
  ===================================================== */

  useEffect(() => {
    const selectedProducts =
      businessProducts[businessId] || businessProducts.electronics;

    setProducts(selectedProducts);
  }, [businessId]);

  /* =====================================================
     CREATE PURCHASE ORDER
  ===================================================== */

  const createPurchaseOrder = (
    supplierId,
    productId,
    quantity
  ) => {
    const qty = Number(quantity);

    if (!supplierId || !productId || !qty || qty <= 0) {
      return false;
    }

    const product = products.find(
      (item) => String(item.id) === String(productId)
    );

    const supplier = suppliers.find(
      (item) => String(item.id) === String(supplierId)
    );

    if (!product || !supplier) {
      return false;
    }

    /* Increase product stock */

    setProducts((currentProducts) =>
      currentProducts.map((item) =>
        String(item.id) === String(productId)
          ? {
              ...item,
              stock: Number(item.stock) + qty,
            }
          : item
      )
    );

    /* Create purchase order */

    const newOrder = {
      id: Date.now(),
      orderNumber: `PO-${String(Date.now()).slice(-6)}`,
      supplierId: supplier.id,
      supplierName: supplier.name,
      productId: product.id,
      productName: product.name,
      quantity: qty,
      date: new Date().toLocaleDateString(),
      status: "Completed",
    };

    setPurchaseOrders((currentOrders) => [
      newOrder,
      ...currentOrders,
    ]);

    return true;
  };

  /* =====================================================
     CONTEXT VALUE
  ===================================================== */

  const value = {
    products,
    setProducts,

    suppliers,
    setSuppliers,

    billingHistory,
    setBillingHistory,

    purchaseOrders,
    setPurchaseOrders,

    createPurchaseOrder,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
}

/* =========================================================
   USE DATA HOOK
========================================================= */

export function useData() {
  const context = useContext(DataContext);

  if (!context) {
    throw new Error(
      "useData must be used inside DataProvider"
    );
  }

  return context;
}

export default DataContext;