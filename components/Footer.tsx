import React from "react";

export default function Footer() {
  return (
    <footer className="mt-12 border-t border-border bg-card">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 text-center text-sm text-muted-foreground">
        <p>© {new Date().getFullYear()} 쿠피 (Koofy). All rights reserved.</p>
        <p className="mt-2">
          문의:{" "}
          <a href="mailto:webmaster@koofy.co.kr" className="font-medium text-foreground hover:text-primary transition-colors">
            webmaster@koofy.co.kr
          </a>
        </p>
      </div>
    </footer>
  );
}
