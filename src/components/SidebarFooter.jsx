import styles from "./SidebarFooter.module.css";
function SidebarFooter() {
  return (
    <footer className={styles.footer}>
      <p>&copy; copyright {new Date().getFullYear()} by Wordwise Inc.</p>
    </footer>
  );
}

export default SidebarFooter;
("");
