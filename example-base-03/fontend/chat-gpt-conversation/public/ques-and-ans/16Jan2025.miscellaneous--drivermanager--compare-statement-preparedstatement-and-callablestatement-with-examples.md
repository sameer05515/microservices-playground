### **Comparison of Statement, PreparedStatement, and CallableStatement**

These interfaces in the Java Database Connectivity (JDBC) API are used to execute SQL queries. Below is a detailed comparison:

| **Feature**              | **Statement**                                  | **PreparedStatement**                                           | **CallableStatement**                                     |
|---------------------------|-----------------------------------------------|-----------------------------------------------------------------|----------------------------------------------------------|
| **Definition**            | Executes static SQL queries.                 | Executes parameterized SQL queries with precompiled SQL.       | Executes stored procedures.                              |
| **Query Compilation**     | Compiles SQL each time it is executed.        | Compiles SQL once and reuses the query plan for efficiency.    | Executes precompiled SQL stored on the database server.  |
| **Performance**           | Slower due to repeated query parsing and execution. | Faster as the query is precompiled and cached.                | Faster for stored procedures, avoids SQL parsing.        |
| **Parameter Handling**    | Does not support parameters.                  | Supports dynamic query parameters with placeholders (`?`).     | Supports parameters and output variables.                |
| **Security**              | Prone to SQL injection.                      | Prevents SQL injection due to parameter binding.               | Prevents SQL injection as stored procedures are used.    |
| **Use Case**              | Simple and static SQL queries.               | Dynamic queries with parameters.                              | Complex business logic encapsulated in stored procedures.|

---

### **Examples**

#### **1. Using Statement**
```java
import java.sql.*;

public class StatementExample {
    public static void main(String[] args) {
        String query = "SELECT * FROM employees WHERE department = 'Sales'";
        try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/company", "user", "password");
             Statement stmt = conn.createStatement();
             ResultSet rs = stmt.executeQuery(query)) {

            while (rs.next()) {
                System.out.println("Employee ID: " + rs.getInt("id"));
                System.out.println("Employee Name: " + rs.getString("name"));
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

---

#### **2. Using PreparedStatement**
```java
import java.sql.*;

public class PreparedStatementExample {
    public static void main(String[] args) {
        String query = "SELECT * FROM employees WHERE department = ?";
        try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/company", "user", "password");
             PreparedStatement pstmt = conn.prepareStatement(query)) {

            pstmt.setString(1, "Sales");
            try (ResultSet rs = pstmt.executeQuery()) {
                while (rs.next()) {
                    System.out.println("Employee ID: " + rs.getInt("id"));
                    System.out.println("Employee Name: " + rs.getString("name"));
                }
            }
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

---

#### **3. Using CallableStatement**
```java
import java.sql.*;

public class CallableStatementExample {
    public static void main(String[] args) {
        String procedure = "{CALL GetEmployeeDetails(?, ?)}";
        try (Connection conn = DriverManager.getConnection("jdbc:mysql://localhost:3306/company", "user", "password");
             CallableStatement cstmt = conn.prepareCall(procedure)) {

            // Set input parameter
            cstmt.setInt(1, 101); // Employee ID
            // Register output parameter
            cstmt.registerOutParameter(2, Types.VARCHAR); // Employee Name

            // Execute stored procedure
            cstmt.execute();

            // Retrieve output parameter
            String employeeName = cstmt.getString(2);
            System.out.println("Employee Name: " + employeeName);
        } catch (SQLException e) {
            e.printStackTrace();
        }
    }
}
```

---

### **Key Considerations**
1. **Performance**:
   - Use `PreparedStatement` for dynamic queries and frequent execution as it reduces query parsing overhead.
   - Use `CallableStatement` for complex logic handled by the database.

2. **Security**:
   - Always prefer `PreparedStatement` or `CallableStatement` to prevent SQL injection attacks.

3. **Maintainability**:
   - For logic reuse and centralized management, use stored procedures with `CallableStatement`.

Each approach has its strengths and should be chosen based on the use case. For instance:
- Use `Statement` for simple queries or administrative tasks.
- Use `PreparedStatement` for dynamic queries.
- Use `CallableStatement` for executing stored procedures in enterprise-grade applications.