// import api from "./api";
import type {
    LoginCredentials,
    LoginResponse,
    SignupCredentials,
    SignupResponse,
    ResetPasswordCredentials,
    VerifyEmailCredentials,
    ProfileResponse,
} from "@/types";

export const authService = {
    login: async (credentials: LoginCredentials): Promise<LoginResponse> => {
        // const { data } = await api.post<LoginResponse>("/api/auth/login", credentials);
        // return data;
        const user = { id: "demo-id", email: credentials.email, name: "Demo User" };
        return { user, token: "", message: "Login successful" };
    },

    signup: async (credentials: SignupCredentials): Promise<SignupResponse> => {
        // const { data } = await api.post<SignupResponse>("/api/auth/signup", credentials);
        // return data;
        return credentials as unknown as SignupResponse;
    },

    logout: async (): Promise<void> => {
        // await api.post("/api/auth/logout");
        return Promise.resolve();
    },

    getProfile: async (): Promise<ProfileResponse> => {
        // const { data } = await api.get<ProfileResponse>("/api/auth/profile");
        // return data;
        return { user: { id: "demo-id", email: "admin@example.com", name: "Demo User" } };
    },

    resetPassword: async (credentials: ResetPasswordCredentials): Promise<{ message: string }> => {
        // const { data } = await api.post<{ message: string }>("/api/auth/reset-password", credentials);
        // return data;
        return { message: "Password reset successful", ...credentials };
    },

    verifyEmail: async (credentials: VerifyEmailCredentials): Promise<{ message: string }> => {
        // const { data } = await api.post<{ message: string }>("/api/auth/verify-email", credentials);
        // return data;
        return { message: "Email verified successfully", ...credentials };
    },
};
