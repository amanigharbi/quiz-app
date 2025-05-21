export default function Footer() {
  return (
    <footer
      className="bg-light text-center py-3"
      style={{
        position: "fixed",
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 10,
      }}
    >
      &copy; {new Date().getFullYear()} Quiz App – Tous droits réservés
    </footer>
  );
}
