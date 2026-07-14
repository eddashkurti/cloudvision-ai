# CloudVision AI

CloudVision AI is a privacy-first browser-based image classification application built with TensorFlow.js, MobileNet V2 and Vite. It classifies images entirely on the client, providing the top three predictions, confidence levels and inference time without uploading user images to a server.

Originally inspired by an OPIT Summer Bootcamp exercise, the project was redesigned and expanded into a production-style portfolio application with a modern architecture, automated testing and CI/CD.

## Live Demo

🌐 http://opit-bootcamp.s3-website.eu-north-1.amazonaws.com

## Preview

### Landing Page

![Landing Page](docs/screenshots/home.png)

### AI Image Classification

![Classification Results](docs/screenshots/classification.png)

## Features

- Browser-based image classification using MobileNet V2
- Client-side inference with TensorFlow.js
- Drag-and-drop and file-picker image uploads
- JPEG, PNG and WebP validation
- 8 MB upload limit with user-friendly validation
- Top three prediction ranking with confidence visualization
- High, medium and low confidence indicators
- Inference processing-time measurement
- Privacy-first local image processing
- Responsive desktop and mobile interface
- Keyboard-accessible controls
- Automated unit tests with Vitest
- GitHub Actions CI pipeline
- Production-ready static deployment for Amazon S3

## Privacy

CloudVision AI performs inference entirely within the browser. Images are never uploaded to an application server.

The browser creates a temporary object URL for the selected image, which is passed directly to TensorFlow.js for classification. The temporary URL is automatically revoked when another image is selected or the page is closed.

The MobileNet model is downloaded when the application loads, so an internet connection is required only to retrieve the model files.

## Technology Stack

- JavaScript (ES Modules)
- TensorFlow.js
- MobileNet V2
- Vite
- Vitest
- ESLint
- GitHub Actions
- Amazon S3 Static Website Hosting

## Project Structure

```text
cloudvision-ai/
├── .github/
│   └── workflows/
│       └── ci.yml
├── docs/
│   ├── DEPLOYMENT.md
│   └── screenshots/
├── public/
│   └── favicon.svg
├── src/
│   ├── config.js
│   ├── main.js
│   ├── model.js
│   ├── styles.css
│   ├── ui.js
│   └── validation.js
├── tests/
│   └── validation.test.js
├── .editorconfig
├── .gitignore
├── eslint.config.js
├── index.html
├── LICENSE
├── package.json
└── vite.config.js
```

## Getting Started

### Requirements

- Node.js 20.19 or later
- npm

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

### Create a production build

```bash
npm run build
```

### Preview the production build

```bash
npm run preview
```

## Testing & Quality

Run ESLint:

```bash
npm run lint
```

Run unit tests:

```bash
npm test
```

GitHub Actions automatically validates every push and pull request by:

- Installing dependencies
- Running ESLint
- Running unit tests
- Building the production bundle

## Deployment

The production build is generated inside the `dist/` directory and can be deployed to any static hosting provider.

Instructions for Amazon S3 deployment are available in:

```text
docs/DEPLOYMENT.md
```

## Confidence Levels

CloudVision AI uses the highest prediction probability to display a simple confidence indicator.

| Confidence | Probability |
|------------|------------:|
| High | ≥ 70% |
| Medium | 40–69% |
| Low | < 40% |

These indicators provide guidance only. MobileNet is a general-purpose ImageNet classifier and may produce inaccurate predictions for unfamiliar or low-quality images.

## Author

**Edda Shkurti**

GitHub: https://github.com/eddashkurti

## License

This project is licensed under the MIT License.

TensorFlow.js and MobileNet are distributed under their respective licenses.