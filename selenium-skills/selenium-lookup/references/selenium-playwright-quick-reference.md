# Selenium & Playwright Quick Reference

## Purpose
Quick reference guide with code snippets for common automation operations - Selenium (Java) vs Playwright (TypeScript) side-by-side comparison.

---

## 1. Browser Launch & Configuration

### Basic Browser Launch

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>WebDriver driver = new ChromeDriver();<br>driver.get("https://example.com");<br>``` | ```typescript<br>const browser = await chromium.launch();<br>const page = await browser.newPage();<br>await page.goto("https://example.com");<br>``` |

### Headless Mode

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>ChromeOptions options = new ChromeOptions();<br>options.addArguments("--headless=new");<br>WebDriver driver = new ChromeDriver(options);<br>``` | ```typescript<br>const browser = await chromium.launch({<br>  headless: true<br>});<br>``` |

### Window Size

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>driver.manage().window().maximize();<br>driver.manage().window().setSize(new Dimension(1920, 1080));<br>``` | ```typescript<br>const context = await browser.newContext({<br>  viewport: { width: 1920, height: 1080 }<br>});<br>const page = await context.newPage();<br>``` |

---

## 2. Locator Strategies

### ID

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>driver.findElement(By.id("username"));<br>``` | ```typescript<br>page.locator('#username');<br>// or<br>page.locator('[id="username"]');<br>``` |

### Class Name

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>driver.findElement(By.className("btn-primary"));<br>``` | ```typescript<br>page.locator('.btn-primary');<br>``` |

### CSS Selector

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>driver.findElement(By.cssSelector("input[type='email']"));<br>``` | ```typescript<br>page.locator("input[type='email']");<br>``` |

### XPath

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>driver.findElement(By.xpath("//button[@id='submit']"));<br>``` | ```typescript<br>page.locator("xpath=//button[@id='submit']");<br>// or<br>page.locator("//button[@id='submit']");<br>``` |

### Text Content

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>driver.findElement(By.xpath("//button[text()='Login']"));<br>``` | ```typescript<br>page.getByText('Login');<br>// or<br>page.locator('text=Login');<br>``` |

### Role (Accessibility)

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>// Not directly supported<br>driver.findElement(By.cssSelector("[role='button']"));<br>``` | ```typescript<br>page.getByRole('button', { name: 'Submit' });<br>``` |

### Placeholder

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>driver.findElement(By.cssSelector("[placeholder='Enter email']"));<br>``` | ```typescript<br>page.getByPlaceholder('Enter email');<br>``` |

### Test ID

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>driver.findElement(By.cssSelector("[data-testid='login-btn']"));<br>``` | ```typescript<br>page.getByTestId('login-btn');<br>``` |

---

## 3. Wait Patterns

### Implicit Wait

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>driver.manage().timeouts().implicitlyWait(Duration.ofSeconds(10));<br>``` | ```typescript<br>// Not recommended - use built-in auto-waiting<br>page.setDefaultTimeout(10000);<br>``` |

### Explicit Wait - Element Visible

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));<br>wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("result")));<br>``` | ```typescript<br>await page.locator('#result').waitFor({ state: 'visible' });<br>// or built-in auto-wait<br>await page.locator('#result').click();<br>``` |

### Explicit Wait - Element Clickable

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>wait.until(ExpectedConditions.elementToBeClickable(By.id("submit")));<br>``` | ```typescript<br>await page.locator('#submit').waitFor({ state: 'visible' });<br>// Playwright auto-waits for actionability<br>``` |

### Wait for URL

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>wait.until(ExpectedConditions.urlContains("dashboard"));<br>``` | ```typescript<br>await page.waitForURL('**/dashboard**');<br>``` |

### Custom Wait Condition

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>wait.until(driver -> {<br>  return driver.findElements(By.className("item")).size() > 5;<br>});<br>``` | ```typescript<br>await page.waitForFunction(() => {<br>  return document.querySelectorAll('.item').length > 5;<br>});<br>``` |

---

## 4. Element Interactions

