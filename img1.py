import tensorflow as tf
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.applications import ResNet50
from tensorflow.keras.layers import Dense, GlobalAveragePooling2D
from tensorflow.keras.models import Model
from tensorflow.keras.optimizers import Adam
import pandas as pd

# Paths
image_dir = "cars_train"  # Set path to your folder with images

# Data generators
datagen = ImageDataGenerator(rescale=1./255, validation_split=0.2)

train_gen = datagen.flow_from_dataframe(
    dataframe=pd.read_csv('train.csv'),
    directory=image_dir,
    x_col='image',
    y_col='label',
    target_size=(224, 224),
    class_mode='raw',
    batch_size=32,
    subset='training'
)

val_gen = datagen.flow_from_dataframe(
    dataframe=pd.read_csv('train.csv'),
    directory=image_dir,
    x_col='image',
    y_col='label',
    target_size=(224, 224),
    class_mode='raw',
    batch_size=32,
    subset='validation'
)

# Load base model
base_model = ResNet50(weights='imagenet', include_top=False, input_shape=(224, 224, 3))
x = GlobalAveragePooling2D()(base_model.output)
output = Dense(196, activation='softmax')(x)
model = Model(inputs=base_model.input, outputs=output)

# Compile and train
model.compile(optimizer=Adam(1e-4), loss='sparse_categorical_crossentropy', metrics=['accuracy'])
model.fit(train_gen, validation_data=val_gen, epochs=10)

# Save model
model.save("car_model.h5") 