package com.MyInsta.My_Instagram.controller;

import com.MyInsta.My_Instagram.entity.Follow;
import com.MyInsta.My_Instagram.repository.FollowRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5174")
@RequestMapping("/api/follows")
public class FollowController {

    private final FollowRepository followRepository;

    public FollowController(FollowRepository followRepository) {
        this.followRepository = followRepository;
    }

    // 팔로우 추가
    @PostMapping("/follow")
    public ResponseEntity<?> follow(
            @RequestParam Long followerUserNo,
            @RequestParam Long followingUserNo) {
        try {
            // 이미 팔로우 중인지 확인
            if (followRepository.existsByFollowerUserNoAndFollowingUserNo(followerUserNo, followingUserNo)) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "이미 팔로우 중입니다."));
            }

            // 팔로우 추가
            Follow follow = new Follow();
            follow.setFollowerUserNo(followerUserNo);
            follow.setFollowingUserNo(followingUserNo);
            followRepository.save(follow);

            // 팔로워/팔로잉 수 조회
            Long followerCount = followRepository.countByFollowingUserNo(followingUserNo);
            Long followingCount = followRepository.countByFollowerUserNo(followerUserNo);

            Map<String, Object> response = new HashMap<>();
            response.put("isFollowing", true);
            response.put("followerCount", followerCount);
            response.put("followingCount", followingCount);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("팔로우 추가 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "팔로우 처리 중 오류가 발생했습니다.", "message", e.getMessage()));
        }
    }

    // 언팔로우
    @PostMapping("/unfollow")
    public ResponseEntity<?> unfollow(
            @RequestParam Long followerUserNo,
            @RequestParam Long followingUserNo) {
        try {
            Optional<Follow> follow = followRepository.findByFollowerUserNoAndFollowingUserNo(followerUserNo, followingUserNo);
            
            if (follow.isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("error", "팔로우 관계가 없습니다."));
            }

            followRepository.delete(follow.get());

            // 팔로워/팔로잉 수 조회
            Long followerCount = followRepository.countByFollowingUserNo(followingUserNo);
            Long followingCount = followRepository.countByFollowerUserNo(followerUserNo);

            Map<String, Object> response = new HashMap<>();
            response.put("isFollowing", false);
            response.put("followerCount", followerCount);
            response.put("followingCount", followingCount);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("언팔로우 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "언팔로우 처리 중 오류가 발생했습니다.", "message", e.getMessage()));
        }
    }

    // 팔로우 상태 확인
    @GetMapping("/status")
    public ResponseEntity<?> checkFollowStatus(
            @RequestParam Long followerUserNo,
            @RequestParam Long followingUserNo) {
        try {
            boolean isFollowing = followRepository.existsByFollowerUserNoAndFollowingUserNo(followerUserNo, followingUserNo);
            
            Map<String, Object> response = new HashMap<>();
            response.put("isFollowing", isFollowing);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("팔로우 상태 확인 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "팔로우 상태 확인 중 오류가 발생했습니다.", "message", e.getMessage()));
        }
    }

    // 특정 사용자의 팔로워 목록 조회
    @GetMapping("/followers/{userNo}")
    public ResponseEntity<?> getFollowers(@PathVariable Long userNo) {
        try {
            List<Follow> follows = followRepository.findFollowersByUserNo(userNo);
            
            List<Map<String, Object>> users = follows.stream()
                    .map(f -> {
                        Map<String, Object> userInfo = new HashMap<>();
                        userInfo.put("userNo", f.getFollower().getUserNo());
                        userInfo.put("userid", f.getFollower().getUserid());
                        userInfo.put("username", f.getFollower().getUsername());
                        userInfo.put("nickname", f.getFollower().getNickname());
                        userInfo.put("profileImg", f.getFollower().getProfileImg());
                        userInfo.put("followedAt", f.getRegDate());
                        return userInfo;
                    })
                    .toList();
            
            return ResponseEntity.ok(Map.of("users", users, "total", users.size()));
        } catch (Exception e) {
            System.err.println("팔로워 목록 조회 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "팔로워 목록 조회 중 오류가 발생했습니다."));
        }
    }

    // 특정 사용자의 팔로잉 목록 조회
    @GetMapping("/following/{userNo}")
    public ResponseEntity<?> getFollowing(@PathVariable Long userNo) {
        try {
            List<Follow> follows = followRepository.findFollowingsByUserNo(userNo);
            
            List<Map<String, Object>> users = follows.stream()
                    .map(f -> {
                        Map<String, Object> userInfo = new HashMap<>();
                        userInfo.put("userNo", f.getFollowing().getUserNo());
                        userInfo.put("userid", f.getFollowing().getUserid());
                        userInfo.put("username", f.getFollowing().getUsername());
                        userInfo.put("nickname", f.getFollowing().getNickname());
                        userInfo.put("profileImg", f.getFollowing().getProfileImg());
                        userInfo.put("followedAt", f.getRegDate());
                        return userInfo;
                    })
                    .toList();
            
            return ResponseEntity.ok(Map.of("users", users, "total", users.size()));
        } catch (Exception e) {
            System.err.println("팔로잉 목록 조회 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "팔로잉 목록 조회 중 오류가 발생했습니다."));
        }
    }

    // 특정 사용자의 팔로워/팔로잉 수 조회
    @GetMapping("/counts/{userNo}")
    public ResponseEntity<?> getFollowCounts(@PathVariable Long userNo) {
        try {
            Long followerCount = followRepository.countByFollowingUserNo(userNo);
            Long followingCount = followRepository.countByFollowerUserNo(userNo);
            
            Map<String, Object> response = new HashMap<>();
            response.put("followerCount", followerCount);
            response.put("followingCount", followingCount);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("팔로우 수 조회 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "팔로우 수 조회 중 오류가 발생했습니다."));
        }
    }
}
