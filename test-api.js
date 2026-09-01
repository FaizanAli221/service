// test-api.js
// Automated verification script testing all Vercel serverless function handlers directly.

const assert = require("assert");

// Helper to mock req/res for Vercel functions
function createMockContext({ method = "GET", body = {}, query = {} } = {}) {
  let statusCode = 200;
  let headers = {};
  let responseData = null;
  let ended = false;

  const req = {
    method,
    body,
    query,
    headers: {},
  };

  const res = {
    setHeader(key, value) {
      headers[key] = value;
    },
    status(code) {
      statusCode = code;
      return res;
    },
    json(data) {
      responseData = data;
      ended = true;
      return res;
    },
    end() {
      ended = true;
      return res;
    },
    getStatus: () => statusCode,
    getData: () => responseData,
    getHeaders: () => headers,
  };

  return { req, res };
}

async function runTests() {
  console.log("=== APEX AUTO CARE API TEST SUITE ===\n");
  let passed = 0;
  let total = 0;

  function test(name, fn) {
    total++;
    try {
      fn();
      console.log(`✅ PASS: ${name}`);
      passed++;
    } catch (err) {
      console.error(`❌ FAIL: ${name}`);
      console.error(err);
    }
  }

  // 1. Root Health Check
  test("GET /api/health returns 200 operational", () => {
    const healthHandler = require("./api/health");
    const { req, res } = createMockContext({ method: "GET" });
    healthHandler(req, res);
    assert.strictEqual(res.getStatus(), 200);
    assert.strictEqual(res.getData().status, "operational");
  });

  // 2. Packages Health Check
  test("GET /api/packages/health returns 200 active", () => {
    const pkgHealthHandler = require("./api/packages/health");
    const { req, res } = createMockContext({ method: "GET" });
    pkgHealthHandler(req, res);
    assert.strictEqual(res.getStatus(), 200);
    assert.strictEqual(res.getData().status, "active");
  });

  // 3. Services List
  test("GET /api/services returns catalog with prices", () => {
    const servicesHandler = require("./api/services");
    const { req, res } = createMockContext({ method: "GET" });
    servicesHandler(req, res);
    assert.strictEqual(res.getStatus(), 200);
    assert.strictEqual(res.getData().success, true);
    assert.ok(Array.isArray(res.getData().data));
    assert.ok(res.getData().data.length >= 6);
  });

  // 4. Packages List
  test("GET /api/packages returns packages with features", () => {
    const packagesHandler = require("./api/packages");
    const { req, res } = createMockContext({ method: "GET" });
    packagesHandler(req, res);
    assert.strictEqual(res.getStatus(), 200);
    assert.strictEqual(res.getData().success, true);
    assert.ok(Array.isArray(res.getData().packages));
    assert.strictEqual(res.getData().packages.length, 3);
  });

  // 5. Get Package by ID
  test("GET /api/packages/[id] returns single package", () => {
    const packageIdHandler = require("./api/packages/[id]");
    const { req, res } = createMockContext({ method: "GET", query: { id: "full-tune-up" } });
    packageIdHandler(req, res);
    assert.strictEqual(res.getStatus(), 200);
    assert.strictEqual(res.getData().package.id, "full-tune-up");
  });

  // 6. Cost Estimator
  test("POST /api/estimate-cost calculates SUV multiplier and tax", () => {
    const estimateHandler = require("./api/estimate-cost");
    const { req, res } = createMockContext({
      method: "POST",
      body: {
        vehicleType: "suv",
        serviceIds: ["oil", "brakes"],
      },
    });
    estimateHandler(req, res);
    assert.strictEqual(res.getStatus(), 200);
    assert.strictEqual(res.getData().success, true);
    assert.strictEqual(res.getData().vehicleMultiplier, 1.25);
    assert.ok(res.getData().total > 0);
  });

  // 7. General Appointment Booking
  test("POST /api/appointments creates appointment APX-XXXX", () => {
    const appointmentHandler = require("./api/appointments");
    const { req, res } = createMockContext({
      method: "POST",
      body: {
        fullName: "Sarah Connor",
        email: "sarah@example.com",
        phone: "+1 (555) 432-1098",
        carMake: "Toyota",
        carModel: "RAV4",
        year: 2023,
        serviceId: "oil",
        preferredDate: new Date().toISOString().split("T")[0],
      },
    });
    appointmentHandler(req, res);
    assert.strictEqual(res.getStatus(), 201);
    assert.strictEqual(res.getData().success, true);
    assert.ok(res.getData().data.bookingId.startsWith("APX-"));
  });

  // 8. Service Package Booking with Zod Validation
  test("POST /api/packages/book validates payload and creates PKG- tracking code", () => {
    const bookHandler = require("./api/packages/book");
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 5);

    const { req, res } = createMockContext({
      method: "POST",
      body: {
        packageId: "full-tune-up",
        customerName: "Ayesha Khan",
        email: "ayesha@example.com",
        phone: "+92 300 1234567",
        carMake: "Honda",
        carModel: "Civic",
        year: 2021,
        scheduledDate: futureDate.toISOString(),
      },
    });
    bookHandler(req, res);
    assert.strictEqual(res.getStatus(), 201);
    assert.strictEqual(res.getData().success, true);
    assert.ok(res.getData().booking.reference.startsWith("PKG-"));
    assert.strictEqual(res.getData().booking.package.id, "full-tune-up");
  });

  console.log(`\nResults: ${passed}/${total} tests passed.`);
  if (passed === total) {
    console.log("🎉 ALL API TESTS PASSED SUCCESSFULLY!");
    process.exit(0);
  } else {
    process.exit(1);
  }
}

runTests();
