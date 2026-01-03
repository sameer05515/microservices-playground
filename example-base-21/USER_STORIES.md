# 📋 User Stories - Personal Expense Tracker

## 🎯 Epic: Personal Expense Tracker

**Goal:** Enable users to record, track, analyze, and manage personal expenses over time with insights by date and category.

---

## ✅ Implementation Status

### ✅ User Story 1: Add Expense
**Status:** ✅ **IMPLEMENTED**

**As a** user  
**I want to** add a new expense with amount, category, and date  
**So that** I can keep track of my spending

**Acceptance Criteria:**
- ✅ User can enter title (description), amount, category, date
- ✅ Amount must be > 0 (validated)
- ✅ Expense is saved successfully (via API)
- ✅ User sees confirmation (form closes on success)

**Implementation:**
- `ExpenseForm.jsx` - Modal form with validation
- Backend API: `POST /api/expenses`

---

### ✅ User Story 2: View Expense List
**Status:** ✅ **IMPLEMENTED**

**As a** user  
**I want to** view all my expenses  
**So that** I can review my spending history

**Acceptance Criteria:**
- ✅ Expenses displayed in descending date order
- ✅ Shows title, amount, category, date
- ✅ Supports pagination (backend supports, frontend can be enhanced)

**Implementation:**
- `ExpenseList.jsx` - Displays expenses sorted by date
- Backend API: `GET /api/expenses?page=1&limit=50`

---

### ✅ User Story 3: Filter Expenses by Date
**Status:** ✅ **IMPLEMENTED**

**As a** user  
**I want to** filter expenses by from-date and to-date  
**So that** I can analyze expenses for a specific period

**Acceptance Criteria:**
- ✅ User can select date range (startDate, endDate)
- ✅ Only expenses within range are shown
- ✅ Empty result handled gracefully

**Implementation:**
- `ExpenseList.jsx` - Date range filters
- Backend API: `GET /api/expenses?startDate=...&endDate=...`

---

### ✅ User Story 4: Categorize Expenses
**Status:** ✅ **IMPLEMENTED**

**As a** user  
**I want to** assign categories to expenses  
**So that** I can understand where my money goes

**Acceptance Criteria:**
- ✅ Category selection mandatory
- ✅ Predefined categories (Food, Transport, Entertainment, Bills, Shopping, Health, Education, Other)
- ✅ Category saved with expense

**Implementation:**
- `expenseUtils.js` - CATEGORIES array
- `ExpenseForm.jsx` - Category dropdown
- Backend: Category enum validation

---

### ✅ User Story 5: Expense Summary (Analytics)
**Status:** ✅ **IMPLEMENTED** (Charts pending)

**As a** user  
**I want to** see category-wise expense summary  
**So that** I can analyze spending patterns

**Acceptance Criteria:**
- ✅ Summary grouped by category
- ✅ Date range supported
- ✅ Amounts correctly aggregated

**Implementation:**
- `ExpenseSummary.jsx` - Category totals with percentages
- Backend API: `GET /api/expenses/stats/summary`

---

### 🚧 User Story 6: Visual Charts
**Status:** 🚧 **IN PROGRESS**

**As a** user  
**I want to** see my expenses in charts  
**So that** insights are easy to understand

**Acceptance Criteria:**
- ⏳ Bar / Pie chart available
- ⏳ Chart updates with filters
- ⏳ Values match backend data

**Implementation Plan:**
- Add chart library (recharts or chart.js)
- Create `ExpenseCharts.jsx` component
- Integrate with existing stats API

---

### ✅ User Story 7: Edit Expense
**Status:** ✅ **IMPLEMENTED**

**As a** user  
**I want to** edit an existing expense  
**So that** I can correct mistakes

**Acceptance Criteria:**
- ✅ User can update title, amount, category, date
- ✅ Changes saved successfully

**Implementation:**
- `ExpenseForm.jsx` - Edit mode
- Backend API: `PUT /api/expenses/:id`

---

### ✅ User Story 8: Delete Expense
**Status:** ✅ **IMPLEMENTED**

**As a** user  
**I want to** delete an expense  
**So that** I can remove invalid entries

