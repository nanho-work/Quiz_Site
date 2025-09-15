import React from "react";

export default function Footer() {
  return (
    <footer className="border-t mt-16 py-8 text-center text-gray-500 text-sm">
      <p>© {new Date().getFullYear()} 구피 (Goofy). All rights reserved.</p>
      <p className="mt-2">
        문의: <a href="mailto:koofylab@gmail.com" className="underline">koofylab@gmail.com</a>
      </p>
    </footer>
  );
}