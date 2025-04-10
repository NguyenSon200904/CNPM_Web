package com.example.warehouse.config;

import java.util.Arrays;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.example.warehouse.service.CustomUserDetailsService;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
public class SecurityConfig {

    @Autowired
    private JwtRequestFilter jwtRequestFilter;

    @Autowired
    private CustomUserDetailsService customUserDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        // Public endpoints
                        .requestMatchers("/api/login").permitAll()
                        .requestMatchers("/api/forgot-password").permitAll()
                        .requestMatchers("/api/reset-password").permitAll()

                        // Endpoints cho tất cả người dùng đã đăng nhập (không yêu cầu vai trò cụ thể)
                        .requestMatchers("/api/auth/me").authenticated()
                        .requestMatchers("/api/current-user").authenticated()

                        // API lấy danh sách tài khoản cho dropdown
                        .requestMatchers("/api/users/list").hasAnyRole("Admin", "Manager", "Importer", "Exporter")

                        // Endpoints cho Admin, Manager, Importer, Exporter
                        .requestMatchers("/api/products/**").hasAnyRole("Admin", "Manager", "Importer", "Exporter")
                        .requestMatchers("/api/suppliers/**").hasAnyRole("Admin", "Manager", "Importer", "Exporter")
                        .requestMatchers("/api/receipts/**").hasAnyRole("Admin", "Manager", "Importer")
                        .requestMatchers("/api/export-receipts/**").hasAnyRole("Admin", "Manager", "Exporter")

                        // Endpoints chỉ dành cho Admin và Manager
                        .requestMatchers("/api/inventory/**").hasAnyRole("Admin", "Manager", "Exporter")
                        .requestMatchers("/api/accounts/**").hasAnyRole("Admin", "Manager")

                        // Endpoints chỉ dành cho Admin
                        .requestMatchers("/api/accounts/*/reset-password").hasRole("Admin")

                        // Tất cả các yêu cầu khác đều cần đăng nhập
                        .anyRequest().authenticated())
                .addFilterBefore(jwtRequestFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public BCryptPasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public CustomUserDetailsService userDetailsService() {
        return customUserDetailsService;
    }
}