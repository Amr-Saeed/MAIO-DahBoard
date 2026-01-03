'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // Initialize theme from localStorage or system preference
        if (typeof window !== 'undefined') {
            const savedTheme = localStorage.getItem('theme');
            if (savedTheme) {
                return savedTheme;
            }
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            return prefersDark ? 'dark' : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        // Apply theme to document
        console.log('Applying theme to document:', theme);
        document.documentElement.setAttribute('data-theme', theme);

        // Toggle dark class for Tailwind
        if (theme === 'dark') {
            document.documentElement.classList.add('dark');
            console.log('Added dark class to html');
        } else {
            document.documentElement.classList.remove('dark');
            console.log('Removed dark class from html');
        }
    }, [theme]);

    const toggleTheme = () => {
        console.log('Toggle theme clicked! Current theme:', theme);
        const newTheme = theme === 'light' ? 'dark' : 'light';
        console.log('Switching to:', newTheme);
        setTheme(newTheme);
        localStorage.setItem('theme', newTheme);
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
}
