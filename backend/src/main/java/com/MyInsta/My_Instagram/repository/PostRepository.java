package com.MyInsta.My_Instagram.repository;

import com.MyInsta.My_Instagram.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {

    @Query("SELECT p FROM Post p JOIN FETCH p.user u ORDER BY p.regDate DESC")
    List<Post> findAllWithUser();
    
    @Query("SELECT p FROM Post p JOIN FETCH p.user u WHERE u.userid = :userid ORDER BY p.regDate DESC")
    List<Post> findByUserUserid(String userid);
    
    @Query(value = "SELECT p FROM Post p JOIN FETCH p.user u",
           countQuery = "SELECT COUNT(p) FROM Post p")
    Page<Post> findAllWithUserPageable(Pageable pageable);
}
