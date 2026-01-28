package com.MyInsta.My_Instagram.repository;

import com.MyInsta.My_Instagram.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    Optional<User> findByUserid(String userid);
    Optional<User> findByUseridAndPassword(String userid, String password);
    Optional<User> findByEmail(String email);
}