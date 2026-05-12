# Plant Disease Detection & Severity Assessment System 🌿🔍

An AI-powered end-to-end web application for automated plant disease detection and severity assessment using deep learning and computer vision techniques. This system enables farmers and agricultural professionals to upload leaf images and instantly receive disease predictions, severity analysis, confidence scores, and downloadable PDF diagnostic reports.

## 🚀 Features

* 🌱 Detects **38 different plant diseases**
* 📊 Severity assessment using lesion coverage analysis
* ⚡ Real-time predictions in under 2 seconds
* 🧠 Fine-tuned **MobileNetV2** transfer learning model
* 🎨 HSV + K-Means based lesion segmentation
* 📄 Automated PDF report generation
* 🔐 JWT-based authentication & secure user management
* 📱 Fully responsive frontend for mobile and desktop
* 📂 Diagnosis history and expert annotation support

## 🛠️ Tech Stack

### Machine Learning

* PyTorch
* MobileNetV2
* OpenCV
* Scikit-learn

### Backend

* FastAPI
* JWT Authentication
* MongoDB / Lovable Cloud

### Frontend

* Lovable (React-based UI)

## 📈 Model Performance

* ✅ Validation Accuracy: **92%**
* ✅ Test Accuracy: **91.8%**
* ✅ Mean Response Time: **1.48s**
* ✅ Mean IoU for Segmentation: **0.817**

## 🧪 Pipeline Overview

1. Image Upload & Validation
2. Image Preprocessing & Normalization
3. HSV Color Space Conversion
4. K-Means Lesion Segmentation
5. Disease Classification using MobileNetV2
6. Severity Quantification
7. PDF Report Generation & Result Storage

## 📚 Dataset

* PlantVillage Dataset
* 54,305 images across 38 disease classes

## 👥 Team Members

* Muhammad Abdullah Asif
* Muhammad Armaghan Shahzad
* Moiz Jadoon

## 🎯 Future Improvements

* Vision Transformer integration
* Multi-disease detection
* Mobile application support
* Cloud scalability for large-scale deployment
* Geospatial disease monitoring

## 📄 License

This project was developed as a Final Year Project (FYP) at the FAST School of Computing, National University of Computer and Emerging Sciences (FAST-NUCES), Karachi.