### Click

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>driver.findElement(By.id("submit")).click();<br>``` | ```typescript<br>await page.locator('#submit').click();<br>``` |

### Type Text

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>driver.findElement(By.id("email")).sendKeys("test@example.com");<br>``` | ```typescript<br>await page.locator('#email').fill('test@example.com');<br>// or type with delay<br>await page.locator('#email').type('test@example.com', { delay: 100 });<br>``` |

### Clear & Type

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>WebElement input = driver.findElement(By.id("search"));<br>input.clear();<br>input.sendKeys("new text");<br>``` | ```typescript<br>await page.locator('#search').fill(''); // clear<br>await page.locator('#search').fill('new text');<br>``` |

### Double Click

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>Actions actions = new Actions(driver);<br>actions.doubleClick(element).perform();<br>``` | ```typescript<br>await page.locator('#element').dblclick();<br>``` |

### Right Click

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>actions.contextClick(element).perform();<br>``` | ```typescript<br>await page.locator('#element').click({ button: 'right' });<br>``` |

### Hover

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>actions.moveToElement(element).perform();<br>``` | ```typescript<br>await page.locator('#element').hover();<br>``` |

### Drag and Drop

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>WebElement source = driver.findElement(By.id("draggable"));<br>WebElement target = driver.findElement(By.id("droppable"));<br>actions.dragAndDrop(source, target).perform();<br>``` | ```typescript<br>await page.locator('#draggable').dragTo(page.locator('#droppable'));<br>``` |

### Select Dropdown - By Value

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>Select select = new Select(driver.findElement(By.id("country")));<br>select.selectByValue("US");<br>``` | ```typescript<br>await page.locator('#country').selectOption('US');<br>``` |

### Select Dropdown - By Text

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>select.selectByVisibleText("United States");<br>``` | ```typescript<br>await page.locator('#country').selectOption({ label: 'United States' });<br>``` |

### Check Checkbox

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>WebElement checkbox = driver.findElement(By.id("terms"));<br>if (!checkbox.isSelected()) {<br>  checkbox.click();<br>}<br>``` | ```typescript<br>await page.locator('#terms').check();<br>``` |

### Uncheck Checkbox

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>if (checkbox.isSelected()) {<br>  checkbox.click();<br>}<br>``` | ```typescript<br>await page.locator('#terms').uncheck();<br>``` |

---

## 5. Alert/Dialog Handling

### Accept Alert

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>Alert alert = driver.switchTo().alert();<br>alert.accept();<br>``` | ```typescript<br>page.on('dialog', dialog => dialog.accept());<br>// or<br>await page.click('#trigger-alert');<br>``` |

### Dismiss Alert

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>alert.dismiss();<br>``` | ```typescript<br>page.on('dialog', dialog => dialog.dismiss());<br>``` |

### Get Alert Text

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>String alertText = alert.getText();<br>``` | ```typescript<br>page.on('dialog', dialog => {<br>  console.log(dialog.message());<br>  dialog.accept();<br>});<br>``` |

### Enter Text in Prompt

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>alert.sendKeys("John Doe");<br>alert.accept();<br>``` | ```typescript<br>page.on('dialog', dialog => dialog.accept('John Doe'));<br>``` |

---

## 6. Frame/iFrame Handling

### Switch to Frame by Index

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>driver.switchTo().frame(0);<br>``` | ```typescript<br>const frame = page.frames()[1]; // 0 is main frame<br>await frame.locator('#element').click();<br>``` |

### Switch to Frame by Name/ID

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>driver.switchTo().frame("frameName");<br>``` | ```typescript<br>const frame = page.frame({ name: 'frameName' });<br>await frame.locator('#element').click();<br>``` |

### Switch to Frame by WebElement

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>WebElement frameElement = driver.findElement(By.id("myframe"));<br>driver.switchTo().frame(frameElement);<br>``` | ```typescript<br>const frameLocator = page.frameLocator('#myframe');<br>await frameLocator.locator('#element').click();<br>``` |

### Switch Back to Main Content

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>driver.switchTo().defaultContent();<br>``` | ```typescript<br>// Not needed - use page.locator() for main content<br>await page.locator('#main-element').click();<br>``` |

