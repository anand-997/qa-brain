# UI Test Data Strategy Guide

## Purpose
Comprehensive guide for managing test data in UI automation frameworks - covering generation, storage, management, and cleanup strategies for scalable and maintainable test automation.

---

## 1. Test Data Types

### 1.1 Credentials
```java
public class TestCredentials {
    private String username;
    private String password;
    private String role;
    
    public static TestCredentials admin() {
        return new TestCredentials("admin@test.com", "Admin@123", "ADMIN");
    }
    
    public static TestCredentials user() {
        return new TestCredentials("user@test.com", "User@123", "USER");
    }
}
```

### 1.2 Form Data
```java
public class UserFormData {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String dateOfBirth;
    
    // Constructor, getters, setters
}
```

### 1.3 File Test Data
```java
public enum TestFiles {
    IMAGE_JPG("images/test-image.jpg"),
    PDF_DOCUMENT("documents/test-doc.pdf"),
    CSV_DATA("csv/test-data.csv"),
    VIDEO_MP4("media/test-video.mp4");
    
    private final String path;
    
    TestFiles(String path) {
        this.path = "uploads/" + path;
    }
    
    public String getAbsolutePath() {
        return System.getProperty("user.dir") + "/" + path;
    }
}
```

### 1.4 API Test Data
```java
public class ApiTestData {
    private Map<String, Object> requestBody;
    private Map<String, String> headers;
    private Map<String, String> queryParams;
    
    public static ApiTestData createUser() {
        ApiTestData data = new ApiTestData();
        data.requestBody = Map.of(
            "name", "Test User",
            "email", "test@example.com",
            "role", "USER"
        );
        return data;
    }
}
```

---

## 2. Form Data Generation with Faker

### 2.1 Maven Dependency
```xml
<dependency>
    <groupId>com.github.javafaker</groupId>
    <artifactId>javafaker</artifactId>
    <version>1.0.2</version>
</dependency>
```

### 2.2 Faker Utility Class
```java
import com.github.javafaker.Faker;
import java.util.Locale;
import java.time.LocalDate;
import java.time.format.DateTimeFormatter;

public class FakerDataGenerator {
    private static final Faker faker = new Faker(new Locale("en-US"));
    private static final DateTimeFormatter DATE_FORMAT = DateTimeFormatter.ofPattern("MM/dd/yyyy");
    
    public static String getFirstName() {
        return faker.name().firstName();
    }
    
    public static String getLastName() {
        return faker.name().lastName();
    }
    
    public static String getFullName() {
        return faker.name().fullName();
    }
    
    public static String getEmail() {
        return faker.internet().emailAddress();
    }
    
    public static String getEmail(String firstName, String lastName) {
        return firstName.toLowerCase() + "." + lastName.toLowerCase() + "@test.com";
    }
    
    public static String getPhoneNumber() {
        return faker.phoneNumber().phoneNumber();
    }
    
    public static String getMobileNumber() {
        return faker.numerify("##########"); // 10 digits
    }
    
    public static String getAddress() {
        return faker.address().streetAddress();
    }
    
    public static String getCity() {
        return faker.address().city();
    }
    
    public static String getState() {
        return faker.address().state();
    }
    
    public static String getZipCode() {
        return faker.address().zipCode();
    }
    
    public static String getCompanyName() {
        return faker.company().name();
    }
    
    public static String getPastDate() {
        LocalDate date = LocalDate.now().minusDays(faker.number().numberBetween(1, 365));
        return date.format(DATE_FORMAT);
    }
    
    public static String getFutureDate() {
        LocalDate date = LocalDate.now().plusDays(faker.number().numberBetween(1, 365));
        return date.format(DATE_FORMAT);
    }
    
    public static int getRandomNumber(int min, int max) {
        return faker.number().numberBetween(min, max);
    }
    
    public static String getRandomText(int characters) {
        return faker.lorem().characters(characters);
    }
    
    public static String getSentence() {
        return faker.lorem().sentence();
    }
    
    public static String getParagraph() {
        return faker.lorem().paragraph();
    }
}
```

