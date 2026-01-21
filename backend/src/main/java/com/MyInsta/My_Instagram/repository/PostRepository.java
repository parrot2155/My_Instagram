package com.MyInsta.My_Instagram.repository;

import com.MyInsta.My_Instagram.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
}
