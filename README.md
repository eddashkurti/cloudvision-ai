# CloudVision AI

CloudVision AI is a privacy-first browser image classifier built with TensorFlow.js, MobileNet V2 and Vite. It analyzes an image locally and displays the model's top three predictions, confidence level and processing time.

The project began as an OPIT Summer Bootcamp exercise and was independently redesigned and expanded into a structured portfolio application.

## Features

- Browser-based image classification with MobileNet V2
- Drag-and-drop and file-picker uploads
- JPEG, PNG and WebP validation
- 8 MB upload limit with clear error messages
- Top-three prediction ranking with confidence bars
- High, medium and low confidence labels
- Inference processing-time measurement
- Temporary local image previews
- Responsive mobile and desktop interface
- Keyboard-accessible upload controls
- Automated validation tests
- GitHub Actions build, test and lint workflow
- Static production build suitable for Amazon S3

## Privacy

Selected images are not uploaded to an application server. The browser creates a temporary object URL and passes the image directly to TensorFlow.js for local inference. The temporary URL is revoked when the image is replaced or the page closes.

The MobileNet model files are downloaded when the application starts, so the first model load requires an internet connection.

## Technology

- JavaScript ES modules
- TensorFlow.js
- MobileNet V2
- Vite
- Vitest
- ESLint
- GitHub Actions
- Amazon S3-compatible static deployment

## Project structure

```text
cloudvision-ai/
├── .github/workflows/ci.yml
├── docs/DEPLOYMENT.md
├── public/favicon.svg
├── src/
│   ├── config.js
│   ├── main.js
│   ├── model.js
│   ├── styles.css
│   ├── ui.js
│   └── validation.js
├── tests/validation.test.js
├── .editorconfig
├── .gitignore
├── eslint.config.js
├── index.html
├── LICENSE
├── package.json
└── vite.config.js
```

## Run locally

Requirements:

- Node.js 20.19 or newer
- npm

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Create a production build:

```bash
npm run build
```

Preview the production build:

```bash
npm run preview
```

## Quality checks

Run linting:

```bash
npm run lint
```

Run tests:

```bash
npm test
```

The CI workflow runs installation, linting, tests and the production build on pushes and pull requests to `main`.

## Deployment

Production files are generated in `dist/` and can be deployed to a static hosting service. Amazon S3 instructions are available in [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md).

## Confidence interpretation

CloudVision AI uses the highest prediction probability to provide a simple confidence description:

- High confidence: 70% or higher
- Medium confidence: 40% to 69%
- Low confidence: below 40%

These labels are interface guidance, not a guarantee that a prediction is correct. MobileNet is a general-purpose ImageNet classifier and may perform poorly on unfamiliar, abstract or low-quality images.

## Author

**Edda Shkurti**

GitHub: [eddashkurti](https://github.com/eddashkurti)

## License

This project is available under the MIT License. TensorFlow.js and the MobileNet model are distributed under their respective licenses.