### 2.3 Complete Form Data Generator
```java
public class FormDataGenerator {
    
    public static UserFormData generateRandomUser() {
        String firstName = FakerDataGenerator.getFirstName();
        String lastName = FakerDataGenerator.getLastName();
        
        return UserFormData.builder()
            .firstName(firstName)
            .lastName(lastName)
            .email(FakerDataGenerator.getEmail(firstName, lastName))
            .phone(FakerDataGenerator.getMobileNumber())
            .address(FakerDataGenerator.getAddress())
            .city(FakerDataGenerator.getCity())
            .state(FakerDataGenerator.getState())
            .zipCode(FakerDataGenerator.getZipCode())
            .dateOfBirth(FakerDataGenerator.getPastDate())
            .build();
    }
    
    public static CompanyFormData generateRandomCompany() {
        return CompanyFormData.builder()
            .companyName(FakerDataGenerator.getCompanyName())
            .email(FakerDataGenerator.getEmail())
            .phone(FakerDataGenerator.getPhoneNumber())
            .address(FakerDataGenerator.getAddress())
            .build();
    }
}
```

---

## 3. User Credentials Management

### 3.1 Environment-Based Configuration
```properties
# config/qa.properties
admin.username=admin@qa.com
admin.password=QA_Admin@123
user.username=user@qa.com
user.password=QA_User@123

# config/staging.properties
admin.username=admin@staging.com
admin.password=Staging_Admin@123
```

### 3.2 Credentials Manager
```java
import java.io.FileInputStream;
import java.io.IOException;
import java.util.Properties;

public class CredentialsManager {
    private static Properties credentials;
    private static final String ENV = System.getProperty("env", "qa");
    
    static {
        loadCredentials();
    }
    
    private static void loadCredentials() {
        credentials = new Properties();
        try {
            String configFile = "src/test/resources/config/" + ENV + ".properties";
            FileInputStream fis = new FileInputStream(configFile);
            credentials.load(fis);
        } catch (IOException e) {
            throw new RuntimeException("Failed to load credentials for environment: " + ENV, e);
        }
    }
    
    public static String getUsername(String role) {
        return credentials.getProperty(role.toLowerCase() + ".username");
    }
    
    public static String getPassword(String role) {
        return credentials.getProperty(role.toLowerCase() + ".password");
    }
    
    public static TestCredentials getCredentials(String role) {
        return new TestCredentials(
            getUsername(role),
            getPassword(role),
            role.toUpperCase()
        );
    }
}
```

### 3.3 Encrypted Credentials (Base64 - Basic)
```java
import java.util.Base64;

public class SecureCredentialsManager {
    
    public static String encrypt(String plainText) {
        return Base64.getEncoder().encodeToString(plainText.getBytes());
    }
    
    public static String decrypt(String encrypted) {
        return new String(Base64.getDecoder().decode(encrypted));
    }
    
    public static String getSecurePassword(String role) {
        String encryptedPassword = credentials.getProperty(role + ".password.encrypted");
        return decrypt(encryptedPassword);
    }
}
```

### 3.4 Environment Variables Approach
```java
public class EnvCredentialsManager {
    
    public static String getUsername() {
        return System.getenv("TEST_USERNAME");
    }
    
    public static String getPassword() {
        return System.getenv("TEST_PASSWORD");
    }
    
    public static String getApiKey() {
        return System.getenv("API_KEY");
    }
}
```

---

## 4. File Upload Test Data Management

### 4.1 Test Files Structure
```
uploads/
├── images/
│   ├── test-image-small.jpg (< 1MB)
│   ├── test-image-large.jpg (> 5MB)
│   └── test-image-invalid.txt
├── documents/
│   ├── test-document.pdf
│   ├── test-document.docx
│   └── test-document-invalid.exe
├── media/
│   ├── test-video.mp4
│   └── test-audio.mp3
└── csv/
    └── test-data.csv
```

### 4.2 File Manager Utility
```java
import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

public class TestFileManager {
    private static final String BASE_PATH = System.getProperty("user.dir") + "/uploads/";
    
    public static String getFilePath(String category, String fileName) {
        return BASE_PATH + category + "/" + fileName;
    }
    
    public static File getFile(String category, String fileName) {
        return new File(getFilePath(category, fileName));
    }
    
    public static boolean fileExists(String category, String fileName) {
        return getFile(category, fileName).exists();
    }
    
    public static long getFileSize(String category, String fileName) {
        return getFile(category, fileName).length();
    }
    
    public static String getFileSizeInMB(String category, String fileName) {
        long bytes = getFileSize(category, fileName);
        return String.format("%.2f MB", bytes / (1024.0 * 1024.0));
    }
    
    // Dynamic file creation for testing
    public static File createTempFile(String prefix, String suffix, long sizeInKB) {
        try {
            File tempFile = File.createTempFile(prefix, suffix);
            byte[] data = new byte[(int) (sizeInKB * 1024)];
            Files.write(tempFile.toPath(), data);
            tempFile.deleteOnExit();
            return tempFile;
        } catch (Exception e) {
            throw new RuntimeException("Failed to create temp file", e);
        }
    }
}
```

