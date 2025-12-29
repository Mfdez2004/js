document.addEventListener('contextmenu', event => event.preventDefault());

document.onkeydown = function(e) {
    // Bloquear F12 (Herramientas de desarrollador)
    if(e.keyCode == 123) {
        return false;
    }
    // Bloquear Ctrl+Shift+I (Inspeccionar)
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    // Bloquear Ctrl+Shift+C (Inspeccionar elemento)
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    // Bloquear Ctrl+Shift+J (Consola)
    if(e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    // Bloquear Ctrl+U (Ver código fuente)
    if(e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
    // Bloquear Ctrl+C (Copiar)
    if(e.ctrlKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
};
