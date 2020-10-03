const qr = require('qr-image')

const landingPage = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>QR Generator</title>
</head>
<body>
<h1>QR Generator</h1>
<p>Click the below button to generate a new QR code. This will make a request to your serverless function.</p>
<input type="text" id="text" value="https://workers.dev"></input>
<button onclick="generate()">Generate QR Code</button>
<h3>QR Code</h3>
<img src="" alt="No QR"/>
<script>
  function generate() {
    fetch(window.location.pathname, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text: document.querySelector("#text").value })
    }).then(response => response.blob()).then(image => {
      const imageURL = URL.createObjectURL(image)
      const imageEl = document.querySelector('img')
      imageEl.setAttribute('src', imageURL)
    })
  }
</script>
</body>
</html>
`

addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request))
})

async function handleRequest(request) {
  let response

  if (request.method === 'POST') {
    response = await generate(request)
  } else {
    response = new Response(landingPage, {
      headers: { 'Content-Type': 'text/html' },
    })
  }

  return response
}

async function generate(request) {
  const body = await request.json()
  const text = body.text
  const qrPng = qr.imageSync(text || 'https://workers.dev')

  return new Response(qrPng, {
    headers: {
      'Content-Type': 'image/png',
    },
  })
}
