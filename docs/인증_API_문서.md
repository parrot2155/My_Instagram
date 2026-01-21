# 인증(Authentication) API 문서

**버전:** 0.0.1-SNAPSHOT  
**작성일:** 2026년 1월 22일  
**설명:** My Instagram 프로젝트의 로그인 및 회원가입 기능 개발자 문서

---

## 📑 목차

1. [개요](#개요)
2. [기술 스택](#기술-스택)
3. [API 엔드포인트](#api-엔드포인트)
4. [데이터베이스 스키마](#데이터베이스-스키마)
5. [프론트엔드 구조](#프론트엔드-구조)
6. [설치 및 실행](#설치-및-실행)
7. [에러 처리](#에러-처리)
8. [보안 고려사항](#보안-고려사항)

---

## 개요

My Instagram 프로젝트의 사용자 인증 시스템은 로그인, 회원가입, 아이디 중복 검사 기능을 제공합니다.

### 주요 기능
- ✅ 사용자 로그인 (아이디/비밀번호 인증)
- ✅ 회원가입 (이름, 아이디, 비밀번호, 이메일, 닉네임)
- ✅ 아이디 중복 검사 (실시간 검증)
- ✅ 비밀번호 확인 검증

---

## 기술 스택

### 백엔드
| 항목 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | Spring Boot | 4.0.0 |
| 언어 | Java | 17 |
| 빌드 도구 | Maven | - |
| ORM | JPA/Hibernate | 7.1.8 |
| 데이터베이스 | Oracle | 19.3 |
| JDBC 드라이버 | ojdbc8 | - |

### 프론트엔드
| 항목 | 기술 | 버전 |
|------|------|------|
| 프레임워크 | React | 19 |
| 빌드 도구 | Vite | 7.3.0 |
| 라우팅 | React Router DOM | 7 |
| 언어 | JavaScript (JSX) | ES6+ |

### 서버 포트
- **백엔드:** http://localhost:8090
- **프론트엔드:** http://localhost:5174
- **CORS:** 프론트엔드 5174 포트 허용

---

## API 엔드포인트

### 1. 로그인 (Login)

**Endpoint:** `POST /api/auth/login`

**설명:** 사용자 아이디와 비밀번호로 로그인을 수행합니다.

#### 요청 (Request)

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "userid": "testuser",
  "password": "password123"
}
```

**필드 설명:**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| userid | String | ✓ | 사용자 아이디 |
| password | String | ✓ | 비밀번호 |

#### 응답 (Response)

**성공 (200 OK):**
```json
{
  "success": true,
  "message": "로그인 성공",
  "user": {
    "userNo": 1,
    "userid": "testuser",
    "username": "홍길동",
    "email": "test@example.com",
    "nickname": "테스터",
    "profileImg": null,
    "description": null,
    "website": null,
    "verified": 0,
    "isPrivate": 0,
    "status": 0,
    "regDate": "2026-01-22T00:00:00.000+00:00",
    "updateDate": "2026-01-22T00:00:00.000+00:00"
  }
}
```

**실패 - 인증 실패 (200 OK):**
```json
{
  "success": false,
  "message": "아이디 또는 비밀번호가 일치하지 않습니다."
}
```

**실패 - 필드 누락 (400 Bad Request):**
```json
{
  "success": false,
  "message": "아이디와 비밀번호를 입력해주세요."
}
```

#### 프론트엔드 호출 예시
```javascript
const response = await fetch("http://localhost:8090/api/auth/login", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
  },
  body: JSON.stringify({
    userid: "testuser",
    password: "password123"
  }),
});

const data = await response.json();
if (data.success) {
  console.log("로그인 성공:", data.user);
  // 로그인 후 처리 (예: 메인 페이지 이동)
} else {
  console.error("로그인 실패:", data.message);
}
```

---

### 2. 아이디 중복 검사 (Check User ID)

**Endpoint:** `POST /api/auth/check-userid`

**설명:** 회원가입 전 아이디가 이미 사용 중인지 확인합니다.

#### 요청 (Request)

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "userid": "newuser"
}
```

**필드 설명:**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| userid | String | ✓ | 검사할 아이디 |

#### 응답 (Response)

**사용 가능 (200 OK):**
```json
{
  "success": true,
  "available": true,
  "message": "사용 가능한 아이디입니다."
}
```

**이미 사용 중 (200 OK):**
```json
{
  "success": true,
  "available": false,
  "message": "이미 사용 중인 아이디입니다."
}
```

**실패 - 필드 누락 (400 Bad Request):**
```json
{
  "success": false,
  "available": false,
  "message": "아이디를 입력해주세요."
}
```

#### 프론트엔드 호출 예시
```javascript
const checkUserid = async (userid) => {
  const response = await fetch("http://localhost:8090/api/auth/check-userid", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ userid }),
  });

  const data = await response.json();
  if (data.available) {
    console.log("사용 가능한 아이디");
  } else {
    console.error("이미 사용 중인 아이디");
  }
};
```

#### 백엔드 디버그 로그
서버 콘솔에 다음과 같은 로그가 출력됩니다:
```
Checking userid: newuser
Existing user: false
```

---

### 3. 회원가입 (Signup)

**Endpoint:** `POST /api/auth/signup`

**설명:** 새로운 사용자 계정을 생성합니다.

#### 요청 (Request)

**Headers:**
```
Content-Type: application/json
```

**Body:**
```json
{
  "name": "홍길동",
  "userid": "newuser",
  "password": "password123",
  "passwordConfirm": "password123",
  "email": "newuser@example.com",
  "nickname": "길동이"
}
```

**필드 설명:**
| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| name | String | ✓ | 사용자 이름 (실명) |
| userid | String | ✓ | 아이디 (고유값, 중복 불가) |
| password | String | ✓ | 비밀번호 |
| passwordConfirm | String | ✓ | 비밀번호 확인 (프론트엔드 검증용) |
| email | String | ✓ | 이메일 (고유값, 중복 불가) |
| nickname | String | ✓ | 닉네임 |

**참고:** `passwordConfirm`은 프론트엔드에서 검증하며, 백엔드에서는 저장하지 않습니다.

#### 응답 (Response)

**성공 (200 OK):**
```json
{
  "success": true,
  "message": "회원가입이 완료되었습니다.",
  "user": {
    "userNo": 2,
    "userid": "newuser",
    "username": "홍길동",
    "password": "password123",
    "email": "newuser@example.com",
    "nickname": "길동이",
    "profileImg": null,
    "description": null,
    "website": null,
    "verified": 0,
    "isPrivate": 0,
    "status": 0,
    "regDate": "2026-01-22T00:44:00.000+00:00",
    "updateDate": "2026-01-22T00:44:00.000+00:00"
  }
}
```

**실패 - 필드 누락 (400 Bad Request):**
```json
{
  "success": false,
  "message": "이름을 입력해주세요."
}
```
*또는 "아이디를 입력해주세요.", "비밀번호를 입력해주세요." 등*

**실패 - 아이디 중복 (400 Bad Request):**
```json
{
  "success": false,
  "message": "이미 사용 중인 아이디입니다."
}
```

**실패 - 서버 오류 (500 Internal Server Error):**
```json
{
  "success": false,
  "message": "회원가입 처리 중 오류가 발생했습니다."
}
```

#### 프론트엔드 호출 예시
```javascript
const handleSignup = async (formData) => {
  // 비밀번호 확인 검증 (프론트엔드)
  if (formData.password !== formData.passwordConfirm) {
    alert("비밀번호가 일치하지 않습니다.");
    return;
  }

  const response = await fetch("http://localhost:8090/api/auth/signup", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(formData),
  });

  const data = await response.json();
  if (data.success) {
    console.log("회원가입 성공:", data.user);
    // 로그인 페이지로 이동
    navigate("/login");
  } else {
    console.error("회원가입 실패:", data.message);
  }
};
```

---

## 데이터베이스 스키마

### USERS 테이블

**테이블명:** `USERS`  
**스키마:** `MULTI`

#### 테이블 구조

| 컬럼명 | 데이터 타입 | NULL | 기본값 | 설명 |
|--------|------------|------|--------|------|
| USER_NO | NUMBER | NO | SEQ_USERS_NO.NEXTVAL | 사용자 고유 번호 (PK, 자동 생성) |
| USERID | VARCHAR2(30) | NO | - | 사용자 아이디 (UK) |
| USERNAME | VARCHAR2(50) | NO | - | 사용자 이름 (실명) |
| PASSWORD | VARCHAR2(255) | NO | - | 비밀번호 (평문 저장 중) |
| EMAIL | VARCHAR2(255) | NO | - | 이메일 주소 (UK) |
| NICKNAME | VARCHAR2(50) | YES | - | 닉네임 |
| PROFILE_IMG | VARCHAR2(500) | YES | - | 프로필 이미지 URL |
| DESCRIPTION | VARCHAR2(150) | YES | - | 자기소개 |
| WEBSITE | VARCHAR2(200) | YES | - | 개인 웹사이트 |
| VERIFIED | NUMBER(1) | YES | 0 | 인증 여부 (0: 미인증, 1: 인증) |
| IS_PRIVATE | NUMBER(1) | YES | 0 | 비공개 계정 여부 (0: 공개, 1: 비공개) |
| STATUS | NUMBER(1) | YES | 0 | 계정 상태 (0: 활성, 1: 정지 등) |
| REG_DATE | DATE | NO | SYSDATE | 가입 일시 |
| UPDATE_DATE | DATE | YES | SYSDATE | 최종 수정 일시 |

#### 제약 조건

**Primary Key:**
```sql
CONSTRAINT PK_USERS PRIMARY KEY (USER_NO)
```

**Unique Constraints:**
```sql
CONSTRAINT UQ_USERS_ID UNIQUE (USERID)
CONSTRAINT UQ_USERS_EMAIL UNIQUE (EMAIL)
```

#### 시퀀스

**시퀀스명:** `SEQ_USERS_NO`

```sql
CREATE SEQUENCE SEQ_USERS_NO
    START WITH 1
    INCREMENT BY 1
    NOCACHE;
```

#### 트리거

**트리거명:** `TRG_USERS_PK`

```sql
CREATE OR REPLACE TRIGGER TRG_USERS_PK
BEFORE INSERT ON USERS
FOR EACH ROW
BEGIN
    IF :NEW.USER_NO IS NULL THEN
        SELECT SEQ_USERS_NO.NEXTVAL INTO :NEW.USER_NO FROM DUAL;
    END IF;
END;
```

**동작:** INSERT 시 USER_NO가 NULL이면 시퀀스에서 자동으로 번호를 할당합니다.

#### DDL 전체 코드

```sql
-- 시퀀스 생성
CREATE SEQUENCE SEQ_USERS_NO
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

-- 테이블 생성
CREATE TABLE USERS (
    USER_NO      NUMBER,
    USERID       VARCHAR2(30)    NOT NULL,
    USERNAME     VARCHAR2(50)    NOT NULL,
    PASSWORD     VARCHAR2(255)   NOT NULL,
    EMAIL        VARCHAR2(255)   NOT NULL,
    NICKNAME     VARCHAR2(50),
    PROFILE_IMG  VARCHAR2(500),
    DESCRIPTION  VARCHAR2(150),
    WEBSITE      VARCHAR2(200),
    VERIFIED     NUMBER(1)       DEFAULT 0,
    IS_PRIVATE   NUMBER(1)       DEFAULT 0,
    STATUS       NUMBER(1)       DEFAULT 0,
    REG_DATE     DATE            DEFAULT SYSDATE NOT NULL,
    UPDATE_DATE  DATE            DEFAULT SYSDATE,
    
    CONSTRAINT PK_USERS PRIMARY KEY (USER_NO),
    CONSTRAINT UQ_USERS_ID UNIQUE (USERID),
    CONSTRAINT UQ_USERS_EMAIL UNIQUE (EMAIL)
);

-- 트리거 생성
CREATE OR REPLACE TRIGGER TRG_USERS_PK
BEFORE INSERT ON USERS
FOR EACH ROW
BEGIN
    IF :NEW.USER_NO IS NULL THEN
        SELECT SEQ_USERS_NO.NEXTVAL INTO :NEW.USER_NO FROM DUAL;
    END IF;
END;
```

#### 데이터 조회 예시

**전체 사용자 조회:**
```sql
SELECT USER_NO, USERID, USERNAME, EMAIL, NICKNAME, REG_DATE
FROM USERS
ORDER BY USER_NO DESC;
```

**최근 가입자 5명:**
```sql
SELECT USER_NO, USERID, USERNAME, EMAIL, NICKNAME, REG_DATE
FROM USERS
ORDER BY USER_NO DESC
FETCH FIRST 5 ROWS ONLY;
```

**특정 아이디 검색:**
```sql
SELECT * FROM USERS WHERE USERID = 'testuser';
```

---

## 프론트엔드 구조

### 디렉토리 구조

```
frontend/
├── src/
│   ├── components/
│   │   ├── Login.jsx          # 로그인 컴포넌트
│   │   ├── Login.css           # 로그인/회원가입 공통 스타일
│   │   └── Signup.jsx          # 회원가입 컴포넌트
│   ├── config/
│   │   └── api.js              # API 설정 (선택)
│   ├── App.jsx                 # 라우팅 설정
│   └── main.jsx                # 엔트리 포인트
├── vite.config.js              # Vite 설정 (포트 5174)
└── package.json
```

### 주요 컴포넌트

#### 1. Login.jsx

**경로:** `frontend/src/components/Login.jsx`

**기능:**
- 사용자 아이디/비밀번호 입력
- 로그인 요청 (`POST /api/auth/login`)
- 로그인 성공 시 메인 페이지로 이동
- 회원가입 페이지로 이동 링크

**주요 State:**
```javascript
const [userid, setUserid] = useState("");
const [password, setPassword] = useState("");
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
```

**핵심 로직:**
```javascript
const handleLogin = async (e) => {
  e.preventDefault();
  setLoading(true);
  
  try {
    const response = await fetch("http://localhost:8090/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userid, password }),
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log("로그인 성공:", data.user);
      navigate("/"); // 메인 페이지로 이동
    } else {
      setError(data.message);
    }
  } catch (error) {
    setError("서버 연결에 실패했습니다.");
  } finally {
    setLoading(false);
  }
};
```

---

#### 2. Signup.jsx

**경로:** `frontend/src/components/Signup.jsx`

**기능:**
- 사용자 정보 입력 (이름, 아이디, 비밀번호, 비밀번호 확인, 이메일, 닉네임)
- 아이디 중복 검사 (`POST /api/auth/check-userid`)
- 비밀번호 일치 검증
- 회원가입 요청 (`POST /api/auth/signup`)
- 회원가입 성공 시 로그인 페이지로 이동

**주요 State:**
```javascript
const [formData, setFormData] = useState({
  name: "",
  userid: "",
  password: "",
  passwordConfirm: "",
  email: "",
  nickname: "",
});
const [error, setError] = useState("");
const [loading, setLoading] = useState(false);
const [useridAvailable, setUseridAvailable] = useState(null); 
// null: 미검사, true: 사용 가능, false: 사용 불가
```

**아이디 중복 검사:**
```javascript
const checkUserid = async () => {
  if (!formData.userid.trim()) {
    setError("아이디를 입력해주세요.");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch("http://localhost:8090/api/auth/check-userid", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userid: formData.userid }),
    });

    const data = await response.json();
    
    if (data.available) {
      setUseridAvailable(true);
      setError("");
    } else {
      setUseridAvailable(false);
      setError("이미 사용 중인 아이디입니다.");
    }
  } catch (error) {
    setError("아이디 중복검사를 실패했습니다.");
  } finally {
    setLoading(false);
  }
};
```

**회원가입 처리:**
```javascript
const handleSignup = async (e) => {
  e.preventDefault();
  setError("");

  // 유효성 검사
  if (!formData.name.trim()) {
    setError("이름을 입력해주세요.");
    return;
  }
  if (useridAvailable === null) {
    setError("아이디 중복검사를 해주세요.");
    return;
  }
  if (!useridAvailable) {
    setError("이미 사용 중인 아이디입니다.");
    return;
  }
  if (formData.password !== formData.passwordConfirm) {
    setError("비밀번호가 일치하지 않습니다.");
    return;
  }

  setLoading(true);
  try {
    const response = await fetch("http://localhost:8090/api/auth/signup", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    const data = await response.json();
    
    if (data.success) {
      console.log("회원가입 성공:", data.user);
      navigate("/login");
    } else {
      setError(data.message);
    }
  } catch (error) {
    setError("서버 연결에 실패했습니다.");
  } finally {
    setLoading(false);
  }
};
```

**아이디 변경 시 중복검사 상태 리셋:**
```javascript
const handleChange = (e) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
  
  // userid 변경 시 중복검사 상태 초기화
  if (name === "userid") {
    setUseridAvailable(null);
  }
};
```

---

#### 3. App.jsx (라우팅)

**경로:** `frontend/src/App.jsx`

**라우팅 설정:**
```javascript
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<div>메인 페이지</div>} />
      </Routes>
    </Router>
  );
}

export default App;
```

**URL 경로:**
- `/login` → 로그인 페이지
- `/signup` → 회원가입 페이지
- `/` → 메인 페이지 (추후 개발)

---

#### 4. Login.css (스타일)

**경로:** `frontend/src/components/Login.css`

**주요 스타일:**
- Instagram 스타일의 로그인/회원가입 UI
- 중복검사 버튼 (`.check-button`)
- 성공 메시지 (`.success-message`)
- 에러 메시지 (`.error-message`)
- 입력 그룹 (`.input-group`)

**중복검사 UI:**
```css
.input-group {
  position: relative;
}

.check-button {
  position: absolute;
  right: 8px;
  top: 50%;
  transform: translateY(-50%);
  background-color: #0095f6;
  color: white;
  border: none;
  padding: 6px 12px;
  border-radius: 4px;
  cursor: pointer;
  font-size: 12px;
  font-weight: 600;
}

.success-message {
  color: #00c853;
  font-size: 12px;
  margin-top: 4px;
  text-align: left;
}
```

---

### UI/UX 플로우

#### 회원가입 플로우

```
1. 사용자가 /signup 접속
   ↓
2. 이름, 아이디, 비밀번호 등 입력
   ↓
3. "중복검사" 버튼 클릭
   ↓
4. POST /api/auth/check-userid 호출
   ↓
5-1. available: true → "사용 가능한 아이디입니다." (녹색)
5-2. available: false → "이미 사용 중인 아이디입니다." (빨간색)
   ↓
6. 비밀번호와 비밀번호 확인 일치 검증
   ↓
7. "회원가입" 버튼 클릭
   ↓
8. POST /api/auth/signup 호출
   ↓
9. 성공 시 /login으로 이동
```

#### 로그인 플로우

```
1. 사용자가 /login 접속
   ↓
2. 아이디, 비밀번호 입력
   ↓
3. "로그인" 버튼 클릭
   ↓
4. POST /api/auth/login 호출
   ↓
5-1. 성공 → / (메인 페이지)로 이동
5-2. 실패 → 에러 메시지 표시
```

---

## 설치 및 실행

### 사전 요구사항

- **Java:** JDK 17 이상
- **Node.js:** v18 이상
- **Oracle Database:** 19c 이상
- **Maven:** 내장 Maven Wrapper 사용

### 데이터베이스 설정

#### 1. Oracle DB 접속
```sql
-- SQL*Plus 또는 SQL Developer 사용
sqlplus MULTI/your_password@localhost:1521/ORCL
```

#### 2. 시퀀스 및 테이블 생성
```sql
-- 시퀀스 생성
CREATE SEQUENCE SEQ_USERS_NO
    START WITH 1
    INCREMENT BY 1
    NOCACHE;

-- 테이블 생성
CREATE TABLE USERS (
    USER_NO      NUMBER,
    USERID       VARCHAR2(30)    NOT NULL,
    USERNAME     VARCHAR2(50)    NOT NULL,
    PASSWORD     VARCHAR2(255)   NOT NULL,
    EMAIL        VARCHAR2(255)   NOT NULL,
    NICKNAME     VARCHAR2(50),
    PROFILE_IMG  VARCHAR2(500),
    DESCRIPTION  VARCHAR2(150),
    WEBSITE      VARCHAR2(200),
    VERIFIED     NUMBER(1)       DEFAULT 0,
    IS_PRIVATE   NUMBER(1)       DEFAULT 0,
    STATUS       NUMBER(1)       DEFAULT 0,
    REG_DATE     DATE            DEFAULT SYSDATE NOT NULL,
    UPDATE_DATE  DATE            DEFAULT SYSDATE,
    
    CONSTRAINT PK_USERS PRIMARY KEY (USER_NO),
    CONSTRAINT UQ_USERS_ID UNIQUE (USERID),
    CONSTRAINT UQ_USERS_EMAIL UNIQUE (EMAIL)
);

-- 트리거 생성
CREATE OR REPLACE TRIGGER TRG_USERS_PK
BEFORE INSERT ON USERS
FOR EACH ROW
BEGIN
    IF :NEW.USER_NO IS NULL THEN
        SELECT SEQ_USERS_NO.NEXTVAL INTO :NEW.USER_NO FROM DUAL;
    END IF;
END;
/
```

#### 3. 연결 정보 확인

**파일:** `backend/src/main/resources/application.properties`

```properties
spring.application.name=My_Instagram

# Oracle DB 설정
spring.datasource.url=jdbc:oracle:thin:@localhost:1521:ORCL
spring.datasource.username=MULTI
spring.datasource.password=your_password
spring.datasource.driver-class-name=oracle.jdbc.OracleDriver

# JPA 설정
spring.jpa.hibernate.ddl-auto=none
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.format_sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.OracleDialect

# 서버 포트
server.port=8090
```

**⚠️ 주의:** `spring.datasource.password`를 실제 비밀번호로 변경하세요.

---

### 백엔드 실행

#### 방법 1: Maven Wrapper 사용 (권장)

```powershell
# 1. 백엔드 디렉토리로 이동
cd d:\work\myInsta\My_Instagram\backend

# 2. 빌드 (테스트 스킵)
.\mvnw.cmd clean package -DskipTests

# 3. 실행
java -jar target\My_Instagram-0.0.1-SNAPSHOT.jar
```

#### 방법 2: 한 줄 명령어

```powershell
cd d:\work\myInsta\My_Instagram\backend && .\mvnw.cmd clean package -DskipTests && java -jar target\My_Instagram-0.0.1-SNAPSHOT.jar
```

#### 실행 확인

서버가 정상적으로 시작되면 다음과 같은 로그가 출력됩니다:

```
  .   ____          _            __ _ _
 /\\ / ___'_ __ _ _(_)_ __  __ _ \ \ \ \
( ( )\___ | '_ | '_| | '_ \/ _` | \ \ \ \
 \\/  ___)| |_)| | | | | || (_| |  ) ) ) )
  '  |____| .__|_| |_|_| |_\__, | / / / /
 =========|_|==============|___/=/_/_/_/

 :: Spring Boot ::                (v4.0.0)

