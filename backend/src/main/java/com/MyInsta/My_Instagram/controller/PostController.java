package com.MyInsta.My_Instagram.controller;

import com.MyInsta.My_Instagram.entity.Post;
import com.MyInsta.My_Instagram.entity.User;
import com.MyInsta.My_Instagram.repository.PostRepository;
import com.MyInsta.My_Instagram.repository.UserRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.List;
import java.util.UUID;

@RestController
@CrossOrigin(origins = "http://localhost:5174")
@RequestMapping("/api")
public class PostController {

    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final String UPLOAD_DIR = "uploads/";

    public PostController(PostRepository postRepository, UserRepository userRepository) {
        this.postRepository = postRepository;
        this.userRepository = userRepository;
        // uploads 디렉토리 생성
        File uploadDir = new File(UPLOAD_DIR);
        if (!uploadDir.exists()) {
            uploadDir.mkdirs();
        }
    }

    @GetMapping("/posts")
    public List<Post> getPosts() {
        return postRepository.findAllWithUser();
    }

    @PostMapping("/posts/create")
    public ResponseEntity<?> createPost(
            @RequestParam("image") MultipartFile image,
            @RequestParam("content") String content,
            @RequestParam(value = "location", required = false) String location,
            @RequestParam("userNo") Long userNo) {
        
        try {
            System.out.println("=== 게시물 작성 시작 ===");
            System.out.println("userNo: " + userNo);
            System.out.println("content: " + content);
            System.out.println("location: " + location);
            System.out.println("image: " + (image != null ? image.getOriginalFilename() : "null"));
            
            // 이미지 파일 타입 검증
            String contentType = image.getContentType();
            if (contentType == null || !contentType.startsWith("image/")) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of("error", "이미지 파일만 업로드할 수 있습니다.", 
                                              "message", "허용되는 파일 형식: JPG, PNG, GIF, WEBP"));
            }
            
            // 허용되는 이미지 타입 확인
            List<String> allowedTypes = List.of("image/jpeg", "image/jpg", "image/png", "image/gif", "image/webp");
            if (!allowedTypes.contains(contentType.toLowerCase())) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of("error", "지원하지 않는 이미지 형식입니다.", 
                                              "message", "허용되는 파일 형식: JPG, PNG, GIF, WEBP"));
            }
            
            // 파일 크기 제한 (10MB)
            long maxSize = 10 * 1024 * 1024; // 10MB
            if (image.getSize() > maxSize) {
                return ResponseEntity.badRequest()
                        .body(java.util.Map.of("error", "파일 크기가 너무 큽니다.", 
                                              "message", "최대 10MB까지 업로드 가능합니다."));
            }
            
            // 사용자 조회
            User user = userRepository.findById(userNo)
                    .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다. userNo: " + userNo));

            System.out.println("사용자 조회 성공: " + user.getUserid());

            // 파일 저장
            String originalFilename = image.getOriginalFilename();
            String extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            String savedFilename = UUID.randomUUID().toString() + extension;
            Path filePath = Paths.get(UPLOAD_DIR + savedFilename);
            Files.write(filePath, image.getBytes());
            
            System.out.println("파일 저장 성공: " + savedFilename);

            // 게시물 생성
            Post post = new Post();
            post.setUser(user);
            post.setUserNo(userNo); // USER_NO 컬럼에 직접 값 설정
            post.setImageUrl("/uploads/" + savedFilename);
            post.setContent(content);
            post.setLocation(location);

            Post savedPost = postRepository.save(post);
            System.out.println("게시물 저장 성공: postId=" + savedPost.getPostId());
            
            return ResponseEntity.ok(savedPost);
        } catch (IOException e) {
            System.err.println("파일 업로드 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(java.util.Map.of("error", "파일 업로드 중 오류가 발생했습니다.", "message", e.getMessage()));
        } catch (Exception e) {
            System.err.println("게시물 작성 오류: " + e.getMessage());
            e.printStackTrace();
            return ResponseEntity.status(500)
                    .body(java.util.Map.of("error", "게시물 작성 중 오류가 발생했습니다.", "message", e.getMessage()));
        }
    }
}