### 4.3 File Upload Test Data Provider
```java
public class FileUploadDataProvider {
    
    @DataProvider(name = "validImages")
    public static Object[][] validImages() {
        return new Object[][] {
            {TestFileManager.getFilePath("images", "test-image-small.jpg"), "JPG"},
            {TestFileManager.getFilePath("images", "test-image.png"), "PNG"}
        };
    }
    
    @DataProvider(name = "invalidFiles")
    public static Object[][] invalidFiles() {
        return new Object[][] {
            {TestFileManager.getFilePath("images", "test-image-invalid.txt"), "TXT"},
            {TestFileManager.getFilePath("documents", "test-invalid.exe"), "EXE"}
        };
    }
    
    @DataProvider(name = "largeFiles")
    public static Object[][] largeFiles() {
        return new Object[][] {
            {TestFileManager.createTempFile("large", ".jpg", 10240)} // 10MB
        };
    }
}
```

---

## 5. Test Data Storage Strategies

### 5.1 JSON Data Reader
```java
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import java.io.FileReader;
import java.util.List;
import java.util.Map;

public class JsonDataReader {
    private static final Gson gson = new Gson();
    
    public static <T> T readObject(String filePath, Class<T> classType) {
        try (FileReader reader = new FileReader(filePath)) {
            return gson.fromJson(reader, classType);
        } catch (Exception e) {
            throw new RuntimeException("Failed to read JSON file: " + filePath, e);
        }
    }
    
    public static <T> List<T> readList(String filePath, Class<T> classType) {
        try (FileReader reader = new FileReader(filePath)) {
            TypeToken<List<T>> typeToken = TypeToken.getParameterized(List.class, classType);
            return gson.fromJson(reader, typeToken.getType());
        } catch (Exception e) {
            throw new RuntimeException("Failed to read JSON list: " + filePath, e);
        }
    }
    
    public static Map<String, Object> readMap(String filePath) {
        try (FileReader reader = new FileReader(filePath)) {
            TypeToken<Map<String, Object>> typeToken = new TypeToken<>() {};
            return gson.fromJson(reader, typeToken.getType());
        } catch (Exception e) {
            throw new RuntimeException("Failed to read JSON map: " + filePath, e);
        }
    }
}
```

**Example JSON File (data/json/users.json):**
```json
[
  {
    "username": "admin@test.com",
    "password": "Admin@123",
    "role": "ADMIN"
  },
  {
    "username": "user@test.com",
    "password": "User@123",
    "role": "USER"
  }
]
```

### 5.2 Excel Data Reader
```java
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import java.io.FileInputStream;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class ExcelDataReader {
    
    public static List<Map<String, String>> readExcel(String filePath, String sheetName) {
        List<Map<String, String>> data = new ArrayList<>();
        
        try (FileInputStream fis = new FileInputStream(filePath);
             Workbook workbook = new XSSFWorkbook(fis)) {
            
            Sheet sheet = workbook.getSheet(sheetName);
            Row headerRow = sheet.getRow(0);
            
            for (int i = 1; i <= sheet.getLastRowNum(); i++) {
                Row row = sheet.getRow(i);
                if (row == null) continue;
                
                Map<String, String> rowData = new HashMap<>();
                for (int j = 0; j < headerRow.getLastCellNum(); j++) {
                    Cell headerCell = headerRow.getCell(j);
                    Cell dataCell = row.getCell(j);
                    
                    String header = getCellValue(headerCell);
                    String value = getCellValue(dataCell);
                    rowData.put(header, value);
                }
                data.add(rowData);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to read Excel: " + filePath, e);
        }
        return data;
    }
    
    private static String getCellValue(Cell cell) {
        if (cell == null) return "";
        
        switch (cell.getCellType()) {
            case STRING:
                return cell.getStringCellValue();
            case NUMERIC:
                if (DateUtil.isCellDateFormatted(cell)) {
                    return cell.getDateCellValue().toString();
                }
                return String.valueOf((long) cell.getNumericCellValue());
            case BOOLEAN:
                return String.valueOf(cell.getBooleanCellValue());
            case FORMULA:
                return cell.getCellFormula();
            default:
                return "";
        }
    }
    
    public static Object[][] getExcelDataAsArray(String filePath, String sheetName) {
        List<Map<String, String>> data = readExcel(filePath, sheetName);
        Object[][] result = new Object[data.size()][1];
        for (int i = 0; i < data.size(); i++) {
            result[i][0] = data.get(i);
        }
        return result;
    }
}
```

