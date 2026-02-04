package com.MyInsta.My_Instagram.controller;

import com.MyInsta.My_Instagram.entity.Post;
import com.MyInsta.My_Instagram.entity.PostLike;
import com.MyInsta.My_Instagram.repository.PostLikeRepository;
import com.MyInsta.My_Instagram.repository.PostRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "http://localhost:5174")
@RequestMapping("/api/likes")
public class LikeController {

    private final PostLikeRepository postLikeRepository;
    private final PostRepository postRepository;

    public LikeController(PostLikeRepository postLikeRepository, PostRepository postRepository) {
        this.postLikeRepository = postLikeRepository;
        this.postRepository = postRepository;
    }

    // 좋아요 추가/삭제 토글
    @PostMapping("/toggle")
    public ResponseEntity<?> toggleLike(
            @RequestParam Long postId,
            @RequestParam Long userNo) {
        try {
            System.out.println("=== 좋아요 토글 시작 ===");
            System.out.println("postId: " + postId + ", userNo: " + userNo);

            // 게시물 존재 확인
            Post post = postRepository.findById(postId)
                    .orElseThrow(() -> new RuntimeException("게시물을 찾을 수 없습니다."));

            // 이미 좋아요가 있는지 확인
            Optional<PostLike> existingLike = postLikeRepository.findByPostIdAndUserNo(postId, userNo);

            boolean isLiked;
            if (existingLike.isPresent()) {
                // 좋아요 취소
                postLikeRepository.delete(existingLike.get());
                post.setLikeCount(Math.max(0, post.getLikeCount() - 1));
                isLiked = false;
                System.out.println("좋아요 취소");
            } else {
                // 좋아요 추가
                PostLike newLike = new PostLike();
                newLike.setPostId(postId);
                newLike.setUserNo(userNo);
                postLikeRepository.save(newLike);
                post.setLikeCount(post.getLikeCount() + 1);
                isLiked = true;
                System.out.println("좋아요 추가");
            }

            postRepository.save(post);

            Map<String, Object> response = new HashMap<>();
            response.put("isLiked", isLiked);
            response.put("likeCount", post.getLikeCount());
            
            System.out.println("최종 좋아요 수: " + post.getLikeCount());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            System.err.println("좋아요 토글 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "좋아요 처리 중 오류가 발생했습니다.", "message", e.getMessage()));
        }
    }

    // 사용자가 좋아요한 게시물 ID 목록 조회
    @GetMapping("/user/{userNo}")
    public ResponseEntity<?> getUserLikedPosts(@PathVariable Long userNo) {
        try {
            List<Long> likedPostIds = postLikeRepository.findPostIdsByUserNo(userNo);
            return ResponseEntity.ok(Map.of("likedPostIds", likedPostIds));
        } catch (Exception e) {
            System.err.println("좋아요 목록 조회 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "좋아요 목록 조회 중 오류가 발생했습니다.", "message", e.getMessage()));
        }
    }

    // 특정 게시물의 좋아요 상태 확인
    @GetMapping("/check")
    public ResponseEntity<?> checkLikeStatus(
            @RequestParam Long postId,
            @RequestParam Long userNo) {
        try {
            boolean isLiked = postLikeRepository.existsByPostIdAndUserNo(postId, userNo);
            Long likeCount = postLikeRepository.countByPostId(postId);
            
            Map<String, Object> response = new HashMap<>();
            response.put("isLiked", isLiked);
            response.put("likeCount", likeCount);
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            System.err.println("좋아요 상태 확인 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(Map.of("error", "좋아요 상태 확인 중 오류가 발생했습니다.", "message", e.getMessage()));
        }
    }
}
