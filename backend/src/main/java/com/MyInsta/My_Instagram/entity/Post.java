package com.MyInsta.My_Instagram.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "POSTS")
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_posts_no")
    @SequenceGenerator(name = "seq_posts_no", sequenceName = "SEQ_POSTS_NO", allocationSize = 1)
    @Column(name = "POST_ID")
    private Long postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_NO", insertable = false, updatable = false)
    private User user;

    @Column(name = "USER_NO")
    private Long userNo;

    @Column(name = "IMAGE_URL")
    private String imageUrl;

    @Column(name = "CONTENT")
    private String content;

    @Column(name = "LOCATION")
    private String location;

    @Column(name = "LIKE_COUNT")
    private Integer likeCount;

    @Column(name = "REG_DATE")
    private Date regDate;

    @Column(name = "UPDATE_DATE")
    private Date updateDate;

    @PrePersist
    protected void onCreate() {
        if (regDate == null) {
            regDate = new Date();
        }
        if (updateDate == null) {
            updateDate = new Date();
        }
        if (likeCount == null) {
            likeCount = 0;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updateDate = new Date();
    }
}