...
Tomcat started on port 8090 (http) with context path '/'
Started MyInstagramApplication in 11.806 seconds
```

**백엔드 URL:** http://localhost:8090

---

### 프론트엔드 실행

#### 1. 의존성 설치 (최초 1회만)

```powershell
cd d:\work\myInsta\My_Instagram\frontend
npm install
```

#### 2. 개발 서버 시작

```powershell
npm run dev -- --port 5174
```

#### 실행 확인

다음과 같은 로그가 출력됩니다:

```
  VITE v7.3.0  ready in 863 ms

  ➜  Local:   http://localhost:5174/
  ➜  Network: use --host to expose
  ➜  press h + enter to show help
```

**프론트엔드 URL:** http://localhost:5174

---

### 서버 종료

```powershell
# 백엔드 종료
taskkill /F /IM java.exe

# 프론트엔드 종료
taskkill /F /IM node.exe

# 모두 종료
taskkill /F /IM java.exe; taskkill /F /IM node.exe
```

또는 터미널에서 `Ctrl + C`를 눌러 종료할 수 있습니다.

---

### 전체 실행 스크립트

**PowerShell 스크립트 (start-servers.ps1):**

```powershell
# 기존 서버 종료
Write-Host "기존 서버 종료 중..." -ForegroundColor Yellow
taskkill /F /IM java.exe 2>$null
taskkill /F /IM node.exe 2>$null
Start-Sleep -Seconds 2

