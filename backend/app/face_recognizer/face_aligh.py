# import the necessary packages
import cv2
import numpy as np
import argparse

def alignFace(image, face_rect):
	'''
	Align face using face rectangle
	'''
	x, y, w, h = face_rect
	face = image[y:y+h, x:x+w]
	return cv2.resize(face, (128, 128))

if __name__ == "__main__":
	ap = argparse.ArgumentParser()
	ap.add_argument("-i", "--image", required=True, help="path to input image")
	args = vars(ap.parse_args())
	
	# Load image
	image = cv2.imread(args["image"])
	
	# Initialize face detector
	face_cascade = cv2.CascadeClassifier(cv2.data.haarcascades + 'haarcascade_frontalface_default.xml')
	gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
	faces = face_cascade.detectMultiScale(gray, 1.3, 5)
	
	for face_rect in faces:
		# Align face
		faceAligned = alignFace(image, face_rect)
		
		# Display results
		cv2.imshow("Original", image)
		cv2.imshow("Aligned", faceAligned)
		cv2.waitKey(0)

	for i in range(0, len(faces)):
		# align faces
		faceAligned = alignFace(image, faces[i])
			
		# display the output images
		cv2.imshow("Original", image)
		cv2.imshow("Aligned", faceAligned)
		cv2.waitKey(0)																			