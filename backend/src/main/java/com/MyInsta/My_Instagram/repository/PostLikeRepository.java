package com.MyInsta.My_Instagram.repository;

import com.MyInsta.My_Instagram.entity.PostLike;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PostLikeRepository extends JpaRepository<PostLike, Long> {

    // 특정 사용자가 특정 게시물에 좋아요를 눌렀는지 확인
    Optional<PostLike> findByPostIdAndUserNo(Long postId, Long userNo);
    
    // 특정 게시물의 좋아요 수
    Long countByPostId(Long postId);
    
    // 특정 사용자가 좋아요한 게시물 ID 목록
    @Query("SELECT pl.postId FROM PostLike pl WHERE pl.userNo = :userNo")
    List<Long> findPostIdsByUserNo(Long userNo);
    
    // 좋아요 존재 여부 확인
    boolean existsByPostIdAndUserNo(Long postId, Long userNo);
    
    // 특정 게시물에 좋아요 누른 사용자 목록 조회 (User 정보 포함)
    @Query("SELECT pl FROM PostLike pl JOIN FETCH pl.user WHERE pl.postId = :postId ORDER BY pl.regDate DESC")
    List<PostLike> findByPostIdWithUser(Long postId);
}
