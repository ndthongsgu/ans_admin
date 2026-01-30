import RegisterForm from "@/components/auth/RegisterForm";

export default function RegisterPage() {
    return (
        <div
            style={{
                minHeight: "100vh",
                display: "flex",
                backgroundImage: "url('/background.png')",
                backgroundSize: "cover",
                backgroundPosition: "center",
            }}
        >
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    justifyContent: "flex-end",
                    alignItems: "center",
                    paddingRight: "300px",
                }}
            >
                <RegisterForm />
            </div>
        </div>
    );
}
