#!/bin/bash

# Simple build script that injects shared navigation into HTML files
# Usage: ./build.sh

# Create dist directory
mkdir -p dist
mkdir -p dist/public

# Process each HTML file
for file in src/*.html; do
  if [ "$file" != "src/navigation.html" ]; then
    filename=$(basename "$file")

    # Use awk to replace placeholder with navigation content
    awk '
      /<!-- NAV_PLACEHOLDER -->/ {
        while ((getline line < "src/navigation.html") > 0) {
          print "    " line
        }
        close("src/navigation.html")
        next
      }
      { print }
    ' "$file" > "dist/$filename"

    echo "Built: dist/$filename"
  fi
done

# Copy public assets
if [ -d "public" ]; then
  cp -r public/* dist/public/
  echo "Copied public assets"
fi

# Copy manifest if exists
if [ -f "manifest.json" ]; then
  cp manifest.json dist/
  echo "Copied manifest.json"
fi

echo "Build complete!"