# 백엔드 시작
Write-Host "백엔드 서버 시작 중..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\work\myInsta\My_Instagram\backend; java -jar target\My_Instagram-0.0.1-SNAPSHOT.jar"
Start-Sleep -Seconds 5

# 프론트엔드 시작
Write-Host "프론트엔드 서버 시작 중..." -ForegroundColor Green
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd d:\work\myInsta\My_Instagram\frontend; npm run dev -- --port 5174"

Write-Host "서버 시작 완료!" -ForegroundColor Cyan
Write-Host "백엔드: http://localhost:8090" -ForegroundColor White
Write-Host "프론트엔드: http://localhost:5174" -ForegroundColor White
```

**사용 방법:**
```powershell
.\start-servers.ps1
```

---

## 에러 처리

### 백엔드 에러

#### 1. Port 8090 already in use

**원인:** 8090 포트가 이미 사용 중입니다.

**해결:**
```powershell
# Java 프로세스 종료
taskkill /F /IM java.exe

# 또는 특정 포트 사용 프로세스 확인
netstat -ano | findstr :8090
taskkill /F /PID [PID 번호]
```

#### 2. ORA-01400: NULL을 삽입할 수 없습니다

**원인:** REG_DATE 또는 UPDATE_DATE가 NULL로 삽입되고 있습니다.

**해결:** User 엔티티에 `@PrePersist`, `@PreUpdate` 추가됨 (현재 버전에서 해결됨)

```java
@PrePersist
protected void onCreate() {
    if (regDate == null) {
        regDate = new Date();
    }
    if (updateDate == null) {
        updateDate = new Date();
    }
}

