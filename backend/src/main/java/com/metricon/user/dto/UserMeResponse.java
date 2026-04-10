package com.metricon.user.dto;

public class UserMeResponse {
    private Long id;
    private String name;
    private String email;
    private String role;
    private String profilePicture;

    public UserMeResponse() {}

    public UserMeResponse(Long id, String name, String email, String role, String profilePicture) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.role = role;
        this.profilePicture = profilePicture;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public String getEmail() {
        return email;
    }

    public String getRole() {
        return role;
    }

    public String getProfilePicture() {
        return profilePicture;
    }
}

// package com.metricon.user.dto;

// public class UserMeResponse {
//     private Long id;
//     private String name;
//     private String email;
//     private String role;
//     private String profilePicture;

//     public UserMeResponse() {}

//     public UserMeResponse(Long id, String name, String email, String role, String profilePicture) {
//         this.id = id;
//         this.name = name;
//         this.email = email;
//         this.role = role;
//         this.profilePicture = profilePicture;
//     }

//     public Long getId() {
//         return id;
//     }

//     public String getName() {
//         return name;
//     }

//     public String getEmail() {
//         return email;
//     }

//     public String getRole() {
//         return role;
//     }

//     public String getProfilePicture() {
//         return profilePicture;
//     }
// }