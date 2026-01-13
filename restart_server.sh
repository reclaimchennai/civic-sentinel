#!/bin/bash
pkill -f "next"
npm run build
setsid npm run start -- -H 0.0.0.0 > /dev/null 2>&1 &
