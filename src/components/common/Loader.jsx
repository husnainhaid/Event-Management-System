function Loader({ fullScreen = false, message = "Loading…", size = "md" }) {
const sizeMap = { sm: 24, md: 44, lg: 64 };
    const px = sizeMap[size] || 44;


    const spinner = (
        <div style={{ textAlign: "center" }}>
            <svg
                width={px}
                height={px}
                viewBox="0 0 50 50"
                style={{ animation: "spin 0.8s linear infinite", display: "block", margin: "0 auto" }}
                aria-label="Loading"
            >
                <circle
                    cx="25" cy="25" r="20"
                    fill="none"
                    stroke="var(--primary-light)"
                    strokeWidth="4"
                    strokeDasharray="80 40"
                    strokeLinecap="round"
                />
            </svg>
            {message && (
                <p style={{ marginTop: 14, color: "var(--text-muted)", fontSize: "0.9rem" }}>{message}</p>
            )}
        </div>
    );
      if (fullScreen) {
        return (
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    minHeight: "60vh",
                }}
            >
                {spinner}
            </div>
        );
    }

    return spinner;


}

export default Loader;
