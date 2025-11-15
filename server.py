from http.server import BaseHTTPRequestHandler, HTTPServer
import os
import subprocess
import urllib

class Handler(BaseHTTPRequestHandler):
    def do_GET(self):
        # Atur default ke html/index.html saat buka /
        if self.path == "/":
            self.path = "/html/index.html"
            if self.path == "/":
                self.path = "/html/index.html"
            elif self.path.endswith(".html") and not self.path.startswith("/html/"):
                self.path = "/html/" + self.path.lstrip("/")


        # Jika minta proker.html, pengumuman.html, dst → arahkan ke /html/
        elif self.path.endswith(".html") and not self.path.startswith("/html/"):
            self.path = "/html/" + self.path

        file_path = os.getcwd() + self.path

        # Keamanan agar tidak keluar direktori
        safe_path = urllib.parse.unquote(self.path)
        if ".." in safe_path or "server.py" in safe_path or "pystuff.py" in safe_path:
            self.send_response(403)
            self.end_headers()
            self.wfile.write(b"Akses ditolak")
            return

        try:
            with open(file_path, "rb") as f:
                content = f.read()
                self.send_response(200)
                if self.path.endswith(".html"):
                    self.send_header("Content-Type", "text/html")
                elif self.path.endswith(".js"):
                    self.send_header("Content-Type", "application/javascript")
                elif self.path.endswith(".css"):
                    self.send_header("Content-Type", "text/css")
                elif self.path.endswith(".png"):
                    self.send_header("Content-Type", "image/png")
                elif self.path.endswith(".jpg") or self.path.endswith(".jpeg"):
                    self.send_header("Content-Type", "image/jpeg")
                else:
                    self.send_header("Content-Type", "application/octet-stream")
                self.end_headers()
                self.wfile.write(content)
        except FileNotFoundError:
            self.send_response(404)
            self.end_headers()
            self.wfile.write(b"404 File tidak ditemukan")

    def do_POST(self):
        if self.path == "/run-python":
            content_length = int(self.headers["Content-Length"])
            body = self.rfile.read(content_length).decode()
            result = subprocess.run(
                ["python3", "python/pystuff.py"],
                input=body.encode(),
                stdout=subprocess.PIPE
            )
            self.send_response(200)
            self.send_header("Content-Type", "application/json")
            self.end_headers()
            self.wfile.write(result.stdout)

httpd = HTTPServer(("localhost", 8000), Handler)
print("Server berjalan di http://localhost:8000")
httpd.serve_forever()
