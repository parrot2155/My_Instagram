package com.MyInsta.My_Instagram.repository;

import com.MyInsta.My_Instagram.entity.Follow;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FollowRepository extends JpaRepository<Follow, Long> {

    // 팔로우 관계 확인
    Optional<Follow> findByFollowerUserNoAndFollowingUserNo(Long followerUserNo, Long followingUserNo);
    
    // 팔로우 관계 존재 여부
    boolean existsByFollowerUserNoAndFollowingUserNo(Long followerUserNo, Long followingUserNo);
    
    // 특정 사용자의 팔로워 수
    Long countByFollowingUserNo(Long followingUserNo);
    
    // 특정 사용자의 팔로잉 수
    Long countByFollowerUserNo(Long followerUserNo);
    
    // 특정 사용자의 팔로워 목록 (User 정보 포함)
    @Query("SELECT f FROM Follow f JOIN FETCH f.follower WHERE f.followingUserNo = :userNo ORDER BY f.regDate DESC")
    List<Follow> findFollowersByUserNo(Long userNo);
    
    // 특정 사용자의 팔로잉 목록 (User 정보 포함)
    @Query("SELECT f FROM Follow f JOIN FETCH f.following WHERE f.followerUserNo = :userNo ORDER BY f.regDate DESC")
    List<Follow> findFollowingsByUserNo(Long userNo);
}
