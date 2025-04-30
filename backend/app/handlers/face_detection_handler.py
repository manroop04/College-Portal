# backend/app/handlers/face_detection_handler.py
import cv2
import numpy as np
from face_recognizer.detect_faces import face_detection
import config

class FaceDetectionHandler:
    def __init__(self):
        self.prototxt = config.PROTOTXT_PATH
        self.model = config.MODEL_PATH

    def detect_faces(self, image: np.ndarray):
        boxes, confidences = face_detection(image, self.prototxt, self.model, 0.5)
        results = []

        for ((startX, startY, endX, endY), confidence) in zip(boxes, confidences):
            results.append({
                "box": [int(startX), int(startY), int(endX), int(endY)],
                "confidence": float(confidence)
            })

        return results
