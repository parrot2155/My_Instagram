package com.MyInsta.My_Instagram.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.PrePersist;
import jakarta.persistence.PreUpdate;
import jakarta.persistence.SequenceGenerator;
import jakarta.persistence.Table;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "USERS")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_users_no")
    @SequenceGenerator(name = "seq_users_no", sequenceName = "SEQ_USERS_NO", allocationSize = 1)
    @Column(name = "USER_NO")
    private Long userNo;

    @Column(name = "USERID")
    private String userid;

    @Column(name = "USERNAME")
    private String username;

    @Column(name = "PASSWORD")
    private String password;

    @Column(name = "EMAIL")
    private String email;

    @Column(name = "NICKNAME")
    private String nickname;

    @Column(name = "PROFILE_IMG")
    private String profileImg;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "WEBSITE")
    private String website;

    @Column(name = "VERIFIED")
    private Integer verified;

    @Column(name = "IS_PRIVATE")
    private Integer isPrivate;

    @Column(name = "STATUS")
    private Integer status;

    @Column(name = "REG_DATE")
    private Date regDate;

    @Column(name = "UPDATE_DATE")
    private Date updateDate;

    // Explicit setters in case Lombok annotation processing isn't available in the build environment
    public void setUsername(String username) {
        this.username = username;
    }

    public void setUserid(String userid) {
        this.userid = userid;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    @PrePersist
    protected void onCreate() {
        if (regDate == null) {
            regDate = new Date();
        }
        if (updateDate == null) {
            updateDate = new Date();
        }
    }

    @PreUpdate
    protected void onUpdate() {
        updateDate = new Date();
    }
}