### 5.3 CSV Data Reader
```java
import java.io.BufferedReader;
import java.io.FileReader;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class CsvDataReader {
    
    public static List<Map<String, String>> readCsv(String filePath) {
        List<Map<String, String>> data = new ArrayList<>();
        
        try (BufferedReader br = new BufferedReader(new FileReader(filePath))) {
            String line;
            String[] headers = br.readLine().split(",");
            
            while ((line = br.readLine()) != null) {
                String[] values = line.split(",");
                Map<String, String> row = new HashMap<>();
                
                for (int i = 0; i < headers.length; i++) {
                    row.put(headers[i].trim(), i < values.length ? values[i].trim() : "");
                }
                data.add(row);
            }
        } catch (Exception e) {
            throw new RuntimeException("Failed to read CSV: " + filePath, e);
        }
        return data;
    }
    
    public static Object[][] getCsvDataAsArray(String filePath) {
        List<Map<String, String>> data = readCsv(filePath);
        Object[][] result = new Object[data.size()][1];
        for (int i = 0; i < data.size(); i++) {
            result[i][0] = data.get(i);
        }
        return result;
    }
}
```

### 5.4 Properties File Reader
```java
import java.io.FileInputStream;
import java.util.Properties;

public class PropertiesDataReader {
    
    public static Properties loadProperties(String filePath) {
        Properties properties = new Properties();
        try (FileInputStream fis = new FileInputStream(filePath)) {
            properties.load(fis);
        } catch (Exception e) {
            throw new RuntimeException("Failed to load properties: " + filePath, e);
        }
        return properties;
    }
    
    public static String getProperty(String filePath, String key) {
        return loadProperties(filePath).getProperty(key);
    }
    
    public static String getProperty(String filePath, String key, String defaultValue) {
        return loadProperties(filePath).getProperty(key, defaultValue);
    }
}
```

---

## 6. Environment-Specific Data Management

### 6.1 Environment Configuration
```java
public enum Environment {
    QA("qa"),
    STAGING("staging"),
    PRODUCTION("prod");
    
    private final String name;
    
    Environment(String name) {
        this.name = name;
    }
    
    public String getName() {
        return name;
    }
    
    public static Environment fromString(String env) {
        for (Environment e : values()) {
            if (e.name.equalsIgnoreCase(env)) {
                return e;
            }
        }
        return QA; // default
    }
}
```

### 6.2 Environment Manager
```java
public class EnvironmentManager {
    private static Environment currentEnvironment;
    private static Properties envProperties;
    
    static {
        String env = System.getProperty("env", "qa");
        currentEnvironment = Environment.fromString(env);
        loadEnvironmentProperties();
    }
    
    private static void loadEnvironmentProperties() {
        String configPath = "src/test/resources/environments/" + 
                            currentEnvironment.getName() + ".properties";
        envProperties = PropertiesDataReader.loadProperties(configPath);
    }
    
    public static String getBaseUrl() {
        return envProperties.getProperty("base.url");
    }
    
    public static String getApiUrl() {
        return envProperties.getProperty("api.url");
    }
    
    public static String getDatabaseUrl() {
        return envProperties.getProperty("database.url");
    }
    
    public static String getProperty(String key) {
        return envProperties.getProperty(key);
    }
    
    public static Environment getCurrentEnvironment() {
        return currentEnvironment;
    }
}
```

### 6.3 Environment Files Structure
```
src/test/resources/environments/
├── qa.properties
├── staging.properties
└── prod.properties
```

**qa.properties:**
```properties
base.url=https://qa.example.com
api.url=https://api-qa.example.com
database.url=jdbc:mysql://qa-db:3306/testdb
timeout=30
```

---

## 7. Test Data Cleanup Strategies

