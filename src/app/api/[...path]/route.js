const API_BASE_URL = (
  process.env.API_SERVER_URL ||
  process.env.NEXT_PUBLIC_API_URL ||
  'http://localhost:5000/api'
).replace(/\/$/, '');

const ALLOWED_API_ROOTS = new Set(['auth', 'products', 'orders', 'admin', 'payments']);

async function proxyRequest(request, context) {
  const { path = [] } = await context.params;

  if (!path.length || !ALLOWED_API_ROOTS.has(path[0])) {
    return Response.json({ success: false, message: 'API route not found.' }, { status: 404 });
  }

  const upstreamUrl = `${API_BASE_URL}/${path.map(encodeURIComponent).join('/')}${new URL(request.url).search}`;
  const headers = new Headers();
  const contentType = request.headers.get('content-type');
  const authorization = request.headers.get('authorization');

  if (contentType) headers.set('content-type', contentType);
  if (authorization) headers.set('authorization', authorization);

  try {
    const upstreamResponse = await fetch(upstreamUrl, {
      method: request.method,
      headers,
      body: ['GET', 'HEAD'].includes(request.method) ? undefined : await request.arrayBuffer(),
      cache: 'no-store',
      redirect: 'manual',
    });
    const responseHeaders = new Headers();
    const responseContentType = upstreamResponse.headers.get('content-type');

    if (responseContentType) responseHeaders.set('content-type', responseContentType);

    return new Response(upstreamResponse.body, {
      status: upstreamResponse.status,
      headers: responseHeaders,
    });
  } catch {
    return Response.json(
      { success: false, message: 'Could not connect to the API server. Make sure the backend is running.' },
      { status: 502 }
    );
  }
}

export const GET = proxyRequest;
export const POST = proxyRequest;
export const PUT = proxyRequest;
export const PATCH = proxyRequest;
export const DELETE = proxyRequest;
