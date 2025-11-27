import React, { useState } from 'react';
import Sidebar from './Sidebar';

interface LayoutProps {
    children: React.ReactNode;
    onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({ children, onLogout }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

    return (
        <div className="min-h-screen bg-background font-sans">
            <Sidebar
                isCollapsed={isSidebarCollapsed}
                onToggle={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                onLogout={onLogout}
            />
            <main
                className={`${isSidebarCollapsed ? 'ml-20' : 'ml-64'
                    } p-8 transition-all duration-300 ease-in-out`}
            >
                {children}
            </main>
        </div>
    );
};

export default Layout;
