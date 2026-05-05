#!/bin/bash
# Starts the mobilecli server and waits for HTTP port 12000 to respond.
# mobilewright is configured to connect to ws://127.0.0.1:12000/ws.

BINARY="node_modules/mobilecli/bin/mobilecli-linux-amd64"
LOG="/tmp/mobilecli.log"

echo "[mobilecli] Starting server on 127.0.0.1:12000..."
chmod +x "$BINARY"
nohup "$BINARY" server start --listen "127.0.0.1:12000" > "$LOG" 2>&1 &
MOBILECLI_PID=$!
echo "[mobilecli] pid=$MOBILECLI_PID"

echo "[mobilecli] Polling http://127.0.0.1:12000 (up to 60s)..."
for i in $(seq 1 60); do
  sleep 1
  if ! kill -0 $MOBILECLI_PID 2>/dev/null; then
    echo "[mobilecli] Process exited early at ${i}s"
    cat "$LOG"
    exit 1
  fi
  HTTP_CODE=$(curl -s --max-time 2 -o /dev/null -w "%{http_code}" http://127.0.0.1:12000/ 2>/dev/null)
  if [ "$HTTP_CODE" != "000" ]; then
    echo "[mobilecli] HTTP server ready after ${i}s (status=$HTTP_CODE)"
    cat "$LOG"
    exit 0
  fi
  echo "  ${i}s — not ready yet"
done

echo "[mobilecli] Timed out after 60s"
cat "$LOG"
exit 1