@PreUpdate
protected void onUpdate() {
    updateDate = new Date();
}
```

#### 3. ORA-00001: 무결성 제약 조건 위반

**원인:** USERID 또는 EMAIL이 중복되었습니다.

**해결:** 
- 프론트엔드에서 아이디 중복검사를 필수로 진행
- 백엔드에서도 중복 검사 후 회원가입 처리 (현재 버전에서 구현됨)

#### 4. Database connection failed

**원인:** Oracle DB 연결 실패

**확인 사항:**
```powershell
# Oracle 서비스 확인
Get-Service | Where-Object {$_.Name -like "Oracle*"}

# DB 접속 테스트
sqlplus MULTI/your_password@localhost:1521/ORCL
```

**application.properties 확인:**
- `spring.datasource.url` 정확한지 확인
- `spring.datasource.username` / `password` 정확한지 확인

---

### 프론트엔드 에러

#### 1. CORS 에러 (Access-Control-Allow-Origin)

**에러 메시지:**
```
Access to fetch at 'http://localhost:8090/api/auth/login' from origin 'http://localhost:5174' 
has been blocked by CORS policy
```

**원인:** CORS 설정이 프론트엔드 포트와 일치하지 않습니다.

**해결:**

**CorsConfig.java:**
```java
@Override
public void addCorsMappings(CorsRegistry registry) {
    registry.addMapping("/api/**")
            .allowedOrigins("http://localhost:5174")  // 프론트엔드 포트 확인
            .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
            .allowedHeaders("*")
            .allowCredentials(true)
            .maxAge(3600);
}
```

**AuthController.java:**
```java
@CrossOrigin(origins = "http://localhost:5174")
@RestController
@RequestMapping("/api/auth")
public class AuthController { ... }
```

백엔드 재빌드 필요:
```powershell
cd backend
.\mvnw.cmd clean package -DskipTests
java -jar target\My_Instagram-0.0.1-SNAPSHOT.jar
```

#### 2. Port 5174 is in use

**원인:** 5174 포트가 이미 사용 중입니다.

**해결:**
```powershell
# Node.js 프로세스 종료
taskkill /F /IM node.exe

