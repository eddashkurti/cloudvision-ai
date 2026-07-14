import { formatFileSize, formatPredictionLabel, getConfidenceLevel } from './validation.js';

export function getElements() {
  return {
    modelStatus: document.querySelector('#modelStatus'),
    statusIndicator: document.querySelector('#statusIndicator'),
    statusText: document.querySelector('#statusText'),
    runtimeValue: document.querySelector('#runtimeValue'),
    dropZone: document.querySelector('#dropZone'),
    dropZoneTitle: document.querySelector('#dropZoneTitle'),
    uploadHelp: document.querySelector('#uploadHelp'),
    fileInput: document.querySelector('#fileInput'),
    chooseButton: document.querySelector('#chooseButton'),
    errorMessage: document.querySelector('#errorMessage'),
    analysisWorkspace: document.querySelector('#analysisWorkspace'),
    imagePreview: document.querySelector('#imagePreview'),
    analyzingOverlay: document.querySelector('#analyzingOverlay'),
    fileDetails: document.querySelector('#fileDetails'),
    resetButton: document.querySelector('#resetButton'),
    emptyResults: document.querySelector('#emptyResults'),
    resultsContent: document.querySelector('#resultsContent'),
    confidenceValue: document.querySelector('#confidenceValue'),
    confidenceBadge: document.querySelector('#confidenceBadge'),
    predictionList: document.querySelector('#predictionList'),
    processingTime: document.querySelector('#processingTime'),
  };
}

export function setModelLoading(elements) {
  elements.statusText.textContent = 'Loading AI model';
  elements.statusIndicator.className = 'status-indicator is-loading';
  elements.dropZone.classList.add('is-disabled');
  elements.dropZone.setAttribute('aria-disabled', 'true');
  elements.fileInput.disabled = true;
  elements.chooseButton.disabled = true;
  elements.dropZoneTitle.textContent = 'Preparing the classifier…';
  elements.uploadHelp.textContent = 'The upload control will unlock when the AI model is ready.';
}

export function setModelReady(elements, backend) {
  elements.statusText.textContent = 'AI model ready';
  elements.statusIndicator.className = 'status-indicator is-ready';
  elements.modelStatus.classList.add('is-ready');
  elements.runtimeValue.textContent = formatBackendName(backend);
  elements.dropZone.classList.remove('is-disabled');
  elements.dropZone.setAttribute('aria-disabled', 'false');
  elements.fileInput.disabled = false;
  elements.chooseButton.disabled = false;
  elements.dropZoneTitle.textContent = 'Drop an image here';
  elements.uploadHelp.textContent = 'or choose a file from your device';
}

export function setModelError(elements) {
  elements.statusText.textContent = 'Model unavailable';
  elements.statusIndicator.className = 'status-indicator is-error';
  elements.runtimeValue.textContent = 'Unavailable';
  elements.dropZoneTitle.textContent = 'The classifier could not start';
  elements.uploadHelp.textContent = 'Check your connection and refresh the page to try again.';
  showError(elements, 'CloudVision AI could not load the MobileNet model. Please refresh the page.');
}

export function showError(elements, message) {
  elements.errorMessage.textContent = message;
  elements.errorMessage.hidden = false;
}

export function clearError(elements) {
  elements.errorMessage.textContent = '';
  elements.errorMessage.hidden = true;
}

export function showImage(elements, imageUrl, file) {
  elements.analysisWorkspace.hidden = false;
  elements.imagePreview.src = imageUrl;
  elements.imagePreview.alt = `Selected image: ${file.name}`;
  elements.fileDetails.replaceChildren(
    createDetail('File', file.name),
    createDetail('Type', file.type.replace('image/', '').toUpperCase()),
    createDetail('Size', formatFileSize(file.size)),
  );
}

export function setAnalyzing(elements, analyzing) {
  elements.analyzingOverlay.hidden = !analyzing;
  elements.emptyResults.hidden = !analyzing;
  elements.resultsContent.hidden = true;
  elements.resetButton.disabled = analyzing;
  elements.chooseButton.disabled = analyzing;
  elements.fileInput.disabled = analyzing;
}

export function renderPredictions(elements, predictions, elapsedMilliseconds) {
  elements.analyzingOverlay.hidden = true;
  elements.predictionList.replaceChildren();

  const topProbability = predictions[0]?.probability ?? 0;
  const confidence = getConfidenceLevel(topProbability);
  const topPercentage = Math.round(topProbability * 100);

  elements.confidenceValue.textContent = `${topPercentage}%`;
  elements.confidenceBadge.textContent = confidence.label;
  elements.confidenceBadge.className = `confidence-badge ${confidence.className}`;
  elements.processingTime.textContent = `${Math.round(elapsedMilliseconds)} ms`;

  predictions.forEach((prediction, index) => {
    elements.predictionList.append(createPredictionItem(prediction, index));
  });

  elements.emptyResults.hidden = true;
  elements.resultsContent.hidden = false;
  elements.resetButton.disabled = false;
  elements.chooseButton.disabled = false;
  elements.fileInput.disabled = false;
}

export function resetWorkspace(elements) {
  elements.analysisWorkspace.hidden = true;
  elements.imagePreview.removeAttribute('src');
  elements.imagePreview.alt = 'Image selected for classification';
  elements.fileDetails.replaceChildren();
  elements.predictionList.replaceChildren();
  elements.resultsContent.hidden = true;
  elements.emptyResults.hidden = false;
  elements.fileInput.value = '';
  clearError(elements);
}

function createPredictionItem(prediction, index) {
  const percentage = Math.round(prediction.probability * 100);
  const item = document.createElement('li');
  item.className = 'prediction-item';

  const heading = document.createElement('div');
  heading.className = 'prediction-heading';

  const rank = document.createElement('span');
  rank.className = 'prediction-rank';
  rank.textContent = String(index + 1).padStart(2, '0');

  const label = document.createElement('strong');
  label.textContent = formatPredictionLabel(prediction.className);

  const value = document.createElement('span');
  value.className = 'prediction-value';
  value.textContent = `${percentage}%`;

  heading.append(rank, label, value);

  const track = document.createElement('div');
  track.className = 'prediction-track';
  track.setAttribute('aria-label', `${label.textContent}: ${percentage}% confidence`);

  const bar = document.createElement('span');
  bar.style.width = `${percentage}%`;
  track.append(bar);

  item.append(heading, track);
  return item;
}

function createDetail(term, description) {
  const wrapper = document.createElement('div');
  const dt = document.createElement('dt');
  const dd = document.createElement('dd');
  dt.textContent = term;
  dd.textContent = description;
  wrapper.append(dt, dd);
  return wrapper;
}

function formatBackendName(backend) {
  const names = {
    webgl: 'WebGL',
    wasm: 'WebAssembly',
    cpu: 'CPU',
  };

  return names[backend] ?? backend.toUpperCase();
}
