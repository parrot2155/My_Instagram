package com.MyInsta.My_Instagram.repository;

import com.MyInsta.My_Instagram.entity.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.Optional;

@Repository
public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Long> {
    Optional<RefreshToken> findByToken(String token);
    Optional<RefreshToken> findByUserNo(Long userNo);
    void deleteByUserNo(Long userNo);
    void deleteByExpiryDateBefore(LocalDateTime now);
}
