# Page Object Prompts Reference

## Purpose
Ready-to-use AI prompts for generating Page Object classes, locators, components, and POM utilities. Copy these prompts into ChatGPT/Claude to generate working code instantly.

---

## Table of Contents
1. [Generate Page Object from URL](#generate-page-object-from-url)
2. [Generate Page Object from HTML](#generate-page-object-from-html)
3. [Locator Strategy Generator](#locator-strategy-generator)
4. [Wait Strategy Generator](#wait-strategy-generator)
5. [Page Component Library](#page-component-library)
6. [Custom Page Assertions](#custom-page-assertions)
7. [Dynamic Element Handling](#dynamic-element-handling)
8. [Shadow DOM Page Objects](#shadow-dom-page-objects)
9. [iFrame Page Objects](#iframe-page-objects)
10. [Data-Driven Page Objects](#data-driven-page-objects)

---

## Generate Page Object from URL

### Prompt Template

```
Generate a complete Selenium Page Object class for the following page:

URL: [PASTE_PAGE_URL]

Requirements:
1. Analyze the page at the provided URL
2. Identify all interactive elements (buttons, links, input fields, dropdowns, checkboxes, etc.)
3. Generate locators using this priority: id > name > css > xpath
4. Create a Java class that extends BasePage
5. Use @FindBy annotations with PageFactory
6. Include all element declarations (private fields)
7. Include action methods (click, enter, select, etc.)
8. Include validation/getter methods (isDisplayed, getText, etc.)
9. Add JavaDoc comments for each method
10. Follow Page Object Model best practices

Page functionality to automate:
[DESCRIBE WHAT THIS PAGE DOES - e.g., "Login page with email, password, remember me, forgot password"]

Generate complete Java code with:
- Class structure
- All locators
- All methods
- Proper naming conventions
- Waits where appropriate
```

### Example Usage

```
Generate a complete Selenium Page Object class for the following page:

URL: https://www.saucedemo.com/

Requirements: [same as above]

Page functionality to automate:
- Login page with username field, password field, login button
- Should validate error messages
- Should handle successful login navigation to inventory page
```

### Expected Output Sample

```java
package pages;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import base.BasePage;

/**
 * LoginPage - Page Object for Sauce Demo login page
 * URL: https://www.saucedemo.com/
 */
public class LoginPage extends BasePage {

    // ==================== LOCATORS ====================
    
    @FindBy(id = "user-name")
    private WebElement usernameField;
    
    @FindBy(id = "password")
    private WebElement passwordField;
    
    @FindBy(id = "login-button")
    private WebElement loginButton;
    
    @FindBy(css = "h3[data-test='error']")
    private WebElement errorMessage;
    
    // ==================== CONSTRUCTOR ====================
    
    public LoginPage() {
        super();
    }
    
    // ==================== ACTIONS ====================
    
    public void enterUsername(String username) {
        sendKeys(usernameField, username);
    }
    
    public void enterPassword(String password) {
        sendKeys(passwordField, password);
    }
    
    public InventoryPage clickLoginButton() {
        click(loginButton);
        return new InventoryPage();
    }
    
    public InventoryPage login(String username, String password) {
        enterUsername(username);
        enterPassword(password);
        return clickLoginButton();
    }
    
    // ==================== VALIDATIONS ====================
    
    public boolean isErrorMessageDisplayed() {
        return isDisplayed(errorMessage);
    }
    
    public String getErrorMessageText() {
        return getText(errorMessage);
    }
    
    public boolean isLoginButtonDisplayed() {
        return isDisplayed(loginButton);
    }
}
```

---

## Generate Page Object from HTML

### Prompt Template

```
Generate a Selenium Page Object class for the following HTML:

[PASTE HTML CODE HERE]

Requirements:
1. Extract all interactive elements from the HTML
2. Generate optimal locators (prefer id, name, then css/xpath)
3. Create @FindBy annotations
4. Generate action methods for each element
5. Add validation methods
6. Extend BasePage
7. Use PageFactory pattern
8. Add proper comments

Element types to identify:
- Input fields (text, email, password, number, etc.)
- Buttons
- Links
- Dropdowns (select)
- Checkboxes
- Radio buttons
- Textareas
- Labels

Generate complete Java class code.
```

### Example Usage

```
Generate a Selenium Page Object class for the following HTML:

<form id="registration-form">
    <input type="text" id="firstName" name="firstName" placeholder="First Name">
    <input type="text" id="lastName" name="lastName" placeholder="Last Name">
    <input type="email" id="email" name="email" placeholder="Email">
    <input type="password" id="password" name="password" placeholder="Password">
    <select id="country" name="country">
        <option value="">Select Country</option>
        <option value="us">United States</option>
        <option value="uk">United Kingdom</option>
    </select>
    <input type="checkbox" id="terms" name="terms">
    <label for="terms">I accept terms and conditions</label>
    <button type="submit" id="submitBtn">Register</button>
</form>
<div id="successMessage" class="alert alert-success" style="display:none">
    Registration successful!
</div>
<div id="errorMessage" class="alert alert-danger" style="display:none">
    Registration failed!
</div>

Requirements: [same as above]
```

---

## Locator Strategy Generator

### Prompt Template

```
Generate optimal locators for the following HTML element:

[PASTE HTML CODE]

Provide:
1. All possible locator strategies (ID, Name, Class, CSS, XPath)
2. Rank them by reliability (most reliable first)
3. Explain pros/cons of each
4. Recommend the best locator and backup locator
5. Generate @FindBy annotation code

Consider:
- Uniqueness
- Stability (resistance to page changes)
- Performance
- Readability
```

### Example Usage

```
Generate optimal locators for the following HTML element:

<button 
    id="submit-btn" 
    class="btn btn-primary" 
    type="submit" 
    data-testid="login-submit"
    name="submitButton">
    Login
</button>

Provide: [requirements above]
```

### Expected Output

```
RECOMMENDED LOCATORS (Ranked):

1. By ID (BEST - Most Reliable)
   @FindBy(id = "submit-btn")
   ✅ Pros: Unique, fast, stable
   ❌ Cons: None

2. By data-testid (RECOMMENDED BACKUP)
   @FindBy(css = "[data-testid='login-submit']")
   ✅ Pros: Designed for testing, stable
   ❌ Cons: Requires developers to add attribute

3. By Name
   @FindBy(name = "submitButton")
   ✅ Pros: Reasonably unique, stable
   ❌ Cons: May not be unique if form has multiple submit buttons

4. By CSS Class (USE WITH CAUTION)
   @FindBy(css = "button.btn.btn-primary")
   ✅ Pros: Works across similar elements
   ❌ Cons: Not unique, may match multiple elements

5. By XPath (AVOID IF POSSIBLE)
   @FindBy(xpath = "//button[@type='submit' and text()='Login']")
   ✅ Pros: Flexible, can combine multiple attributes
   ❌ Cons: Slower, brittle if structure changes

BEST CHOICE: Use ID (option 1)
BACKUP: Use data-testid (option 2)

RECOMMENDED CODE:
@FindBy(id = "submit-btn")
private WebElement loginButton;
```

---

## Wait Strategy Generator

### Prompt Template

```
Generate wait strategy for the following scenario:

Scenario: [DESCRIBE SCENARIO]
Element: [DESCRIBE ELEMENT]
Action: [WHAT NEEDS TO HAPPEN]

Requirements:
1. Generate appropriate explicit wait code
2. Use WebDriverWait with ExpectedConditions
3. Handle potential exceptions
4. Set reasonable timeout
5. Add logging
6. Provide alternative approaches

Common scenarios:
- Element to be clickable
- Element to be visible
- Element to disappear
- Text to appear in element
- AJAX call to complete
- Page to load
- Alert to appear
```

### Example Usage

```
Generate wait strategy for the following scenario:

Scenario: After clicking submit button, a loading spinner appears, then results load
Element: Loading spinner (class="spinner"), Results table (id="results-table")
Action: Wait for spinner to disappear, then verify table is visible

Requirements: [same as above]
```

### Expected Output

```java
/**
 * Waits for loading spinner to disappear and results table to appear
 * @param timeout Maximum wait time in seconds
 */
public void waitForResultsToLoad(int timeout) {
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeout));
    
    try {
        // Step 1: Wait for spinner to appear (confirms action started)
        logger.info("Waiting for loading spinner to appear");
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.className("spinner")));
        
        // Step 2: Wait for spinner to disappear (loading complete)
        logger.info("Waiting for loading spinner to disappear");
        wait.until(ExpectedConditions.invisibilityOfElementLocated(
            By.className("spinner")));
        
        // Step 3: Wait for results table to be visible
        logger.info("Waiting for results table to be visible");
        wait.until(ExpectedConditions.visibilityOfElementLocated(
            By.id("results-table")));
        
        logger.info("Results loaded successfully");
        
    } catch (TimeoutException e) {
        logger.error("Timeout waiting for results to load", e);
        throw new RuntimeException("Results did not load within " + timeout + " seconds", e);
    }
}

// Alternative: Custom ExpectedCondition
public void waitForResultsAlternative(int timeout) {
    WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(timeout));
    
    wait.until(new ExpectedCondition<Boolean>() {
        public Boolean apply(WebDriver driver) {
            WebElement spinner = driver.findElement(By.className("spinner"));
            WebElement table = driver.findElement(By.id("results-table"));
            // Return true when spinner is hidden AND table is visible
            return !spinner.isDisplayed() && table.isDisplayed();
        }
    });
}
```

---

## Page Component Library

### Prompt Template

```
Generate a reusable component class for [COMPONENT_TYPE]:

Component Type: [Header / Footer / Navigation / Search Bar / User Dropdown / etc.]

Requirements:
1. Create a separate component class
2. Include all elements and actions for this component
3. Make it reusable across multiple pages
4. Extend BasePage
5. Use composition pattern
6. Add JavaDoc comments

The component should be imported into page classes where needed.

Generate complete component class code.
```

### Example Usage

```
Generate a reusable component class for Header Navigation:

Component Type: Header Navigation Bar

Elements include:
- Logo (links to home)
- Search box
- Shopping cart icon with count
- User account dropdown
- Logout button

Requirements: [same as above]
```

### Expected Output

```java
package components;

import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;
import base.BasePage;
import pages.HomePage;
import pages.CartPage;
import pages.SearchResultsPage;

/**
 * HeaderComponent - Reusable header navigation component
 * Present on most pages in the application
 */
public class HeaderComponent extends BasePage {

    // ==================== LOCATORS ====================
    
    @FindBy(id = "site-logo")
    private WebElement logo;
    
    @FindBy(id = "search-box")
    private WebElement searchBox;
    
    @FindBy(id = "search-btn")
    private WebElement searchButton;
    
    @FindBy(id = "cart-icon")
    private WebElement cartIcon;
    
    @FindBy(className = "cart-count")
    private WebElement cartCount;
    
    @FindBy(id = "user-dropdown")
    private WebElement userDropdown;
    
    @FindBy(linkText = "My Account")
    private WebElement myAccountLink;
    
    @FindBy(linkText = "Logout")
    private WebElement logoutLink;
    
    // ==================== CONSTRUCTOR ====================
    
    public HeaderComponent() {
        super();
    }
    
    // ==================== ACTIONS ====================
    
    public HomePage clickLogo() {
        click(logo);
        return new HomePage();
    }
    
    public SearchResultsPage searchFor(String query) {
        sendKeys(searchBox, query);
        click(searchButton);
        return new SearchResultsPage();
    }
    
    public CartPage clickCartIcon() {
        click(cartIcon);
        return new CartPage();
    }
    
    public void openUserDropdown() {
        click(userDropdown);
    }
    
    public void logout() {
        openUserDropdown();
        click(logoutLink);
    }
    
    // ==================== GETTERS ====================
    
    public int getCartItemCount() {
        String count = getText(cartCount);
        return Integer.parseInt(count);
    }
    
    public boolean isUserLoggedIn() {
        return isDisplayed(userDropdown);
    }
}
```

**Usage in Page Class:**
```java
public class ProductPage extends BasePage {
    
    private HeaderComponent header;
    
    public ProductPage() {
        super();
        this.header = new HeaderComponent();
    }
    
    public SearchResultsPage searchProduct(String product) {
        return header.searchFor(product);
    }
    
    public void logout() {
        header.logout();
    }
}
```

---

## Custom Page Assertions

### Prompt Template

```
Generate custom assertion methods for [PAGE_NAME]:

Page: [PAGE NAME and PURPOSE]

Requirements:
1. Create validation/assertion methods specific to this page
2. Methods should return boolean or String for assertions
3. Include methods to verify page loaded correctly
4. Add methods to verify element states
5. Add methods to verify data accuracy
6. Methods should not contain Assert statements (return data for test to assert)

Common assertion types:
- isOnPage() - Verify current page
- isElementDisplayed() - Visibility checks
- getElementText() - Get text for assertion
- isElementEnabled() - State checks
- getElementCount() - Count checks

Generate methods for the page.
```

### Example Usage

```
Generate custom assertion methods for Product Details Page:

Page: Product Details Page - Shows product information, price, add to cart

Elements to validate:
- Product title
- Product price
- Product image
- Add to cart button
- Stock availability
- Product description
- Customer ratings

Requirements: [same as above]
```

### Expected Output

```java
// Add these validation methods to ProductDetailsPage class

// ==================== PAGE VALIDATIONS ====================

/**
 * Verifies user is on product details page
 * @return true if on product details page
 */
public boolean isOnProductDetailsPage() {
    return getCurrentUrl().contains("/product/") 
        && isDisplayed(productTitle);
}

/**
 * Checks if product image is displayed
 * @return true if product image is visible
 */
public boolean isProductImageDisplayed() {
    return isDisplayed(productImage);
}

/**
 * Checks if add to cart button is enabled
 * @return true if button is enabled
 */
public boolean isAddToCartButtonEnabled() {
    return isEnabled(addToCartButton);
}

/**
 * Gets product title text
 * @return Product title as String
 */
public String getProductTitle() {
    return getText(productTitle);
}

/**
 * Gets product price
 * @return Product price as double
 */
public double getProductPrice() {
    String priceText = getText(productPrice);
    // Remove currency symbol and parse
    priceText = priceText.replaceAll("[^0-9.]", "");
    return Double.parseDouble(priceText);
}

/**
 * Gets stock availability status
 * @return Stock status (In Stock, Out of Stock, etc.)
 */
public String getStockStatus() {
    return getText(stockAvailability);
}

/**
 * Checks if product is in stock
 * @return true if in stock
 */
public boolean isProductInStock() {
    return getStockStatus().equalsIgnoreCase("In Stock");
}

/**
 * Gets average customer rating
 * @return Rating as double (0-5)
 */
public double getAverageRating() {
    String ratingText = getAttribute(ratingElement, "data-rating");
    return Double.parseDouble(ratingText);
}

/**
 * Gets number of customer reviews
 * @return Review count as integer
 */
public int getReviewCount() {
    String countText = getText(reviewCount);
    countText = countText.replaceAll("[^0-9]", "");
    return Integer.parseInt(countText);
}

/**
 * Gets product description text
 * @return Description as String
 */
public String getProductDescription() {
    return getText(productDescription);
}

/**
 * Verifies all required product information is displayed
 * @return true if all required elements are present
 */
public boolean isProductInformationComplete() {
    return isProductImageDisplayed()
        && !getProductTitle().isEmpty()
        && getProductPrice() > 0
        && !getStockStatus().isEmpty()
        && !getProductDescription().isEmpty();
}
```

**Usage in Test:**
```java
@Test
public void testProductDetailsPage() {
    ProductDetailsPage productPage = new ProductDetailsPage();
    
    Assert.assertTrue(productPage.isOnProductDetailsPage());
    Assert.assertTrue(productPage.isProductInformationComplete());
    Assert.assertTrue(productPage.getProductPrice() > 0);
    Assert.assertTrue(productPage.isProductInStock());
    Assert.assertTrue(productPage.getAverageRating() >= 4.0);
}
```

---

## Dynamic Element Handling

### Prompt Template

```
Generate code to handle dynamic elements with changing attributes:

Dynamic Element: [DESCRIBE ELEMENT]
Dynamic Attribute: [What changes - ID, class, etc.]
Pattern: [Describe the pattern - e.g., "button-12345 where 12345 changes"]
Stable Attributes: [What doesn't change]

Requirements:
1. Create dynamic locator using stable attributes
2. Handle stale element exception
3. Use XPath/CSS functions (contains, starts-with, etc.)
4. Create reusable method
5. Add retry mechanism if needed

Generate code to reliably locate and interact with this element.
```

### Example Usage

```
Generate code to handle dynamic elements with changing attributes:

Dynamic Element: Submit button
Dynamic Attribute: ID changes on each page load (e.g., "submit-btn-xyz123", "submit-btn-abc456")
Pattern: ID format is always "submit-btn-" followed by random alphanumeric
Stable Attributes: class="submit-button", type="submit", text="Submit"

Requirements: [same as above]
```

### Expected Output

```java
// Option 1: Using XPath with starts-with
@FindBy(xpath = "//button[starts-with(@id, 'submit-btn-') and @type='submit']")
private WebElement submitButton;

// Option 2: Using CSS with attribute starts with
@FindBy(css = "button[id^='submit-btn-'][type='submit']")
private WebElement submitButton;

// Option 3: Using XPath with text and class
@FindBy(xpath = "//button[@class='submit-button' and text()='Submit']")
private WebElement submitButton;

// Option 4: Dynamic locator method with retry
public WebElement getSubmitButton() {
    int attempts = 0;
    int maxAttempts = 3;
    
    while (attempts < maxAttempts) {
        try {
            // Try to find element with partial ID match
            WebElement element = driver.findElement(
                By.xpath("//button[starts-with(@id, 'submit-btn-')]"));
            
            // Verify element is the right one by checking text
            if (element.getText().equals("Submit")) {
                return element;
            }
        } catch (StaleElementReferenceException e) {
            attempts++;
            logger.warn("Stale element, retrying... ({}/{})", attempts, maxAttempts);
        } catch (NoSuchElementException e) {
            attempts++;
            logger.warn("Element not found, retrying... ({}/{})", attempts, maxAttempts);
            sleep(500);
        }
    }
    
    throw new RuntimeException("Submit button not found after " + maxAttempts + " attempts");
}

// Option 5: Using data attributes (if available)
@FindBy(css = "[data-testid='submit-button']")
private WebElement submitButton; // RECOMMENDED if dev team can add data-testid

// Usage
public void clickSubmit() {
    // Approach 1: Direct click with retry on stale element
    try {
        submitButton.click();
    } catch (StaleElementReferenceException e) {
        // Re-initialize elements
        PageFactory.initElements(driver, this);
        submitButton.click();
    }
    
    // Approach 2: Using dynamic method
    getSubmitButton().click();
}
```

---

## Shadow DOM Page Objects

### Prompt Template

```
Generate code to interact with Shadow DOM elements:

Shadow Host Element: [DESCRIBE SHADOW HOST]
Shadow Root Elements: [DESCRIBE ELEMENTS INSIDE SHADOW DOM]

Requirements:
1. Access shadow root using JavaScriptExecutor
2. Find elements inside shadow root
3. Create methods to interact with shadow elements
4. Handle nested shadow DOMs if applicable
5. Make it reusable

Generate complete code with utility methods.
```

### Expected Output

```java
/**
 * Accesses shadow root and finds element inside
 * @param shadowHost The element hosting the shadow DOM
 * @param cssSelector CSS selector for element inside shadow root
 * @return WebElement inside shadow DOM
 */
public WebElement getShadowElement(WebElement shadowHost, String cssSelector) {
    JavascriptExecutor js = (JavascriptExecutor) driver;
    
    // Access shadow root
    WebElement shadowRoot = (WebElement) js.executeScript(
        "return arguments[0].shadowRoot", shadowHost);
    
    // Find element inside shadow root
    WebElement element = (WebElement) js.executeScript(
        "return arguments[0].querySelector(arguments[1])", shadowRoot, cssSelector);
    
    return element;
}

/**
 * Accesses nested shadow DOM (shadow inside shadow)
 */
public WebElement getNestedShadowElement(WebElement outerHost, String innerHostSelector, String finalElementSelector) {
    // Get first shadow root
    WebElement innerHost = getShadowElement(outerHost, innerHostSelector);
    
    // Get element from nested shadow root
    return getShadowElement(innerHost, finalElementSelector);
}

// Example usage in Page Object
public class CustomComponentPage extends BasePage {
    
    @FindBy(id = "custom-component")
    private WebElement customComponentHost;
    
    public void clickButtonInsideShadowDOM() {
        WebElement shadowButton = getShadowElement(customComponentHost, "button.submit");
        shadowButton.click();
    }
    
    public String getTextFromShadowElement() {
        WebElement shadowText = getShadowElement(customComponentHost, "div.message");
        return shadowText.getText();
    }
}
```

---

## iFrame Page Objects

### Prompt Template

```
Generate code to handle iFrame interactions:

iFrame Identifier: [ID, Name, or index of iframe]
Elements inside iFrame: [Describe elements]

Requirements:
1. Switch to iframe
2. Interact with elements
3. Switch back to default content
4. Handle nested iframes if applicable
5. Create wrapper methods

Generate complete code.
```

### Expected Output

```java
public class IFramePage extends BasePage {
    
    @FindBy(id = "payment-iframe")
    private WebElement paymentIFrame;
    
    // Elements inside iframe
    private By cardNumberField = By.id("card-number");
    private By expiryField = By.id("expiry");
    private By cvvField = By.id("cvv");
    private By submitButton = By.id("submit-payment");
    
    /**
     * Enters payment details in iframe
     */
    public void enterPaymentDetails(String cardNumber, String expiry, String cvv) {
        // Switch to iframe
        switchToFrame(paymentIFrame);
        
        try {
            // Interact with elements inside iframe
            driver.findElement(cardNumberField).sendKeys(cardNumber);
            driver.findElement(expiryField).sendKeys(expiry);
            driver.findElement(cvvField).sendKeys(cvv);
            driver.findElement(submitButton).click();
        } finally {
            // Always switch back to default content
            switchToDefaultContent();
        }
    }
    
    /**
     * Handles nested iframe scenario
     */
    public void handleNestedIFrame() {
        // Switch to outer iframe
        driver.switchTo().frame("outer-frame");
        
        // Switch to inner iframe
        driver.switchTo().frame("inner-frame");
        
        // Interact with element
        driver.findElement(By.id("inner-element")).click();
        
        // Switch back to outer frame
        driver.switchTo().parentFrame();
        
        // Switch to default content
        driver.switchTo().defaultContent();
    }
}
```

---

## Data-Driven Page Objects

### Prompt Template

```
Generate a data-driven Page Object that accepts test data:

Page: [PAGE NAME]
Data Parameters: [List parameters - username, password, email, etc.]

Requirements:
1. Create methods that accept parameters
2. Support method chaining (fluent interface)
3. Make it flexible for different test scenarios
4. Return appropriate page objects
5. Add validation

Generate parameterized page object code.
```

### Expected Output

```java
public class RegistrationPage extends BasePage {
    
    @FindBy(id = "firstName")
    private WebElement firstNameField;
    
    @FindBy(id = "lastName")
    private WebElement lastNameField;
    
    @FindBy(id = "email")
    private WebElement emailField;
    
    @FindBy(id = "password")
    private WebElement passwordField;
    
    @FindBy(id = "confirmPassword")
    private WebElement confirmPasswordField;
    
    @FindBy(id = "submitBtn")
    private WebElement submitButton;
    
    /**
     * Fluent registration method with all parameters
     */
    public HomePage register(String firstName, String lastName, String email, 
                            String password, String confirmPassword) {
        enterFirstName(firstName);
        enterLastName(lastName);
        enterEmail(email);
        enterPassword(password);
        enterConfirmPassword(confirmPassword);
        return clickSubmit();
    }
    
    /**
     * Builder pattern for complex registration
     */
    public static class RegistrationBuilder {
        private String firstName;
        private String lastName;
        private String email;
        private String password;
        private String confirmPassword;
        
        public RegistrationBuilder withFirstName(String firstName) {
            this.firstName = firstName;
            return this;
        }
        
        public RegistrationBuilder withLastName(String lastName) {
            this.lastName = lastName;
            return this;
        }
        
        public RegistrationBuilder withEmail(String email) {
            this.email = email;
            return this;
        }
        
        public RegistrationBuilder withPassword(String password) {
            this.password = password;
            this.confirmPassword = password; // Auto-match
            return this;
        }
        
        public HomePage submit(RegistrationPage page) {
            return page.register(firstName, lastName, email, password, confirmPassword);
        }
    }
}

// Usage in test
@Test
public void testRegistrationWithBuilder() {
    RegistrationPage regPage = new RegistrationPage();
    
    HomePage homePage = new RegistrationPage.RegistrationBuilder()
        .withFirstName("John")
        .withLastName("Doe")
        .withEmail("john.doe@example.com")
        .withPassword("SecurePass123")
        .submit(regPage);
    
    Assert.assertTrue(homePage.isUserLoggedIn());
}
```

---

**Last Updated**: January 2026  
**Version**: 2.0

