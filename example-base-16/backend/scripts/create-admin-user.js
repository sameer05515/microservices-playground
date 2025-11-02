// MongoDB script to create an admin user
// Run with: mongosh ex_base_16_backend < create-admin-user.js
// Or: mongosh --eval "load('create-admin-user.js')"

db = db.getSiblingDB('ex_base_16_backend');

// Insert admin user
// Password 'admin123' is BCrypt encoded: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
// IMPORTANT: Change the password immediately after first login!

const adminUser = {
    username: "admin",
    password: "$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy",
    email: "admin@example.com",
    role: "ADMIN",
    enabled: true,
    createdAt: new Date(),
    updatedAt: null
};

// Update existing or insert new
db.users.updateOne(
    { username: "admin" },
    { 
        $set: {
            password: adminUser.password,
            email: adminUser.email,
            role: "ADMIN",
            enabled: true,
            updatedAt: new Date()
        },
        $setOnInsert: {
            createdAt: new Date()
        }
    },
    { upsert: true }
);

print("Admin user created/updated successfully!");
print("Username: admin");
print("Password: admin123");
print("⚠️  IMPORTANT: Change the password immediately after first login!");

// Display the created user
const user = db.users.findOne({ username: "admin" });
printjson(user);

