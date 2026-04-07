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

import com.metricon.security.handler.OAuth2LoginSuccessHandler;
import com.metricon.security.services.CustomOAuth2UserService;
import com.metricon.security.services.CustomOidcUserService;

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
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())
            .cors(Customizer.withDefaults())
            .exceptionHandling(e -> e.authenticationEntryPoint(
                new org.springframework.security.web.authentication.HttpStatusEntryPoint(org.springframework.http.HttpStatus.UNAUTHORIZED)
            ))
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/", "/error", "/login/**", "/oauth2/**").permitAll()
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