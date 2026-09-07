// Cloudflare Pages Function
// Endpoint: GET /api/image-base64?file=jacket-01.jpg
// Returns the requested image as base64-encoded text inside JSON,
// so it can be read by tools that cannot fetch raw binary images.

export async function onRequestGet(context) {
  const { request, env } = context;
  const url = new URL(request.url);
  const fileName = url.searchParams.get('file');

  if (!fileName) {
    return new Response(JSON.stringify({ error: 'Missing file param' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Safety: only allow simple image filenames, no folders, no path traversal
  if (!/^[a-zA-Z0-9_\-\.]+\.(jpg|jpeg|png|webp)$/i.test(fileName)) {
    return new Response(JSON.stringify({ error: 'Invalid file name' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const assetUrl = new URL('/' + fileName, request.url);
  const imageResponse = await env.ASSETS.fetch(assetUrl);

  if (!imageResponse.ok) {
    return new Response(JSON.stringify({ error: 'File not found', filename: fileName }), {
      status: 404,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  const buffer = await imageResponse.arrayBuffer();

  // Chunked base64 encoding (avoids call-stack limits on larger images)
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  const base64 = btoa(binary);
  const contentType = imageResponse.headers.get('Content-Type') || 'image/jpeg';

  return new Response(JSON.stringify({
    filename: fileName,
    content_type: contentType,
    data_base64: base64
  }), {
    headers: { 'Content-Type': 'application/json' }
  });
}
