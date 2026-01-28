package com.MyInsta.My_Instagram.entity;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Entity
@Table(name = "REFRESH_TOKENS")
public class RefreshToken {

    @Id
    @GeneratedValue(strategy = GenerationType.SEQUENCE, generator = "seq_refresh_token_id")
    @SequenceGenerator(name = "seq_refresh_token_id", sequenceName = "SEQ_REFRESH_TOKEN_ID", allocationSize = 1)
    @Column(name = "TOKEN_ID")
    private Long tokenId;

    @Column(name = "USER_NO", nullable = false)
    private Long userNo;

    @Column(name = "TOKEN", nullable = false, length = 500)
    private String token;

    @Column(name = "EXPIRY_DATE", nullable = false)
    private LocalDateTime expiryDate;

    @Column(name = "CREATED_AT")
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        createdAt = LocalDateTime.now();
    }
}
