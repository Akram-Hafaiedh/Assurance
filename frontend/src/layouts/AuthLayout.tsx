interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
}
const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
                <h2 className="mb-4 text-2xl font-bold text-center">{title}</h2>
                {children}
            </div>
        </div>
    );

    
};

export default AuthLayout;