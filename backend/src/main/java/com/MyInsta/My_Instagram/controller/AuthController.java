package com.MyInsta.My_Instagram.controller;

import com.MyInsta.My_Instagram.config.JwtUtil;
import com.MyInsta.My_Instagram.entity.User;
import com.MyInsta.My_Instagram.repository.UserRepository;
import com.MyInsta.My_Instagram.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5174")
public class AuthController {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private AuthService authService;

    @Autowired
    private JwtUtil jwtUtil;

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody LoginRequest loginRequest) {
        String userid = loginRequest.getUserid();
        String password = loginRequest.getPassword();

        Map<String, Object> response = new HashMap<>();

        if (userid == null || password == null || userid.trim().isEmpty() || password.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "아이디와 비밀번호를 입력해주세요.");
            return ResponseEntity.badRequest().body(response);
        }

        // AuthService를 통한 로그인 처리
        response = authService.login(userid, password);
        
        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    @PostMapping("/check-userid")
    public ResponseEntity<Map<String, Object>> checkUserid(@RequestBody Map<String, String> request) {
        String userid = request.get("userid");

        Map<String, Object> response = new HashMap<>();

        if (userid == null || userid.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "아이디를 입력해주세요.");
            response.put("available", false);
            return ResponseEntity.badRequest().body(response);
        }

        System.out.println("Checking userid: " + userid);
        Optional<User> existingUser = userRepository.findByUserid(userid);
        System.out.println("Existing user: " + existingUser.isPresent());

        if (existingUser.isPresent()) {
            response.put("success", true);
            response.put("available", false);
            response.put("message", "이미 사용 중인 아이디입니다.");
        } else {
            response.put("success", true);
            response.put("available", true);
            response.put("message", "사용 가능한 아이디입니다.");
        }

        return ResponseEntity.ok(response);
    }

    @PostMapping("/signup")
    public ResponseEntity<Map<String, Object>> signup(@RequestBody SignupRequest signupRequest) {
        String name = signupRequest.getName();
        String userid = signupRequest.getUserid();
        String password = signupRequest.getPassword();
        String email = signupRequest.getEmail();
        String nickname = signupRequest.getNickname();

        Map<String, Object> response = new HashMap<>();

        // 유효성 검사
        if (name == null || name.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "이름을 입력해주세요.");
            return ResponseEntity.badRequest().body(response);
        }
        if (userid == null || userid.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "아이디를 입력해주세요.");
            return ResponseEntity.badRequest().body(response);
        }
        if (password == null || password.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "비밀번호를 입력해주세요.");
            return ResponseEntity.badRequest().body(response);
        }
        if (email == null || email.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "이메일을 입력해주세요.");
            return ResponseEntity.badRequest().body(response);
        }
        if (nickname == null || nickname.trim().isEmpty()) {
            response.put("success", false);
            response.put("message", "닉네임을 입력해주세요.");
            return ResponseEntity.badRequest().body(response);
        }

        // 아이디 중복 검사
        Optional<User> existingUser = userRepository.findByUserid(userid);
        if (existingUser.isPresent()) {
            response.put("success", false);
            response.put("message", "이미 사용 중인 아이디입니다.");
            return ResponseEntity.badRequest().body(response);
        }

        // 이메일 중복 검사
        Optional<User> existingEmail = userRepository.findByEmail(email);
        if (existingEmail.isPresent()) {
            response.put("success", false);
            response.put("message", "이미 사용 중인 이메일입니다.");
            return ResponseEntity.badRequest().body(response);
        }

        // 새 사용자 생성
        User newUser = new User();
        newUser.setUsername(name);
        newUser.setUserid(userid);
        newUser.setPassword(password);
        newUser.setEmail(email);
        newUser.setNickname(nickname);

        try {
            response = authService.signup(newUser);
            if ((Boolean) response.get("success")) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.badRequest().body(response);
            }
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "회원가입 처리 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // 리프레시 토큰으로 액세스 토큰 재발급
    @PostMapping("/refresh")
    public ResponseEntity<Map<String, Object>> refreshToken(@RequestBody Map<String, String> request) {
        String refreshToken = request.get("refreshToken");
        
        if (refreshToken == null || refreshToken.trim().isEmpty()) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", false);
            response.put("message", "리프레시 토큰이 필요합니다.");
            return ResponseEntity.badRequest().body(response);
        }

        Map<String, Object> response = authService.refreshAccessToken(refreshToken);
        
        if ((Boolean) response.get("success")) {
            return ResponseEntity.ok(response);
        } else {
            return ResponseEntity.badRequest().body(response);
        }
    }

    // 로그아웃
    @PostMapping("/logout")
    public ResponseEntity<Map<String, Object>> logout(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "유효하지 않은 토큰입니다.");
                return ResponseEntity.badRequest().body(response);
            }

            String token = authHeader.substring(7);
            Long userNo = jwtUtil.extractUserNo(token);
            
            response = authService.logout(userNo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "로그아웃 처리 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(response);
        }
    }

    // 현재 사용자 정보 조회
    @GetMapping("/me")
    public ResponseEntity<Map<String, Object>> getCurrentUser(@RequestHeader("Authorization") String authHeader) {
        Map<String, Object> response = new HashMap<>();
        
        try {
            if (authHeader == null || !authHeader.startsWith("Bearer ")) {
                response.put("success", false);
                response.put("message", "유효하지 않은 토큰입니다.");
                return ResponseEntity.badRequest().body(response);
            }

            String token = authHeader.substring(7);
            
            if (!jwtUtil.validateToken(token)) {
                response.put("success", false);
                response.put("message", "만료되거나 유효하지 않은 토큰입니다.");
                return ResponseEntity.badRequest().body(response);
            }

            Long userNo = jwtUtil.extractUserNo(token);
            Optional<User> userOptional = userRepository.findById(userNo);
            
            if (userOptional.isEmpty()) {
                response.put("success", false);
                response.put("message", "사용자를 찾을 수 없습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            User user = userOptional.get();
            Map<String, Object> userInfo = new HashMap<>();
            userInfo.put("userNo", user.getUserNo());
            userInfo.put("userid", user.getUserid());
            userInfo.put("username", user.getUsername());
            userInfo.put("nickname", user.getNickname());
            userInfo.put("email", user.getEmail());
            userInfo.put("profileImg", user.getProfileImg());
            userInfo.put("description", user.getDescription());
            
            response.put("success", true);
            response.put("user", userInfo);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "사용자 정보 조회 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(response);
        }
    }
}