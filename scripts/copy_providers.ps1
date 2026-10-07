$src = 'D:\Pengembangan-Sistem-Pembelajaran-Adaptif\laravel_core\app\Providers'
$dst = 'D:\Pengembangan-Sistem-Pembelajaran-Adaptif\laravel\app\Providers'
if (Test-Path $src -PathType Container) {
  if (!(Test-Path $dst)) { New-Item -ItemType Directory -Path $dst | Out-Null }
  Copy-Item -Path (Join-Path $src '*') -Destination $dst -Recurse -Force
  Write-Output 'Providers copied'
} else {
  Write-Output 'Source Providers not found'
}