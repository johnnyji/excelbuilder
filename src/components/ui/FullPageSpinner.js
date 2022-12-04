import { CircularProgress } from "@mui/material";

const styles = {
  wrapper: {
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    height: "100vh",
    left: 0,
    position: "fixed",
    top: 0,
    width: "100vw",
    // This will override the sidebar
    zIndex: 10000
  },
  content: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%"
  }
};

export default function FullPageSpinner() {
  return (
    <div style={styles.wrapper}>
      <div style={styles.content}>
        <CircularProgress size={60} />
      </div>
    </div>
  );
}