### 7.1 Database Cleanup Utility
```java
import java.sql.*;

public class DatabaseCleanupUtil {
    private static final String DB_URL = EnvironmentManager.getDatabaseUrl();
    private static final String DB_USER = System.getenv("DB_USER");
    private static final String DB_PASSWORD = System.getenv("DB_PASSWORD");
    
    public static void deleteTestData(String table, String whereClause) {
        String query = "DELETE FROM " + table + " WHERE " + whereClause;
        executeUpdate(query);
    }
    
    public static void deleteUserByEmail(String email) {
        deleteTestData("users", "email = '" + email + "'");
    }
    
    public static void deleteTestDataCreatedToday(String table) {
        deleteTestData(table, "DATE(created_at) = CURDATE()");
    }
    
    public static void truncateTable(String table) {
        executeUpdate("TRUNCATE TABLE " + table);
    }
    
    private static void executeUpdate(String query) {
        try (Connection conn = DriverManager.getConnection(DB_URL, DB_USER, DB_PASSWORD);
             Statement stmt = conn.createStatement()) {
            stmt.executeUpdate(query);
        } catch (SQLException e) {
            throw new RuntimeException("Database cleanup failed: " + query, e);
        }
    }
}
```

### 7.2 File Cleanup Utility
```java
import java.io.File;
import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;

public class FileCleanupUtil {
    
    public static void deleteFile(String filePath) {
        File file = new File(filePath);
        if (file.exists()) {
            file.delete();
        }
    }
    
    public static void deleteDirectory(String directoryPath) {
        try {
            Path path = Paths.get(directoryPath);
            if (Files.exists(path)) {
                Files.walkFileTree(path, new SimpleFileVisitor<Path>() {
                    @Override
                    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) 
                            throws IOException {
                        Files.delete(file);
                        return FileVisitResult.CONTINUE;
                    }
                    
                    @Override
                    public FileVisitResult postVisitDirectory(Path dir, IOException exc) 
                            throws IOException {
                        Files.delete(dir);
                        return FileVisitResult.CONTINUE;
                    }
                });
            }
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete directory: " + directoryPath, e);
        }
    }
    
    public static void cleanDownloadsFolder() {
        String downloadsPath = System.getProperty("user.dir") + "/downloads";
        deleteDirectory(downloadsPath);
        new File(downloadsPath).mkdirs();
    }
    
    public static void cleanScreenshotsFolder() {
        String screenshotsPath = System.getProperty("user.dir") + "/screenshots";
        deleteDirectory(screenshotsPath);
        new File(screenshotsPath).mkdirs();
    }
}
```

### 7.3 TestNG Cleanup Methods
```java
import org.testng.annotations.*;

public class CleanupExampleTest {
    private List<String> createdUsers = new ArrayList<>();
    
    @BeforeClass
    public void setupClass() {
        // Initial setup
    }
    
    @BeforeMethod
    public void setupMethod() {
        // Setup before each test
    }
    
    @Test
    public void testCreateUser() {
        String email = FakerDataGenerator.getEmail();
        // Create user logic
        createdUsers.add(email);
    }
    
    @AfterMethod
    public void teardownMethod() {
        // Cleanup after each test method
        FileCleanupUtil.cleanDownloadsFolder();
    }
    
    @AfterClass
    public void teardownClass() {
        // Cleanup all created test data
        createdUsers.forEach(DatabaseCleanupUtil::deleteUserByEmail);
        FileCleanupUtil.cleanScreenshotsFolder();
    }
}
```

---

## 8. Data-Driven Testing

### 8.1 TestNG DataProvider - Inline
```java
public class DataDrivenTest {
    
    @DataProvider(name = "loginData")
    public Object[][] loginTestData() {
        return new Object[][] {
            {"admin@test.com", "Admin@123", true},
            {"user@test.com", "User@123", true},
            {"invalid@test.com", "Wrong@123", false}
        };
    }
    
    @Test(dataProvider = "loginData")
    public void testLogin(String username, String password, boolean shouldSucceed) {
        // Test logic
    }
}
```

### 8.2 DataProvider from JSON
```java
public class JsonDataProviders {
    
    @DataProvider(name = "usersFromJson")
    public static Object[][] getUsersFromJson() {
        String filePath = "data/json/users.json";
        List<UserFormData> users = JsonDataReader.readList(filePath, UserFormData.class);
        
        Object[][] data = new Object[users.size()][1];
        for (int i = 0; i < users.size(); i++) {
            data[i][0] = users.get(i);
        }
        return data;
    }
    
    @Test(dataProvider = "usersFromJson")
    public void testUserCreation(UserFormData user) {
        // Test logic using user object
    }
}
```

