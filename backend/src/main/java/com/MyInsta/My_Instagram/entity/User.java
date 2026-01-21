package com.MyInsta.My_Instagram.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.util.Date;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "USERS")
public class User {

    @Id
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
}