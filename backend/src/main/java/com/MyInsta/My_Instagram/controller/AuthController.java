package com.MyInsta.My_Instagram.controller;

import com.MyInsta.My_Instagram.entity.User;
import com.MyInsta.My_Instagram.repository.UserRepository;
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

        Optional<User> user = userRepository.findByUseridAndPassword(userid, password);

        if (user.isPresent()) {
            response.put("success", true);
            response.put("message", "로그인 성공");
            response.put("user", user.get());
            return ResponseEntity.ok(response);
        } else {
            response.put("success", false);
            response.put("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
            return ResponseEntity.ok(response);
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

        // 새 사용자 생성
        User newUser = new User();
        newUser.setUsername(name);
        newUser.setUserid(userid);
        newUser.setPassword(password); // 실제로는 암호화 필요
        newUser.setEmail(email);
        newUser.setNickname(nickname);

        try {
            User savedUser = userRepository.save(newUser);
            response.put("success", true);
            response.put("message", "회원가입이 완료되었습니다.");
            response.put("user", savedUser);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            response.put("success", false);
            response.put("message", "회원가입 처리 중 오류가 발생했습니다.");
            return ResponseEntity.internalServerError().body(response);
        }
    }
}