interface SuccessNotificationProps {
    message: string;
    show: boolean;
    onClose?: () => void;
    autoHideDuration?: number;
}

function SuccessNotification({ message, show, onClose, autoHideDuration = 3000 }: SuccessNotificationProps) {
    if (!show) return null;

    // Auto-hide after duration
    if (autoHideDuration && onClose) {
        setTimeout(() => {
            onClose();
        }, autoHideDuration);
    }

    return (
        <div className="success-notification">
            <span className="success-icon">✅</span>
            <span className="success-text">{message}</span>
            {onClose && (
                <button className="success-close" onClick={onClose} aria-label="Close">
                    ×
                </button>
            )}
        </div>
    );
}

export default SuccessNotification;
