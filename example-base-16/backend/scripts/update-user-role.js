// MongoDB script to update a user's role to ADMIN
// Usage: mongosh ex_base_16_backend --eval "load('update-user-role.js')"
// Or: mongosh ex_base_16_backend update-user-role.js

db = db.getSiblingDB('ex_base_16_backend');

// Replace 'your_username' with the actual username
const username = "your_username";

const result = db.users.updateOne(
    { username: username },
    { 
        $set: { 
            role: "ADMIN",
            updatedAt: new Date()
        } 
    }
);

if (result.matchedCount === 0) {
    print("User not found: " + username);
} else if (result.modifiedCount > 0) {
    print("User role updated to ADMIN: " + username);
    const user = db.users.findOne({ username: username });
    printjson(user);
} else {
    print("User already has ADMIN role: " + username);
}

