Object.assign(document.body.style, {
    WebkitUserSelect: "none",
    msUserSelect: "none",
    userSelect: "none"
});
let focoActivo = true;
function obtenerBaseQuizUrl() {
    const url = new URL(window.location.href);
    return url.origin + url.pathname.replace(/\/[^\/]*\.php$/, '/');
}
function pierdeFoco() {
    focoActivo = false;
    //console.log("🔴 Ventana SIN foco");
    const url = new URL(window.location.href);
    const attempt = url.searchParams.get('attempt');
    const cmid = url.searchParams.get('cmid'); 
    const finishattempt=0;//document.querySelector(`input[type="hidden"][name="finishattempt"]`).value;
    const timeup=document.querySelector(`input[type="hidden"][name="timeup"]`).value;
    const slots=document.querySelector(`input[type="hidden"][name="slots"]`).value;
    const sesskey=document.querySelector(`input[type="hidden"][name="sesskey"]`).value;
    const postURL= obtenerBaseQuizUrl() + "processattempt.php";
    form = document.createElement('form');
    form.method = 'POST';
    form.action = postURL;
    //form.action = 'http://localhost/moodle/mod/quiz/processattempt.php';


    const data = {
        attempt: attempt,
        finishattempt: 1,
        timeup: timeup,
        slots: slots,
        cmid: cmid,
        sesskey: sesskey
    };

    for ([name, value] of Object.entries(data)) {
        input = document.createElement('input');
        input.type = 'hidden';
        input.name = name;
        input.value = value;
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
}

function ganaFoco() {
    //if (!focoActivo){
    //    const boton = document.querySelector('button[type="submit"], input[type="submit"]');
    //    const id = boton ? boton.id : null;
    //    const btn=document.getElementById(id);
    //    btn.click();
    //}
    focoActivo = true;
    console.log("🟢 Ventana CON foco");
}

window.addEventListener("blur", pierdeFoco);
window.addEventListener("focus", ganaFoco);

document.addEventListener("visibilitychange", () => {
    if (document.hidden) {
        pierdeFoco();
    } else {
        ganaFoco();
    }
});

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
