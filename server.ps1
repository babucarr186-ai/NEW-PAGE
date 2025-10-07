# Simple PowerShell Web Server for Development
param(
    [int]$Port = 8000
)

$path = Split-Path -Parent $MyInvocation.MyCommand.Path

# Create a simple HTTP listener
$listener = New-Object System.Net.HttpListener
$listener.Prefixes.Add("http://localhost:$Port/")
$listener.Start()

Write-Host "Server running at http://localhost:$Port/"
Write-Host "Press Ctrl+C to stop"

# Open browser
Start-Process "http://localhost:$Port"

try {
    while ($listener.IsListening) {
        $context = $listener.GetContext()
        $request = $context.Request
        $response = $context.Response

        $localPath = $request.Url.LocalPath
        if ($localPath -eq "/") { $localPath = "/index.html" }

        $filePath = Join-Path $path $localPath.TrimStart("/")

        if (Test-Path $filePath -PathType Leaf) {
            $content = Get-Content $filePath -Raw -Encoding UTF8
            $response.ContentType = if ($filePath.EndsWith(".html")) { "text/html" }
                                  elseif ($filePath.EndsWith(".css")) { "text/css" }
                                  elseif ($filePath.EndsWith(".js")) { "application/javascript" }
                                  elseif ($filePath.EndsWith(".json")) { "application/json" }
                                  else { "text/plain" }
            $buffer = [System.Text.Encoding]::UTF8.GetBytes($content)
        } else {
            $response.StatusCode = 404
            $buffer = [System.Text.Encoding]::UTF8.GetBytes("File not found")
        }

        $response.ContentLength64 = $buffer.Length
        $response.OutputStream.Write($buffer, 0, $buffer.Length)
        $response.OutputStream.Close()
    }
}
finally {
    $listener.Stop()
}