---

## 7. Window/Tab Handling

### Get Current Window Handle

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>String mainWindow = driver.getWindowHandle();<br>``` | ```typescript<br>const mainPage = page;<br>``` |

### Get All Window Handles

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>Set<String> allWindows = driver.getWindowHandles();<br>``` | ```typescript<br>const allPages = context.pages();<br>``` |

### Switch to New Window

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>for (String window : driver.getWindowHandles()) {<br>  if (!window.equals(mainWindow)) {<br>    driver.switchTo().window(window);<br>  }<br>}<br>``` | ```typescript<br>const [newPage] = await Promise.all([<br>  context.waitForEvent('page'),<br>  page.click('#open-new-window')<br>]);<br>await newPage.waitForLoadState();<br>``` |

### Close Current Window

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>driver.close();<br>``` | ```typescript<br>await page.close();<br>``` |

### Switch Back to Main Window

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>driver.switchTo().window(mainWindow);<br>``` | ```typescript<br>// Use the original page reference<br>await mainPage.click('#element');<br>``` |

---

## 8. JavaScript Execution

### Execute Simple Script

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>JavascriptExecutor js = (JavascriptExecutor) driver;<br>js.executeScript("alert('Hello');");<br>``` | ```typescript<br>await page.evaluate(() => alert('Hello'));<br>``` |

### Click Element via JS

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>WebElement element = driver.findElement(By.id("btn"));<br>js.executeScript("arguments[0].click();", element);<br>``` | ```typescript<br>await page.locator('#btn').evaluate(el => el.click());<br>``` |

### Scroll to Element

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>js.executeScript("arguments[0].scrollIntoView();", element);<br>``` | ```typescript<br>await page.locator('#element').scrollIntoViewIfNeeded();<br>``` |

### Scroll to Bottom

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>js.executeScript("window.scrollTo(0, document.body.scrollHeight);");<br>``` | ```typescript<br>await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));<br>``` |

### Get Element Attribute

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>String value = element.getAttribute("value");<br>``` | ```typescript<br>const value = await page.locator('#input').getAttribute('value');<br>``` |

### Get Text Content

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>String text = element.getText();<br>``` | ```typescript<br>const text = await page.locator('#element').textContent();<br>// or innerText<br>const innerText = await page.locator('#element').innerText();<br>``` |

---

## 9. Screenshot Capture

### Full Page Screenshot

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>File screenshot = ((TakesScreenshot) driver).getScreenshotAs(OutputType.FILE);<br>Files.copy(screenshot, new File("screenshot.png"));<br>``` | ```typescript<br>await page.screenshot({ path: 'screenshot.png', fullPage: true });<br>``` |

### Element Screenshot

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>File screenshot = element.getScreenshotAs(OutputType.FILE);<br>Files.copy(screenshot, new File("element.png"));<br>``` | ```typescript<br>await page.locator('#element').screenshot({ path: 'element.png' });<br>``` |

### Screenshot as Base64

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>String base64 = ((TakesScreenshot) driver).getScreenshotAs(OutputType.BASE64);<br>``` | ```typescript<br>const buffer = await page.screenshot();<br>const base64 = buffer.toString('base64');<br>``` |

---

## 10. Browser Capabilities & Options

### Chrome Options - Disable Notifications

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>ChromeOptions options = new ChromeOptions();<br>options.addArguments("--disable-notifications");<br>WebDriver driver = new ChromeDriver(options);<br>``` | ```typescript<br>const context = await browser.newContext({<br>  permissions: []<br>});<br>``` |

### Set Download Directory

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>Map<String, Object> prefs = new HashMap<>();<br>prefs.put("download.default_directory", "/path/to/downloads");<br>options.setExperimentalOption("prefs", prefs);<br>``` | ```typescript<br>const browser = await chromium.launch({<br>  downloadsPath: '/path/to/downloads'<br>});<br>``` |

### User Agent

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>options.addArguments("user-agent=Custom Agent");<br>``` | ```typescript<br>const context = await browser.newContext({<br>  userAgent: 'Custom Agent'<br>});<br>``` |

