"""Lokale preview-server voor de statische site.

Start via .claude/launch.json. Gebruikt bewust nooit os.getcwd(): de
preview-starter van de Claude-app draait processen zonder leesrechten op
de bovenliggende mappen, waardoor `python3 -m http.server` direct crasht.
"""
import functools
import http.server
import os
import sys

ROOT = os.path.dirname(os.path.dirname(__file__))
assert os.path.isabs(ROOT), "start dit script met een absoluut pad"
PORT = int(sys.argv[1]) if len(sys.argv) > 1 else 8000


class Handler(http.server.SimpleHTTPRequestHandler):
    def end_headers(self):
        # Geen caching, zodat een refresh altijd de laatste bewerking toont.
        self.send_header("Cache-Control", "no-store")
        super().end_headers()


handler = functools.partial(Handler, directory=ROOT)
with http.server.ThreadingHTTPServer(("127.0.0.1", PORT), handler) as httpd:
    print(f"Serving {ROOT} on http://127.0.0.1:{PORT}", flush=True)
    httpd.serve_forever()
