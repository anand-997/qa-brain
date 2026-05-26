# Complete UI Automation Project Structure - Implementation Guide

**Version:** 2.0  
**Last Updated:** January 2026  
**Purpose:** Complete copy-paste ready template for setting up a new UI automation framework from scratch. This combines complete implementation code with standard project structure templates.

---

## 📋 Table of Contents
1. [Complete Directory Structure](#-complete-directory-structure)
2. [Core Implementation Files](#-core-implementation-files)
3. [Configuration Files](#-configuration-files)
4. [Setup Instructions](#-setup-instructions)
5. [Execution Commands](#-execution-commands)
6. [Best Practices](#-best-practices)
7. [Standard Project Templates](#-standard-project-templates)
8. [Quick Reference](#-quick-reference)

---

## 📁 Complete Directory Structure

```
ui-automation-project/
├── pom.xml
├── testng.xml
├── README.md
├── .gitignore
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   └── com/
│   │   │       └── yourcompany/
│   │   │           └── automation/
│   │   │               ├── core/
│   │   │               │   ├── DriverFactory.java
│   │   │               │   ├── BasePage.java
│   │   │               │   └── BaseTest.java
│   │   │               ├── config/
│   │   │               │   └── ConfigManager.java
│   │   │               ├── pages/
│   │   │               │   ├── LoginPage.java
│   │   │               │   └── DashboardPage.java
│   │   │               ├── utils/
│   │   │               │   ├── WaitHelper.java
│   │   │               │   ├── ScreenshotUtil.java
│   │   │               │   └── ExcelReader.java
│   │   │               └── listeners/
│   │   │                   ├── TestListener.java
│   │   │                   └── RetryAnalyzer.java
│   │   └── resources/
│   │       ├── log4j2.xml
│   │       └── config/
│   │           ├── config.properties
│   │           ├── qa.properties
│   │           └── prod.properties
│   └── test/
│       ├── java/
│       │   └── com/
│       │       └── yourcompany/
│       │           └── automation/
│       │               └── tests/
│       │                   ├── auth/
│       │                   │   └── LoginTest.java
│       │                   └── dashboard/
│       │                       └── DashboardTest.java
│       └── resources/
│           └── testdata/
│               ├── login.json
│               └── testdata.xlsx
├── data/
│   ├── json/
│   ├── excel/
│   └── csv/
├── reports/
├── screenshots/
├── logs/
└── downloads/
```

---

## 🔧 Core Implementation Files

### 1. pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.yourcompany</groupId>
    <artifactId>ui-automation-framework</artifactId>
    <version>1.0-SNAPSHOT</version>
    <packaging>jar</packaging>

    <name>UI Automation Framework</name>
    <description>Selenium TestNG UI Automation Framework</description>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
        <project.build.sourceEncoding>UTF-8</project.build.sourceEncoding>
        <selenium.version>4.16.1</selenium.version>
        <testng.version>7.8.0</testng.version>
        <webdrivermanager.version>5.6.3</webdrivermanager.version>
        <log4j.version>2.22.1</log4j.version>
        <apache.poi.version>5.2.5</apache.poi.version>
        <extentreports.version>5.1.1</extentreports.version>
        <jackson.version>2.16.1</jackson.version>
    </properties>

    <dependencies>
        <!-- Selenium -->
        <dependency>
            <groupId>org.seleniumhq.selenium</groupId>
            <artifactId>selenium-java</artifactId>
            <version>${selenium.version}</version>
        </dependency>

        <!-- WebDriverManager -->
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
            <artifactId>poi</artifactId>
            <version>${apache.poi.version}</version>
        </dependency>
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>${apache.poi.version}</version>
        </dependency>

        <!-- ExtentReports -->
        <dependency>
            <groupId>com.aventstack</groupId>
            <artifactId>extentreports</artifactId>
            <version>${extentreports.version}</version>
        </dependency>

        <!-- Jackson for JSON -->
        <dependency>
            <groupId>com.fasterxml.jackson.core</groupId>
            <artifactId>jackson-databind</artifactId>
            <version>${jackson.version}</version>
        </dependency>

        <!-- Commons IO -->
        <dependency>
            <groupId>commons-io</groupId>
            <artifactId>commons-io</artifactId>
            <version>2.15.1</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-compiler-plugin</artifactId>
                <version>3.11.0</version>
                <configuration>
                    <source>11</source>
                    <target>11</target>
                </configuration>
            </plugin>

            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.3</version>
                <configuration>
                    <suiteXmlFiles>
                        <suiteXmlFile>testng.xml</suiteXmlFile>
                    </suiteXmlFiles>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

### 2. DriverFactory.java

```java
package com.yourcompany.automation.core;

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

public class DriverFactory {
    private static final Logger log = LogManager.getLogger(DriverFactory.class);
    private static final ThreadLocal<WebDriver> driver = new ThreadLocal<>();

    public static WebDriver getDriver() {
        return driver.get();
    }

    public static void initializeDriver(String browser, boolean headless) {
        log.info("Initializing {} driver (headless: {})", browser, headless);
        
        WebDriver webDriver = null;
        
        switch (browser.toLowerCase()) {
            case "chrome":
                WebDriverManager.chromedriver().setup();
                ChromeOptions chromeOptions = new ChromeOptions();
                if (headless) {
                    chromeOptions.addArguments("--headless=new");
                }
                chromeOptions.addArguments("--start-maximized");
                chromeOptions.addArguments("--disable-notifications");
                chromeOptions.addArguments("--disable-popup-blocking");
                chromeOptions.addArguments("--disable-infobars");
                chromeOptions.addArguments("--no-sandbox");
                chromeOptions.addArguments("--disable-dev-shm-usage");
                webDriver = new ChromeDriver(chromeOptions);
                break;
                
            case "firefox":
                WebDriverManager.firefoxdriver().setup();
                FirefoxOptions firefoxOptions = new FirefoxOptions();
                if (headless) {
                    firefoxOptions.addArguments("--headless");
                }
                webDriver = new FirefoxDriver(firefoxOptions);
                break;
                
            case "edge":
                WebDriverManager.edgedriver().setup();
                EdgeOptions edgeOptions = new EdgeOptions();
                if (headless) {
                    edgeOptions.addArguments("--headless");
                }
                edgeOptions.addArguments("--start-maximized");
                webDriver = new EdgeDriver(edgeOptions);
                break;
                
            default:
                throw new IllegalArgumentException("Browser not supported: " + browser);
        }
        
        webDriver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));
        webDriver.manage().timeouts().pageLoadTimeout(Duration.ofSeconds(30));
        webDriver.manage().window().maximize();
        
        driver.set(webDriver);
        log.info("Driver initialized successfully");
    }

    public static void quitDriver() {
        if (driver.get() != null) {
            log.info("Quitting driver");
            driver.get().quit();
            driver.remove();
        }
    }
}
```

### 3. BasePage.java

```java
package com.yourcompany.automation.core;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.By;
import org.openqa.selenium.JavascriptExecutor;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.PageFactory;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;

import java.time.Duration;

public class BasePage {
    protected WebDriver driver;
    protected WebDriverWait wait;
    protected Logger log;

    public BasePage(WebDriver driver) {
        this.driver = driver;
        this.wait = new WebDriverWait(driver, Duration.ofSeconds(15));
        this.log = LogManager.getLogger(this.getClass());
        PageFactory.initElements(driver, this);
    }

    protected void click(WebElement element) {
        waitForElementToBeClickable(element);
        element.click();
        log.info("Clicked on element: {}", element);
    }

    protected void type(WebElement element, String text) {
        waitForElementToBeVisible(element);
        element.clear();
        element.sendKeys(text);
        log.info("Typed '{}' into element", text);
    }

    protected String getText(WebElement element) {
        waitForElementToBeVisible(element);
        String text = element.getText();
        log.info("Got text: {}", text);
        return text;
    }

    protected boolean isDisplayed(WebElement element) {
        try {
            return element.isDisplayed();
        } catch (Exception e) {
            return false;
        }
    }

    protected void waitForElementToBeVisible(WebElement element) {
        wait.until(ExpectedConditions.visibilityOf(element));
    }

    protected void waitForElementToBeClickable(WebElement element) {
        wait.until(ExpectedConditions.elementToBeClickable(element));
    }

    protected void waitForUrlContains(String urlPart) {
        wait.until(ExpectedConditions.urlContains(urlPart));
    }

    protected void scrollToElement(WebElement element) {
        ((JavascriptExecutor) driver).executeScript("arguments[0].scrollIntoView(true);", element);
    }

    protected void jsClick(WebElement element) {
        ((JavascriptExecutor) driver).executeScript("arguments[0].click();", element);
    }

    protected String getCurrentUrl() {
        return driver.getCurrentUrl();
    }

    protected String getPageTitle() {
        return driver.getTitle();
    }
}
```

### 4. BaseTest.java

```java
package com.yourcompany.automation.core;

import com.yourcompany.automation.config.ConfigManager;
import com.yourcompany.automation.utils.ScreenshotUtil;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.WebDriver;
import org.testng.ITestResult;
import org.testng.annotations.*;

public class BaseTest {
    protected static final Logger log = LogManager.getLogger(BaseTest.class);
    protected WebDriver driver;

    @BeforeMethod(alwaysRun = true)
    public void setUp() {
        log.info("========== Test Setup Started ==========");
        String browser = ConfigManager.getProperty("browser", "chrome");
        boolean headless = Boolean.parseBoolean(ConfigManager.getProperty("headless", "false"));
        
        DriverFactory.initializeDriver(browser, headless);
        driver = DriverFactory.getDriver();
        
        String url = ConfigManager.getProperty("app.url");
        driver.get(url);
        log.info("Navigated to: {}", url);
    }

    @AfterMethod(alwaysRun = true)
    public void tearDown(ITestResult result) {
        if (result.getStatus() == ITestResult.FAILURE) {
            log.error("Test FAILED: {}", result.getName());
            ScreenshotUtil.captureScreenshot(driver, result.getName());
        } else if (result.getStatus() == ITestResult.SUCCESS) {
            log.info("Test PASSED: {}", result.getName());
        }
        
        DriverFactory.quitDriver();
        log.info("========== Test Teardown Completed ==========");
    }
}
```

### 5. ConfigManager.java

```java
package com.yourcompany.automation.config;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class ConfigManager {
    private static final Logger log = LogManager.getLogger(ConfigManager.class);
    private static Properties properties;
    private static final String CONFIG_FILE = "src/main/resources/config/config.properties";

    static {
        loadProperties();
    }

    private static void loadProperties() {
        properties = new Properties();
        try (FileInputStream fis = new FileInputStream(CONFIG_FILE)) {
            properties.load(fis);
            log.info("Configuration loaded from: {}", CONFIG_FILE);
            
            // Load environment-specific properties if specified
            String env = System.getProperty("env", properties.getProperty("environment", "qa"));
            String envFile = "src/main/resources/config/" + env + ".properties";
            
            try (FileInputStream envFis = new FileInputStream(envFile)) {
                properties.load(envFis);
                log.info("Environment-specific config loaded: {}", envFile);
            } catch (IOException e) {
                log.warn("Environment config not found: {}", envFile);
            }
        } catch (IOException e) {
            log.error("Failed to load configuration", e);
            throw new RuntimeException("Configuration file not found: " + CONFIG_FILE);
        }
    }

    public static String getProperty(String key) {
        String value = System.getProperty(key);
        if (value == null) {
            value = properties.getProperty(key);
        }
        return value;
    }

    public static String getProperty(String key, String defaultValue) {
        String value = getProperty(key);
        return value != null ? value : defaultValue;
    }

    public static int getPropertyAsInt(String key, int defaultValue) {
        String value = getProperty(key);
        try {
            return value != null ? Integer.parseInt(value) : defaultValue;
        } catch (NumberFormatException e) {
            return defaultValue;
        }
    }

    public static boolean getPropertyAsBoolean(String key, boolean defaultValue) {
        String value = getProperty(key);
        return value != null ? Boolean.parseBoolean(value) : defaultValue;
    }
}
```

### 6. LoginPage.java (Sample Page Object)

```java
package com.yourcompany.automation.pages;

import com.yourcompany.automation.core.BasePage;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.support.FindBy;

public class LoginPage extends BasePage {

    @FindBy(id = "username")
    private WebElement usernameField;

    @FindBy(id = "password")
    private WebElement passwordField;

    @FindBy(id = "loginBtn")
    private WebElement loginButton;

    @FindBy(xpath = "//div[@class='error-message']")
    private WebElement errorMessage;

    @FindBy(linkText = "Forgot Password?")
    private WebElement forgotPasswordLink;

    public LoginPage(WebDriver driver) {
        super(driver);
    }

    public void enterUsername(String username) {
        log.info("Entering username: {}", username);
        type(usernameField, username);
    }

    public void enterPassword(String password) {
        log.info("Entering password");
        type(passwordField, password);
    }

    public void clickLoginButton() {
        log.info("Clicking login button");
        click(loginButton);
    }

    public void login(String username, String password) {
        log.info("Performing login with username: {}", username);
        enterUsername(username);
        enterPassword(password);
        clickLoginButton();
    }

    public boolean isErrorMessageDisplayed() {
        return isDisplayed(errorMessage);
    }

    public String getErrorMessage() {
        return getText(errorMessage);
    }

    public boolean isLoginPageDisplayed() {
        return isDisplayed(loginButton) && isDisplayed(usernameField);
    }
}
```

### 7. LoginTest.java (Sample Test)

```java
package com.yourcompany.automation.tests.auth;

import com.yourcompany.automation.core.BaseTest;
import com.yourcompany.automation.pages.LoginPage;
import org.testng.Assert;
import org.testng.annotations.Test;

public class LoginTest extends BaseTest {

    @Test(priority = 1, description = "Verify successful login with valid credentials")
    public void testValidLogin() {
        log.info("Starting testValidLogin");
        
        LoginPage loginPage = new LoginPage(driver);
        Assert.assertTrue(loginPage.isLoginPageDisplayed(), "Login page is not displayed");
        
        loginPage.login("testuser@example.com", "Password123");
        
        // Wait for redirect and verify
        String currentUrl = driver.getCurrentUrl();
        Assert.assertTrue(currentUrl.contains("dashboard"), "User not redirected to dashboard");
        
        log.info("Login successful");
    }

    @Test(priority = 2, description = "Verify login fails with invalid credentials")
    public void testInvalidLogin() {
        log.info("Starting testInvalidLogin");
        
        LoginPage loginPage = new LoginPage(driver);
        loginPage.login("invalid@example.com", "wrongpassword");
        
        Assert.assertTrue(loginPage.isErrorMessageDisplayed(), "Error message not displayed");
        String errorMsg = loginPage.getErrorMessage();
        Assert.assertTrue(errorMsg.contains("Invalid credentials"), "Unexpected error message");
        
        log.info("Invalid login test passed");
    }

    @Test(priority = 3, description = "Verify login with empty username")
    public void testEmptyUsername() {
        log.info("Starting testEmptyUsername");
        
        LoginPage loginPage = new LoginPage(driver);
        loginPage.enterPassword("Password123");
        loginPage.clickLoginButton();
        
        Assert.assertTrue(loginPage.isErrorMessageDisplayed(), "Error message not displayed");
        
        log.info("Empty username test passed");
    }
}
```

### 8. TestListener.java

```java
package com.yourcompany.automation.listeners;

import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.ITestContext;
import org.testng.ITestListener;
import org.testng.ITestResult;

public class TestListener implements ITestListener {
    private static final Logger log = LogManager.getLogger(TestListener.class);

    @Override
    public void onStart(ITestContext context) {
        log.info("========================================");
        log.info("Test Suite Started: {}", context.getName());
        log.info("========================================");
    }

    @Override
    public void onFinish(ITestContext context) {
        log.info("========================================");
        log.info("Test Suite Finished: {}", context.getName());
        log.info("Total Tests: {}", context.getAllTestMethods().length);
        log.info("Passed: {}", context.getPassedTests().size());
        log.info("Failed: {}", context.getFailedTests().size());
        log.info("Skipped: {}", context.getSkippedTests().size());
        log.info("========================================");
    }

    @Override
    public void onTestStart(ITestResult result) {
        log.info(">>> Test Started: {}", result.getName());
    }

    @Override
    public void onTestSuccess(ITestResult result) {
        log.info("✓ Test PASSED: {} (Duration: {}ms)", 
                result.getName(), 
                result.getEndMillis() - result.getStartMillis());
    }

    @Override
    public void onTestFailure(ITestResult result) {
        log.error("✗ Test FAILED: {}", result.getName());
        log.error("Failure Reason: {}", result.getThrowable().getMessage());
    }

    @Override
    public void onTestSkipped(ITestResult result) {
        log.warn("⊘ Test SKIPPED: {}", result.getName());
    }
}
```

### 9. RetryAnalyzer.java

```java
package com.yourcompany.automation.listeners;

import com.yourcompany.automation.config.ConfigManager;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.testng.IRetryAnalyzer;
import org.testng.ITestResult;

public class RetryAnalyzer implements IRetryAnalyzer {
    private static final Logger log = LogManager.getLogger(RetryAnalyzer.class);
    private int retryCount = 0;
    private int maxRetryCount;

    public RetryAnalyzer() {
        this.maxRetryCount = ConfigManager.getPropertyAsInt("retry.count", 2);
    }

    @Override
    public boolean retry(ITestResult result) {
        if (retryCount < maxRetryCount) {
            retryCount++;
            log.warn("Retrying test: {} (Attempt {}/{})", 
                    result.getName(), retryCount, maxRetryCount);
            return true;
        }
        return false;
    }
}
```

### 10. ScreenshotUtil.java

```java
package com.yourcompany.automation.utils;

import org.apache.commons.io.FileUtils;
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;
import org.openqa.selenium.OutputType;
import org.openqa.selenium.TakesScreenshot;
import org.openqa.selenium.WebDriver;

import java.io.File;
import java.text.SimpleDateFormat;
import java.util.Date;

public class ScreenshotUtil {
    private static final Logger log = LogManager.getLogger(ScreenshotUtil.class);
    private static final String SCREENSHOT_DIR = "screenshots/";

    public static String captureScreenshot(WebDriver driver, String testName) {
        try {
            String timestamp = new SimpleDateFormat("yyyy-MM-dd_HH-mm-ss").format(new Date());
            String fileName = testName + "_" + timestamp + ".png";
            String filePath = SCREENSHOT_DIR + fileName;

            File screenshotDir = new File(SCREENSHOT_DIR);
            if (!screenshotDir.exists()) {
                screenshotDir.mkdirs();
            }

            File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);
            File destination = new File(filePath);
            FileUtils.copyFile(screenshot, destination);

            log.info("Screenshot captured: {}", filePath);
            return filePath;
        } catch (Exception e) {
            log.error("Failed to capture screenshot", e);
            return null;
        }
    }
}
```

---

## 📝 Configuration Files

### log4j2.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
    <Properties>
        <Property name="logPath">logs</Property>
        <Property name="pattern">%d{yyyy-MM-dd HH:mm:ss} %-5p %c{1}:%L - %m%n</Property>
    </Properties>

    <Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="${pattern}"/>
        </Console>

        <RollingFile name="FileLogger" fileName="${logPath}/automation.log"
                     filePattern="${logPath}/automation-%d{yyyy-MM-dd}-%i.log">
            <PatternLayout pattern="${pattern}"/>
            <Policies>
                <TimeBasedTriggeringPolicy interval="1" modulate="true"/>
                <SizeBasedTriggeringPolicy size="10MB"/>
            </Policies>
            <DefaultRolloverStrategy max="10"/>
        </RollingFile>
    </Appenders>

    <Loggers>
        <Root level="info">
            <AppenderRef ref="Console"/>
            <AppenderRef ref="FileLogger"/>
        </Root>
    </Loggers>
</Configuration>
```

### config.properties

```properties
# Application Configuration
app.url=https://your-application-url.com
app.name=Your Application Name

# Browser Configuration
browser=chrome
headless=false

# Environment
environment=qa

# Timeouts (in seconds)
implicit.wait=10
explicit.wait=15
page.load.timeout=30

# Retry Configuration
retry.count=2

# Screenshot Configuration
screenshot.on.failure=true
screenshot.on.success=false

# Test Data
testdata.excel=src/test/resources/testdata/testdata.xlsx
testdata.json=src/test/resources/testdata/login.json

# Parallel Execution
parallel.execution=false
thread.count=3
```

### qa.properties

```properties
# QA Environment Specific Configuration
app.url=https://qa.your-application.com
environment=qa

# QA Credentials
default.username=qauser@example.com
default.password=QAPassword123

# QA Database
db.url=jdbc:mysql://qa-db-server:3306/testdb
db.username=qa_user
db.password=qa_password
```

### testng.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="UI Automation Suite" verbose="1" parallel="false">
    
    <listeners>
        <listener class-name="com.yourcompany.automation.listeners.TestListener"/>
    </listeners>
    
    <test name="Authentication Tests" preserve-order="true">
        <classes>
            <class name="com.yourcompany.automation.tests.auth.LoginTest">
                <methods>
                    <method name="testValidLogin"/>
                    <method name="testInvalidLogin"/>
                    <method name="testEmptyUsername"/>
                </methods>
            </class>
        </classes>
    </test>
    
    <test name="Dashboard Tests">
        <classes>
            <class name="com.yourcompany.automation.tests.dashboard.DashboardTest"/>
        </classes>
    </test>
    
</suite>
```

### .gitignore

```
# Compiled class files
*.class
target/
*.jar
*.war
*.ear

# Logs
logs/
*.log

# Test outputs
test-output/
screenshots/
reports/
downloads/

# IDE
.idea/
*.iml
.settings/
.classpath
.project
.vscode/

# OS
.DS_Store
Thumbs.db

# Dependencies
node_modules/
```

---

## 🚀 Setup Instructions

### Step 1: Prerequisites
1. Install Java JDK 11 or higher
2. Install Maven 3.6+
3. Install IDE (Eclipse/IntelliJ IDEA)
4. Install Git

### Step 2: Project Creation
```bash
# Create project directory
mkdir ui-automation-project
cd ui-automation-project

# Initialize Git
git init

# Create directory structure
mkdir -p src/main/java/com/yourcompany/automation/{core,config,pages,utils,listeners}
mkdir -p src/main/resources/config
mkdir -p src/test/java/com/yourcompany/automation/tests/{auth,dashboard}
mkdir -p src/test/resources/testdata
mkdir -p {data,reports,screenshots,logs,downloads}
mkdir -p data/{json,excel,csv}
```

### Step 3: Copy Files
1. Copy `pom.xml` to project root
2. Copy all Java files to respective packages
3. Copy configuration files to `src/main/resources/`
4. Copy `testng.xml` and `.gitignore` to project root

### Step 4: Update Package Names
Replace `com.yourcompany.automation` with your actual package name throughout all files.

### Step 5: Maven Setup
```bash
# Download dependencies
mvn clean install -DskipTests

# Verify installation
mvn verify
```

### Step 6: IDE Setup
1. Import project as Maven project
2. Enable annotation processing
3. Set Java 11 as project SDK
4. Install TestNG plugin

### Step 7: Configuration
1. Update `config.properties` with your application URL
2. Update environment-specific properties files
3. Configure `testng.xml` suite as needed

---

## 🎯 Execution Commands

### Maven Commands
```bash
# Run all tests
mvn clean test

# Run specific test suite
mvn clean test -DsuiteXmlFile=testng.xml

# Run with specific browser
mvn clean test -Dbrowser=chrome

# Run in headless mode
mvn clean test -Dheadless=true

# Run specific environment
mvn clean test -Denv=qa

# Run with parallel execution
mvn clean test -Dparallel.execution=true -Dthread.count=3

# Generate reports
mvn surefire-report:report
```

### TestNG Commands
```bash
# Run from IDE
Right-click on testng.xml > Run As > TestNG Suite

# Run specific test class
Right-click on test class > Run As > TestNG Test
```

---

## ✅ Best Practices

### DO's
- ✓ Use Page Object Model pattern consistently
- ✓ Keep page objects independent of tests
- ✓ Use meaningful locators (ID > Name > CSS > XPath)
- ✓ Implement explicit waits over implicit waits
- ✓ Use data-driven approach for test data
- ✓ Implement proper logging at all levels
- ✓ Capture screenshots on test failures
- ✓ Use TestNG groups for test categorization
- ✓ Keep methods small and focused (Single Responsibility)
- ✓ Use meaningful test names
- ✓ Implement retry mechanism for flaky tests
- ✓ Clean up test data in @AfterMethod
- ✓ Use constants for repeated values
- ✓ Externalize all configuration

### DON'Ts
- ✗ Don't use Thread.sleep() - use explicit waits
- ✗ Don't hardcode test data in tests
- ✗ Don't use absolute XPath
- ✗ Don't create dependencies between tests
- ✗ Don't ignore exceptions
- ✗ Don't share WebDriver instance between tests
- ✗ Don't test business logic in page objects
- ✗ Don't use overly generic locators
- ✗ Don't skip assertions
- ✗ Don't commit sensitive data (passwords, API keys)
- ✗ Don't create god classes
- ✗ Don't mix test logic with page logic

---

## 📊 Adding Test Data

### JSON Test Data (login.json)
```json
{
  "validUser": {
    "username": "testuser@example.com",
    "password": "Password123"
  },
  "invalidUser": {
    "username": "invalid@example.com",
    "password": "wrongpassword"
  }
}
```

### Excel Reader Utility
```java
// ExcelReader.java
package com.yourcompany.automation.utils;

import org.apache.poi.ss.usermodel.*;
import java.io.FileInputStream;

public class ExcelReader {
    public static Object[][] getTestData(String filePath, String sheetName) {
        // Implementation for reading Excel data
        // Returns Object[][] for @DataProvider
    }
}
```

---

## 🔍 Advanced Features (Optional)

### Parallel Execution testng.xml
```xml
<suite name="Parallel Suite" parallel="tests" thread-count="3">
    <!-- Test definitions -->
</suite>
```

### Database Connection Utility
```java
// DBHelper.java - Add to utils package if needed
public class DBHelper {
    public static Connection getConnection() {
        // JDBC connection implementation
    }
}
```

### API Helper
```java
// RestAssured integration for API validation
// Add dependency: rest-assured 5.3.2
```

---

## 📚 Quick Reference

### Common Locator Strategies
```java
@FindBy(id = "elementId")
@FindBy(name = "elementName")
@FindBy(className = "className")
@FindBy(css = "css.selector")
@FindBy(xpath = "//xpath")
@FindBy(linkText = "Link Text")
@FindBy(partialLinkText = "Partial Link")
```

### Common Assertions
```java
Assert.assertTrue(condition, "message");
Assert.assertEquals(actual, expected, "message");
Assert.assertNotNull(object, "message");
```

### TestNG Annotations
```java
@BeforeSuite, @BeforeTest, @BeforeClass, @BeforeMethod
@AfterSuite, @AfterTest, @AfterClass, @AfterMethod
@Test(priority=1, enabled=true, groups={"smoke"})
@DataProvider
```

---

## 🎓 Next Steps

1. **Customize** - Replace package names and URLs
2. **Extend** - Add more page objects and tests
3. **Integrate** - Add CI/CD pipeline (Jenkins, GitHub Actions)
4. **Report** - Integrate ExtentReports or Allure
5. **Scale** - Implement cross-browser testing
6. **Optimize** - Add more utilities as needed

---

## 📞 Troubleshooting

### WebDriverManager Issues
```bash
# Clear cache
rm -rf ~/.m2/repository/webdriver
```

### Port Already in Use
```bash
# Kill process on specific port
netstat -ano | findstr :4444
taskkill /PID <process_id> /F
```

### Maven Build Fails
```bash
# Force update dependencies
mvn clean install -U
```

---

**End of Template** - Ready to copy, paste, and customize! 🚀

---
---

# PART 2: STANDARD PROJECT STRUCTURE TEMPLATES

This section provides alternative standard templates and patterns for organizing automation projects.

---

## 📂 Alternative Selenium WebDriver Project Structure (Java + TestNG)

```
selenium-automation-framework/
│
├── src/
│   ├── main/
│   │   ├── java/
│   │   │   ├── base/
│   │   │   │   ├── BaseTest.java               # Base test class with setup/teardown
│   │   │   │   ├── BasePage.java               # Base page with common methods
│   │   │   │   └── DriverManager.java          # WebDriver singleton manager
│   │   │   │
│   │   │   ├── pages/                           # Page Object Model classes
│   │   │   │   ├── LoginPage.java
│   │   │   │   ├── HomePage.java
│   │   │   │   ├── ProductPage.java
│   │   │   │   └── CheckoutPage.java
│   │   │   │
│   │   │   ├── utils/                           # Utility classes
│   │   │   │   ├── ConfigReader.java           # Read config.properties
│   │   │   │   ├── WaitUtils.java              # Explicit wait utilities
│   │   │   │   ├── ScreenshotUtils.java        # Screenshot capture
│   │   │   │   ├── ExcelUtils.java             # Excel data reading
│   │   │   │   ├── JsonUtils.java              # JSON file handling
│   │   │   │   └── DateUtils.java              # Date/time utilities
│   │   │   │
│   │   │   └── listeners/                       # TestNG listeners
│   │   │       ├── TestListener.java           # ITestListener for logging
│   │   │       ├── RetryAnalyzer.java          # Retry failed tests
│   │   │       └── ExtentReportListener.java   # Report generation
│   │   │
│   │   └── resources/
│   │       ├── config.properties               # Configuration file
│   │       ├── log4j2.xml                      # Logging configuration
│   │       └── extent-config.xml               # ExtentReports config
│   │
│   └── test/
│       ├── java/
│       │   └── tests/                          # Test classes
│       │       ├── login/
│       │       │   ├── LoginTests.java
│       │       │   └── LogoutTests.java
│       │       │
│       │       ├── product/
│       │       │   ├── SearchTests.java
│       │       │   └── ProductDetailsTests.java
│       │       │
│       │       └── checkout/
│       │           └── CheckoutTests.java
│       │
│       └── resources/
│           ├── testdata/                        # Test data files
│           │   ├── users.json
│           │   ├── products.csv
│           │   └── testdata.xlsx
│           │
│           └── testsuites/                      # TestNG XML files
│               ├── smoke-suite.xml
│               ├── regression-suite.xml
│               └── all-tests.xml
│
├── reports/                                     # Test reports (gitignored)
│   ├── extent-reports/
│   ├── screenshots/
│   └── logs/
│
├── drivers/                                     # WebDriver executables (optional)
│   ├── chromedriver.exe
│   └── geckodriver.exe
│
├── pom.xml                                      # Maven dependencies
├── README.md                                    # Project documentation
├── .gitignore                                   # Git ignore file
└── docker-compose.yml                           # Docker setup (optional)
```

---

## 🔧 Alternative POM.XML Template

### Standard Selenium pom.xml

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0"
         xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
         xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 
         http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>com.example</groupId>
    <artifactId>selenium-automation</artifactId>
    <version>1.0-SNAPSHOT</version>

    <properties>
        <maven.compiler.source>11</maven.compiler.source>
        <maven.compiler.target>11</maven.compiler.target>
        <selenium.version>4.16.0</selenium.version>
        <testng.version>7.8.0</testng.version>
    </properties>

    <dependencies>
        <!-- Selenium WebDriver -->
        <dependency>
            <groupId>org.seleniumhq.selenium</groupId>
            <artifactId>selenium-java</artifactId>
            <version>${selenium.version}</version>
        </dependency>

        <!-- TestNG -->
        <dependency>
            <groupId>org.testng</groupId>
            <artifactId>testng</artifactId>
            <version>${testng.version}</version>
        </dependency>

        <!-- WebDriverManager -->
        <dependency>
            <groupId>io.github.bonigarcia</groupId>
            <artifactId>webdrivermanager</artifactId>
            <version>5.6.2</version>
        </dependency>

        <!-- ExtentReports -->
        <dependency>
            <groupId>com.aventstack</groupId>
            <artifactId>extentreports</artifactId>
            <version>5.1.1</version>
        </dependency>

        <!-- Log4j -->
        <dependency>
            <groupId>org.apache.logging.log4j</groupId>
            <artifactId>log4j-core</artifactId>
            <version>2.22.0</version>
        </dependency>

        <!-- Apache POI (Excel reading) -->
        <dependency>
            <groupId>org.apache.poi</groupId>
            <artifactId>poi-ooxml</artifactId>
            <version>5.2.5</version>
        </dependency>

        <!-- AssertJ -->
        <dependency>
            <groupId>org.assertj</groupId>
            <artifactId>assertj-core</artifactId>
            <version>3.24.2</version>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.apache.maven.plugins</groupId>
                <artifactId>maven-surefire-plugin</artifactId>
                <version>3.2.2</version>
                <configuration>
                    <suiteXmlFiles>
                        <suiteXmlFile>
                            src/test/resources/testsuites/regression-suite.xml
                        </suiteXmlFile>
                    </suiteXmlFiles>
                </configuration>
            </plugin>
        </plugins>
    </build>
</project>
```

---

## 📝 Standard Configuration Templates

### config.properties Template

```properties
# Application URLs
qa.url=https://qa.example.com
staging.url=https://staging.example.com
prod.url=https://example.com

# Browser settings
browser=chrome
headless=false
implicit.wait=10
explicit.wait=20
page.load.timeout=30

# Test data
test.user.email=testuser@example.com
test.user.password=Test@1234

# Reporting
screenshot.on.failure=true
screenshot.on.pass=false
extent.report.path=reports/extent-reports/

# Retry
retry.failed.tests=true
max.retry.count=2
```

---

### BaseTest.java Template

```java
package base;

import io.github.bonigarcia.wdm.WebDriverManager;
import org.openqa.selenium.WebDriver;
import org.testng.annotations.*;
import utils.ConfigReader;

public class BaseTest {
    
    protected WebDriver driver;
    
    @BeforeMethod
    public void setup() {
        String browser = ConfigReader.getProperty("browser");
        driver = DriverManager.getDriver(browser);
        driver.manage().window().maximize();
        driver.get(ConfigReader.getProperty("qa.url"));
    }
    
    @AfterMethod
    public void teardown() {
        if (driver != null) {
            driver.quit();
        }
    }
}
```

---

### smoke-suite.xml Template

```xml
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Smoke Test Suite" parallel="tests" thread-count="3">
    
    <listeners>
        <listener class-name="listeners.TestListener"/>
        <listener class-name="listeners.ExtentReportListener"/>
    </listeners>
    
    <test name="Login Tests">
        <classes>
            <class name="tests.login.LoginTests">
                <methods>
                    <include name="testLoginWithValidCredentials"/>
                </methods>
            </class>
        </classes>
    </test>
    
    <test name="Product Tests">
        <classes>
            <class name="tests.product.SearchTests">
                <methods>
                    <include name="testProductSearch"/>
                </methods>
            </class>
        </classes>
    </test>
    
</suite>
```

---

### README.md Template

```markdown
# Selenium Test Automation Framework

## Overview
This is a Page Object Model (POM) based Selenium WebDriver automation framework 
using Java, TestNG, and Maven.

## Prerequisites
- Java 11 or higher
- Maven 3.6+
- Chrome/Firefox browser

## Project Structure
- `src/main/java/base/` - Base classes
- `src/main/java/pages/` - Page Object classes
- `src/main/java/utils/` - Utility classes
- `src/test/java/tests/` - Test classes
- `src/test/resources/testsuites/` - TestNG XML files

## Running Tests

### Run all tests:
```bash
mvn clean test
```

### Run specific suite:
```bash
mvn clean test -DsuiteXmlFile=smoke-suite.xml
```

### Run with specific browser:
```bash
mvn clean test -Dbrowser=chrome
```

### Run in headless mode:
```bash
mvn clean test -Dheadless=true
```

## Reports
- ExtentReports: `reports/extent-reports/ExtentReport.html`
- TestNG Reports: `target/surefire-reports/index.html`

## Configuration
Edit `src/main/resources/config.properties` for:
- URLs (QA, Staging, Prod)
- Browser settings
- Timeout values
- Test data

## CI/CD Integration
This framework can be integrated with:
- Jenkins
- GitHub Actions
- GitLab CI
- Azure DevOps

See `.github/workflows/` for GitHub Actions example.
```

---

### .gitignore Template

```
# Compiled class files
*.class
target/
build/

# IDE files
.idea/
*.iml
.vscode/
.settings/
.project
.classpath

# Test reports
reports/
test-output/
screenshots/
logs/
*.log

# OS files
.DS_Store
Thumbs.db

# Test data (if sensitive)
**/testdata/sensitive/

# Environment files
.env
config.local.properties
```

---

## 💡 Tips for Organizing Automation Projects

### ✅ Best Practices

1. **Separation of Concerns:**
   - Page Objects separate from Tests
   - Utilities separate from business logic
   - Configuration external to code

2. **Naming Conventions:**
   - Test classes: `*Tests.java`
   - Page classes: `*Page.java`
   - Utility classes: `*Utils.java`

3. **Package Structure:**
   - Group by feature/module
   - Keep related classes together

4. **Configuration:**
   - Externalize all configurable values
   - Use properties files or environment variables
   - Never hardcode URLs, credentials

5. **Reporting:**
   - Generate HTML reports
   - Include screenshots on failure
   - Log all important actions

6. **Version Control:**
   - Exclude generated files (reports, logs)
   - Include framework code
   - Document in README

---

## 🎯 Project Organization Patterns

### Pattern 1: By Feature
```
pages/
├── authentication/
│   ├── LoginPage.java
│   └── RegistrationPage.java
├── product/
│   ├── SearchPage.java
│   └── ProductDetailsPage.java
└── checkout/
    ├── CartPage.java
    └── CheckoutPage.java
```

### Pattern 2: By Page Type
```
pages/
├── HomePage.java
├── LoginPage.java
├── ProductPage.java
└── components/
    ├── HeaderComponent.java
    └── FooterComponent.java
```

### Pattern 3: Hybrid Approach
```
pages/
├── common/
│   ├── BasePage.java
│   └── components/
├── auth/
│   └── LoginPage.java
└── shopping/
    ├── ProductPage.java
    └── CartPage.java
```

---

## 📊 Alternative TestNG Suite Structures

### Suite 1: By Test Type
```xml
<suite name="All Tests Suite">
    <test name="Smoke Tests">
        <groups><run><include name="smoke"/></run></groups>
        <packages><package name="tests.*"/></packages>
    </test>
    
    <test name="Regression Tests">
        <groups><run><include name="regression"/></run></groups>
        <packages><package name="tests.*"/></packages>
    </test>
</suite>
```

### Suite 2: By Module
```xml
<suite name="Module Suite" parallel="tests" thread-count="2">
    <test name="Authentication Module">
        <packages><package name="tests.auth.*"/></packages>
    </test>
    
    <test name="Shopping Module">
        <packages><package name="tests.shopping.*"/></packages>
    </test>
</suite>
```

---

## 🚀 Quick Start Checklist

- [ ] Install Java JDK 11+
- [ ] Install Maven 3.6+
- [ ] Clone/create project structure
- [ ] Update pom.xml dependencies
- [ ] Configure config.properties
- [ ] Create BasePage and BaseTest
- [ ] Create first Page Object
- [ ] Create first test
- [ ] Setup TestNG XML
- [ ] Run first test
- [ ] Configure reporting
- [ ] Setup version control
- [ ] Document in README

---

## 🔗 Additional Resources

### Framework Enhancements
- Integrate Allure Reports
- Add API testing with RestAssured
- Docker containerization
- CI/CD pipeline setup
- Cross-browser testing
- Mobile web testing
- Performance testing integration

### Common Utilities to Add
- Database utilities
- Email verification
- File download verification
- API utilities
- Encryption utilities
- Random data generators
- Custom assertions

---

**Last Updated**: January 2026  
**Version**: 2.0  
**Template Status**: Complete and ready to use 🎯