### Ignore Certificate Errors

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>options.setAcceptInsecureCerts(true);<br>``` | ```typescript<br>const context = await browser.newContext({<br>  ignoreHTTPSErrors: true<br>});<br>``` |

---

## 11. Network Interception

### Block Images (Playwright)

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>// Requires additional libraries like BrowserMob Proxy<br>``` | ```typescript<br>await page.route('**/*.{png,jpg,jpeg}', route => route.abort());<br>``` |

### Intercept API Response

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>// Not natively supported<br>``` | ```typescript<br>await page.route('**/api/users', route => {<br>  route.fulfill({<br>    status: 200,<br>    body: JSON.stringify({ users: [] })<br>  });<br>});<br>``` |

### Wait for Network Response

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>// Not natively supported<br>``` | ```typescript<br>const [response] = await Promise.all([<br>  page.waitForResponse('**/api/data'),<br>  page.click('#load-data')<br>]);<br>``` |

---

## 12. File Upload/Download

### File Upload - Single File

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>WebElement upload = driver.findElement(By.id("file-upload"));<br>upload.sendKeys("/path/to/file.pdf");<br>``` | ```typescript<br>await page.locator('#file-upload').setInputFiles('/path/to/file.pdf');<br>``` |

### File Upload - Multiple Files

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>upload.sendKeys("/path/file1.pdf\n/path/file2.pdf");<br>``` | ```typescript<br>await page.locator('#file-upload').setInputFiles([<br>  '/path/file1.pdf',<br>  '/path/file2.pdf'<br>]);<br>``` |

### File Download

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>// Click download link<br>driver.findElement(By.id("download")).click();<br>// Wait for file in download directory<br>``` | ```typescript<br>const [download] = await Promise.all([<br>  page.waitForEvent('download'),<br>  page.click('#download')<br>]);<br>const path = await download.path();<br>await download.saveAs('/path/to/save.pdf');<br>``` |

---

## 13. Mobile Emulation

### Chrome Mobile Emulation

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>Map<String, Object> mobileEmulation = new HashMap<>();<br>mobileEmulation.put("deviceName", "iPhone 12");<br>ChromeOptions options = new ChromeOptions();<br>options.setExperimentalOption("mobileEmulation", mobileEmulation);<br>``` | ```typescript<br>const browser = await chromium.launch();<br>const context = await browser.newContext({<br>  ...devices['iPhone 12']<br>});<br>const page = await context.newPage();<br>``` |

### Custom Device Metrics

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>Map<String, Object> deviceMetrics = new HashMap<>();<br>deviceMetrics.put("width", 375);<br>deviceMetrics.put("height", 812);<br>deviceMetrics.put("pixelRatio", 3);<br>mobileEmulation.put("deviceMetrics", deviceMetrics);<br>``` | ```typescript<br>const context = await browser.newContext({<br>  viewport: { width: 375, height: 812 },<br>  deviceScaleFactor: 3,<br>  isMobile: true<br>});<br>``` |

---

## 14. Headless Mode

### Chrome Headless

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>ChromeOptions options = new ChromeOptions();<br>options.addArguments("--headless=new");<br>WebDriver driver = new ChromeDriver(options);<br>``` | ```typescript<br>const browser = await chromium.launch({ headless: true });<br>``` |

### Firefox Headless

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>FirefoxOptions options = new FirefoxOptions();<br>options.addArguments("--headless");<br>WebDriver driver = new FirefoxDriver(options);<br>``` | ```typescript<br>const browser = await firefox.launch({ headless: true });<br>``` |

---

## 15. Common Troubleshooting

### Element Not Clickable - Wait for Element

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));<br>WebElement element = wait.until(ExpectedConditions.elementToBeClickable(By.id("btn")));<br>element.click();<br>``` | ```typescript<br>// Auto-waits for actionability<br>await page.locator('#btn').click();<br>// or explicit<br>await page.locator('#btn').waitFor({ state: 'visible' });<br>await page.locator('#btn').click();<br>``` |

