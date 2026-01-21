package com.MyInsta.My_Instagram.repository;

import com.MyInsta.My_Instagram.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p JOIN FETCH p.user u ORDER BY p.regDate DESC")
    List<Post> findAllWithUser();
}
