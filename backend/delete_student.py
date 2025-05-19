import os
import shutil
import pickle
import pandas as pd
import config

ENCODINGS = config.ENCODINGS_PATH

def delete_student_completely(student_name):
    """Completely remove a student from the system with error handling"""
    results = {
        'encodings': False,
        'images': False,
        'attendance': False
    }
    
    # 1. Delete from encodings.pickle
    try:
        if os.path.exists(ENCODINGS):
            with open(ENCODINGS, "rb") as f:
                data = pickle.load(f)
            
            # Filter out the student's encodings
            original_count = len(data["names"])
            data["names"] = [n for n in data["names"] if n != student_name]
            data["encodings"] = [e for e, n in zip(data["encodings"], data["names"])]
            
            with open("encodings.pickle", "wb") as f:
                pickle.dump(data, f)
            
            results['encodings'] = True
            print(f"Removed {original_count - len(data['names'])} encodings for {student_name}")
    except Exception as e:
        print(f"Error deleting encodings: {str(e)}")

    # 2. Delete image folder
    try:
        sanitized_name = student_name.replace(" ", "_")
        image_dir = os.path.join("dataset", sanitized_name)
        
        if os.path.exists(image_dir):
            shutil.rmtree(image_dir)
            results['images'] = True
            print(f"Deleted image directory: {image_dir}")
        else:
            print(f"No image directory found for {student_name}")
    except Exception as e:
        print(f"Error deleting images: {str(e)}")

    # 3. Delete from attendance.csv
    try:
        if os.path.exists("attendance.csv"):
            df = pd.read_csv("attendance.csv", index_col=0)
            original_rows = len(df)
            df = df[df["names"] != student_name]
            
            if len(df) < original_rows:
                df.to_csv("attendance.csv")
                results['attendance'] = True
                print(f"Removed attendance records for {student_name}")
            else:
                print(f"No attendance records found for {student_name}")
    except Exception as e:
        print(f"Error deleting attendance records: {str(e)}")

    # Return summary
    if all(results.values()):
        return True, "Complete deletion successful"
    else:
        error_msg = "Partial deletion: " + ", ".join(
            [k for k, v in results.items() if not v]
        )
        return False, error_msg
    
success, message = delete_student_completely("dataset")
if success:
    print("Successfully deleted all records")
else:
    print(f"Deletion issues: {message}")
    
import pickle

def get_student_names(encodings_path=ENCODINGS):
    """Returns a list of all unique student names from encodings"""
    try:
        with open(encodings_path, "rb") as f:
            data = pickle.load(f)
        return sorted(list(set(data["names"])))  # Remove duplicates with set()
    except FileNotFoundError:
        print(f"Error: {encodings_path} not found")
        return []
    except Exception as e:
        print(f"Error reading encodings: {str(e)}")
        return []

# Usage:
student_names = get_student_names()
print("Registered students:", student_names)    
    