// package com.metricon.security.config;

// import org.springframework.context.annotation.Bean;
// import org.springframework.context.annotation.Configuration;
// import org.springframework.security.config.Customizer;
// import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
// import org.springframework.security.config.annotation.web.builders.HttpSecurity;
// import org.springframework.security.web.SecurityFilterChain;

// import com.metricon.security.handler.OAuth2LoginSuccessHandler;
// import com.metricon.security.services.CustomOAuth2UserService;

// @Configuration
// @EnableMethodSecurity
// public class SecurityConfig {

//     private final OAuth2LoginSuccessHandler successHandler;
//     private final CustomOAuth2UserService customOAuth2UserService;

//     public SecurityConfig(OAuth2LoginSuccessHandler successHandler,
//                           CustomOAuth2UserService customOAuth2UserService) {
//         this.successHandler = successHandler;
//         this.customOAuth2UserService = customOAuth2UserService;
//     }

//     @Bean
//     public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
//         http
//             .csrf(csrf -> csrf.disable())
//             .cors(Customizer.withDefaults())
//             .authorizeHttpRequests(auth -> auth
//                 .requestMatchers("/", "/error", "/login/**", "/oauth2/**").permitAll()
//                 .requestMatchers("/api/users/me").authenticated()
//                 .requestMatchers("/api/admin/**").hasRole("ADMIN")
//                 .requestMatchers("/api/technician/**").hasAnyRole("TECHNICIAN", "ADMIN")
//                 .requestMatchers("/api/staff/**").hasAnyRole("STAFF", "ADMIN")
//                 .requestMatchers("/api/student/**").hasAnyRole("STUDENT", "ADMIN")
//                 .anyRequest().authenticated()
//             )
//             .oauth2Login(oauth -> oauth
//                 .userInfoEndpoint(userInfo -> userInfo.userService(customOAuth2UserService))
//                 .successHandler(successHandler)
//             )
//             .logout(logout -> logout
//                 .logoutSuccessUrl("http://localhost:5173/login")
//             );

//         return http.build();
//     }
// }


package com.metricon.security.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.Customizer;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import com.metricon.security.handler.OAuth2LoginSuccessHandler;
import com.metricon.security.services.CustomOAuth2UserService;
import com.metricon.security.services.CustomOidcUserService;

import java.util.Arrays;

@Configuration
@EnableMethodSecurity
public class SecurityConfig {

    private final OAuth2LoginSuccessHandler successHandler;
    private final CustomOAuth2UserService customOAuth2UserService;
    private final CustomOidcUserService customOidcUserService;

    public SecurityConfig(OAuth2LoginSuccessHandler successHandler,
                          CustomOAuth2UserService customOAuth2UserService,
                          CustomOidcUserService customOidcUserService) {
        this.successHandler = successHandler;
        this.customOAuth2UserService = customOAuth2UserService;
        this.customOidcUserService = customOidcUserService;
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(Arrays.asList("http://localhost:5173", "http://localhost:5174", "http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        configuration.setMaxAge(3600L);
        
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .exceptionHandling(e -> e.authenticationEntryPoint(
                new org.springframework.security.web.authentication.HttpStatusEntryPoint(org.springframework.http.HttpStatus.UNAUTHORIZED)
            ))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/error", "/login/**", "/oauth2/**").permitAll()
                .requestMatchers("/api/tickets", "/api/tickets/**").permitAll() // TODO: Remove after testing — temporary Postman bypass
                .requestMatchers("/api/users/me").authenticated()
                .requestMatchers("/api/admin/**").hasRole("ADMIN")
                .requestMatchers("/api/technician/**").hasAnyRole("TECHNICIAN", "ADMIN")
                .requestMatchers("/api/staff/**").hasAnyRole("STAFF", "ADMIN")
                .requestMatchers("/api/student/**").hasAnyRole("STUDENT", "ADMIN")
                .anyRequest().authenticated()
            )
            .oauth2Login(oauth -> oauth
                .userInfoEndpoint(userInfo -> userInfo
                    .userService(customOAuth2UserService)
                    .oidcUserService(customOidcUserService)
                )
                .successHandler(successHandler)
            )
            .logout(logout -> logout
                .logoutSuccessUrl("http://localhost:5173/login")
            );

        return http.build();
    }
}