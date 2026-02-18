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
@Table(name = "FOLLOWS", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"FOLLOWER_USER_NO", "FOLLOWING_USER_NO"})
})
public class Follow {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_follows_no")
    @SequenceGenerator(name = "seq_follows_no", sequenceName = "SEQ_FOLLOWS_NO", allocationSize = 1)
    @Column(name = "FOLLOW_ID")
    private Long followId;

    // 팔로우 하는 사람 (나)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "FOLLOWER_USER_NO", insertable = false, updatable = false)
    private User follower;

    @Column(name = "FOLLOWER_USER_NO")
    private Long followerUserNo;

    // 팔로우 받는 사람 (상대방)
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "FOLLOWING_USER_NO", insertable = false, updatable = false)
    private User following;

    @Column(name = "FOLLOWING_USER_NO")
    private Long followingUserNo;

    @Column(name = "REG_DATE")
    private Date regDate;

    @PrePersist
    protected void onCreate() {
        regDate = new Date();
    }
}
