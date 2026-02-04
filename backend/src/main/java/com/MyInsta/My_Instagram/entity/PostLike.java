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
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "POST_LIKES", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"POST_ID", "USER_NO"})
})
public class PostLike {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_post_likes_no")
    @SequenceGenerator(name = "seq_post_likes_no", sequenceName = "SEQ_POST_LIKES_NO", allocationSize = 1)
    @Column(name = "LIKE_ID")
    private Long likeId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "POST_ID", insertable = false, updatable = false)
    private Post post;

    @Column(name = "POST_ID")
    private Long postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "USER_NO", insertable = false, updatable = false)
    private User user;

    @Column(name = "USER_NO")
    private Long userNo;

    @Column(name = "REG_DATE")
    private Date regDate;

    @PrePersist
    protected void onCreate() {
        if (regDate == null) {
            regDate = new Date();
        }
    }
}
