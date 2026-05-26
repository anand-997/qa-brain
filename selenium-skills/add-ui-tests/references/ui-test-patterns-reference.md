# UI Test Patterns Reference

## Purpose
Comprehensive collection of UI test patterns for common automation scenarios. Includes complete test implementations for login, forms, navigation, tables, modals, drag-drop, file operations, and more.

---

## Table of Contents
1. [Login & Authentication Tests](#login--authentication-tests)
2. [Form Validation Tests](#form-validation-tests)
3. [Navigation Tests](#navigation-tests)
4. [Table/Grid Interaction Tests](#tablegrid-interaction-tests)
5. [Modal/Dialog Handling](#modaldialog-handling)
6. [Drag-and-Drop Tests](#drag-and-drop-tests)
7. [File Upload/Download Tests](#file-uploaddownload-tests)
8. [Responsive Testing Patterns](#responsive-testing-patterns)
9. [Cross-Browser Testing Patterns](#cross-browser-testing-patterns)
10. [E2E Testing Patterns](#e2e-testing-patterns)

---

## Login & Authentication Tests

### Pattern 1: Basic Login Test

```java
@Test(description = "Verify successful login with valid credentials",
      groups = {"smoke", "regression"}, priority = 1)
public void testValidLogin() {
    LoginPage loginPage = new LoginPage();
    
    HomePage homePage = loginPage.login(
        ConfigManager.get("test.username"),
        ConfigManager.get("test.password")
    );
    
    Assert.assertTrue(homePage.isUserLoggedIn(), 
        "User should be logged in successfully");
    Assert.assertEquals(homePage.getWelcomeMessage(), 
        "Welcome, Test User");
}
```

### Pattern 2: Invalid Login Scenarios

```java
@DataProvider(name = "invalidLoginData")
public Object[][] getInvalidLoginData() {
    return new Object[][] {
        {"invalid@email.com", "ValidPass123", "Invalid email or password"},
        {"valid@email.com", "WrongPassword", "Invalid email or password"},
        {"", "ValidPass123", "Email is required"},
        {"valid@email.com", "", "Password is required"},
        {"notemail", "ValidPass123", "Please enter a valid email"},
        {"valid@email.com", "123", "Password must be at least 8 characters"}
    };
}

@Test(dataProvider = "invalidLoginData",
      description = "Verify error messages for invalid login attempts")
public void testInvalidLogin(String email, String password, String expectedError) {
    LoginPage loginPage = new LoginPage();
    
    loginPage.enterEmail(email);
    loginPage.enterPassword(password);
    loginPage.clickLoginButton();
    
    Assert.assertTrue(loginPage.isErrorMessageDisplayed(),
        "Error message should be displayed");
    Assert.assertEquals(loginPage.getErrorMessageText(), expectedError,
        "Error message text should match");
    Assert.assertFalse(loginPage.isLoginSuccessful(),
        "Login should not succeed");
}
```

### Pattern 3: Remember Me Functionality

```java
@Test(description = "Verify Remember Me checkbox functionality")
public void testRememberMeFunction() {
    LoginPage loginPage = new LoginPage();
    
    // Login with Remember Me
    loginPage.enterEmail("test@example.com");
    loginPage.enterPassword("Password123");
    loginPage.selectRememberMe();
    HomePage homePage = loginPage.clickLoginButton();
    
    Assert.assertTrue(homePage.isUserLoggedIn());
    
    // Logout
    homePage.logout();
    
    // Reopen browser (simulate)
    driver.manage().deleteAllCookies();
    driver.navigate().refresh();
    
    // Verify user is still logged in or email is pre-filled
    loginPage = new LoginPage();
    String prefillEmail = loginPage.getEmailFieldValue();
    Assert.assertEquals(prefillEmail, "test@example.com",
        "Email should be pre-filled due to Remember Me");
}
```

### Pattern 4: Password Visibility Toggle

```java
@Test(description = "Verify password visibility toggle")
public void testPasswordVisibilityToggle() {
    LoginPage loginPage = new LoginPage();
    
    String password = "SecurePass123";
    loginPage.enterPassword(password);
    
    // Verify password is masked initially
    String inputType = loginPage.getPasswordFieldType();
    Assert.assertEquals(inputType, "password", "Password should be masked");
    
    // Click show password icon
    loginPage.clickShowPasswordIcon();
    
    // Verify password is visible
    inputType = loginPage.getPasswordFieldType();
    Assert.assertEquals(inputType, "text", "Password should be visible");
    
    // Verify password value
    String visiblePassword = loginPage.getPasswordFieldValue();
    Assert.assertEquals(visiblePassword, password);
    
    // Click hide password icon
    loginPage.clickHidePasswordIcon();
    
    // Verify password is masked again
    inputType = loginPage.getPasswordFieldType();
    Assert.assertEquals(inputType, "password", "Password should be masked again");
}
```

### Pattern 5: Session Timeout Handling

```java
@Test(description = "Verify session timeout redirects to login")
public void testSessionTimeout() {
    LoginPage loginPage = new LoginPage();
    HomePage homePage = loginPage.login("test@example.com", "Password123");
    
    Assert.assertTrue(homePage.isUserLoggedIn());
    
    // Simulate session timeout (delete session cookie)
    driver.manage().deleteCookieNamed("sessionId");
    
    // Try to access protected page
    driver.navigate().to(ConfigManager.get("app.url") + "/dashboard");
    
    // Verify redirected to login
    loginPage = new LoginPage();
    Assert.assertTrue(loginPage.isOnLoginPage(),
        "Should be redirected to login page after session timeout");
    Assert.assertTrue(loginPage.getSessionTimeoutMessage().contains("session has expired"),
        "Session timeout message should be displayed");
}
```

---

## Form Validation Tests

### Pattern 1: Required Field Validation

```java
@Test(description = "Verify all required fields show error when empty")
public void testRequiredFieldValidation() {
    RegistrationPage regPage = new RegistrationPage();
    
    // Submit form without filling any fields
    regPage.clickSubmitButton();
    
    // Verify error messages for all required fields
    SoftAssert softAssert = new SoftAssert();
    softAssert.assertTrue(regPage.isFirstNameErrorDisplayed(),
        "First name error should be displayed");
    softAssert.assertEquals(regPage.getFirstNameError(), "First name is required");
    
    softAssert.assertTrue(regPage.isLastNameErrorDisplayed(),
        "Last name error should be displayed");
    softAssert.assertEquals(regPage.getLastNameError(), "Last name is required");
    
    softAssert.assertTrue(regPage.isEmailErrorDisplayed(),
        "Email error should be displayed");
    softAssert.assertEquals(regPage.getEmailError(), "Email is required");
    
    softAssert.assertTrue(regPage.isPasswordErrorDisplayed(),
        "Password error should be displayed");
    softAssert.assertEquals(regPage.getPasswordError(), "Password is required");
    
    softAssert.assertAll();
}
```

### Pattern 2: Email Format Validation

```java
@DataProvider(name = "invalidEmails")
public Object[][] getInvalidEmails() {
    return new Object[][] {
        {"plaintext"},
        {"@example.com"},
        {"user@"},
        {"user @example.com"},
        {"user@.com"},
        {"user..name@example.com"},
        {"user@example"},
        {"user@example..com"}
    };
}

@Test(dataProvider = "invalidEmails",
      description = "Verify email format validation")
public void testEmailFormatValidation(String invalidEmail) {
    RegistrationPage regPage = new RegistrationPage();
    
    regPage.enterEmail(invalidEmail);
    regPage.clickSubmitButton();
    
    Assert.assertTrue(regPage.isEmailErrorDisplayed(),
        "Email format error should be displayed for: " + invalidEmail);
    Assert.assertEquals(regPage.getEmailError(), "Please enter a valid email address");
}
```

### Pattern 3: Password Strength Validation

```java
@Test(description = "Verify password strength requirements")
public void testPasswordStrengthValidation() {
    RegistrationPage regPage = new RegistrationPage();
    
    // Test weak password
    regPage.enterPassword("weak");
    Assert.assertEquals(regPage.getPasswordStrengthIndicator(), "Weak",
        "Password strength should be Weak");
    Assert.assertTrue(regPage.getPasswordStrengthColor().contains("red"));
    
    // Test medium password
    regPage.clearPassword();
    regPage.enterPassword("Medium123");
    Assert.assertEquals(regPage.getPasswordStrengthIndicator(), "Medium",
        "Password strength should be Medium");
    Assert.assertTrue(regPage.getPasswordStrengthColor().contains("orange"));
    
    // Test strong password
    regPage.clearPassword();
    regPage.enterPassword("Strong@Pass123");
    Assert.assertEquals(regPage.getPasswordStrengthIndicator(), "Strong",
        "Password strength should be Strong");
    Assert.assertTrue(regPage.getPasswordStrengthColor().contains("green"));
}
```

### Pattern 4: Real-time Field Validation

```java
@Test(description = "Verify real-time validation as user types")
public void testRealTimeValidation() {
    RegistrationPage regPage = new RegistrationPage();
    
    // Start typing email
    regPage.enterEmail("test");
    Assert.assertTrue(regPage.isEmailErrorDisplayed(),
        "Email error should show while typing invalid email");
    
    // Complete valid email
    regPage.enterEmail("test@example.com");
    Assert.assertFalse(regPage.isEmailErrorDisplayed(),
        "Email error should disappear when valid email entered");
    Assert.assertTrue(regPage.isEmailValidIconDisplayed(),
        "Valid email icon should be displayed");
}
```

### Pattern 5: Confirm Password Match

```java
@Test(description = "Verify password confirmation matching")
public void testPasswordConfirmationMatch() {
    RegistrationPage regPage = new RegistrationPage();
    
    String password = "SecurePass123";
    
    // Enter password
    regPage.enterPassword(password);
    
    // Enter non-matching confirmation
    regPage.enterConfirmPassword("DifferentPass123");
    regPage.clickSubmitButton();
    
    Assert.assertTrue(regPage.isConfirmPasswordErrorDisplayed(),
        "Confirmation password error should be displayed");
    Assert.assertEquals(regPage.getConfirmPasswordError(),
        "Passwords do not match");
    
    // Enter matching confirmation
    regPage.clearConfirmPassword();
    regPage.enterConfirmPassword(password);
    
    Assert.assertFalse(regPage.isConfirmPasswordErrorDisplayed(),
        "Error should disappear when passwords match");
}
```

---

## Navigation Tests

### Pattern 1: Top Navigation Menu

```java
@Test(description = "Verify all top navigation menu links")
public void testTopNavigationMenu() {
    HomePage homePage = new HomePage();
    
    SoftAssert softAssert = new SoftAssert();
    
    // Test Home link
    homePage.clickHomeLink();
    softAssert.assertTrue(homePage.isOnHomePage(), "Should navigate to home");
    
    // Test Products link
    ProductsPage productsPage = homePage.clickProductsLink();
    softAssert.assertTrue(productsPage.isOnProductsPage(), "Should navigate to products");
    
    // Test About link
    AboutPage aboutPage = homePage.clickAboutLink();
    softAssert.assertTrue(aboutPage.isOnAboutPage(), "Should navigate to about");
    
    // Test Contact link
    ContactPage contactPage = homePage.clickContactLink();
    softAssert.assertTrue(contactPage.isOnContactPage(), "Should navigate to contact");
    
    softAssert.assertAll();
}
```

### Pattern 2: Breadcrumb Navigation

```java
@Test(description = "Verify breadcrumb navigation")
public void testBreadcrumbNavigation() {
    HomePage homePage = new HomePage();
    
    // Navigate deep into hierarchy
    ProductsPage productsPage = homePage.clickProductsLink();
    CategoryPage categoryPage = productsPage.clickCategory("Electronics");
    SubCategoryPage subCategoryPage = categoryPage.clickSubCategory("Laptops");
    ProductDetailsPage productPage = subCategoryPage.clickProduct("Dell XPS 15");
    
    // Verify breadcrumb trail
    List<String> breadcrumbs = productPage.getBreadcrumbTrail();
    Assert.assertEquals(breadcrumbs.size(), 5, "Breadcrumb should have 5 levels");
    Assert.assertEquals(breadcrumbs.get(0), "Home");
    Assert.assertEquals(breadcrumbs.get(1), "Products");
    Assert.assertEquals(breadcrumbs.get(2), "Electronics");
    Assert.assertEquals(breadcrumbs.get(3), "Laptops");
    Assert.assertEquals(breadcrumbs.get(4), "Dell XPS 15");
    
    // Click breadcrumb to navigate back
    categoryPage = productPage.clickBreadcrumb("Electronics");
    Assert.assertTrue(categoryPage.isOnCategoryPage("Electronics"),
        "Should navigate back to Electronics category");
}
```

### Pattern 3: Tab Navigation

```java
@Test(description = "Verify tab navigation functionality")
public void testTabNavigation() {
    ProductDetailsPage productPage = new ProductDetailsPage();
    
    // Verify default tab is active
    Assert.assertTrue(productPage.isTabActive("Description"),
        "Description tab should be active by default");
    Assert.assertTrue(productPage.isDescriptionContentVisible(),
        "Description content should be visible");
    
    // Click Specifications tab
    productPage.clickTab("Specifications");
    Assert.assertTrue(productPage.isTabActive("Specifications"),
        "Specifications tab should be active");
    Assert.assertTrue(productPage.isSpecificationsContentVisible(),
        "Specifications content should be visible");
    Assert.assertFalse(productPage.isDescriptionContentVisible(),
        "Description content should be hidden");
    
    // Click Reviews tab
    productPage.clickTab("Reviews");
    Assert.assertTrue(productPage.isTabActive("Reviews"),
        "Reviews tab should be active");
    Assert.assertTrue(productPage.isReviewsContentVisible(),
        "Reviews content should be visible");
}
```

### Pattern 4: Pagination

```java
@Test(description = "Verify pagination functionality")
public void testPagination() {
    SearchResultsPage resultsPage = new SearchResultsPage();
    
    // Verify first page
    Assert.assertEquals(resultsPage.getCurrentPage(), 1,
        "Should be on page 1");
    Assert.assertTrue(resultsPage.isPreviousButtonDisabled(),
        "Previous button should be disabled on first page");
    
    int firstPageItemCount = resultsPage.getItemCount();
    String firstItemTitle = resultsPage.getItemTitle(0);
    
    // Click next page
    resultsPage.clickNextPage();
    Assert.assertEquals(resultsPage.getCurrentPage(), 2,
        "Should be on page 2");
    Assert.assertTrue(resultsPage.isPreviousButtonEnabled(),
        "Previous button should be enabled");
    
    String secondPageFirstItem = resultsPage.getItemTitle(0);
    Assert.assertNotEquals(firstItemTitle, secondPageFirstItem,
        "First item should be different on page 2");
    
    // Click specific page number
    resultsPage.clickPage(5);
    Assert.assertEquals(resultsPage.getCurrentPage(), 5,
        "Should be on page 5");
    
    // Click last page
    resultsPage.clickLastPage();
    Assert.assertTrue(resultsPage.isNextButtonDisabled(),
        "Next button should be disabled on last page");
}
```

---

## Table/Grid Interaction Tests

### Pattern 1: Basic Table Operations

```java
@Test(description = "Verify table data retrieval")
public void testTableDataRetrieval() {
    DashboardPage dashboard = new DashboardPage();
    
    // Get row count
    int rowCount = dashboard.getTableRowCount();
    Assert.assertTrue(rowCount > 0, "Table should have rows");
    
    // Get column count
    int columnCount = dashboard.getTableColumnCount();
    Assert.assertEquals(columnCount, 5, "Table should have 5 columns");
    
    // Get specific cell value
    String cellValue = dashboard.getTableCellValue(2, 3);
    Assert.assertNotNull(cellValue, "Cell value should not be null");
    
    // Get entire row data
    List<String> rowData = dashboard.getTableRowData(1);
    Assert.assertEquals(rowData.size(), 5, "Row should have 5 cells");
    
    // Get entire column data
    List<String> columnData = dashboard.getTableColumnData(2);
    Assert.assertEquals(columnData.size(), rowCount, "Column should have all row values");
}
```

### Pattern 2: Table Sorting

```java
@Test(description = "Verify table sorting functionality")
public void testTableSorting() {
    DashboardPage dashboard = new DashboardPage();
    
    // Get original data
    List<String> originalData = dashboard.getTableColumnData(1);
    
    // Click column header to sort ascending
    dashboard.clickColumnHeader("Name");
    List<String> sortedAscData = dashboard.getTableColumnData(1);
    
    // Verify ascending order
    List<String> expectedAsc = new ArrayList<>(originalData);
    Collections.sort(expectedAsc);
    Assert.assertEquals(sortedAscData, expectedAsc,
        "Data should be sorted in ascending order");
    
    // Click again to sort descending
    dashboard.clickColumnHeader("Name");
    List<String> sortedDescData = dashboard.getTableColumnData(1);
    
    // Verify descending order
    List<String> expectedDesc = new ArrayList<>(originalData);
    Collections.sort(expectedDesc, Collections.reverseOrder());
    Assert.assertEquals(sortedDescData, expectedDesc,
        "Data should be sorted in descending order");
}
```

### Pattern 3: Table Filtering

```java
@Test(description = "Verify table filtering functionality")
public void testTableFiltering() {
    DashboardPage dashboard = new DashboardPage();
    
    int originalRowCount = dashboard.getTableRowCount();
    
    // Apply filter
    dashboard.enterFilterText("Status", "Active");
    dashboard.clickApplyFilter();
    
    // Wait for filter to apply
    dashboard.waitForTableUpdate();
    
    // Verify filtered results
    int filteredRowCount = dashboard.getTableRowCount();
    Assert.assertTrue(filteredRowCount < originalRowCount,
        "Filtered row count should be less than original");
    
    // Verify all visible rows match filter
    List<String> statusColumn = dashboard.getTableColumnData("Status");
    for (String status : statusColumn) {
        Assert.assertEquals(status, "Active",
            "All filtered rows should have Active status");
    }
    
    // Clear filter
    dashboard.clickClearFilter();
    Assert.assertEquals(dashboard.getTableRowCount(), originalRowCount,
        "Row count should return to original after clearing filter");
}
```

### Pattern 4: Row Actions (Edit/Delete)

```java
@Test(description = "Verify row action buttons")
public void testTableRowActions() {
    DashboardPage dashboard = new DashboardPage();
    
    // Find row by value
    int rowIndex = dashboard.findRowByValue("Name", "John Doe");
    Assert.assertTrue(rowIndex >= 0, "Row should be found");
    
    // Click edit button in row
    EditModal editModal = dashboard.clickEditButton(rowIndex);
    Assert.assertTrue(editModal.isDisplayed(), "Edit modal should be displayed");
    
    // Verify data is pre-filled
    String name = editModal.getNameFieldValue();
    Assert.assertEquals(name, "John Doe", "Name should be pre-filled");
    
    // Update data
    editModal.setNameField("Jane Doe");
    editModal.clickSave();
    
    // Verify updated data in table
    dashboard.waitForTableUpdate();
    String updatedName = dashboard.getTableCellValue(rowIndex, "Name");
    Assert.assertEquals(updatedName, "Jane Doe", "Name should be updated");
}
```

### Pattern 5: Table Selection (Checkboxes)

```java
@Test(description = "Verify table row selection with checkboxes")
public void testTableRowSelection() {
    DashboardPage dashboard = new DashboardPage();
    
    // Verify no rows selected initially
    Assert.assertEquals(dashboard.getSelectedRowCount(), 0,
        "No rows should be selected initially");
    Assert.assertFalse(dashboard.isBulkActionButtonEnabled(),
        "Bulk action button should be disabled");
    
    // Select single row
    dashboard.selectRow(0);
    Assert.assertEquals(dashboard.getSelectedRowCount(), 1,
        "One row should be selected");
    Assert.assertTrue(dashboard.isBulkActionButtonEnabled(),
        "Bulk action button should be enabled");
    
    // Select multiple rows
    dashboard.selectRow(1);
    dashboard.selectRow(2);
    Assert.assertEquals(dashboard.getSelectedRowCount(), 3,
        "Three rows should be selected");
    
    // Select all rows
    dashboard.clickSelectAllCheckbox();
    int totalRows = dashboard.getTableRowCount();
    Assert.assertEquals(dashboard.getSelectedRowCount(), totalRows,
        "All rows should be selected");
    
    // Deselect all
    dashboard.clickSelectAllCheckbox();
    Assert.assertEquals(dashboard.getSelectedRowCount(), 0,
        "No rows should be selected after deselect all");
}
```

---

## Modal/Dialog Handling

### Pattern 1: Basic Modal Interaction

```java
@Test(description = "Verify modal open/close functionality")
public void testModalOpenClose() {
    HomePage homePage = new HomePage();
    
    // Open modal
    Modal modal = homePage.clickOpenModalButton();
    Assert.assertTrue(modal.isDisplayed(), "Modal should be displayed");
    Assert.assertTrue(modal.isOverlayDisplayed(), "Overlay should be displayed");
    
    // Verify modal content
    Assert.assertEquals(modal.getTitle(), "Modal Title");
    Assert.assertTrue(modal.isCloseButtonDisplayed(), "Close button should be present");
    
    // Close modal using close button
    modal.clickCloseButton();
    Assert.assertFalse(modal.isDisplayed(), "Modal should be closed");
    Assert.assertFalse(modal.isOverlayDisplayed(), "Overlay should be hidden");
}
```

### Pattern 2: Modal with Form Submission

```java
@Test(description = "Verify modal form submission")
public void testModalFormSubmission() {
    HomePage homePage = new HomePage();
    
    AddItemModal modal = homePage.clickAddItemButton();
    Assert.assertTrue(modal.isDisplayed());
    
    // Fill form in modal
    modal.enterName("Test Item");
    modal.enterDescription("Test Description");
    modal.selectCategory("Electronics");
    modal.enterPrice("99.99");
    
    // Submit form
    modal.clickSaveButton();
    
    // Verify modal closes
    Assert.assertFalse(modal.isDisplayed(), "Modal should close after save");
    
    // Verify success message
    Assert.assertTrue(homePage.isSuccessMessageDisplayed(),
        "Success message should be displayed");
    Assert.assertEquals(homePage.getSuccessMessage(),
        "Item added successfully");
    
    // Verify item appears in list
    Assert.assertTrue(homePage.isItemInList("Test Item"),
        "New item should appear in list");
}
```

### Pattern 3: Confirmation Dialog

```java
@Test(description = "Verify confirmation dialog for delete action")
public void testConfirmationDialog() {
    DashboardPage dashboard = new DashboardPage();
    
    int initialRowCount = dashboard.getTableRowCount();
    
    // Click delete button
    ConfirmDialog confirmDialog = dashboard.clickDeleteButton(0);
    Assert.assertTrue(confirmDialog.isDisplayed(), "Confirm dialog should be displayed");
    Assert.assertEquals(confirmDialog.getMessage(),
        "Are you sure you want to delete this item?");
    
    // Cancel deletion
    confirmDialog.clickCancel();
    Assert.assertFalse(confirmDialog.isDisplayed(), "Dialog should be closed");
    Assert.assertEquals(dashboard.getTableRowCount(), initialRowCount,
        "Row count should remain same after cancel");
    
    // Delete with confirmation
    confirmDialog = dashboard.clickDeleteButton(0);
    confirmDialog.clickConfirm();
    
    // Verify deletion
    dashboard.waitForTableUpdate();
    Assert.assertEquals(dashboard.getTableRowCount(), initialRowCount - 1,
        "Row count should decrease by 1");
}
```

### Pattern 4: Modal Close on Outside Click

```java
@Test(description = "Verify modal closes when clicking outside")
public void testModalCloseOnOutsideClick() {
    HomePage homePage = new HomePage();
    
    Modal modal = homePage.clickOpenModalButton();
    Assert.assertTrue(modal.isDisplayed());
    
    // Click on overlay (outside modal)
    modal.clickOverlay();
    
    // Verify modal closes
    Assert.assertFalse(modal.isDisplayed(),
        "Modal should close when clicking outside");
}
```

### Pattern 5: Nested Modals

```java
@Test(description = "Verify nested modal functionality")
public void testNestedModals() {
    HomePage homePage = new HomePage();
    
    // Open first modal
    FirstModal firstModal = homePage.clickOpenFirstModal();
    Assert.assertTrue(firstModal.isDisplayed(), "First modal should be displayed");
    
    // Open second modal from first modal
    SecondModal secondModal = firstModal.clickOpenSecondModal();
    Assert.assertTrue(secondModal.isDisplayed(), "Second modal should be displayed");
    Assert.assertTrue(firstModal.isDisplayed(), "First modal should still be visible");
    
    // Close second modal
    secondModal.clickClose();
    Assert.assertFalse(secondModal.isDisplayed(), "Second modal should be closed");
    Assert.assertTrue(firstModal.isDisplayed(), "First modal should still be open");
    
    // Close first modal
    firstModal.clickClose();
    Assert.assertFalse(firstModal.isDisplayed(), "First modal should be closed");
}
```

---

## Drag-and-Drop Tests

### Pattern 1: Simple Drag-and-Drop

```java
@Test(description = "Verify drag and drop functionality")
public void testDragAndDrop() {
    DragDropPage page = new DragDropPage();
    
    WebElement sourceElement = page.getSourceElement();
    WebElement targetElement = page.getTargetElement();
    
    // Verify initial state
    Assert.assertTrue(page.isElementInSourceContainer(sourceElement),
        "Element should be in source container");
    Assert.assertFalse(page.isElementInTargetContainer(sourceElement),
        "Element should not be in target container");
    
    // Perform drag and drop
    page.dragAndDrop(sourceElement, targetElement);
    
    // Verify final state
    Assert.assertFalse(page.isElementInSourceContainer(sourceElement),
        "Element should not be in source container");
    Assert.assertTrue(page.isElementInTargetContainer(sourceElement),
        "Element should be in target container");
}
```

### Pattern 2: Sortable List Drag-and-Drop

```java
@Test(description = "Verify sortable list reordering")
public void testSortableListReorder() {
    TaskBoardPage taskBoard = new TaskBoardPage();
    
    // Get original order
    List<String> originalOrder = taskBoard.getTaskOrder();
    Assert.assertEquals(originalOrder.get(0), "Task 1");
    Assert.assertEquals(originalOrder.get(1), "Task 2");
    Assert.assertEquals(originalOrder.get(2), "Task 3");
    
    // Drag Task 3 to first position
    taskBoard.dragTaskToPosition("Task 3", 0);
    
    // Verify new order
    List<String> newOrder = taskBoard.getTaskOrder();
    Assert.assertEquals(newOrder.get(0), "Task 3");
    Assert.assertEquals(newOrder.get(1), "Task 1");
    Assert.assertEquals(newOrder.get(2), "Task 2");
}
```

### Pattern 3: Kanban Board Drag-and-Drop

```java
@Test(description = "Verify kanban board task movement")
public void testKanbanBoardDragDrop() {
    KanbanBoardPage kanban = new KanbanBoardPage();
    
    // Verify task is in "To Do" column
    Assert.assertTrue(kanban.isTaskInColumn("Task 1", "To Do"),
        "Task should be in To Do column");
    
    // Drag task to "In Progress" column
    kanban.dragTaskToColumn("Task 1", "In Progress");
    
    // Verify task moved
    Assert.assertFalse(kanban.isTaskInColumn("Task 1", "To Do"),
        "Task should not be in To Do column");
    Assert.assertTrue(kanban.isTaskInColumn("Task 1", "In Progress"),
        "Task should be in In Progress column");
    
    // Verify column counts updated
    Assert.assertEquals(kanban.getColumnTaskCount("To Do"), 2);
    Assert.assertEquals(kanban.getColumnTaskCount("In Progress"), 1);
}
```

---

## File Upload/Download Tests

### Pattern 1: Single File Upload

```java
@Test(description = "Verify single file upload")
public void testSingleFileUpload() {
    UploadPage uploadPage = new UploadPage();
    
    String filePath = System.getProperty("user.dir") + "/uploads/test-document.pdf";
    
    // Upload file
    uploadPage.uploadFile(filePath);
    
    // Verify file uploaded
    Assert.assertTrue(uploadPage.isFileUploaded("test-document.pdf"),
        "File should be uploaded");
    Assert.assertEquals(uploadPage.getUploadedFileName(), "test-document.pdf");
    Assert.assertTrue(uploadPage.isUploadSuccessMessageDisplayed(),
        "Success message should be displayed");
}
```

### Pattern 2: Multiple File Upload

```java
@Test(description = "Verify multiple file upload")
public void testMultipleFileUpload() {
    UploadPage uploadPage = new UploadPage();
    
    String file1 = System.getProperty("user.dir") + "/uploads/file1.pdf";
    String file2 = System.getProperty("user.dir") + "/uploads/file2.jpg";
    String file3 = System.getProperty("user.dir") + "/uploads/file3.docx";
    
    // Upload multiple files
    uploadPage.uploadMultipleFiles(file1, file2, file3);
    
    // Verify all files uploaded
    Assert.assertEquals(uploadPage.getUploadedFileCount(), 3,
        "Three files should be uploaded");
    Assert.assertTrue(uploadPage.isFileInList("file1.pdf"));
    Assert.assertTrue(uploadPage.isFileInList("file2.jpg"));
    Assert.assertTrue(uploadPage.isFileInList("file3.docx"));
}
```

### Pattern 3: File Download Verification

```java
@Test(description = "Verify file download")
public void testFileDownload() throws InterruptedException {
    DownloadPage downloadPage = new DownloadPage();
    
    String downloadDir = System.getProperty("user.dir") + "/downloads/";
    String expectedFileName = "sample-report.pdf";
    File downloadedFile = new File(downloadDir + expectedFileName);
    
    // Delete file if exists
    if (downloadedFile.exists()) {
        downloadedFile.delete();
    }
    
    // Trigger download
    downloadPage.clickDownloadButton();
    
    // Wait for download to complete
    int maxWait = 30;
    int waited = 0;
    while (!downloadedFile.exists() && waited < maxWait) {
        Thread.sleep(1000);
        waited++;
    }
    
    // Verify file downloaded
    Assert.assertTrue(downloadedFile.exists(),
        "File should be downloaded");
    Assert.assertTrue(downloadedFile.length() > 0,
        "Downloaded file should not be empty");
}
```

---

## Responsive Testing Patterns

### Pattern 1: Mobile Viewport Testing

```java
@Test(description = "Verify responsive design in mobile viewport")
public void testMobileViewport() {
    // Set mobile viewport
    driver.manage().window().setSize(new Dimension(375, 812)); // iPhone X
    
    HomePage homePage = new HomePage();
    homePage.navigateTo("/");
    
    // Verify mobile menu icon is displayed
    Assert.assertTrue(homePage.isMobileMenuIconDisplayed(),
        "Mobile menu icon should be displayed");
    Assert.assertFalse(homePage.isDesktopMenuDisplayed(),
        "Desktop menu should be hidden");
    
    // Open mobile menu
    homePage.clickMobileMenuIcon();
    Assert.assertTrue(homePage.isMobileMenuOpen(),
        "Mobile menu should be open");
    
    // Verify menu items
    Assert.assertTrue(homePage.isMobileMenuItemDisplayed("Home"));
    Assert.assertTrue(homePage.isMobileMenuItemDisplayed("Products"));
}
```

### Pattern 2: Tablet Viewport Testing

```java
@Test(description = "Verify layout in tablet viewport")
public void testTabletViewport() {
    // Set tablet viewport
    driver.manage().window().setSize(new Dimension(768, 1024)); // iPad
    
    DashboardPage dashboard = new DashboardPage();
    
    // Verify tablet-specific layout
    Assert.assertEquals(dashboard.getSidebarWidth(), 200,
        "Sidebar should have reduced width on tablet");
    Assert.assertTrue(dashboard.isGridLayoutTwoColumns(),
        "Grid should display 2 columns on tablet");
}
```

---

## Cross-Browser Testing Patterns

### Pattern 1: Cross-Browser Test Suite

```xml
<!-- testng-crossbrowser.xml -->
<suite name="Cross Browser Suite" parallel="tests" thread-count="3">
    <test name="Chrome Test">
        <parameter name="browser" value="chrome"/>
        <classes>
            <class name="tests.LoginTests"/>
        </classes>
    </test>
    <test name="Firefox Test">
        <parameter name="browser" value="firefox"/>
        <classes>
            <class name="tests.LoginTests"/>
        </classes>
    </test>
    <test name="Edge Test">
        <parameter name="browser" value="edge"/>
        <classes>
            <class name="tests.LoginTests"/>
        </classes>
    </test>
</suite>
```

---

## E2E Testing Patterns

### Pattern 1: Complete User Journey

```java
@Test(description = "E2E: Complete shopping journey")
public void testCompleteShoppingJourney() {
    // Step 1: Register
    HomePage homePage = new HomePage();
    RegistrationPage regPage = homePage.clickRegister();
    String email = "user" + System.currentTimeMillis() + "@example.com";
    homePage = regPage.register("Test User", email, "Password123");
    
    // Step 2: Search product
    SearchResultsPage resultsPage = homePage.searchProduct("laptop");
    Assert.assertTrue(resultsPage.hasResults());
    
    // Step 3: Add to cart
    ProductPage productPage = resultsPage.clickFirstProduct();
    CartPage cartPage = productPage.addToCart();
    
    // Step 4: Checkout
    CheckoutPage checkoutPage = cartPage.proceedToCheckout();
    checkoutPage.enterShippingAddress("123 Test St", "Test City", "12345");
    checkoutPage.enterPaymentDetails("4111111111111111", "12/26", "123");
    
    // Step 5: Place order
    OrderConfirmationPage confirmPage = checkoutPage.placeOrder();
    Assert.assertTrue(confirmPage.isOrderSuccessful());
    String orderId = confirmPage.getOrderId();
    Assert.assertNotNull(orderId);
}
```

---

**Last Updated**: January 2026  
**Version**: 2.0