### 8.3 DataProvider from Excel
```java
public class ExcelDataProviders {
    
    @DataProvider(name = "loginFromExcel")
    public static Object[][] getLoginDataFromExcel() {
        String filePath = "data/excel/authentication/login-data.xlsx";
        return ExcelDataReader.getExcelDataAsArray(filePath, "LoginTests");
    }
    
    @Test(dataProvider = "loginFromExcel")
    public void testLoginFromExcel(Map<String, String> data) {
        String username = data.get("username");
        String password = data.get("password");
        String expectedResult = data.get("expected_result");
        
        // Test logic
    }
}
```

### 8.4 DataProvider from CSV
```java
public class CsvDataProviders {
    
    @DataProvider(name = "dataFromCsv")
    public static Object[][] getDataFromCsv() {
        String filePath = "data/csv/test-data.csv";
        return CsvDataReader.getCsvDataAsArray(filePath);
    }
    
    @Test(dataProvider = "dataFromCsv")
    public void testFromCsv(Map<String, String> data) {
        // Test logic
    }
}
```

### 8.5 Parameterized Tests with Multiple DataProviders
```java
public class MultiDataProviderTest {
    
    @Test(dataProvider = "positiveData")
    public void testPositiveScenarios(String input) {
        // Positive test logic
    }
    
    @Test(dataProvider = "negativeData")
    public void testNegativeScenarios(String input) {
        // Negative test logic
    }
    
    @DataProvider(name = "positiveData")
    public Object[][] getPositiveData() {
        return new Object[][] {{"valid1"}, {"valid2"}};
    }
    
    @DataProvider(name = "negativeData")
    public Object[][] getNegativeData() {
        return new Object[][] {{"invalid1"}, {"invalid2"}};
    }
}
```

---

## 9. Test Data Factories - Builder Pattern

### 9.1 User Builder
```java
public class UserFormData {
    private String firstName;
    private String lastName;
    private String email;
    private String phone;
    private String address;
    private String city;
    private String state;
    private String zipCode;
    private String dateOfBirth;
    
    private UserFormData() {}
    
    public static UserBuilder builder() {
        return new UserBuilder();
    }
    
    public static class UserBuilder {
        private UserFormData user = new UserFormData();
        
        public UserBuilder firstName(String firstName) {
            user.firstName = firstName;
            return this;
        }
        
        public UserBuilder lastName(String lastName) {
            user.lastName = lastName;
            return this;
        }
        
        public UserBuilder email(String email) {
            user.email = email;
            return this;
        }
        
        public UserBuilder phone(String phone) {
            user.phone = phone;
            return this;
        }
        
        public UserBuilder address(String address) {
            user.address = address;
            return this;
        }
        
        public UserBuilder city(String city) {
            user.city = city;
            return this;
        }
        
        public UserBuilder state(String state) {
            user.state = state;
            return this;
        }
        
        public UserBuilder zipCode(String zipCode) {
            user.zipCode = zipCode;
            return this;
        }
        
        public UserBuilder dateOfBirth(String dateOfBirth) {
            user.dateOfBirth = dateOfBirth;
            return this;
        }
        
        public UserBuilder withRandomData() {
            user.firstName = FakerDataGenerator.getFirstName();
            user.lastName = FakerDataGenerator.getLastName();
            user.email = FakerDataGenerator.getEmail();
            user.phone = FakerDataGenerator.getMobileNumber();
            user.address = FakerDataGenerator.getAddress();
            user.city = FakerDataGenerator.getCity();
            user.state = FakerDataGenerator.getState();
            user.zipCode = FakerDataGenerator.getZipCode();
            user.dateOfBirth = FakerDataGenerator.getPastDate();
            return this;
        }
        
        public UserFormData build() {
            return user;
        }
    }
    
    // Getters
    public String getFirstName() { return firstName; }
    public String getLastName() { return lastName; }
    public String getEmail() { return email; }
    public String getPhone() { return phone; }
    public String getAddress() { return address; }
    public String getCity() { return city; }
    public String getState() { return state; }
    public String getZipCode() { return zipCode; }
    public String getDateOfBirth() { return dateOfBirth; }
}
```

