# Footer & FAQ Changes — Astana Golf Club

## Footer changes (apply to ALL 6 pages)

### 1. Restaurant section — replace Reservations with Dining Information

Find:
```html
<li><a class="footer-link" href="dining.html#heritage-heading">Reservations</a></li>
```

Replace with:
```html
<li><a class="footer-link" href="dining.html#moments-heading">Dining Information</a></li>
```

### 2. About section — remove Contact Us

Delete this entire line:
```html
<li><a class="footer-link" href="about.html#about-heading">Contact Us</a></li>
```

---

## FAQ change (about.html only)

### 3. Replace map links in Q19

Find the `panel-content` for "Where can I find directions to Astana Golf Club?" and replace the links:

**Old:**
```html
<a href="https://www.google.com/maps/search/?api=1&amp;query=51.108952,71.572776" target="_blank" rel="noopener noreferrer">Google Maps</a> / <a href="https://2gis.kz/astana/directions/points/%7C71.572776%2C51.108952%3B70000001065121814" target="_blank" rel="noopener noreferrer">2GIS</a>
```

**New:**
```html
<a href="https://www.google.com/maps/place/«Астана»+Гольф+клубы/@51.1096694,71.5690906,16z/data=!4m12!1m5!3m4!2zNTHCsDA2JzMyLjIiTiA3McKwMzQnMjIuMCJF!8m2!3d51.108952!4d71.572776!3m5!1s0x424582606e15c265:0xd2d6ccc4370d538d!8m2!3d51.110319!4d71.5660536!16s%2Fg%2F11f3q_p69n?entry=ttu&amp;g_ep=EgoyMDI2MDMwMi4wIKXMDSoASAFQAw%3D%3D" target="_blank" rel="noopener noreferrer">Google Maps</a> / <a href="https://2gis.kz/astana/firm/70000001065121814?m=71.572776%2C51.108952%2F16" target="_blank" rel="noopener noreferrer">2GIS</a>
```
