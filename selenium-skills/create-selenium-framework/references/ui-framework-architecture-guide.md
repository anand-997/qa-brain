# UI Framework Architecture Guide

## Purpose
Complete framework setup guide for Selenium/Playwright/Cypress UI automation frameworks. This guide covers architecture, base classes, configuration, logging, reporting, and core utilities needed for a robust automation framework.

---

## Table of Contents
1. [Framework Architecture](#framework-architecture)
2. [Maven/NPM Project Setup](#mavendotnet-project-setup)
3. [Base Page Implementation](#base-page-implementation)
4. [Base Test Implementation](#base-test-implementation)
5. [WebDriver/Browser Manager](#webdriverbrowser-manager)
6. [Configuration Management](#configuration-management)
7. [Logging Setup](#logging-setup)
8. [Reporting Setup](#reporting-setup)
9. [Screenshot Capture](#screenshot-capture)
10. [Retry Mechanism](#retry-mechanism)
11. [Test Execution Commands](#test-execution-commands)

---

## Framework Architecture

### Standard Directory Structure

```
ui-automation-framework/
│
├── src/
│   ├── main/
│   │   ├── java/                          # For Java
│   │   │   ├── core/
│   │   │   │   ├── driver/
│   │   │   │   │   ├── DriverFactory.java
│   │   │   │   │   └── DriverManager.java
│   │   │   │   ├── config/
│   │   │   │   │   └── ConfigManager.java
│   │   │   │   └── listeners/
│   │   │   │       ├── TestListener.java
│   │   │   │       └── RetryAnalyzer.java
│   │   │   ├── ui/
│   │   │   │   ├── base/
│   │   │   │   │   ├── BasePage.java
│   │   │   │   │   └── BaseTest.java
│   │   │   │   └── pages/
│   │   │   │       ├── LoginPage.java
│   │   │   │       └── HomePage.java
│   │   │   └── utils/
│   │   │       ├── WaitUtils.java
│   │   │       ├── ScreenshotUtils.java
│   │   │       ├── ExcelUtils.java
│   │   │       └── DateUtils.java
│   │   │
│   │   └── resources/
│   │       ├── config.properties
│   │       ├── log4j2.xml
│   │       └── extent-config.xml
│   │
│   └── test/
│       ├── java/
│       │   └── tests/
│       │       ├── auth/
│       │       │   └── LoginTests.java
│       │       └── dashboard/
│       │           └── DashboardTests.java
│       │
│       └── resources/
│           ├── testng.xml
│           ├── environments/
│           │   ├── qa.properties
│           │   ├── staging.properties
│           │   └── prod.properties
│           └── testdata/
│               ├── users.json
│               └── testdata.xlsx
│
├── reports/
│   ├── extent-reports/
│   ├── allure-results/
│   └── logs/
│
├── screenshots/
│
├── downloads/
│
├── pom.xml                                # Maven
├── package.json                           # NPM/Node.js
├── testng.xml
├── .gitignore
└── README.md
```

---

## Maven/NPM Project Setup

### Maven POM.XML (Selenium + TestNG)

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.automation</groupId>
    <artifactId>ui-automation-framework</artifactId>
    <version>1.0.0</version>
    <name>UI Automation Framework</name>

    <properties>
        <maven.compiler.source>17</maven.compiler.source>
        <maven.compiler.target>17</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        
        <!-- Dependency Versions -->
        <selenium.version>4.26.0</selenium.version>
        <webdrivermanager.version>5.8.0</webdrivermanager.version>
        <testng.version>7.10.2</testng.version>
        <extentreports.version>5.1.2</extentreports.version>
        <log4j.version>2.23.1</log4j.version>
        <poi.version>5.4.1</poi.version>
        <jackson.version>2.17.2</jackson.version>
        <commons-io.version>2.16.1</commons-io.version>
        <assertj.version>3.26.0</assertj.version>
        
        <!-- Plugin Versions -->
        <maven-compiler-plugin.version>3.13.0</maven-compiler-plugin.version>
        <maven-surefire-plugin.version>3.2.5</maven-surefire-plugin.version>
    </properties>

    <dependencies>
        <!-- Selenium WebDriver -->
        <dependency>
            <groupId>org.seleniumhq.selenium</groupId>
            <artifactId>selenium-java</artifactId>
            <version>${selenium.version}</version>
        </dependency>

        <!-- WebDriverManager for automatic driver management -->
        <dependency>
            <groupId>io.github.bonigarcia</groupId>
            <artifactId>webdrivermanager</artifactId>
            <version>${webdrivermanager.version}</version>
        </dependency>

        <!-- TestNG -->
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>${testng.version}</version>
        </dependency>

        <!-- ExtentReports -->
        <dependency>
            <groupId>com.aventstack</groupId>
            <artifactId>extentreports</artifactId>
            <version>${extentreports.version}</version>
        </dependency>

        <!-- Log4j2 -->
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>${log4j.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-api</artifactId>
            <version>${log4j.version}</version>
        </dependency>

        <!-- Apache POI for Excel -->
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>${poi.version}</version>
        </dependency>

        <!-- Jackson for JSON -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>${jackson.version}</version>
        </dependency>

        <!-- Apache Commons IO -->
        <dependency>
            <groupId>commons-io</groupId>
            <artifactId>commons-io</artifactId>
            <version>${commons-io.version}</version>
        </dependency>

        <!-- AssertJ for fluent assertions -->
        <dependency>
            <groupId>org.assertj</groupId>
            <artifactId>assertj-core</artifactId>
            <version>${assertj.version}</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <!-- Maven Compiler Plugin -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>${maven-compiler-plugin.version}</version>
                <configuration>
                    <source>${maven.compiler.source}</source>
                    <target>${maven.compiler.target}</target>
                </configuration>
            </plugin>

            <!-- Maven Surefire Plugin for test execution -->
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>${maven-surefire-plugin.version}</version>
                <configuration>
                    <suiteXmlFiles>
                        <suiteXmlFile>testng.xml</suiteXmlFile>
                    </suiteXmlFiles>
                    <testFailureIgnore>true</testFailureIgnore>
                    <parallel>classes</parallel>
                    <threadCount>4</threadCount>
                    <argLine>
                        -Xmx2048m 
                        -XX:+HeapDumpOnOutOfMemoryError 
                        -Dfile.encoding=UTF-8
                    </argLine>
                    <reportsDirectory>${project.build.directory}/surefire-reports</reportsDirectory>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### Package.json (Playwright + Jest/Mocha)

```json
{
  "name": "ui-automation-framework",
  "version": "1.0.0",
  "description": "UI Automation Framework with Playwright",
  "main": "index.js",
  "scripts": {
    "test": "playwright test",
    "test:headed": "playwright test --headed",
    "test:debug": "playwright test --debug",
    "test:chromium": "playwright test --project=chromium",
    "test:firefox": "playwright test --project=firefox",
    "test:webkit": "playwright test --project=webkit",
    "report": "playwright show-report"
  },
  "devDependencies": {
    "@playwright/test": "^1.40.0",
    "@types/node": "^20.10.0",
    "allure-playwright": "^2.10.0",
    "dotenv": "^16.3.1"
  }
}
```

---

## Base Page Implementation

### BasePage.java (Selenium)

```java
package ui.base;

import org.openqa.selenium.*;
import org.openqa.selenium.interactions.Actions;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.Select;
import org.openqa.selenium.support.ui.WebDriverWait;
import core.driver.DriverFactory;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.time.Duration;
import java.util.List;
import java.util.stream.Collectors;

/**
 * BasePage - Foundation class for all Page Object classes.
 * Contains reusable methods for common web interactions.
 */
public abstract class BasePage {

    protected WebDriver driver;
    protected WebDriverWait wait;
    protected Actions actions;
    protected JavascriptExecutor js;
    protected static final Logger logger = LogManager.getLogger(BasePage.class);
    protected static final int DEFAULT_TIMEOUT = 20;

    /**
     * Constructor initializes driver, waits, and PageFactory
     */
    public BasePage() {
        this.driver = DriverFactory.getDriver();
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(DEFAULT_TIMEOUT));
        this.actions = new Actions(driver);
        this.js = (JavascriptExecutor) driver;
        PageFactory.initElements(driver, this);
        logger.debug("{} initialized", this.getClass().getSimpleName());
    }

    // ==================== CLICK ACTIONS ====================

    /**
     * Waits for element to be clickable and performs click
     */
    protected void click(WebElement element) {
        try {
            wait.until(ExpectedConditions.elementToBeClickable(element));
            element.click();
            logger.debug("Clicked element: {}", element);
        } catch (ElementClickInterceptedException e) {
            logger.warn("Click intercepted, trying JS click");
            clickByJS(element);
        }
    }

    /**
     * Clicks element using JavaScript
     */
    protected void clickByJS(WebElement element) {
        wait.until(ExpectedConditions.visibilityOf(element));
        js.executeScript("arguments[0].click();", element);
        logger.debug("JS clicked element: {}", element);
    }

    /**
     * Double-clicks an element
     */
    protected void doubleClick(WebElement element) {
        wait.until(ExpectedConditions.elementToBeClickable(element));
        actions.doubleClick(element).perform();
        logger.debug("Double-clicked element: {}", element);
    }

    /**
     * Right-clicks an element (context menu)
     */
    protected void rightClick(WebElement element) {
        wait.until(ExpectedConditions.elementToBeClickable(element));
        actions.contextClick(element).perform();
        logger.debug("Right-clicked element: {}", element);
    }

    // ==================== INPUT ACTIONS ====================

    /**
     * Clears and enters text into element
     */
    protected void sendKeys(WebElement element, String text) {
        wait.until(ExpectedConditions.visibilityOf(element));
        element.clear();
        element.sendKeys(text);
        logger.debug("Entered text '{}' into element", text);
    }

    /**
     * Enters text character by character with delay
     */
    protected void sendKeysSlowly(WebElement element, String text, int delayMillis) {
        wait.until(ExpectedConditions.visibilityOf(element));
        element.clear();
        for (char c : text.toCharArray()) {
            element.sendKeys(String.valueOf(c));
            sleep(delayMillis);
        }
        logger.debug("Entered text slowly: {}", text);
    }

    /**
     * Sets value using JavaScript (bypasses validation)
     */
    protected void setValueByJS(WebElement element, String value) {
        js.executeScript("arguments[0].value=arguments[1];", element, value);
        logger.debug("Set value via JS: {}", value);
    }

    // ==================== GET TEXT / ATTRIBUTES ====================

    /**
     * Gets visible text from element
     */
    protected String getText(WebElement element) {
        wait.until(ExpectedConditions.visibilityOf(element));
        return element.getText();
    }

    /**
     * Gets attribute value from element
     */
    protected String getAttribute(WebElement element, String attributeName) {
        wait.until(ExpectedConditions.visibilityOf(element));
        return element.getAttribute(attributeName);
    }

    /**
     * Gets CSS property value
     */
    protected String getCssValue(WebElement element, String propertyName) {
        return element.getCssValue(propertyName);
    }

    // ==================== VISIBILITY & STATE CHECKS ====================

    /**
     * Checks if element is displayed
     */
    protected boolean isDisplayed(WebElement element) {
        try {
            return element.isDisplayed();
        } catch (NoSuchElementException | StaleElementReferenceException e) {
            return false;
        }
    }

    /**
     * Checks if element is enabled
     */
    protected boolean isEnabled(WebElement element) {
        try {
            return element.isEnabled();
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    /**
     * Checks if element is selected (checkbox/radio)
     */
    protected boolean isSelected(WebElement element) {
        try {
            return element.isSelected();
        } catch (NoSuchElementException e) {
            return false;
        }
    }

    // ==================== DROPDOWN ACTIONS ====================

    /**
     * Selects dropdown option by visible text
     */
    protected void selectByVisibleText(WebElement dropdownElement, String text) {
        wait.until(ExpectedConditions.visibilityOf(dropdownElement));
        Select select = new Select(dropdownElement);
        select.selectByVisibleText(text);
        logger.debug("Selected dropdown option: {}", text);
    }

    /**
     * Selects dropdown option by value attribute
     */
    protected void selectByValue(WebElement dropdownElement, String value) {
        wait.until(ExpectedConditions.visibilityOf(dropdownElement));
        Select select = new Select(dropdownElement);
        select.selectByValue(value);
        logger.debug("Selected dropdown by value: {}", value);
    }

    /**
     * Selects dropdown option by index
     */
    protected void selectByIndex(WebElement dropdownElement, int index) {
        wait.until(ExpectedConditions.visibilityOf(dropdownElement));
        Select select = new Select(dropdownElement);
        select.selectByIndex(index);
        logger.debug("Selected dropdown by index: {}", index);
    }

    /**
     * Gets all options from dropdown
     */
    protected List<String> getAllDropdownOptions(WebElement dropdownElement) {
        Select select = new Select(dropdownElement);
        return select.getOptions().stream()
                .map(WebElement::getText)
                .collect(Collectors.toList());
    }

    /**
     * Gets selected dropdown option text
     */
    protected String getSelectedDropdownOption(WebElement dropdownElement) {
        Select select = new Select(dropdownElement);
        return select.getFirstSelectedOption().getText();
    }

    // ==================== SCROLL ACTIONS ====================

    /**
     * Scrolls to element using JavaScript
     */
    protected void scrollToElement(WebElement element) {
        js.executeScript("arguments[0].scrollIntoView({behavior: 'smooth', block: 'center'});", element);
        sleep(300); // Wait for scroll animation
        logger.debug("Scrolled to element");
    }

    /**
     * Scrolls to bottom of page
     */
    protected void scrollToBottom() {
        js.executeScript("window.scrollTo(0, document.body.scrollHeight);");
        logger.debug("Scrolled to bottom");
    }

    /**
     * Scrolls to top of page
     */
    protected void scrollToTop() {
        js.executeScript("window.scrollTo(0, 0);");
        logger.debug("Scrolled to top");
    }

    /**
     * Scrolls by specific pixel amount
     */
    protected void scrollByPixels(int xPixels, int yPixels) {
        js.executeScript("window.scrollBy(arguments[0], arguments[1]);", xPixels, yPixels);
    }

    // ==================== ALERT HANDLING ====================

    /**
     * Accepts JavaScript alert
     */
    protected void acceptAlert() {
        wait.until(ExpectedConditions.alertIsPresent());
        driver.switchTo().alert().accept();
        logger.debug("Accepted alert");
    }

    /**
     * Dismisses JavaScript alert
     */
    protected void dismissAlert() {
        wait.until(ExpectedConditions.alertIsPresent());
        driver.switchTo().alert().dismiss();
        logger.debug("Dismissed alert");
    }

    /**
     * Gets alert text
     */
    protected String getAlertText() {
        wait.until(ExpectedConditions.alertIsPresent());
        return driver.switchTo().alert().getText();
    }

    /**
     * Sends text to alert prompt
     */
    protected void sendKeysToAlert(String text) {
        wait.until(ExpectedConditions.alertIsPresent());
        driver.switchTo().alert().sendKeys(text);
        logger.debug("Sent keys to alert: {}", text);
    }

    // ==================== FRAME HANDLING ====================

    /**
     * Switches to frame by WebElement
     */
    protected void switchToFrame(WebElement frameElement) {
        wait.until(ExpectedConditions.frameToBeAvailableAndSwitchToIt(frameElement));
        logger.debug("Switched to frame");
    }

    /**
     * Switches to frame by index
     */
    protected void switchToFrame(int index) {
        driver.switchTo().frame(index);
        logger.debug("Switched to frame index: {}", index);
    }

    /**
     * Switches to frame by name or ID
     */
    protected void switchToFrame(String nameOrId) {
        driver.switchTo().frame(nameOrId);
        logger.debug("Switched to frame: {}", nameOrId);
    }

    /**
     * Switches back to default content
     */
    protected void switchToDefaultContent() {
        driver.switchTo().defaultContent();
        logger.debug("Switched to default content");
    }

    /**
     * Switches to parent frame
     */
    protected void switchToParentFrame() {
        driver.switchTo().parentFrame();
        logger.debug("Switched to parent frame");
    }

    // ==================== WINDOW HANDLING ====================

    /**
     * Switches to new window
     */
    protected void switchToNewWindow() {
        String currentWindow = driver.getWindowHandle();
        for (String windowHandle : driver.getWindowHandles()) {
            if (!windowHandle.equals(currentWindow)) {
                driver.switchTo().window(windowHandle);
                logger.debug("Switched to new window");
                break;
            }
        }
    }

    /**
     * Switches to window by title
     */
    protected void switchToWindowByTitle(String title) {
        for (String windowHandle : driver.getWindowHandles()) {
            driver.switchTo().window(windowHandle);
            if (driver.getTitle().equals(title)) {
                logger.debug("Switched to window: {}", title);
                return;
            }
        }
        logger.warn("Window with title '{}' not found", title);
    }

    /**
     * Closes current window and switches to main window
     */
    protected void closeCurrentWindowAndSwitchToMain() {
        String mainWindow = driver.getWindowHandles().iterator().next();
        driver.close();
        driver.switchTo().window(mainWindow);
        logger.debug("Closed window and switched to main");
    }

    // ==================== MOUSE ACTIONS ====================

    /**
     * Hovers over element
     */
    protected void hoverOver(WebElement element) {
        wait.until(ExpectedConditions.visibilityOf(element));
        actions.moveToElement(element).perform();
        logger.debug("Hovered over element");
    }

    /**
     * Drags element from source to target
     */
    protected void dragAndDrop(WebElement source, WebElement target) {
        actions.dragAndDrop(source, target).perform();
        logger.debug("Performed drag and drop");
    }

    // ==================== WAIT UTILITIES ====================

    /**
     * Waits for element to be visible
     */
    protected void waitForVisibility(WebElement element) {
        wait.until(ExpectedConditions.visibilityOf(element));
    }

    /**
     * Waits for element to be invisible
     */
    protected void waitForInvisibility(WebElement element) {
        wait.until(ExpectedConditions.invisibilityOf(element));
    }

    /**
     * Waits for element to be clickable
     */
    protected void waitForClickability(WebElement element) {
        wait.until(ExpectedConditions.elementToBeClickable(element));
    }

    /**
     * Waits for text to be present in element
     */
    protected void waitForTextToBePresentInElement(WebElement element, String text) {
        wait.until(ExpectedConditions.textToBePresentInElement(element, text));
    }

    /**
     * Custom wait with condition
     */
    protected void waitForCondition(int timeoutSeconds, ExpectedCondition<?> condition) {
        WebDriverWait customWait = new WebDriverWait(driver, Duration.ofSeconds(timeoutSeconds));
        customWait.until(condition);
    }

    /**
     * Hard wait (use sparingly)
     */
    protected void sleep(int milliseconds) {
        try {
            Thread.sleep(milliseconds);
        } catch (InterruptedException e) {
            Thread.currentThread().interrupt();
            logger.error("Sleep interrupted", e);
        }
    }

    // ==================== NAVIGATION ====================

    /**
     * Navigates to URL
     */
    protected void navigateTo(String url) {
        driver.navigate().to(url);
        logger.info("Navigated to: {}", url);
    }

    /**
     * Refreshes current page
     */
    protected void refresh() {
        driver.navigate().refresh();
        logger.debug("Page refreshed");
    }

    /**
     * Navigates back
     */
    protected void navigateBack() {
        driver.navigate().back();
        logger.debug("Navigated back");
    }

    /**
     * Navigates forward
     */
    protected void navigateForward() {
        driver.navigate().forward();
        logger.debug("Navigated forward");
    }

    // ==================== PAGE INFO ====================

    /**
     * Gets current page title
     */
    protected String getPageTitle() {
        return driver.getTitle();
    }

    /**
     * Gets current URL
     */
    protected String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    /**
     * Gets page source
     */
    protected String getPageSource() {
        return driver.getPageSource();
    }

    // ==================== FILE OPERATIONS ====================

    /**
     * Uploads file (for input[type=file])
     */
    protected void uploadFile(WebElement fileInput, String absoluteFilePath) {
        wait.until(ExpectedConditions.presenceOfElementLocated(
                By.xpath("//*[@type='file']")));
        fileInput.sendKeys(absoluteFilePath);
        logger.debug("Uploaded file: {}", absoluteFilePath);
    }

    // ==================== HELPER METHODS ====================

    /**
     * Highlights element (for debugging/demo)
     */
    protected void highlightElement(WebElement element) {
        String originalStyle = element.getAttribute("style");
        js.executeScript("arguments[0].setAttribute('style', 'border: 2px solid red;');", element);
        sleep(500);
        js.executeScript("arguments[0].setAttribute('style', arguments[1]);", element, originalStyle);
    }

    /**
     * Takes element screenshot
     */
    protected byte[] getElementScreenshot(WebElement element) {
        return element.getScreenshotAs(OutputType.BYTES);
    }
}
```

---

## Base Test Implementation

### BaseTest.java (TestNG)

```java
package ui.base;

import core.config.ConfigManager;
import core.driver.DriverFactory;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.testng.ITestResult;
import org.testng.annotations.*;
import utils.ScreenshotUtils;

/**
 * BaseTest - Parent class for all test classes.
 * Handles test setup, teardown, and common test utilities.
 */
public abstract class BaseTest {

    protected static final Logger logger = LogManager.getLogger(BaseTest.class);
    protected WebDriver driver;

    /**
     * Suite-level setup (runs once before all tests)
     */
    @BeforeSuite
    public void beforeSuite() {
        logger.info("===== TEST SUITE STARTED =====");
        logger.info("Environment: {}", ConfigManager.get("environment"));
        logger.info("Browser: {}", ConfigManager.get("browser"));
    }

    /**
     * Test-level setup (runs before each test class)
     */
    @BeforeClass
    public void beforeClass() {
        logger.info("===== TEST CLASS: {} =====", this.getClass().getSimpleName());
    }

    /**
     * Method-level setup (runs before each @Test method)
     */
    @BeforeMethod
    public void setUp(ITestResult result) {
        logger.info("========== TEST STARTED: {} ==========", result.getMethod().getMethodName());
        
        // Initialize WebDriver
        String browser = ConfigManager.get("browser");
        boolean headless = Boolean.parseBoolean(ConfigManager.get("headless"));
        DriverFactory.initDriver(browser, headless);
        driver = DriverFactory.getDriver();
        
        // Navigate to base URL
        String baseUrl = ConfigManager.get("app.url");
        driver.get(baseUrl);
        logger.info("Navigated to: {}", baseUrl);
    }

    /**
     * Method-level teardown (runs after each @Test method)
     */
    @AfterMethod
    public void tearDown(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE) {
            logger.error("========== TEST FAILED: {} ==========", result.getName());
            logger.error("Failure Reason: {}", result.getThrowable().getMessage());
            
            // Capture screenshot on failure
            ScreenshotUtils.captureScreenshot(result.getName());
        } else if (result.getStatus() == ITestResult.SUCCESS) {
            logger.info("========== TEST PASSED: {} ==========", result.getName());
        } else if (result.getStatus() == ITestResult.SKIP) {
            logger.warn("========== TEST SKIPPED: {} ==========", result.getName());
        }
        
        // Quit driver
        DriverFactory.quitDriver();
    }

    /**
     * Class-level teardown
     */
    @AfterClass
    public void afterClass() {
        logger.info("===== TEST CLASS COMPLETED: {} =====", this.getClass().getSimpleName());
    }

    /**
     * Suite-level teardown
     */
    @AfterSuite
    public void afterSuite() {
        logger.info("===== TEST SUITE COMPLETED =====");
    }
}
```

---

## WebDriver/Browser Manager

### DriverFactory.java

```java
package core.driver;

import core.config.ConfigManager;
import io.github.bonigarcia.wdm.WebDriverManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.edge.EdgeDriver;
import org.openqa.selenium.edge.EdgeOptions;
import org.openqa.selenium.firefox.FirefoxDriver;
import org.openqa.selenium.firefox.FirefoxOptions;

import java.time.Duration;

/**
 * DriverFactory - Manages WebDriver lifecycle using ThreadLocal for parallel execution.
 */
public class DriverFactory {

    private static final Logger logger = LogManager.getLogger(DriverFactory.class);
    private static final ThreadLocal<WebDriver> driverThreadLocal = new ThreadLocal<>();

    /**
     * Initializes WebDriver for the current thread
     */
    public static void initDriver(String browser, boolean headless) {
        logger.info("Initializing {} driver (headless: {})", browser, headless);
        
        WebDriver driver = switch (browser.toLowerCase()) {
            case "chrome" -> initChromeDriver(headless);
            case "firefox" -> initFirefoxDriver(headless);
            case "edge" -> initEdgeDriver(headless);
            default -> throw new IllegalArgumentException("Unsupported browser: " + browser);
        };
        
        // Configure timeouts
        int implicitWait = Integer.parseInt(ConfigManager.get("implicit.wait"));
        int pageLoadTimeout = Integer.parseInt(ConfigManager.get("page.load.timeout"));
        
        driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(implicitWait));
        driver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(pageLoadTimeout));
        driver.manage().window().maximize();
        
        driverThreadLocal.set(driver);
        logger.info("Driver initialized successfully");
    }

    /**
     * Gets WebDriver instance for current thread
     */
    public static WebDriver getDriver() {
        WebDriver driver = driverThreadLocal.get();
        if (driver == null) {
            throw new IllegalStateException("Driver not initialized. Call initDriver() first.");
        }
        return driver;
    }

    /**
     * Quits WebDriver and removes from ThreadLocal
     */
    public static void quitDriver() {
        WebDriver driver = driverThreadLocal.get();
        if (driver != null) {
            driver.quit();
            driverThreadLocal.remove();
            logger.info("Driver quit successfully");
        }
    }

    /**
     * Initializes Chrome driver with options
     */
    private static WebDriver initChromeDriver(boolean headless) {
        WebDriverManager.chromedriver().setup();
        ChromeOptions options = new ChromeOptions();
        
        if (headless) {
            options.addArguments("--headless=new");
        }
        
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        options.addArguments("--disable-dev-shm-usage");
        options.addArguments("--no-sandbox");
        options.addArguments("--remote-allow-origins=*");
        options.addArguments("--disable-blink-features=AutomationControlled");
        options.setExperimentalOption("excludeSwitches", new String[]{"enable-automation"});
        options.setExperimentalOption("useAutomationExtension", false);
        
        return new ChromeDriver(options);
    }

    /**
     * Initializes Firefox driver with options
     */
    private static WebDriver initFirefoxDriver(boolean headless) {
        WebDriverManager.firefoxdriver().setup();
        FirefoxOptions options = new FirefoxOptions();
        
        if (headless) {
            options.addArguments("--headless");
        }
        
        options.addArguments("--disable-notifications");
        options.addPreference("dom.webnotifications.enabled", false);
        
        return new FirefoxDriver(options);
    }

    /**
     * Initializes Edge driver with options
     */
    private static WebDriver initEdgeDriver(boolean headless) {
        WebDriverManager.edgedriver().setup();
        EdgeOptions options = new EdgeOptions();
        
        if (headless) {
            options.addArguments("--headless=new");
        }
        
        options.addArguments("--disable-notifications");
        options.addArguments("--disable-popup-blocking");
        
        return new EdgeDriver(options);
    }
}
```

---

## Configuration Management

### ConfigManager.java

```java
package core.config;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.FileInputStream;
import java.io.IOException;
import java.io.InputStream;
import java.util.Properties;

/**
 * ConfigManager - Centralized configuration management.
 * Reads properties from config files based on environment.
 */
public class ConfigManager {

    private static final Logger logger = LogManager.getLogger(ConfigManager.class);
    private static Properties properties;
    private static final String DEFAULT_CONFIG = "src/main/resources/config.properties";

    static {
        loadConfiguration();
    }

    /**
     * Loads configuration from properties file
     */
    private static void loadConfiguration() {
        properties = new Properties();
        
        // Load default config
        loadPropertiesFile(DEFAULT_CONFIG);
        
        // Load environment-specific config if specified
        String environment = System.getProperty("environment", properties.getProperty("environment", "qa"));
        String envConfigFile = String.format("src/test/resources/environments/%s.properties", environment);
        loadPropertiesFile(envConfigFile);
        
        logger.info("Configuration loaded for environment: {}", environment);
    }

    /**
     * Loads properties from file
     */
    private static void loadPropertiesFile(String filePath) {
        try (InputStream input = new FileInputStream(filePath)) {
            properties.load(input);
            logger.debug("Loaded properties from: {}", filePath);
        } catch (IOException e) {
            logger.warn("Could not load properties from: {}", filePath);
        }
    }

    /**
     * Gets property value by key
     */
    public static String get(String key) {
        // Check system properties first (allows override)
        String value = System.getProperty(key);
        if (value != null) {
            return value;
        }
        
        // Check loaded properties
        value = properties.getProperty(key);
        if (value == null) {
            logger.warn("Property '{}' not found, returning null", key);
        }
        return value;
    }

    /**
     * Gets property with default value
     */
    public static String get(String key, String defaultValue) {
        String value = get(key);
        return value != null ? value : defaultValue;
    }

    /**
     * Gets property as integer
     */
    public static int getInt(String key) {
        return Integer.parseInt(get(key));
    }

    /**
     * Gets property as boolean
     */
    public static boolean getBoolean(String key) {
        return Boolean.parseBoolean(get(key));
    }

    /**
     * Sets property (runtime only)
     */
    public static void set(String key, String value) {
        properties.setProperty(key, value);
    }
}
```

### config.properties

```properties
# ==================== BROWSER CONFIGURATION ====================
browser=chrome
headless=false

# ==================== TIMEOUTS (seconds) ====================
implicit.wait=10
explicit.wait=20
page.load.timeout=30

# ==================== APPLICATION URLs ====================
app.url=https://www.example.com

# ==================== ENVIRONMENT ====================
environment=qa

# ==================== TEST DATA ====================
test.username=testuser@example.com
test.password=TestPassword123

# ==================== REPORTING ====================
extent.report.name=Automation Test Report
extent.report.path=reports/extent-reports/

# ==================== SCREENSHOTS ====================
screenshot.on.failure=true
screenshot.on.pass=false
screenshot.path=screenshots/

# ==================== RETRY CONFIGURATION ====================
retry.failed.tests=true
max.retry.count=2

# ==================== LOGGING ====================
log.level=INFO

# ==================== PARALLEL EXECUTION ====================
parallel.execution=false
thread.count=4
```

---

## Logging Setup

### log4j2.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
    
    <Properties>
        <Property name="LOG_PATTERN">%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %logger{36} - %msg%n</Property>
        <Property name="LOG_DIR">logs</Property>
    </Properties>

    <Appenders>
        <!-- Console Appender -->
        <Console name="ConsoleAppender" target="SYSTEM_OUT">
            <PatternLayout pattern="${LOG_PATTERN}"/>
        </Console>

        <!-- File Appender - All Logs -->
        <RollingFile name="FileAppender" 
                     fileName="${LOG_DIR}/automation.log"
                     filePattern="${LOG_DIR}/automation-%d{yyyy-MM-dd}-%i.log.gz">
            <PatternLayout pattern="${LOG_PATTERN}"/>
            <Policies>
                <TimeBasedTriggeringPolicy/>
                <SizeBasedTriggeringPolicy size="10MB"/>
            </Policies>
            <DefaultRolloverStrategy max="10"/>
        </RollingFile>

        <!-- File Appender - Error Logs Only -->
        <RollingFile name="ErrorAppender" 
                     fileName="${LOG_DIR}/error.log"
                     filePattern="${LOG_DIR}/error-%d{yyyy-MM-dd}-%i.log.gz">
            <PatternLayout pattern="${LOG_PATTERN}"/>
            <Policies>
                <TimeBasedTriggeringPolicy/>
                <SizeBasedTriggeringPolicy size="10MB"/>
            </Policies>
            <DefaultRolloverStrategy max="10"/>
            <ThresholdFilter level="ERROR" onMatch="ACCEPT" onMismatch="DENY"/>
        </RollingFile>
    </Appenders>

    <Loggers>
        <Root level="INFO">
            <AppenderRef ref="ConsoleAppender"/>
            <AppenderRef ref="FileAppender"/>
            <AppenderRef ref="ErrorAppender"/>
        </Root>
        
        <!-- Set specific log levels for packages -->
        <Logger name="core" level="DEBUG"/>
        <Logger name="ui" level="DEBUG"/>
        <Logger name="tests" level="INFO"/>
        
        <!-- Suppress verbose Selenium logs -->
        <Logger name="org.openqa.selenium" level="WARN"/>
        <Logger name="io.github.bonigarcia" level="WARN"/>
    </Loggers>

</Configuration>
```

---

## Reporting Setup

### ExtentReportManager.java

```java
package utils;

import com.aventstack.extentreports.ExtentReports;
import com.aventstack.extentreports.ExtentTest;
import com.aventstack.extentreports.reporter.ExtentSparkReporter;
import com.aventstack.extentreports.reporter.configuration.Theme;
import core.config.ConfigManager;

import java.io.File;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * ExtentReportManager - Manages Extent Reports lifecycle.
 */
public class ExtentReportManager {

    private static ExtentReports extentReports;
    private static ThreadLocal<ExtentTest> extentTest = new ThreadLocal<>();

    /**
     * Creates Extent Reports instance
     */
    public static void createInstance() {
        if (extentReports == null) {
            String reportPath = ConfigManager.get("extent.report.path");
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd_HH-mm-ss"));
            String reportFile = reportPath + "AutomationReport_" + timestamp + ".html";
            
            // Create directories if they don't exist
            new File(reportPath).mkdirs();
            
            ExtentSparkReporter sparkReporter = new ExtentSparkReporter(reportFile);
            sparkReporter.config().setTheme(Theme.DARK);
            sparkReporter.config().setDocumentTitle("Automation Test Report");
            sparkReporter.config().setReportName(ConfigManager.get("extent.report.name"));
            sparkReporter.config().setTimeStampFormat("yyyy-MM-dd HH:mm:ss");
            
            extentReports = new ExtentReports();
            extentReports.attachReporter(sparkReporter);
            
            // System info
            extentReports.setSystemInfo("OS", System.getProperty("os.name"));
            extentReports.setSystemInfo("Java Version", System.getProperty("java.version"));
            extentReports.setSystemInfo("Browser", ConfigManager.get("browser"));
            extentReports.setSystemInfo("Environment", ConfigManager.get("environment"));
        }
    }

    /**
     * Creates a new test entry
     */
    public static void createTest(String testName, String description) {
        ExtentTest test = extentReports.createTest(testName, description);
        extentTest.set(test);
    }

    /**
     * Gets current test
     */
    public static ExtentTest getTest() {
        return extentTest.get();
    }

    /**
     * Flushes report
     */
    public static void flush() {
        if (extentReports != null) {
            extentReports.flush();
        }
    }
}
```

---

## Screenshot Capture

### ScreenshotUtils.java

```java
package utils;

import core.driver.DriverFactory;
import org.apache.commons.io.FileUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;
import core.config.ConfigManager;

import java.io.File;
import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * ScreenshotUtils - Utility for capturing screenshots.
 */
public class ScreenshotUtils {

    private static final Logger logger = LogManager.getLogger(ScreenshotUtils.class);

    /**
     * Captures screenshot and saves to file
     */
    public static String captureScreenshot(String testName) {
        WebDriver driver = DriverFactory.getDriver();
        String screenshotPath = null;
        
        try {
            // Generate filename
            String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMdd_HHmmss"));
            String fileName = testName + "_" + timestamp + ".png";
            String directory = ConfigManager.get("screenshot.path");
            
            // Create directory if doesn't exist
            new File(directory).mkdirs();
            
            screenshotPath = directory + fileName;
            
            // Capture screenshot
            TakesScreenshot screenshotDriver = (TakesScreenshot) driver;
            File sourceFile = screenshotDriver.getScreenshotAs(OutputType.FILE);
            File destFile = new File(screenshotPath);
            
            FileUtils.copyFile(sourceFile, destFile);
            logger.info("Screenshot captured: {}", screenshotPath);
            
        } catch (IOException e) {
            logger.error("Failed to capture screenshot", e);
        }
        
        return screenshotPath;
    }

    /**
     * Captures screenshot as Base64
     */
    public static String captureScreenshotAsBase64() {
        WebDriver driver = DriverFactory.getDriver();
        TakesScreenshot screenshotDriver = (TakesScreenshot) driver;
        return screenshotDriver.getScreenshotAs(OutputType.BASE64);
    }
}
```

---

## Retry Mechanism

### RetryAnalyzer.java

```java
package core.listeners;

import core.config.ConfigManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.IRetryAnalyzer;
import org.testng.ITestResult;

/**
 * RetryAnalyzer - Automatically retries failed tests.
 */
public class RetryAnalyzer implements IRetryAnalyzer {

    private static final Logger logger = LogManager.getLogger(RetryAnalyzer.class);
    private int retryCount = 0;
    private final int maxRetryCount = ConfigManager.getInt("max.retry.count");

    @Override
    public boolean retry(ITestResult result) {
        if (!ConfigManager.getBoolean("retry.failed.tests")) {
            return false;
        }
        
        if (retryCount < maxRetryCount) {
            retryCount++;
            logger.warn("Retrying test '{}' - Attempt {}/{}", 
                       result.getName(), retryCount, maxRetryCount);
            return true;
        }
        
        logger.error("Test '{}' failed after {} retries", result.getName(), maxRetryCount);
        return false;
    }
}
```

### RetryTransformer.java

```java
package core.listeners;

import org.testng.IAnnotationTransformer;
import org.testng.annotations.ITestAnnotation;

import java.lang.reflect.Constructor;
import java.lang.reflect.Method;

/**
 * RetryTransformer - Applies RetryAnalyzer to all tests.
 */
public class RetryTransformer implements IAnnotationTransformer {

    @Override
    public void transform(ITestAnnotation annotation, Class testClass, 
                         Constructor testConstructor, Method testMethod) {
        annotation.setRetryAnalyzer(RetryAnalyzer.class);
    }
}
```

---

## Test Execution Commands

### Maven Commands

```bash
# Run all tests
mvn clean test

# Run specific test suite
mvn clean test -DsuiteXmlFile=smoke-tests.xml

# Run with specific browser
mvn clean test -Dbrowser=chrome

# Run in headless mode
mvn clean test -Dheadless=true

# Run specific environment
mvn clean test -Denvironment=qa

# Run tests in parallel
mvn clean test -Dparallel.execution=true -Dthread.count=4

# Skip tests
mvn clean install -DskipTests

# Run single test class
mvn clean test -Dtest=LoginTests

# Run single test method
mvn clean test -Dtest=LoginTests#testValidLogin
```

### TestNG XML

```bash
# Run via TestNG XML
mvn clean test -DsuiteXmlFile=testng.xml
```

### testng.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="UI Automation Suite" parallel="tests" thread-count="3">
    
    <listeners>
        <listener class-name="core.listeners.TestListener"/>
        <listener class-name="core.listeners.RetryTransformer"/>
    </listeners>

    <test name="Smoke Tests">
        <groups>
            <run>
                <include name="smoke"/>
            </run>
        </groups>
        <packages>
            <package name="tests.*"/>
        </packages>
    </test>

    <test name="Regression Tests">
        <groups>
            <run>
                <include name="regression"/>
            </run>
        </groups>
        <packages>
            <package name="tests.*"/>
        </packages>
    </test>

</suite>
```

---

## Best Practices

✅ **Use ThreadLocal for parallel execution** - Avoids driver conflicts
✅ **Externalize all configuration** - Properties files for flexibility
✅ **Implement comprehensive logging** - Debug and trace execution
✅ **Generate detailed reports** - Extent Reports with screenshots
✅ **Capture screenshots on failure** - Visual debugging
✅ **Implement retry mechanism** - Handle flaky tests gracefully
✅ **Use Page Object Model** - Maintainability and reusability
✅ **Apply explicit waits** - Avoid Thread.sleep()
✅ **Manage test data externally** - Excel, JSON, CSV
✅ **Follow naming conventions** - Consistent and descriptive
✅ **Use version control** - Git for collaboration
✅ **Integrate with CI/CD** - Jenkins, GitHub Actions

---

**Last Updated**: January 2026  
**Version**: 2.0  
**Framework**: Selenium WebDriver 4.x + TestNG 7.x + Java 17

