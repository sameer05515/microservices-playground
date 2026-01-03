# Testing Guide

This document describes the test suite for the Directory/Topic/Question Management application.

---

## Backend Tests (Spring Boot)

### Test Structure

```
backend-spring-boot/src/test/java/com/p/backend/
├── service/
│   ├── DirectoryServiceTest.java
│   ├── TopicServiceTest.java
│   └── QuestionServiceTest.java
├── controller/
│   ├── DirectoryControllerTest.java
│   ├── QuestionControllerTest.java
│   └── HealthControllerTest.java
├── repository/
│   └── DirectoryRepositoryTest.java
└── BackendApplicationTests.java
```

### Running Backend Tests

#### Using Maven
```bash
cd backend-spring-boot
mvn test
```

#### Run Specific Test Class
```bash
mvn test -Dtest=DirectoryServiceTest
```

#### Run with Coverage
```bash
mvn test jacoco:report
```

### Test Categories

#### 1. Service Tests (Unit Tests)
- **DirectoryServiceTest**: Tests directory CRUD operations, hierarchy management, cascading deletes
- **TopicServiceTest**: Tests topic CRUD operations, directory association
- **QuestionServiceTest**: Tests question CRUD operations, parent association (directory/topic)

**Key Test Cases:**
- ✅ Create operations with valid data
- ✅ Create operations with duplicate names (should fail)
- ✅ Get by ID operations
- ✅ Update operations
- ✅ Delete operations (soft delete)
- ✅ Cascading delete when parent is deleted
- ✅ Search operations

#### 2. Controller Tests (Integration Tests)
- **DirectoryControllerTest**: Tests REST endpoints for directories
- **QuestionControllerTest**: Tests REST endpoints for questions
- **HealthControllerTest**: Tests health check endpoint

**Key Test Cases:**
- ✅ POST endpoints (create)
- ✅ GET endpoints (retrieve)
- ✅ PUT endpoints (update)
- ✅ DELETE endpoints (delete)
- ✅ HTTP status codes validation
- ✅ Response body validation

#### 3. Repository Tests (Data Layer Tests)
- **DirectoryRepositoryTest**: Tests MongoDB repository queries

**Key Test Cases:**
- ✅ Save and find operations
- ✅ Find by parent ID
- ✅ Find root directories
- ✅ Soft delete filtering

---

## Frontend Tests (Next.js)

### Test Structure

```
frontend-nextjs/__tests__/
├── components/
│   ├── DirectoryTree.test.tsx
│   └── QuestionList.test.tsx
└── lib/
    └── api.test.ts
```

### Running Frontend Tests

#### Run All Tests
```bash
cd frontend-nextjs
npm test
```

#### Run in Watch Mode
```bash
npm run test:watch
```

#### Run with Coverage
```bash
npm run test:coverage
```

### Test Categories

#### 1. Component Tests
- **DirectoryTree.test.tsx**: Tests directory tree component
  - Rendering directory names
  - Click handlers (select, edit, delete)
  - Expand/collapse functionality
  - Action buttons (add sub-dir, add topic, add question)

- **QuestionList.test.tsx**: Tests question list component
  - Empty state rendering
  - Question list rendering
  - Expand/collapse answers
  - Tag display
  - Edit/delete actions

#### 2. API Service Tests
- **api.test.ts**: Tests API service layer
  - Directory API calls
  - Topic API calls
  - Question API calls
  - Search API calls

---

## Test Coverage Goals

### Backend
- **Service Layer**: 80%+ coverage
- **Controller Layer**: 70%+ coverage
- **Repository Layer**: 60%+ coverage

### Frontend
- **Components**: 70%+ coverage
- **API Services**: 80%+ coverage

---

## Writing New Tests

### Backend Test Template

```java
@ExtendWith(MockitoExtension.class)
class YourServiceTest {
    
    @Mock
    private YourRepository repository;
    
    @InjectMocks
    private YourService service;
    
    @Test
    void testYourMethod_Success() {
        // Given
        // Setup test data
        
        // When
        // Call method
        
        // Then
        // Assert results
    }
}
```

### Frontend Test Template

```typescript
describe('YourComponent', () => {
  it('renders correctly', () => {
    render(<YourComponent />);
    expect(screen.getByText('Expected Text')).toBeInTheDocument();
  });
  
  it('handles user interaction', () => {
    const onAction = jest.fn();
    render(<YourComponent onAction={onAction} />);
    
    fireEvent.click(screen.getByRole('button'));
    expect(onAction).toHaveBeenCalled();
  });
});
```

---

## Continuous Integration

### GitHub Actions Example

```yaml
name: Tests

on: [push, pull_request]

jobs:
  backend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-java@v2
        with:
          java-version: '21'
      - name: Run Backend Tests
        run: |
          cd backend-spring-boot
          mvn test

  frontend-tests:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
        with:
          node-version: '18'
      - name: Run Frontend Tests
        run: |
          cd frontend-nextjs
          npm install
          npm test
```

---

## Test Data

### Backend Test Data
- Uses in-memory MongoDB for repository tests
- Uses mocks for service and controller tests
- Test data is created in `@BeforeEach` methods

### Frontend Test Data
- Mock data defined in test files
- Uses `@testing-library` for component testing
- Mocks axios for API tests

---

## Troubleshooting

### Backend Tests Failing

1. **MongoDB Connection Issues**
   - Ensure MongoDB is running
   - Check connection string in test properties
   - Use embedded MongoDB for tests if needed

2. **Mock Issues**
   - Verify `@Mock` and `@InjectMocks` annotations
   - Check method stubbing with `when().thenReturn()`

### Frontend Tests Failing

1. **Module Resolution Issues**
   - Check `jest.config.js` path mappings
   - Verify `tsconfig.json` paths match

2. **Component Rendering Issues**
   - Ensure proper imports
   - Check for missing providers/contexts

---

## Best Practices

1. **Test Naming**: Use descriptive names like `testMethodName_Scenario_ExpectedResult`
2. **Arrange-Act-Assert**: Structure tests clearly
3. **Isolation**: Each test should be independent
4. **Mock External Dependencies**: Don't test external services
5. **Cover Edge Cases**: Test both success and failure scenarios
6. **Keep Tests Fast**: Use mocks instead of real database calls when possible

---

## Running Tests in Batch Files

Add to your batch files:

```batch
@echo off
echo Running Backend Tests...
cd backend-spring-boot
mvn test
cd ..

echo.
echo Running Frontend Tests...
cd frontend-nextjs
npm test
cd ..
```

