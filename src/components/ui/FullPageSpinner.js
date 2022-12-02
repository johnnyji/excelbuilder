import { CircularProgress } from "@mui/material";

const styles = {
  wrapper: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    display: "flex",
    height: "100vh",
    justifyContent: "center",
    left: 0,
    position: "absolute",
    top: 0,
    width: "100vw",
    // This will override the sidebar
    zIndex: 10000
  }
};

export default function FullPageSpinner() {
  return (
    <div style={styles.wrapper}>
      <CircularProgress size={60} />
    </div>
  );
}
