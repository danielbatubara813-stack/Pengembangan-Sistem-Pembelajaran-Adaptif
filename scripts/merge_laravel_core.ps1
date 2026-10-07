$src = 'D:\Pengembangan-Sistem-Pembelajaran-Adaptif\laravel_core'
$dst = 'D:\Pengembangan-Sistem-Pembelajaran-Adaptif\laravel'
$dirs = @('bootstrap','public','resources','config','vendor')
foreach ($d in $dirs) {
  $s = Join-Path $src $d
  $t = Join-Path $dst $d
  if (Test-Path $s) {
    robocopy $s $t /E /XC /XN /XO | Out-Null
  }
}
$files = @('artisan','composer.json','composer.lock','.env.example')
foreach ($f in $files) {
  $s = Join-Path $src $f
  $t = Join-Path $dst $f
  if ( (Test-Path $s -PathType Any) -and -not (Test-Path $t) ) {
    Copy-Item $s $t -Force
  }
}
Write-Output "Merge complete"