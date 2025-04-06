import scipy.io
import pandas as pd
import os
from sklearn.model_selection import train_test_split

# Load annotations
annos = scipy.io.loadmat('cars_annos.mat')['annotations'][0]

# Extract image file names and class labels
data = []
for a in annos:
    file_name = a[-1][0]
    class_id = int(a[5][0])
    data.append((file_name, class_id))

df = pd.DataFrame(data, columns=['image', 'label'])

# Split into train and test
train_df, test_df = train_test_split(df, test_size=0.2, stratify=df['label'], random_state=42)
train_df.to_csv('train.csv', index=False)
test_df.to_csv('test.csv', index=False)
