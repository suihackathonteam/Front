interface LoadingSpinnerProps {
    size?: "small" | "medium" | "large";
    message?: string;
}

function LoadingSpinner({ size = "medium", message }: LoadingSpinnerProps) {
    const sizeClasses = {
        small: "spinner-small",
        medium: "spinner-medium",
        large: "spinner-large",
    };

    return (
        <div className="loading-spinner-container">
            <div className={`loading-spinner ${sizeClasses[size]}`}></div>
            {message && <p className="loading-message">{message}</p>}
        </div>
    );
}

export default LoadingSpinner;
