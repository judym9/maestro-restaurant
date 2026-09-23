import os
import sys
from PIL import Image, ImageEnhance

workspace = r"c:\Users\judym\Desktop\maestro"
source_dir = r"C:\Users\judym\Desktop\photo"
brand_dir = os.path.join(workspace, "src", "assets", "images", "brand")
meals_dir = os.path.join(workspace, "src", "assets", "images", "meals")

os.makedirs(brand_dir, exist_ok=True)
os.makedirs(meals_dir, exist_ok=True)

# List of assets to process from source_dir
# Format: (source_filename, crop_box_or_none, base_names_list, is_brand, is_transparent)
# If crop_box is None and is_transparent is True, it will auto-crop to the alpha bounding box.
tasks = [
    # 1. Official Brand Logo (Background removed, transparent PNG/WebP)
    {
        "src": "WhatsApp Image 2026-09-17 at 6.33.12 PM.png",
        "crop": None,  # Auto-crop to alpha bounding box
        "targets": ["maestro-logo"],
        "is_brand": True,
        "is_transparent": True,
    },
    # 2. Hero Banner (Background removed, transparent PNG/WebP/JPG)
    {
        "src": "WhatsApp Image 2026-09-17 at 6.33.11 PM (2).png",
        "crop": None,  # Auto-crop to alpha bounding box
        "targets": ["maestro-hero-banner"],
        "is_brand": True,
        "is_transparent": True,
    },
    # 3. Shawarma Tower
    {
        "src": "Screenshot 2026-09-22 170941.png",
        "crop": None,
        "targets": ["shawarma-tower"],
        "is_brand": False,
        "is_transparent": False,
    },
    # 4. Shawarma Platters
    {
        "src": "Screenshot 2026-09-22 170927.png",
        "crop": None,
        "targets": ["shawarma-platters"],
        "is_brand": False,
        "is_transparent": False,
    },
    # 5. Shawarma Spit (Colossal Rotisserie)
    {
        "src": "WhatsApp Image 2026-09-17 at 6.33.09 PM (1).jpeg",
        "crop": (0, 212, 486, 840),
        "targets": ["shawarma-spit"],
        "is_brand": False,
        "is_transparent": False,
    },
    # 6. Broasted Chicken with Potato Chips
    {
        "src": "\u0648\u062c\u0628\u0629 \u0628\u0631\u0648\u0633\u062a\u062f.png",
        "crop": None,
        "targets": ["broasted-chips"],
        "is_brand": False,
        "is_transparent": False,
    },
    # 7. Crispy Broasted Pieces
    {
        "src": "\u0628\u0631\u0648\u0633\u062a\u062f \u0642\u0637\u0639.png",
        "crop": None,
        "targets": ["broasted-pieces"],
        "is_brand": False,
        "is_transparent": False,
    },
    # 8. Crispy French Baguettes / Zinger Sub
    {
        "src": "\u0648\u062c\u0628\u0629 \u0632\u0646\u062c\u0631.png",
        "crop": None,
        "targets": ["crispy-baguettes"],
        "is_brand": False,
        "is_transparent": False,
    },
    # 9. Supreme Chicken Meal Sub
    {
        "src": "\u0648\u062c\u0628\u0629 \u0633\u0648\u0628\u0631\u064a\u0645.png",
        "crop": None,
        "targets": ["supreme-meal"],
        "is_brand": False,
        "is_transparent": False,
    },
    # 10. Fajita & Mushroom Sub
    {
        "src": "\u0648\u062c\u0628\u0629 \u0641\u0627\u0647\u064a\u062a\u0627.jpeg",
        "crop": (0, 365, 486, 695),
        "targets": ["fajita-sub"],
        "is_brand": False,
        "is_transparent": False,
    },
    # 11. Crispy Tenders Meal (Used for crispy-meal and upgrading princess-meal)
    {
        "src": "\u0648\u062c\u0628\u0629 \u0643\u0631\u064a\u0633\u0628\u064a.png",
        "crop": None,
        "targets": ["crispy-meal", "princess-meal"],
        "is_brand": False,
        "is_transparent": False,
    },
]

for task in tasks:
    src_file = os.path.join(source_dir, task["src"])
    if not os.path.exists(src_file):
        print(f"[WARN] Source file not found: {task['src']}")
        continue

    img = Image.open(src_file)
    target_folder = brand_dir if task["is_brand"] else meals_dir

    # Crop handling
    if task["is_transparent"] and img.mode == "RGBA" and task["crop"] is None:
        alpha = img.split()[-1]
        bbox = alpha.getbbox()
        if bbox:
            img = img.crop(bbox)
    elif task["crop"] is not None:
        img = img.crop(task["crop"])

    # Food vibrance enhancement
    if not task["is_brand"]:
        enhancer = ImageEnhance.Color(img)
        img = enhancer.enhance(1.06)

    # Save to all target base names
    for base_name in task["targets"]:
        # WebP output (supports alpha for transparent images)
        webp_path = os.path.join(target_folder, f"{base_name}.webp")
        if task["is_transparent"]:
            img.save(webp_path, "WEBP", quality=95, method=6)
        else:
            rgb_img = img.convert("RGB")
            rgb_img.save(webp_path, "WEBP", quality=92, method=6)

        # Standard fallback (PNG for transparent/logo, JPG for standard photos)
        if task["is_transparent"]:
            png_path = os.path.join(target_folder, f"{base_name}.png")
            img.save(png_path, "PNG", optimize=True)
            # If hero banner, also provide high quality JPG with neutral background for legacy fallback
            if "hero-banner" in base_name:
                jpg_path = os.path.join(target_folder, f"{base_name}.jpg")
                bg = Image.new("RGB", img.size, (15, 17, 23))
                bg.paste(img, mask=img.split()[-1])
                bg.save(jpg_path, "JPEG", quality=92)
        else:
            jpg_path = os.path.join(target_folder, f"{base_name}.jpg")
            rgb_img = img.convert("RGB")
            rgb_img.save(jpg_path, "JPEG", quality=92)

        print(f"[OK] Processed {task['src']} -> {base_name} ({img.size}) in {target_folder}")

print("\n--- Asset processing completed successfully! ---")
