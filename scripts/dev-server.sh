#!/usr/bin/env bash
# dev-server.sh — start/stop/status the Next.js dev server in a way that
# survives CC (Claude Code) session restarts.
#
# Why this exists: Claude Preview MCP's preview_start and Bash
# run_in_background both bind the spawned process to the CC session.
# When CC is restarted (every /resume into a new session), the dev
# server dies and the user gets ERR_CONNECTION_REFUSED on localhost:3456.
#
# This wrapper uses nohup + </dev/null + disown to detach the process
# from the calling shell, so it lives across CC restarts. (setsid is not
# available on macOS by default; nohup + closed stdin + disown is the
# portable equivalent.) Lockfile + PID file in /tmp keeps the script
# idempotent — repeated `start` calls won't spawn a second server.
#
# Usage:
#   scripts/dev-server.sh start    # idempotent — no-op if already running
#   scripts/dev-server.sh stop     # kill the process
#   scripts/dev-server.sh status   # check running + curl health
#   scripts/dev-server.sh restart  # stop + start
#   scripts/dev-server.sh logs     # tail the log file

set -euo pipefail

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
WORKTREE="$PROJECT_ROOT/.claude/worktrees/nextjs-migration"
PORT=3456
PID_FILE="/tmp/bso-website-dev-server.pid"
LOG_FILE="/tmp/bso-website-dev-server.log"

if [ ! -d "$WORKTREE" ]; then
  echo "ERROR: worktree not found at $WORKTREE"
  exit 1
fi

is_running() {
  if [ -f "$PID_FILE" ]; then
    local pid
    pid="$(cat "$PID_FILE")"
    if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
      return 0
    fi
  fi
  # Also check by port — covers the case where PID file is stale but
  # something else is on the port (e.g. user started server manually).
  if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN >/dev/null 2>&1; then
    return 0
  fi
  return 1
}

cmd_start() {
  if is_running; then
    echo "Dev server already running on port $PORT"
    cmd_status
    return 0
  fi

  echo "Starting Next.js dev server (detached) at $WORKTREE..."

  # nohup: ignore SIGHUP when CC's parent shell exits
  # </dev/null: closed stdin so the process has no TTY to lose
  # & + disown: detach from shell job table
  # The combination is what makes the process survive CC restart on macOS.
  cd "$WORKTREE"
  nohup npm run dev >"$LOG_FILE" 2>&1 </dev/null &
  local pid=$!
  disown 2>/dev/null || true
  echo "$pid" >"$PID_FILE"

  # Wait up to 30s for port to become live
  for i in $(seq 1 60); do
    if curl -fsS "http://localhost:$PORT" -o /dev/null 2>/dev/null; then
      echo "Dev server up at http://localhost:$PORT (pid $pid)"
      echo "Log: $LOG_FILE"
      return 0
    fi
    sleep 0.5
  done

  echo "WARNING: server didn't respond on port $PORT within 30s"
  echo "PID: $pid (may still be compiling — check $LOG_FILE)"
  return 1
}

cmd_stop() {
  if [ ! -f "$PID_FILE" ]; then
    echo "No PID file — checking port..."
    if ! is_running; then
      echo "Nothing running on port $PORT"
      return 0
    fi
  fi

  local pid
  pid="$(cat "$PID_FILE" 2>/dev/null || echo '')"
  if [ -n "$pid" ] && kill -0 "$pid" 2>/dev/null; then
    echo "Stopping dev server (pid $pid)..."
    # Kill the whole process group (negative PID) — Next.js spawns workers
    kill -TERM "-$pid" 2>/dev/null || kill -TERM "$pid" 2>/dev/null || true
    sleep 1
    if kill -0 "$pid" 2>/dev/null; then
      echo "Forcing kill..."
      kill -KILL "-$pid" 2>/dev/null || kill -KILL "$pid" 2>/dev/null || true
    fi
  fi

  # Belt-and-braces: kill anything left on the port
  if lsof -nP -iTCP:"$PORT" -sTCP:LISTEN -t 2>/dev/null | xargs -r kill -TERM 2>/dev/null; then
    sleep 1
  fi

  rm -f "$PID_FILE"
  echo "Stopped"
}

cmd_status() {
  if is_running; then
    local pid="(unknown)"
    if [ -f "$PID_FILE" ]; then
      pid="$(cat "$PID_FILE")"
    fi
    echo "Running on port $PORT (pid $pid)"
    if curl -fsS "http://localhost:$PORT" -o /dev/null 2>/dev/null; then
      echo "Health: OK (HTTP 200)"
    else
      echo "Health: NOT RESPONDING (process alive but port not serving)"
    fi
  else
    echo "Not running"
  fi
}

cmd_logs() {
  if [ -f "$LOG_FILE" ]; then
    tail -n 80 "$LOG_FILE"
  else
    echo "No log file at $LOG_FILE"
  fi
}

case "${1:-status}" in
  start) cmd_start ;;
  stop) cmd_stop ;;
  restart) cmd_stop; sleep 1; cmd_start ;;
  status) cmd_status ;;
  logs) cmd_logs ;;
  *)
    echo "Usage: $0 {start|stop|restart|status|logs}"
    exit 1
    ;;
esac
