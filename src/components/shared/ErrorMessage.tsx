interface ErrorMessageProps {
    message: string;
    onDismiss?: () => void;
    variant?: "error" | "warning";
}

function ErrorMessage({ message, onDismiss, variant = "error" }: ErrorMessageProps) {
    return (
        <div className={`error-message-container ${variant}`}>
            <div className="error-content">
                <span className="error-icon">{variant === "error" ? "❌" : "⚠️"}</span>
                <span className="error-text">{message}</span>
            </div>
            {onDismiss && (
                <button className="error-dismiss" onClick={onDismiss} aria-label="Dismiss">
                    ×
                </button>
            )}
        </div>
    );
}

export default ErrorMessage;
