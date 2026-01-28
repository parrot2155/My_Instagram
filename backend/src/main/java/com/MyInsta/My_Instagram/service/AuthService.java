package com.MyInsta.My_Instagram.service;

import com.MyInsta.My_Instagram.config.JwtUtil;
import com.MyInsta.My_Instagram.entity.RefreshToken;
import com.MyInsta.My_Instagram.entity.User;
import com.MyInsta.My_Instagram.repository.RefreshTokenRepository;
import com.MyInsta.My_Instagram.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.Optional;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RefreshTokenRepository refreshTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    // 회원가입 - 비밀번호 해시화
    @Transactional
    public Map<String, Object> signup(User user) {
        Map<String, Object> response = new HashMap<>();

        // 아이디 중복 체크
        if (userRepository.findByUserid(user.getUserid()).isPresent()) {
            response.put("success", false);
            response.put("message", "이미 존재하는 아이디입니다.");
            return response;
        }

        // 이메일 중복 체크
        if (userRepository.findByEmail(user.getEmail()).isPresent()) {
            response.put("success", false);
            response.put("message", "이미 사용 중인 이메일입니다.");
            return response;
        }

        // 비밀번호 해시화
        user.setPassword(passwordEncoder.encode(user.getPassword()));
        
        // 사용자 저장
        User savedUser = userRepository.save(user);
        
        response.put("success", true);
        response.put("message", "회원가입이 완료되었습니다.");
        response.put("user", savedUser);
        return response;
    }

    // 로그인 - 해시화된 비밀번호 검증 및 토큰 발급
    @Transactional
    public Map<String, Object> login(String userid, String password) {
        Map<String, Object> response = new HashMap<>();

        // 사용자 조회
        Optional<User> userOptional = userRepository.findByUserid(userid);
        
        if (userOptional.isEmpty()) {
            response.put("success", false);
            response.put("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
            return response;
        }

        User user = userOptional.get();

        // 비밀번호 검증
        if (!passwordEncoder.matches(password, user.getPassword())) {
            response.put("success", false);
            response.put("message", "아이디 또는 비밀번호가 일치하지 않습니다.");
            return response;
        }

        // 토큰 생성
        String accessToken = jwtUtil.generateAccessToken(user.getUserNo(), user.getUserid(), user.getNickname());
        String refreshToken = jwtUtil.generateRefreshToken(user.getUserNo());

        // 기존 리프레시 토큰 삭제
        refreshTokenRepository.deleteByUserNo(user.getUserNo());

        // 새 리프레시 토큰 저장
        RefreshToken refreshTokenEntity = new RefreshToken();
        refreshTokenEntity.setUserNo(user.getUserNo());
        refreshTokenEntity.setToken(refreshToken);
        refreshTokenEntity.setExpiryDate(LocalDateTime.now().plusDays(1));
        refreshTokenRepository.save(refreshTokenEntity);

        // 응답 데이터 구성
        response.put("success", true);
        response.put("message", "로그인 성공");
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);
        
        // 사용자 정보 (비밀번호 제외)
        Map<String, Object> userInfo = new HashMap<>();
        userInfo.put("userNo", user.getUserNo());
        userInfo.put("userid", user.getUserid());
        userInfo.put("username", user.getUsername());
        userInfo.put("nickname", user.getNickname());
        userInfo.put("email", user.getEmail());
        userInfo.put("profileImg", user.getProfileImg());
        userInfo.put("description", user.getDescription());
        
        response.put("user", userInfo);
        return response;
    }

    // 리프레시 토큰으로 액세스 토큰 재발급
    @Transactional
    public Map<String, Object> refreshAccessToken(String refreshToken) {
        Map<String, Object> response = new HashMap<>();

        // 리프레시 토큰 검증
        if (!jwtUtil.validateToken(refreshToken)) {
            response.put("success", false);
            response.put("message", "유효하지 않은 리프레시 토큰입니다.");
            return response;
        }

        // DB에서 리프레시 토큰 조회
        Optional<RefreshToken> tokenOptional = refreshTokenRepository.findByToken(refreshToken);
        
        if (tokenOptional.isEmpty()) {
            response.put("success", false);
            response.put("message", "존재하지 않는 리프레시 토큰입니다.");
            return response;
        }

        RefreshToken tokenEntity = tokenOptional.get();

        // 만료 확인
        if (tokenEntity.getExpiryDate().isBefore(LocalDateTime.now())) {
            refreshTokenRepository.delete(tokenEntity);
            response.put("success", false);
            response.put("message", "만료된 리프레시 토큰입니다. 다시 로그인해주세요.");
            return response;
        }

        // 사용자 정보 조회
        Optional<User> userOptional = userRepository.findById(tokenEntity.getUserNo());
        
        if (userOptional.isEmpty()) {
            response.put("success", false);
            response.put("message", "사용자를 찾을 수 없습니다.");
            return response;
        }

        User user = userOptional.get();

        // 새 액세스 토큰 생성
        String newAccessToken = jwtUtil.generateAccessToken(user.getUserNo(), user.getUserid(), user.getNickname());

        response.put("success", true);
        response.put("message", "액세스 토큰이 재발급되었습니다.");
        response.put("accessToken", newAccessToken);
        return response;
    }

    // 로그아웃 - 리프레시 토큰 삭제
    @Transactional
    public Map<String, Object> logout(Long userNo) {
        Map<String, Object> response = new HashMap<>();
        
        refreshTokenRepository.deleteByUserNo(userNo);
        
        response.put("success", true);
        response.put("message", "로그아웃되었습니다.");
        return response;
    }
}
