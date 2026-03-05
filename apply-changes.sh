#!/bin/bash
# run this from the root of your astana golf club project folder

# list of all html files with the shared footer
FILES="index.html golf.html dining.html meetings.html tournaments.html about.html"

for f in $FILES; do
  if [ ! -f "$f" ]; then
    echo "skipping $f (not found)"
    continue
  fi

  # 1. replace Reservations -> Dining Information, point to #moments-heading
  sed -i 's|<a class="footer-link" href="dining.html#heritage-heading">Reservations</a>|<a class="footer-link" href="dining.html#moments-heading">Dining Information</a>|g' "$f"

  # 2. remove the Contact Us line from the footer
  sed -i '/<a class="footer-link" href="about.html#about-heading">Contact Us<\/a>/d' "$f"

  echo "updated $f"
done

# 3. about.html only — replace FAQ map links
if [ -f "about.html" ]; then
  # replace google maps link
  sed -i 's|https://www.google.com/maps/search/?api=1\&amp;query=51.108952,71.572776|https://www.google.com/maps/place/«Астана»+Гольф+клубы/@51.1096694,71.5690906,16z/data=!4m12!1m5!3m4!2zNTHCsDA2JzMyLjIiTiA3McKwMzQnMjIuMCJF!8m2!3d51.108952!4d71.572776!3m5!1s0x424582606e15c265:0xd2d6ccc4370d538d!8m2!3d51.110319!4d71.5660536!16s%2Fg%2F11f3q_p69n?entry=ttu\&amp;g_ep=EgoyMDI2MDMwMi4wIKXMDSoASAFQAw%3D%3D|g' "about.html"

  # replace 2gis link
  sed -i 's|https://2gis.kz/astana/directions/points/%7C71.572776%2C51.108952%3B70000001065121814|https://2gis.kz/astana/firm/70000001065121814?m=71.572776%2C51.108952%2F16|g' "about.html"

  echo "updated about.html FAQ links"
fi

echo "all done"
