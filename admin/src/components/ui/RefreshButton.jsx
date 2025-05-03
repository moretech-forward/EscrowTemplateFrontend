import { useState, useEffect } from 'react';
import { Card, Button } from 'pixel-retroui';

// In your component:
const RefreshButton = ({ onClick, isLoading }) => {
    const [rotation, setRotation] = useState(0);

    // Loading animation effect
    useEffect(() => {
        if (!isLoading) return;

        // Animation for rotation in 90-degree increments
        const animationInterval = setInterval(() => {
            setRotation(prev => (prev + 90) % 360);
        }, 250); // 250ms for each 90-degree rotation

        return () => clearInterval(animationInterval);
    }, [isLoading]);

    return (
        <Button
            onClick={onClick}
            disabled={isLoading}
        >
            <svg
                xmlns="http://www.w3.org/2000/svg"
                x="0px"
                y="0px"
                className="w-4 md:w-6"
                viewBox="0 0 32 32"
                style={{ transform: isLoading ? `rotate(${rotation}deg)` : 'none' }}
            >
                <path
                    d="M 6 4 L 6 6 L 4 6 L 4 8 L 2 8 L 2 10 L 6 10 L 6 26 L 17 26 L 17 24 L 8 24 L 8 10 L 12 10 L 12 8 L 10 8 L 10 6 L 8 6 L 8 4 L 6 4 z M 15 6 L 15 8 L 24 8 L 24 22 L 20 22 L 20 24 L 22 24 L 22 26 L 24 26 L 24 28 L 26 28 L 26 26 L 28 26 L 28 24 L 30 24 L 30 22 L 26 22 L 26 6 L 15 6 z"
                    fill="black"
                />
            </svg>
        </Button>
    );
};

export default RefreshButton;