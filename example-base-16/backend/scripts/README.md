# Database Scripts

This directory contains SQL scripts for database setup and management.

## Scripts

### 1. `create-database.sql`
Creates the database `ex_base_15_backend` if it doesn't exist.

**Usage:**
```bash
mysql -u root -p < create-database.sql
```

### 2. `create-tables.sql`
Creates the `users` table in the database.

**Usage:**
```bash
mysql -u root -p ex_base_15_backend < create-tables.sql
```

### 3. `create-admin-user.sql`
Creates a default admin user:
- **Username:** `admin`
- **Password:** `admin123`
- **Email:** `admin@example.com`
- **Role:** `ADMIN`

**⚠️ IMPORTANT:** Change the password immediately after first login!

**Usage:**
```bash
mysql -u root -p ex_base_15_backend < create-admin-user.sql
```

### 4. `drop-database.sql`
**⚠️ WARNING:** This script drops the entire database and all its data. Use with caution!

**Usage:**
```bash
mysql -u root -p < drop-database.sql
```

## Quick Setup

To set up the database from scratch:

```bash
# 1. Create the database
mysql -u root -p < scripts/create-database.sql

# 2. Create tables (if not using Hibernate auto-creation)
mysql -u root -p ex_base_15_backend < scripts/create-tables.sql

# 3. (Optional) Create admin user
mysql -u root -p ex_base_15_backend < scripts/create-admin-user.sql
```

## Alternative: Using MySQL Client

You can also run these scripts directly in MySQL:

```sql
SOURCE /path/to/scripts/create-database.sql;
SOURCE /path/to/scripts/create-tables.sql;
SOURCE /path/to/scripts/create-admin-user.sql;
```

## Notes

- The application is configured to auto-create tables via Hibernate (`spring.jpa.hibernate.ddl-auto=update`)
- If you use Hibernate auto-creation, you may only need to run `create-database.sql`
- The admin user password is BCrypt encoded. To generate a new BCrypt hash, you can use the Spring Boot application or online tools
- All scripts use `IF EXISTS` or `IF NOT EXISTS` to avoid errors on re-runs