# 프론트엔드 재시작
cd frontend
npm run dev -- --port 5174
```

#### 3. Failed to fetch

**원인:** 백엔드 서버가 실행되지 않았거나 네트워크 오류

**확인:**
1. 백엔드 서버가 실행 중인지 확인 (http://localhost:8090)
2. 브라우저 개발자 도구 → Network 탭에서 요청 상태 확인
3. 백엔드 콘솔에서 에러 로그 확인

---

### 일반적인 문제 해결

#### 빌드 실패 (컴파일 에러)

```powershell
# 캐시 정리 후 재빌드
cd backend
.\mvnw.cmd clean
.\mvnw.cmd clean package -DskipTests
```

#### JAR 파일 접근 불가

**에러:**
```
Error: Unable to access jarfile target/My_Instagram-0.0.1-SNAPSHOT.jar
```

**해결:**
```powershell
# 절대 경로 사용
java -jar "d:\work\myInsta\My_Instagram\backend\target\My_Instagram-0.0.1-SNAPSHOT.jar"
```

#### 프론트엔드 의존성 에러

```powershell
# node_modules 삭제 후 재설치
cd frontend
Remove-Item node_modules -Recurse -Force
Remove-Item package-lock.json -Force
npm install
```

---

## 보안 고려사항

### ⚠️ 현재 보안 이슈

#### 1. 비밀번호 평문 저장

**문제:** 현재 비밀번호가 DB에 평문으로 저장되고 있습니다.

**위험도:** 🔴 **매우 높음**

**권장 사항:** Spring Security + BCrypt 해싱 적용

**해결 방법 (예시):**

```java
// 의존성 추가 (pom.xml)
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-security</artifactId>
</dependency>

