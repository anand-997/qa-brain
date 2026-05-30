# Framework Blueprints — Config, Build & Suite Files

Reference file for `/create-restassured-framework`. Contains verbatim blueprints for all configuration, build, and suite files (framework files 16–26, 29). Substitute project values per Phase 2 rules before generating.

---

#### Configuration files blueprint

```properties
# config/config.properties
api.connect.timeout.ms=10000
api.socket.timeout.ms=30000
retry.enabled=true
retry.max.count=2
report.title=API Automation Report

# config/api.properties
api.base.path=/api/v1
api.path.smoke.endpoint1=/REPLACE_ME_ENDPOINT_1
api.path.smoke.endpoint2=/REPLACE_ME_ENDPOINT_2

# config/auth.properties  (gitignored — populate only if auth is required)
auth.url=REPLACE_ME
auth.username=REPLACE_ME
auth.password=REPLACE_ME
auth.token.json.path=access_token
auth.token.ttl.seconds=3600

# config/data.properties
testdata.users=testdata/users.json
testdata.products=testdata/products.json

# config/routes.properties
api.dev.uri=REPLACE_ME_PROD_URL
api.uat.uri=REPLACE_ME_PROD_URL
api.test.uri=REPLACE_ME_PROD_URL
api.prod.uri=REPLACE_ME_PROD_URL
retry.enabled=false
retry.max.count=0
api.connect.timeout.ms=5000
api.socket.timeout.ms=15000
```

---

#### log4j2.xml blueprint

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
    <Properties>
        <Property name="logDir">logs</Property>
        <Property name="pattern">%d{yyyy-MM-dd HH:mm:ss.SSS} [%t] %-5level %-40logger{40} — %msg%n</Property>
    </Properties>
    <Appenders>
        <Console name="Console" target="SYSTEM_OUT">
            <PatternLayout pattern="${pattern}"/>
        </Console>
        <RollingFile name="FileAppender"
                     fileName="${logDir}/api-automation.log"
                     filePattern="${logDir}/archived/api-automation-%d{yyyy-MM-dd}-%i.log.gz">
            <PatternLayout pattern="${pattern}"/>
            <Policies>
                <TimeBasedTriggeringPolicy interval="1" modulate="true"/>
                <SizeBasedTriggeringPolicy size="20MB"/>
            </Policies>
            <DefaultRolloverStrategy max="15"/>
        </RollingFile>
    </Appenders>
    <Loggers>
        <Logger name="com.company.api.automation" level="DEBUG" additivity="false">
            <AppenderRef ref="Console"/>
            <AppenderRef ref="FileAppender"/>
        </Logger>
        <Logger name="io.restassured" level="WARN" additivity="false">
            <AppenderRef ref="FileAppender"/>
        </Logger>
        <Root level="INFO">
            <AppenderRef ref="Console"/>
            <AppenderRef ref="FileAppender"/>
        </Root>
    </Loggers>
</Configuration>
```

---

#### TestNG suite XML blueprints

```xml
<!-- smoke-api-suite.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Smoke API Suite" parallel="methods" thread-count="5" verbose="1">
    <listeners>
        <listener class-name="com.company.api.automation.core.listeners.TestListener"/>
        <listener class-name="com.company.api.automation.core.listeners.RetryTransformer"/>
    </listeners>
    <test name="Smoke Tests">
        <groups><run><include name="smoke"/></run></groups>
        <packages><package name="com.company.api.automation.tests"/></packages>
    </test>
</suite>
```

```xml
<!-- regression-api-suite.xml -->
<?xml version="1.0" encoding="UTF-8"?>
<!DOCTYPE suite SYSTEM "https://testng.org/testng-1.0.dtd">
<suite name="Regression API Suite" parallel="classes" thread-count="10" verbose="1">
    <listeners>
        <listener class-name="com.company.api.automation.core.listeners.TestListener"/>
        <listener class-name="com.company.api.automation.core.listeners.RetryTransformer"/>
    </listeners>
    <test name="Smoke Tests">
        <packages><package name="com.company.api.automation.tests.smoke"/></packages>
    </test>
</suite>
```

---

#### .gitignore blueprint

```gitignore
target/
build/
.idea/
*.iml
.vscode/
.settings/
.project
.classpath
reports/
test-output/
logs/
*.log
archived/
src/test/resources/config/auth.properties
*.local.properties
.env
.DS_Store
Thumbs.db
```
