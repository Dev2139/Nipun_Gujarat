import os
import math
try:
    from PIL import Image, ImageDraw, ImageFont
except ImportError:
    import subprocess
    subprocess.check_call(["pip", "install", "pillow"])
    from PIL import Image, ImageDraw, ImageFont

def generate_pwa_icon(size, filename, maskable=False):
    # Create image with RGBA
    img = Image.new("RGBA", (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)

    # Rounded background
    padding = 0 if maskable else int(size * 0.04)
    corner_radius = int(size * 0.22) if not maskable else 0
    
    # Draw emerald gradient / background
    draw.rounded_rectangle(
        [padding, padding, size - padding, size - padding],
        radius=corner_radius,
        fill="#059669"
    )

    # Center target bullseye
    center = (size // 2, int(size * 0.44))
    r_outer = int(size * 0.28)
    r_mid = int(size * 0.21)
    r_inner = int(size * 0.14)
    r_bullseye = int(size * 0.08)

    # Target circles
    draw.ellipse([center[0] - r_outer, center[1] - r_outer, center[0] + r_outer, center[1] + r_outer], fill="#ffffff")
    draw.ellipse([center[0] - r_mid, center[1] - r_mid, center[0] + r_mid, center[1] + r_mid], fill="#059669")
    draw.ellipse([center[0] - r_inner, center[1] - r_inner, center[0] + r_inner, center[1] + r_inner], fill="#ffffff")
    draw.ellipse([center[0] - r_bullseye, center[1] - r_bullseye, center[0] + r_bullseye, center[1] + r_bullseye], fill="#f59e0b")

    # Bottom pill
    pill_w = int(size * 0.72)
    pill_h = int(size * 0.16)
    pill_x = (size - pill_w) // 2
    pill_y = int(size * 0.76)

    draw.rounded_rectangle(
        [pill_x, pill_y, pill_x + pill_w, pill_y + pill_h],
        radius=pill_h // 2,
        fill="#ffffff"
    )

    # Save icon
    os.makedirs(os.path.dirname(filename), exist_ok=True)
    img.save(filename, "PNG")
    print(f"Generated: {filename} ({size}x{size})")

out_dir = r"C:\Users\Dev\OneDrive\Desktop\Nipun_Gujarat\client\public\icons"
generate_pwa_icon(192, os.path.join(out_dir, "icon-192x192.png"))
generate_pwa_icon(512, os.path.join(out_dir, "icon-512x512.png"))
generate_pwa_icon(512, os.path.join(out_dir, "maskable-icon-512x512.png"), maskable=True)
generate_pwa_icon(180, os.path.join(out_dir, "apple-touch-icon.png"))
