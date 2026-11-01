#!/bin/zsh
set -u
cd "$(dirname "$0")/../public/food" || exit 1
ids=(
  1519708227418-c8fd9a32b7a2
  1532550907401-a500c9a57435
  1604908176997-125f25cc6f3d
  1502741224143-90386d7f8c82
  1553530666-ba11a7da3888
  1631452180519-c014fe946bc7
  1567188040759-fb8a883dc6d8
  1517673132405-a56a62b18caf
  1505576399279-565b52d4ac71
  1547592166-23ac45744acd
  1579871494447-9811cf80d66c
  1512852939750-1305098529bf
  1626700051175-6818013e1d4f
  1565557623262-b51c2513a641
  1546833999-b9f581a1996d
  1589301760014-d929f3979dbc
  1490474418585-ba9bad8fd0ea
)
for id in $ids; do
  target="food-$id.jpg"
  if [[ ! -s "$target" ]]; then
    curl -sL --max-time 40 "https://images.unsplash.com/photo-$id?auto=format&fit=crop&w=900&q=80" -o "$target"
    echo "$target $(wc -c < "$target" | tr -d ' ')"
  fi
done