// PasswordEncoder 설정
@Configuration
public class SecurityConfig {
    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }
}

// 회원가입 시 암호화
@Autowired
private PasswordEncoder passwordEncoder;

public ResponseEntity<?> signup(@RequestBody SignupRequest request) {
    // ...
    String encodedPassword = passwordEncoder.encode(request.getPassword());
    newUser.setPassword(encodedPassword);
    // ...
}

// 로그인 시 검증
public ResponseEntity<?> login(@RequestBody LoginRequest request) {
    Optional<User> user = userRepository.findByUserid(request.getUserid());
    
    if (user.isPresent() && passwordEncoder.matches(request.getPassword(), user.get().getPassword())) {
        // 로그인 성공
    }
}
```

---

#### 2. 인증 토큰 미사용

**문제:** 로그인 후 세션 관리가 없습니다.

**위험도:** 🟡 **중간**

**권장 사항:** JWT (JSON Web Token) 또는 Spring Session 적용

**JWT 예시:**
```java
// JWT 생성
String token = Jwts.builder()
    .setSubject(user.getUserid())
    .setIssuedAt(new Date())
    .setExpiration(new Date(System.currentTimeMillis() + 86400000)) // 24시간
    .signWith(SignatureAlgorithm.HS512, "secret-key")
    .compact();

