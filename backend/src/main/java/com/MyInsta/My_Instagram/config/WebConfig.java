package com.MyInsta.My_Instagram.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.ResourceHandlerRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.nio.file.Paths;

@Configuration
public class WebConfig implements WebMvcConfigurer {

    @Override
    public void addResourceHandlers(ResourceHandlerRegistry registry) {
        // 절대 경로로 uploads 폴더 설정
        String uploadsPath = Paths.get("uploads").toAbsolutePath().toUri().toString();
        System.out.println("Uploads 경로 설정: " + uploadsPath);
        
        registry.addResourceHandler("/uploads/**")
                .addResourceLocations(uploadsPath);
    }
}
