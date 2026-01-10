function dibujarCilindro(x, y, ancho, alto, radio, canvasName) {
    const canvas = document.getElementById(canvasName);
    const ctx = canvas.getContext("2d");
    const canvas = document.getElementById(canvasName);
    const ctx = canvas.getContext("2d");

    // Degradado horizontal (volumen)
    const gradiente = ctx.createLinearGradient(x, 0, x + ancho, 0);
    gradiente.addColorStop(0, "#666");
    gradiente.addColorStop(0.3, "#ccc");
    gradiente.addColorStop(0.6, "#999");
    gradiente.addColorStop(1, "#444");

    ctx.fillStyle = gradiente;

    // Rectángulo central
    ctx.fillRect(x, y + radio, ancho, alto - 2 * radio);

    // Elipse superior
    ctx.beginPath();
    ctx.ellipse(
        x + ancho / 2,
        y + radio,
        ancho / 2,
        radio,
        0, 0, Math.PI * 2
    );
    ctx.fill();

    // Elipse inferior
    ctx.beginPath();
    ctx.ellipse(
        x + ancho / 2,
        y + alto - radio,
        ancho / 2,
        radio,
        0, 0, Math.PI * 2
    );
    ctx.fill();

    // ---- BORDES ----
    ctx.strokeStyle = "#333";
    ctx.lineWidth = 1;

    // Borde superior
    ctx.beginPath();
    ctx.ellipse(
        x + ancho / 2,
        y + radio,
        ancho / 2,
        radio,
        0, 0, Math.PI * 2
    );
    ctx.stroke();

    // Laterales
    ctx.beginPath();
    ctx.moveTo(x, y + radio);
    ctx.lineTo(x, y + alto - radio);
    ctx.moveTo(x + ancho, y + radio);
    ctx.lineTo(x + ancho, y + alto - radio);
    ctx.stroke();

    // Borde inferior
    ctx.beginPath();
    ctx.ellipse(
        x + ancho / 2,
        y + alto - radio,
        ancho / 2,
        radio,
        0, 0, Math.PI //* 2
    );
    ctx.stroke();
}