// 응답에 토큰 포함
response.put("token", token);
```

**프론트엔드 저장:**
```javascript
localStorage.setItem("token", data.token);

// API 요청 시 헤더에 포함
headers: {
  "Authorization": `Bearer ${localStorage.getItem("token")}`
}
```

---

#### 3. HTTPS 미사용

**문제:** HTTP로 통신하여 데이터가 암호화되지 않습니다.

**위험도:** 🟡 **중간** (개발 환경에서는 허용, 프로덕션에서는 필수)

**권장 사항:** 프로덕션 배포 시 HTTPS 필수

---

#### 4. SQL Injection 방지

**현재 상태:** ✅ **안전**

JPA를 사용하여 Prepared Statement로 자동 처리되므로 SQL Injection에 안전합니다.

```java
// 안전한 쿼리 (JPA)
Optional<User> findByUserid(String userid);
```

---

#### 5. XSS (Cross-Site Scripting) 방지

**권장 사항:** 프론트엔드에서 사용자 입력 검증 및 이스케이프 처리

```javascript
// 입력 검증 예시
const sanitizeInput = (input) => {
  return input.replace(/[<>]/g, "");
};
```

---

#### 6. Rate Limiting

**권장 사항:** 무차별 대입 공격 방지를 위해 요청 제한 추가

```java
// Spring Boot Actuator + Rate Limiting 적용 가능
```

---

### 보안 체크리스트 (프로덕션 배포 전)

- [ ] 비밀번호 해싱 (BCrypt)
- [ ] JWT 또는 세션 기반 인증
- [ ] HTTPS 적용
- [ ] 환경 변수로 DB 비밀번호 관리
- [ ] Rate Limiting (요청 제한)
- [ ] 입력 검증 강화
- [ ] CORS 설정 최소화 (필요한 도메인만)
- [ ] 에러 메시지에서 민감 정보 제거
- [ ] 로깅 시 비밀번호 등 민감 정보 제외

---

## 부록

### A. 백엔드 주요 클래스

#### AuthController.java
**경로:** `backend/src/main/java/com/MyInsta/My_Instagram/controller/AuthController.java`

**역할:** 인증 관련 REST API 엔드포인트 제공

**주요 메서드:**
- `login()` - 로그인 처리
- `checkUserid()` - 아이디 중복 검사
- `signup()` - 회원가입 처리

---

#### User.java (Entity)
**경로:** `backend/src/main/java/com/MyInsta/My_Instagram/entity/User.java`

**역할:** USERS 테이블과 매핑되는 JPA 엔티티

**어노테이션:**
- `@Entity` - JPA 엔티티 선언
- `@Table(name = "USERS")` - 테이블 매핑
- `@Id` - Primary Key
- `@GeneratedValue` - ID 자동 생성
- `@SequenceGenerator` - Oracle 시퀀스 매핑
- `@PrePersist` - INSERT 전 실행
- `@PreUpdate` - UPDATE 전 실행

---

#### UserRepository.java
**경로:** `backend/src/main/java/com/MyInsta/My_Instagram/repository/UserRepository.java`

**역할:** User 엔티티 데이터 접근 인터페이스

**메서드:**
```java
Optional<User> findByUserid(String userid);
Optional<User> findByUseridAndPassword(String userid, String password);
```

---

#### LoginRequest.java / SignupRequest.java
**경로:** `backend/src/main/java/com/MyInsta/My_Instagram/controller/`

**역할:** API 요청 DTO (Data Transfer Object)

---

#### CorsConfig.java
**경로:** `backend/src/main/java/com/MyInsta/My_Instagram/config/CorsConfig.java`

**역할:** CORS 설정

---

### B. API 테스트

#### Postman / cURL 예시

**로그인:**
```bash
curl -X POST http://localhost:8090/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"userid":"testuser","password":"password123"}'
```

**아이디 중복 검사:**
```bash
curl -X POST http://localhost:8090/api/auth/check-userid \
  -H "Content-Type: application/json" \
  -d '{"userid":"newuser"}'
