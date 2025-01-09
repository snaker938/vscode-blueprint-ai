#!/usr/bin/env python
import sys
import json
import cv2
import numpy as np
import easyocr

def upscale_if_needed(img_bgr, min_width=1200):
    """
    If the image width is below min_width, scale it up by a factor 
    that ensures at least min_width. Helps EasyOCR see small fonts better.
    """
    h, w = img_bgr.shape[:2]
    if w < min_width:
        scale_factor = min_width / w
        new_w = int(w * scale_factor)
        new_h = int(h * scale_factor)
        img_bgr = cv2.resize(img_bgr, (new_w, new_h), interpolation=cv2.INTER_CUBIC)
    return img_bgr

def minimal_preprocess(image_path: str):
    """
    Minimal approach:
    1) Load color image with OpenCV
    2) If width < 1200, upscale
    3) Convert to grayscale
    (No further morphological or thresholding to avoid corrupting simpler images.)
    """
    img_bgr = cv2.imread(image_path, cv2.IMREAD_COLOR)
    if img_bgr is None:
        raise ValueError(f"Could not load image from: {image_path}")
    
    # 1) Upscale if needed
    img_bgr = upscale_if_needed(img_bgr, min_width=1200)
    
    # 2) Convert to grayscale
    gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)

    return gray

def run_easyocr(numpy_image):
    """
    Use EasyOCR with GPU if available (fallback CPU).
    paragraph=True merges lines into blocks for complicated text.
    """
    # ‘verbose=False’ to skip progress bars that sometimes cause Unicode issues on Windows
    reader = easyocr.Reader(['en'], gpu=True, verbose=False)
    results = reader.readtext(numpy_image, detail=1, paragraph=True)
    return results

def main():
    # Attempt to set stdout to UTF-8 on Windows, in case the console is CP1252
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass
    
    if len(sys.argv) < 2:
        print("Usage: ocr_service.py <IMAGE_PATH>", file=sys.stderr)
        sys.exit(1)

    image_path = sys.argv[1]

    # 1) Minimal Preprocessing
    processed = minimal_preprocess(image_path)

    # 2) Perform OCR
    ocr_results = run_easyocr(processed)

    # 3) Build structured results, handling variable output formats
    output_data = []
    for result in ocr_results:
        # result might be (coords, text) or (coords, text, conf)
        if not isinstance(result, (list, tuple)):
            continue
        if len(result) < 2:
            continue

        coords = result[0]
        text = result[1]
        confidence = result[2] if len(result) >= 3 else 1.0

        # coords => bounding box corners
        xs = [pt[0] for pt in coords]
        ys = [pt[1] for pt in coords]
        min_x, max_x = int(min(xs)), int(max(xs))
        min_y, max_y = int(min(ys)), int(max(ys))

        output_data.append({
            "text": text,
            "confidence": float(confidence),
            "bbox": [min_x, min_y, max_x, max_y],
        })

    # 4) Print JSON to stdout
    print(json.dumps(output_data, ensure_ascii=False))

if __name__ == "__main__":
    main()
