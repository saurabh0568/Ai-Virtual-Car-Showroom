import os

# Relative path (assuming this script is in the root folder)
folder_path = "cars_train"

# Check existence
if os.path.exists(folder_path) and os.path.isdir(folder_path):
    print(f"✅ Folder '{folder_path}' exists and is accessible.")
else:
    print(f"❌ Folder '{folder_path}' does NOT exist or is not accessible.")

if os.path.exists(folder_path):
    print("Contents of folder:")
    for file in os.listdir(folder_path):
        print(" -", file)