### 9.2 Test Data Factory
```java
public class TestDataFactory {
    
    public static UserFormData createValidUser() {
        return UserFormData.builder()
            .withRandomData()
            .build();
    }
    
    public static UserFormData createUserWithSpecificEmail(String email) {
        return UserFormData.builder()
            .withRandomData()
            .email(email)
            .build();
    }
    
    public static UserFormData createMinimalUser() {
        return UserFormData.builder()
            .firstName(FakerDataGenerator.getFirstName())
            .lastName(FakerDataGenerator.getLastName())
            .email(FakerDataGenerator.getEmail())
            .build();
    }
    
    public static List<UserFormData> createMultipleUsers(int count) {
        List<UserFormData> users = new ArrayList<>();
        for (int i = 0; i < count; i++) {
            users.add(createValidUser());
        }
        return users;
    }
}
```

### 9.3 Usage Example
```java
@Test
public void testUserCreation() {
    // Create user with random data
    UserFormData user1 = TestDataFactory.createValidUser();
    
    // Create user with specific email
    UserFormData user2 = TestDataFactory.createUserWithSpecificEmail("custom@test.com");
    
    // Create user with custom builder
    UserFormData user3 = UserFormData.builder()
        .firstName("John")
        .lastName("Doe")
        .email("john.doe@test.com")
        .phone("1234567890")
        .withRandomData() // Will randomize remaining fields
        .build();
}
```

---

## 10. Sensitive Data Handling

### 10.1 AES Encryption Utility
```java
import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.util.Base64;

public class EncryptionUtil {
    private static final String ALGORITHM = "AES";
    private static final String SECRET_KEY = System.getenv("ENCRYPTION_KEY"); // Store in env
    
    public static String encrypt(String plainText) {
        try {
            SecretKeySpec secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.ENCRYPT_MODE, secretKey);
            byte[] encryptedBytes = cipher.doFinal(plainText.getBytes());
            return Base64.getEncoder().encodeToString(encryptedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Encryption failed", e);
        }
    }
    
    public static String decrypt(String encryptedText) {
        try {
            SecretKeySpec secretKey = new SecretKeySpec(SECRET_KEY.getBytes(), ALGORITHM);
            Cipher cipher = Cipher.getInstance(ALGORITHM);
            cipher.init(Cipher.DECRYPT_MODE, secretKey);
            byte[] decryptedBytes = cipher.doFinal(Base64.getDecoder().decode(encryptedText));
            return new String(decryptedBytes);
        } catch (Exception e) {
            throw new RuntimeException("Decryption failed", e);
        }
    }
}
```

### 10.2 Secure Vault Manager
```java
import java.util.HashMap;
import java.util.Map;

public class SecureVaultManager {
    private static Map<String, String> vault = new HashMap<>();
    
    static {
        loadFromEnvironment();
    }
    
    private static void loadFromEnvironment() {
        vault.put("admin.password", decrypt(System.getenv("ADMIN_PASSWORD_ENCRYPTED")));
        vault.put("api.key", decrypt(System.getenv("API_KEY_ENCRYPTED")));
        vault.put("db.password", decrypt(System.getenv("DB_PASSWORD_ENCRYPTED")));
    }
    
    private static String decrypt(String encrypted) {
        return encrypted != null ? EncryptionUtil.decrypt(encrypted) : null;
    }
    
    public static String getSecret(String key) {
        String value = vault.get(key);
        if (value == null) {
            throw new RuntimeException("Secret not found: " + key);
        }
        return value;
    }
    
    public static String getAdminPassword() {
        return getSecret("admin.password");
    }
    
    public static String getApiKey() {
        return getSecret("api.key");
    }
}
```

### 10.3 Data Masking Utility
```java
public class DataMaskingUtil {
    
    public static String maskEmail(String email) {
        if (email == null || !email.contains("@")) return email;
        
        String[] parts = email.split("@");
        String username = parts[0];
        String domain = parts[1];
        
        String maskedUsername = username.length() > 2 
            ? username.substring(0, 2) + "****" 
            : "****";
        
        return maskedUsername + "@" + domain;
    }
    
    public static String maskPhone(String phone) {
        if (phone == null || phone.length() < 10) return phone;
        return "******" + phone.substring(phone.length() - 4);
    }
    
    public static String maskCreditCard(String cardNumber) {
        if (cardNumber == null || cardNumber.length() < 16) return cardNumber;
        return "**** **** **** " + cardNumber.substring(12);
    }
    
    public static String maskSsn(String ssn) {
        if (ssn == null || ssn.length() != 9) return ssn;
        return "***-**-" + ssn.substring(5);
    }
}
```

