export const sampleRequestJson = {
  customerInfo: {
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@example.com",
    age: 30,
    isActive: true,
    registeredDate: "2023-01-15T10:30:00Z"
  },
  orderDetails: {
    orderId: "ORD-123456",
    items: [
      {
        productId: "P001",
        quantity: 2,
        price: 99.99
      }
    ],
    totalAmount: 199.98,
    shippingAddress: {
      street: "123 Main St",
      city: "New York",
      zipCode: "10001"
    }
  }
}

export const sampleArgumentsJson = {
  mappingConfig: {
    customerIdPrefix: "CUST",
    defaultCountry: "USA",
    taxRate: 0.08,
    currencyCode: "USD"
  },
  validationRules: {
    minAge: 18,
    maxQuantity: 10,
    requiredFields: ["email", "firstName", "lastName"]
  },
  transformations: {
    dateFormat: "YYYY-MM-DD",
    priceFormat: "###,##0.00",
    nameFormat: "uppercase"
  }
}

export const availableDatabaseTables = [
  {
    name: "customers",
    schema: [
      { name: "id", type: "integer", required: true, isPrimary: true },
      { name: "first_name", type: "string", required: true },
      { name: "last_name", type: "string", required: true },
      { name: "email", type: "string", required: true },
      { name: "age", type: "integer" },
      { name: "is_active", type: "boolean", required: true },
      { name: "registered_date", type: "timestamp", required: true },
      { name: "customer_id", type: "string", required: true }
    ]
  },
  {
    name: "orders",
    schema: [
      { name: "id", type: "integer", required: true, isPrimary: true },
      { name: "order_id", type: "string", required: true },
      { name: "customer_id", type: "string", required: true },
      { name: "total_amount", type: "decimal", required: true },
      { name: "tax_amount", type: "decimal", required: true },
      { name: "created_at", type: "timestamp", required: true },
      { name: "status", type: "string", required: true }
    ]
  },
  {
    name: "addresses",
    schema: [
      { name: "id", type: "integer", required: true, isPrimary: true },
      { name: "customer_id", type: "string", required: true },
      { name: "street", type: "string", required: true },
      { name: "city", type: "string", required: true },
      { name: "zip_code", type: "string", required: true },
      { name: "country", type: "string", required: true },
      { name: "is_primary", type: "boolean", required: true }
    ]
  }
]