**Acceptance Criteria:**
- ✅ Confirmation before delete
- ✅ Expense removed from list and summary

**Implementation:**
- `ExpenseList.jsx` - Delete button with confirmation
- Backend API: `DELETE /api/expenses/:id`

---

### 🚧 User Story 9: Secure Access
**Status:** 🚧 **BACKEND READY, FRONTEND PENDING**

**As a** user  
**I want to** securely access my expenses  
**So that** my data is private

**Acceptance Criteria:**
- ✅ Authentication required (backend supports)
- ⏳ User can access only own expenses (backend ready, frontend needs auth UI)

**Implementation:**
- Backend: JWT authentication ready
- Frontend: Need to add login/register UI
- `authAPI` in `apiClient.js` - Ready to use

---

### 🚧 User Story 10: Export Expenses
**Status:** 🚧 **PENDING**

**As a** user  
**I want to** export my expenses  
**So that** I can use them for reports or tax

**Acceptance Criteria:**
- ⏳ CSV / Excel export
- ⏳ Respects date filters

**Implementation Plan:**
- Add export button in `ExpenseList.jsx`
- Create export utility function
- Generate CSV/Excel from filtered expenses

---

## ⭐ Non-Functional Requirements

### Performance
- ✅ **Pagination:** Backend supports pagination (`page`, `limit` params)
- ⏳ **Virtualization:** Frontend can add react-window for large lists
- ✅ **Debouncing:** Filter changes debounced (300ms)
- ✅ **API Optimization:** Backend uses MongoDB indexes

### Data Handling
- ⚠️ **Monetary Values:** Currently using JavaScript `Number`
  - **Recommendation:** Use `decimal.js` or backend BigDecimal for precision
  - **Current:** Works for most use cases, but may have floating-point issues

### API Response Time
- ✅ **Target:** < 500ms
- ✅ **Current:** MongoDB queries optimized with indexes
- ✅ **Stats Endpoint:** Uses aggregation pipeline for efficiency

---

## 📊 Implementation Summary

| User Story | Status | Priority |
|------------|--------|----------|
| 1. Add Expense | ✅ Done | P0 |
| 2. View List | ✅ Done | P0 |
| 3. Filter by Date | ✅ Done | P0 |
| 4. Categorize | ✅ Done | P0 |
| 5. Summary | ✅ Done | P1 |
| 6. Visual Charts | 🚧 In Progress | P1 |
| 7. Edit Expense | ✅ Done | P0 |
| 8. Delete Expense | ✅ Done | P0 |
| 9. Secure Access | 🚧 Backend Ready | P2 |
| 10. Export | 🚧 Pending | P2 |

**Legend:**
- ✅ Implemented
- 🚧 In Progress / Partial
- ⏳ Pending
- P0 = Critical, P1 = Important, P2 = Nice to have

---

## 🚀 Next Steps

1. **Add Visual Charts** (User Story 6)
   - Install chart library
   - Create chart components
   - Integrate with stats API

2. **Export Functionality** (User Story 10)
   - Add export button
   - Implement CSV generation
   - Add Excel export option

3. **Authentication UI** (User Story 9)
   - Create login/register components
   - Add auth state management
   - Protect routes

4. **Performance Optimization**
   - Add virtualization for large lists
   - Implement proper decimal handling
   - Add caching for stats

---

## 📝 BDD Scenarios (Given-When-Then)

### Scenario: Add New Expense
```
Given I am on the expense tracker page
When I click the "+" button
And I fill in description "Lunch", amount "500", category "Food", date "2024-01-15"
And I click "Add Expense"
Then I should see a success message
And the expense should appear in the list
And the total should update
```

### Scenario: Filter by Date Range
```
Given I have expenses from January to March
When I set start date to "2024-02-01"
And I set end date to "2024-02-28"
Then I should see only February expenses
And the summary should reflect February totals
```

### Scenario: View Category Summary
```
Given I have expenses in multiple categories
When I view the summary section
Then I should see total expenses
And category-wise breakdown with percentages
And monthly breakdown
```

---

**Last Updated:** 2024-01-15