```

**회원가입:**
```bash
curl -X POST http://localhost:8090/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "name":"홍길동",
    "userid":"newuser",
    "password":"password123",
    "passwordConfirm":"password123",
    "email":"newuser@example.com",
    "nickname":"길동이"
  }'
```

---

### C. 프로젝트 구조 전체

```
My_Instagram/
├── backend/
│   ├── src/
│   │   ├── main/
│   │   │   ├── java/
│   │   │   │   └── com/MyInsta/My_Instagram/
│   │   │   │       ├── MyInstagramApplication.java
│   │   │   │       ├── config/
│   │   │   │       │   └── CorsConfig.java
│   │   │   │       ├── controller/
│   │   │   │       │   ├── AuthController.java
│   │   │   │       │   ├── LoginRequest.java
│   │   │   │       │   └── SignupRequest.java
│   │   │   │       ├── entity/
│   │   │   │       │   └── User.java
│   │   │   │       └── repository/
│   │   │   │           └── UserRepository.java
│   │   │   └── resources/
│   │   │       ├── application.properties
│   │   │       └── mybatis-config.xml
│   │   └── test/
│   ├── target/
│   │   └── My_Instagram-0.0.1-SNAPSHOT.jar
│   ├── pom.xml
│   ├── mvnw.cmd
│   └── HELP.md
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Login.jsx
│   │   │   ├── Login.css
│   │   │   └── Signup.jsx
│   │   ├── App.jsx
│   │   ├── App.css
│   │   ├── main.jsx
│   │   └── index.css
│   ├── public/
│   ├── vite.config.js
│   ├── package.json
│   └── README.md
│
└── docs/
    └── 인증_API_문서.md (이 문서)
```

---

## 문서 이력

| 버전 | 날짜 | 작성자 | 변경 내용 |
|------|------|--------|-----------|
| 1.0.0 | 2026-01-22 | - | 초기 작성 (로그인, 회원가입, 아이디 중복 검사) |

---

## 문의

프로젝트 관련 문의사항이나 버그 리포트는 이슈 트래커를 이용해주세요.

---

**END OF DOCUMENT**