### Element Not Clickable - Scroll to Element

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>JavascriptExecutor js = (JavascriptExecutor) driver;<br>js.executeScript("arguments[0].scrollIntoView(true);", element);<br>element.click();<br>``` | ```typescript<br>await page.locator('#btn').scrollIntoViewIfNeeded();<br>await page.locator('#btn').click();<br>``` |

### Stale Element Reference - Re-find Element

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>// Re-find element after DOM changes<br>WebElement element = driver.findElement(By.id("dynamic"));<br>element.click();<br>``` | ```typescript<br>// Playwright auto-retries - no stale elements<br>await page.locator('#dynamic').click();<br>``` |

### Element Covered by Another Element

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>// Click via JavaScript<br>JavascriptExecutor js = (JavascriptExecutor) driver;<br>js.executeScript("arguments[0].click();", element);<br>``` | ```typescript<br>// Force click<br>await page.locator('#btn').click({ force: true });<br>``` |

### Handle Dynamic Content

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>WebDriverWait wait = new WebDriverWait(driver, Duration.ofSeconds(10));<br>wait.until(ExpectedConditions.presenceOfElementLocated(By.id("dynamic")));<br>``` | ```typescript<br>await page.waitForSelector('#dynamic');<br>// or use auto-waiting<br>await page.locator('#dynamic').click();<br>``` |

### Wait for Ajax/Fetch Calls

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>wait.until(driver -> {<br>  JavascriptExecutor js = (JavascriptExecutor) driver;<br>  return (Boolean) js.executeScript("return jQuery.active == 0");<br>});<br>``` | ```typescript<br>await page.waitForLoadState('networkidle');<br>// or wait for specific request<br>await page.waitForResponse('**/api/data');<br>``` |

### Handle Flaky Tests - Retry

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>// Use TestNG retry analyzer or JUnit retry rules<br>@Test(retryAnalyzer = RetryAnalyzer.class)<br>public void testMethod() { }<br>``` | ```typescript<br>test.describe.configure({ retries: 2 });<br>// or in config<br>// retries: 2<br>``` |

### Debug - Slow Down Execution

| Selenium (Java) | Playwright (TypeScript) |
|----------------|------------------------|
| ```java<br>Thread.sleep(2000); // Not recommended<br>// Use explicit waits instead<br>``` | ```typescript<br>const browser = await chromium.launch({<br>  slowMo: 500 // 500ms delay between actions<br>});<br>``` |

---

## Additional Tips

### Selenium Best Practices
- Always use explicit waits over implicit waits
- Use Page Object Model for maintainability
- Avoid `Thread.sleep()` - use `WebDriverWait` instead
- Use relative locators (Selenium 4+) for better reliability
- Close resources properly with try-finally or try-with-resources

### Playwright Best Practices
- Leverage auto-waiting - don't add unnecessary waits
- Use `getByRole`, `getByText` for better accessibility-focused locators
- Use `page.pause()` for debugging
- Utilize network interception for API testing
- Use `test.step()` for better test reporting
- Prefer `locator` over `$` for better auto-waiting

### Performance Optimization
- **Selenium**: Disable images/CSS when not needed, use headless mode, parallel execution
- **Playwright**: Use `context.route()` to block resources, enable browser contexts reuse, use API for setup

---

## Quick Comparison Summary

| Feature | Selenium | Playwright |
|---------|----------|------------|
| **Auto-waiting** | Manual (explicit waits) | Built-in |
| **Network control** | Limited (requires proxy) | Native support |
| **Browser support** | Chrome, Firefox, Safari, Edge | Chromium, Firefox, WebKit |
| **Language support** | Java, Python, C#, JS, Ruby | JavaScript/TypeScript, Python, Java, .NET |
| **Learning curve** | Moderate | Easier (better defaults) |
| **Mobile testing** | Emulation only | Emulation + real devices (preview) |
| **Parallel execution** | Requires framework (TestNG/JUnit) | Built-in |
| **Debugging** | Browser DevTools | Playwright Inspector, Trace Viewer |
| **Community** | Large, mature | Growing rapidly |

---

**Last Updated**: January 2026  
**Note**: Code snippets are simplified for quick reference. Add proper error handling and resource cleanup in production code.
