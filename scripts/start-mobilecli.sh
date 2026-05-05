#!/bin/bash
# Starts the mobilecli server and waits for the WebSocket at ws://localhost:12000/ws
# mobilewright checks this exact endpoint — TCP port open is NOT sufficient.

BINARY="node_modules/mobilecli/bin/mobilecli-linux-amd64"
LOG="/tmp/mobilecli.log"
WS_CHECK="node_modules/ws/index.js"

echo "[mobilecli] Starting server..."
chmod +x "$BINARY"
nohup "$BINARY" server start --listen "localhost:12000" > "$LOG" 2>&1 &
MOBILECLI_PID=$!
echo "[mobilecli] pid=$MOBILECLI_PID"

echo "[mobilecli] Polling ws://localhost:12000/ws (up to 60s)..."
for i in $(seq 1 60); do
  sleep 1
  if ! kill -0 $MOBILECLI_PID 2>/dev/null; then
    echo "[mobilecli] Process exited early at ${i}s"
    cat "$LOG"
    exit 1
  fi
  # Check the actual WebSocket endpoint (same check mobilewright uses)
  RESULT=$(node -e "const W=require('./node_modules/ws/index.js');const w=new W('ws://localhost:12000/ws');const t=setTimeout(()=>{w.terminate();process.stdout.write('0')},1500);w.on('open',()=>{clearTimeout(t);w.close();process.stdout.write('1')});w.on('error',()=>{clearTimeout(t);process.stdout.write('0')})" 2>/dev/null)
  if [ "$RESULT" = "1" ]; then
    echo "[mobilecli] WebSocket ready after ${i}s"
    cat "$LOG"
    exit 0
  fi
  echo "  ${i}s — not ready yet"
done

echo "[mobilecli] Timed out after 60s"
cat "$LOG"
exit 1
