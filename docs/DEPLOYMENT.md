# Deployment Guide

CloudVision AI is a static Vite application. The production files generated in `dist/` can be hosted on Amazon S3, CloudFront, GitHub Pages, Netlify or Vercel.

## Build the application

```bash
npm ci
npm run build
```

Vite creates the deployable site in:

```text
dist/
```

Upload the **contents** of `dist/`, not the `dist` directory itself.

## Amazon S3 static website hosting

1. Create or choose an S3 bucket.
2. Enable static website hosting.
3. Set `index.html` as the index document.
4. Upload all files from `dist/`.
5. Configure public access only when the bucket is intentionally being used as a public website.

Using AWS CLI:

```bash
aws s3 sync dist/ s3://YOUR_BUCKET_NAME --delete
```

For a portfolio deployment, put CloudFront in front of S3 to provide HTTPS, caching and a custom domain.

## Recommended cache headers

The generated asset filenames contain hashes and can be cached for a long time. `index.html` should use a short cache duration so new deployments appear quickly.

```bash
aws s3 cp dist/index.html s3://YOUR_BUCKET_NAME/index.html \
  --content-type "text/html" \
  --cache-control "no-cache"

aws s3 sync dist/assets/ s3://YOUR_BUCKET_NAME/assets/ \
  --cache-control "public,max-age=31536000,immutable" \
  --delete
```

## Verify the deployment

After deployment, confirm that:

- The page loads without console errors.
- The model status changes to **AI model ready**.
- JPEG, PNG and WebP uploads work.
- Invalid or oversized files display an error.
- The layout works on desktop and mobile.

The MobileNet model is downloaded by the visitor's browser when the application starts, so the first load requires an internet connection.