### 10.4 Secure Logging
```java
import org.apache.logging.log4j.LogManager;
import org.apache.logging.log4j.Logger;

public class SecureLogger {
    private static final Logger logger = LogManager.getLogger(SecureLogger.class);
    
    public static void logUserAction(String action, String email) {
        logger.info("User action: {} | Email: {}", action, DataMaskingUtil.maskEmail(email));
    }
    
    public static void logPaymentInfo(String cardNumber, double amount) {
        logger.info("Payment processed: Amount={} | Card={}", 
            amount, DataMaskingUtil.maskCreditCard(cardNumber));
    }
    
    public static void logSensitiveData(String message, Object... params) {
        // Ensure no sensitive data in logs
        for (Object param : params) {
            if (param instanceof String) {
                String str = (String) param;
                if (str.contains("password") || str.contains("token")) {
                    logger.warn("Attempted to log sensitive data!");
                    return;
                }
            }
        }
        logger.info(message, params);
    }
}
```

---

## Best Practices

### 1. Data Isolation
- Keep test data separate for each environment
- Never use production data in testing
- Use data generation for dynamic test data

### 2. Data Cleanup
- Always clean up test data after test execution
- Use @AfterMethod and @AfterClass for cleanup
- Implement database cleanup for data-driven tests

### 3. Secure Credentials
- Never hardcode credentials in test code
- Use environment variables or secure vaults
- Encrypt sensitive data in configuration files

### 4. Data Reusability
- Create reusable data utilities and factories
- Use builder pattern for complex objects
- Centralize data providers

### 5. Data Validation
- Validate test data before using in tests
- Check file existence before upload tests
- Verify data integrity from external sources

### 6. Version Control
- Never commit sensitive data to version control
- Use .gitignore for credentials and config files
- Store sample/template data files only

### 7. Maintainability
- Keep data files organized in structured folders
- Document data file formats and schemas
- Use meaningful names for data files and methods

### 8. Performance
- Load large data files only once (static blocks)
- Use lazy loading for data when possible
- Cache frequently used data

---

## Complete Test Example

```java
public class CompleteDataDrivenTest extends BaseTest {
    private static final Logger logger = LogManager.getLogger();
    private List<String> testUsersCreated = new ArrayList<>();
    
    @DataProvider(name = "userData")
    public Object[][] getUserTestData() {
        String filePath = "data/excel/users/user-registration-data.xlsx";
        return ExcelDataReader.getExcelDataAsArray(filePath, "ValidUsers");
    }
    
    @Test(dataProvider = "userData")
    public void testUserRegistration(Map<String, String> data) {
        // Generate additional random data
        UserFormData user = UserFormData.builder()
            .firstName(data.get("firstName"))
            .lastName(data.get("lastName"))
            .email(FakerDataGenerator.getEmail()) // Dynamic email
            .phone(FakerDataGenerator.getMobileNumber())
            .address(data.get("address"))
            .city(data.get("city"))
            .state(data.get("state"))
            .zipCode(data.get("zipCode"))
            .build();
        
        // Track for cleanup
        testUsersCreated.add(user.getEmail());
        
        // Log with masked data
        SecureLogger.logUserAction("Registration Test", user.getEmail());
        
        // Perform test
        registrationPage.fillUserForm(user);
        registrationPage.submitForm();
        
        // Verify
        Assert.assertTrue(registrationPage.isSuccessMessageDisplayed());
    }
    
    @AfterClass
    public void cleanup() {
        // Cleanup all test users
        testUsersCreated.forEach(email -> {
            DatabaseCleanupUtil.deleteUserByEmail(email);
            logger.info("Cleaned up test user: {}", DataMaskingUtil.maskEmail(email));
        });
        
        // Cleanup files
        FileCleanupUtil.cleanDownloadsFolder();
    }
}
```

---

## Summary

This guide covers comprehensive test data strategies:
- **Generation**: Faker libraries for dynamic data
- **Storage**: JSON, Excel, CSV, Properties, Database
- **Management**: Environment-specific, centralized utilities
- **Security**: Encryption, vaults, masking
- **Cleanup**: Database, file system, automated teardown
- **Patterns**: Builders, factories, data providers

Use these patterns to create maintainable, scalable, and secure test automation frameworks.
