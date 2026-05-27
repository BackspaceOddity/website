#!/usr/bin/env python3
"""
Tiny inbox server — accepts POST /inbox from the wireframe edit-mode
"Send to Claude" button. Writes payload to _edit-inbox.json.
Run: python3 wireframe/inbox-server.py 8002
"""
import json, os, sys
from http.server import HTTPServer, BaseHTTPRequestHandler

INBOX = os.path.join(os.path.dirname(os.path.abspath(__file__)), '_edit-inbox.json')

CORS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
}

class Handler(BaseHTTPRequestHandler):
    def do_OPTIONS(self):
        self.send_response(204)
        for k, v in CORS.items():
            self.send_header(k, v)
        self.end_headers()

    def do_POST(self):
        if self.path != '/inbox':
            self.send_response(404); self.end_headers(); return
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length)
        with open(INBOX, 'wb') as f:
            f.write(body)
        self.send_response(200)
        self.send_header('Content-Type', 'application/json')
        for k, v in CORS.items():
            self.send_header(k, v)
        self.end_headers()
        self.wfile.write(b'{"ok":true}')

    def log_message(self, *_):
        pass  # silent

port = int(sys.argv[1]) if len(sys.argv) > 1 else 8002
print(f'inbox-server listening on :{port}', flush=True)
HTTPServer(('', port), Handler).serve_forever()
