@echo off
echo Ejecutando Newman...

call newman run Variables.postman_collection.json -e Variables.postman_environment.json --insecure -r htmlextra --reporter-htmlextra-export reporte.html

echo Esperando a que reporte.html exista...

:waitLoop
IF EXIST reporte.html (
    echo Reporte encontrado.
    goto sendMail
) ELSE (
    echo Reporte no encontrado, esperando...
    timeout /t 1 >nul
    goto waitLoop
)

:sendMail
echo Enviando correo...
call node sendMail.js

echo Todo finalizado.
pause
