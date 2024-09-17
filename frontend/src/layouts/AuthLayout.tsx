interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
}
const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-8 rounded-lg shadow-md">
                <h2 className="text-center text-2xl font-bold mb-4">{title}</h2>
                {children}
            </div>
        </div>
    );
};

export default AuthLayout;