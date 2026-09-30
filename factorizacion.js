
function factoriza(selected, inpTxt){
    // --- 1. CONFIGURACIÓN Y NÚMEROS VÁLIDOS (5-smooth <= 300) ---
    const VALID_NUMBERS = [
        6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 27, 30, 32, 36, 40, 45, 48, 50,
        54, 60, 64, 72, 75, 80, 81, 90, 96, 100, 108, 120, 125, 128, 135, 144,
        150, 160, 162, 180, 192, 200, 216, 225, 240, 243, 250, 256, 270, 288, 300
    ];
    //let selected = eval('{#l1_10#}');

    let examExercises = [];
    let currentIndex = 0;
    let isReviewMode = false;

    let canvas = null;
    let activeFactorBox = null;
    let activeQuotientBox = null;

    // --- 2. INICIALIZACIÓN ---
    window.addEventListener('load', () => {
        initFabricCanvas();
        startNewExam();

        document.getElementById('btnAddStep').addEventListener('click', handleAddStep);
        document.getElementById('btnDeleteStep').addEventListener('click', handleDeleteStep);
        document.getElementById('btnNextEx').addEventListener('click', handleNextExercise);
        document.getElementById('btnPrevEx').addEventListener('click', handlePrevExercise);
        document.getElementById('btnRestart').addEventListener('click', startNewExam);
        document.getElementById('btnReviewBoard').addEventListener('click', enterReviewMode);
        document.getElementById('btnBackToSummary').addEventListener('click', showResultsSummary);
    });

    function initFabricCanvas() {
        canvas = new fabric.Canvas('factorCanvas', {
            selection: false,
            backgroundColor: '#ffffff'
        });

        canvas.on('object:moving', (e) => {
            const obj = e.target;
            if (obj._initialLeft !== undefined) obj.left = obj._initialLeft;
            if (obj._initialTop !== undefined) obj.top = obj._initialTop;
        });
    }

    // --- 3. GESTIÓN DEL EXAMEN ---
    function startNewExam() {
        //const shuffled = [...VALID_NUMBERS].sort(() => 0.5 - Math.random());

        examExercises = selected.map(num => ({
            number: num,
            userSteps: [],
            isCorrect: false,
            errorMessage: '',
            correctFactors: getPrimeFactors(num)
        }));

        currentIndex = 0;
        isReviewMode = false;

        document.getElementById('examScreen').style.display = 'flex';
        document.getElementById('resultsScreen').style.display = 'none';
        document.getElementById('reviewIndicator').style.display = 'none';
        document.getElementById('instructionsBox').style.display = 'block';
        document.getElementById('btnBackToSummary').style.display = 'none';
        document.getElementById('btnPrevEx').style.display = 'none';
        document.getElementById('btnAddStep').style.display = 'inline-flex';
        document.getElementById('btnDeleteStep').style.display = 'inline-flex';
        document.getElementById('btnNextEx').textContent = "Siguiente Número ➔";

        loadExercise(0);
    }

    function loadExercise(index) {
        currentIndex = index;
        const ex = examExercises[currentIndex];

        document.getElementById('exerciseCounter').textContent = `Ejercicio ${currentIndex + 1} / 10`;
        document.getElementById('targetNumDisplay').textContent = `Número: ${ex.number}`;

        if (isReviewMode) {
            document.getElementById('btnPrevEx').style.display = currentIndex > 0 ? 'inline-flex' : 'none';
            document.getElementById('btnNextEx').style.display = currentIndex < 9 ? 'inline-flex' : 'none';
            document.getElementById('btnNextEx').textContent = "Siguiente ➔";
        } else {
            document.getElementById('btnPrevEx').style.display = 'none';
            document.getElementById('btnNextEx').textContent = currentIndex === 9 ? "Finalizar y Corregir 🏁" : "Siguiente Número ➔";
        }

        renderBoard();
    }

    // --- 4. RENDERIZADO DEL LIENZO (CANVAS) ---
    function renderBoard() {
        canvas.clear();
        const ex = examExercises[currentIndex];
        //if (inpTxt !== "") {
        //    inpTxt[currentIndex].value = JSON.stringify(examExercises[currentIndex].userSteps);
        //}

        const startY = 50;
        const lineHeight = 42;

        if (isReviewMode && !ex.isCorrect) {
            // MODO REVISIÓN INCORRECTO: Muestra Comparativa de 2 Columnas
            drawVerticalFactorization(140, startY, lineHeight, ex.number, ex.userSteps, true, "Tu Respuesta (Incorrecta)");

            // Línea divisoria central entre ambas factorizaciones
            const middleDivider = new fabric.Line([275, 20, 275, 340], {
                stroke: '#cbd5e1',
                strokeWidth: 2,
                strokeDashArray: [6, 4],
                selectable: false,
                evented: false
            });
            canvas.add(middleDivider);

            // Construir los pasos correctos dinámicamente
            const correctSteps = [];
            let tempNum = ex.number;
            ex.correctFactors.forEach(f => {
                tempNum /= f;
                correctSteps.push({
                    factor: f,
                    quotient: tempNum
                });
            });

            drawVerticalFactorization(410, startY, lineHeight, ex.number, correctSteps, false, "Factorización Correcta");

        } else {
            // MODO EXAMEN / REVISIÓN CORRECTA: Columna Única Centrada
            drawVerticalFactorization(275, startY, lineHeight, ex.number, ex.userSteps, isReviewMode, isReviewMode ? "Respuesta Correcta" : null);

            // Si no estamos en modo revisión y no hemos llegado al final, añadir campos interactivos
            const lastQuotient = ex.userSteps.length > 0 ? ex.userSteps[ex.userSteps.length - 1].quotient : ex.number;

            if (!isReviewMode && lastQuotient !== 1) {
                const activeY = startY + (ex.userSteps.length * lineHeight);

                activeFactorBox = createEditableBox('?', 275 + 25, activeY, '#3b82f6', 'left');
                activeQuotientBox = createEditableBox('?', 275 - 25, activeY + lineHeight, '#8b5cf6', 'right');

                canvas.add(activeFactorBox);
                canvas.add(activeQuotientBox);
                canvas.setActiveObject(activeFactorBox);
            } else {
                activeFactorBox = null;
                activeQuotientBox = null;
            }
        }

        canvas.renderAll();
    }

    // Dibuja una estructura de factorización vertical en una coordenada X concreta
    function drawVerticalFactorization(centerX, startY, lineHeight, number, steps, isErrorStyle, titleHeader) {
        // Título encabezado de la columna si procede
        if (titleHeader) {
            const titleText = new fabric.Text(titleHeader, {
                left: centerX,
                top: 15,
                fontFamily: 'Segoe UI, sans-serif',
                fontSize: 15,
                fontWeight: 'bold',
                fill: isErrorStyle ? '#b91c1c' : '#15803d',
                originX: 'center',
                selectable: false,
                evented: false
            });
            canvas.add(titleText);
        }

        // Línea vertical central
        const maxRows = Math.max(steps.length + 1, 4);
        const line = new fabric.Line([centerX, startY - 10, centerX, startY + (maxRows * lineHeight)], {
            stroke: '#1e293b',
            strokeWidth: 3,
            selectable: false,
            evented: false
        });
        canvas.add(line);

        // Número original en la esquina superior izquierda
        const startNumText = new fabric.Text(number.toString(), {
            left: centerX - 25,
            top: startY,
            fontFamily: 'Segoe UI, sans-serif',
            fontSize: 24,
            fontWeight: 'bold',
            fill: '#1e293b',
            originX: 'right',
            selectable: false,
            evented: false
        });
        canvas.add(startNumText);

        // Dibuja los pasos
        steps.forEach((step, i) => {
            const currentY = startY + (i * lineHeight);

            // Factor (derecha)
            const factorText = new fabric.Text(step.factor.toString(), {
                left: centerX + 25,
                top: currentY,
                fontFamily: 'Segoe UI, sans-serif',
                fontSize: 24,
                fontWeight: 'bold',
                fill: isReviewMode ? (isErrorStyle ? '#b91c1c' : '#15803d') : '#3b82f6',
                originX: 'left',
                selectable: false,
                evented: false
            });
            canvas.add(factorText);

            // Cociente (izquierda)
            const quotText = new fabric.Text(step.quotient.toString(), {
                left: centerX - 25,
                top: currentY + lineHeight,
                fontFamily: 'Segoe UI, sans-serif',
                fontSize: 24,
                fontWeight: 'bold',
                fill: isReviewMode ? (isErrorStyle ? '#b91c1c' : '#15803d') : '#8b5cf6',
                originX: 'right',
                selectable: false,
                evented: false
            });
            canvas.add(quotText);
        });
    }

    // Crea cuadros editables con corrección del signo '?'
    function createEditableBox(defaultText, left, top, color, originX) {
        const box = new fabric.IText(defaultText, {
            left: left,
            top: top,
            fontFamily: 'Segoe UI, sans-serif',
            fontSize: 24,
            fontWeight: 'bold',
            fill: color,
            originX: originX,
            editable: true,
            hasControls: false,
            hasBorders: false,
            lockMovementX: true,
            lockMovementY: true,
            lockRotation: true,
            lockScalingX: true,
            lockScalingY: true
        });

        box._initialLeft = left;
        box._initialTop = top;

        // CORRECCIÓN INTERROGACIÓN: Elimina automáticamente la '?' al enfocar o empezar a escribir
        const clearInterrogation = () => {
            if (box.text.includes('?')) {
                box.text = box.text.replace(/\?/g, '');
                canvas.renderAll();
            }
        };

        function actualiza() {
            clearInterrogation();

            // 1. Clonamos los pasos que el usuario ya ha guardado con "Añadir Paso"
            const currentSteps = [...examExercises[currentIndex].userSteps];

            // 2. Si las casillas editables existen, leemos lo que el usuario está escribiendo ahora mismo
            if (activeFactorBox && activeQuotientBox) {
                const factorVal = parseInt(activeFactorBox.text.replace(/\?/g, '').trim());
                const quotientVal = parseInt(activeQuotientBox.text.replace(/\?/g, '').trim());

                // Si al menos uno de los campos tiene un valor numérico, lo incluimos de forma borrador/temporal
                if (!isNaN(factorVal) || !isNaN(quotientVal)) {
                    currentSteps.push({
                        factor: isNaN(factorVal) ? null : factorVal,
                        quotient: isNaN(quotientVal) ? null : quotientVal
                    });
                }
            }

            // 3. Escribimos el JSON actualizado en el input del DOM
            if (inpTxt !== "" && inpTxt[currentIndex]) {
                inpTxt[currentIndex].value = JSON.stringify(currentSteps);
            }
        }

        box.on('editing:entered', clearInterrogation);
        box.on('selection:created', clearInterrogation);
        box.on('changed', actualiza);

        return box;
    }

    // --- 5. LÓGICA DE AÑADIR / BORRAR PASOS ---
    function handleAddStep(e) {
        if (e) e.preventDefault(); // Evita recargas en Moodle / Formularios
        if (isReviewMode || !activeFactorBox || !activeQuotientBox) return;

        const factorVal = parseInt(activeFactorBox.text.replace(/\?/g, '').trim());
        const quotientVal = parseInt(activeQuotientBox.text.replace(/\?/g, '').trim());

        if (isNaN(factorVal) || isNaN(quotientVal)) {
            alert("Por favor, escribe números válidos en ambas casillas antes de continuar.");
            return;
        }

        examExercises[currentIndex].userSteps.push({
            factor: factorVal,
            quotient: quotientVal
        });

        renderBoard();
    }

    function handleDeleteStep(e) {
        if (e) e.preventDefault(); // Evita recargas en Moodle / Formularios
        if (isReviewMode) return;
        const ex = examExercises[currentIndex];
        if (ex.userSteps.length > 0) {
            ex.userSteps.pop();
            renderBoard();
        }
    }

    // --- 6. NAVEGACIÓN Y EVALUACIÓN FINAL ---
    function handleNextExercise(e) {
        if (e) e.preventDefault(); // Evita recargas en Moodle / Formularios
        if (!isReviewMode) {
            if (activeFactorBox && activeQuotientBox) {
                const fVal = parseInt(activeFactorBox.text.replace(/\?/g, '').trim());
                const qVal = parseInt(activeQuotientBox.text.replace(/\?/g, '').trim());
                if (!isNaN(fVal) && !isNaN(qVal)) {
                    examExercises[currentIndex].userSteps.push({
                        factor: fVal,
                        quotient: qVal
                    });
                }
            }

            if (currentIndex < 9) {
                loadExercise(currentIndex + 1);
            } else {
                evaluateAndShowResults();
            }
        } else {
            if (currentIndex < 9) loadExercise(currentIndex + 1);
        }
    }

    function handlePrevExercise(e) {
        if (e) e.preventDefault(); // Evita recargas en Moodle / Formularios
        if (currentIndex > 0) {
            loadExercise(currentIndex - 1);
        }
    }

    function evaluateAndShowResults(e) {
        if (e) e.preventDefault(); // Evita recargas en Moodle / Formularios
        examExercises.forEach(ex => {
            const target = ex.number;
            const steps = ex.userSteps;

            if (steps.length === 0) {
                ex.isCorrect = false;
                ex.errorMessage = "Ejercicio sin responder.";
                return;
            }

            let currentNum = target;
            let valid = true;
            let errReason = "";

            for (let i = 0; i < steps.length; i++) {
                const f = steps[i].factor;
                const q = steps[i].quotient;

                if (!isPrime(f)) {
                    valid = false;
                    errReason = `El número ${f} no es primo.`;
                    break;
                }

                if (currentNum % f !== 0) {
                    valid = false;
                    errReason = `${currentNum} no es divisible entre ${f}.`;
                    break;
                }

                if (currentNum / f !== q) {
                    valid = false;
                    errReason = `Error de cálculo: ${currentNum} ÷ ${f} no es ${q}.`;
                    break;
                }

                currentNum = q;
            }

            if (valid && currentNum !== 1) {
                valid = false;
                errReason = `Descomposición incompleta (no se llegó al cociente 1).`;
            }

            ex.isCorrect = valid;
            ex.errorMessage = errReason;
        });

        showResultsSummary();
    }

    function showResultsSummary(e) {
        if (e) e.preventDefault(); // Evita recargas en Moodle / Formularios
        document.getElementById('examScreen').style.display = 'none';
        document.getElementById('resultsScreen').style.display = 'flex';

        const correctCount = examExercises.filter(e => e.isCorrect).length;
        document.getElementById('finalScoreTitle').textContent = `Resultado: ${correctCount} de 10 Correctos (${correctCount * 10}%)`;

        const resultsGrid = document.getElementById('resultsGrid');
        resultsGrid.innerHTML = '';

        examExercises.forEach((ex, idx) => {
            const card = document.createElement('div');
            card.className = `result-card ${ex.isCorrect ? 'correct' : 'incorrect'}`;

            const userFactorsStr = ex.userSteps.map(s => s.factor).join(' × ') || 'Ninguna';
            const correctFactorsStr = ex.correctFactors.join(' × ');
            const correctPowerStr = formatPowers(ex.correctFactors);

            card.innerHTML = `
                    <div class="card-title-bar">
                        <strong>#${idx + 1}. Número: ${ex.number}</strong>
                        <span class="badge-status ${ex.isCorrect ? 'correct' : 'incorrect'}">
                            ${ex.isCorrect ? 'Correcto' : 'Incorrecto'}
                        </span>
                    </div>
                    <div class="factor-comparison">
                        <div><b>Tu respuesta:</b> ${userFactorsStr}</div>
                        ${!ex.isCorrect ? `<div style="color: #b91c1c; font-size: 0.85rem; margin-top:2px;">⚠️ ${ex.errorMessage}</div>` : ''}
                        <div class="correct-ans" style="margin-top: 4px;">
                            <b>Factorización Correcta:</b> ${correctFactorsStr} (${correctPowerStr})
                        </div>
                    </div>
                `;

            resultsGrid.appendChild(card);
        });
    }

    function enterReviewMode(e) {
        if (e) e.preventDefault(); // Evita recargas en Moodle / Formularios
        isReviewMode = true;
        document.getElementById('examScreen').style.display = 'flex';
        document.getElementById('resultsScreen').style.display = 'none';

        document.getElementById('reviewIndicator').style.display = 'inline-block';
        document.getElementById('instructionsBox').style.display = 'none';
        document.getElementById('btnBackToSummary').style.display = 'inline-flex';
        document.getElementById('btnAddStep').style.display = 'none';
        document.getElementById('btnDeleteStep').style.display = 'none';

        loadExercise(0);
    }

    // --- 7. UTILERÍAS MATEMÁTICAS ---
    function getPrimeFactors(n) {
        const factors = [];
        let num = n;
        for (let d = 2; d * d <= num; d++) {
            while (num % d === 0) {
                factors.push(d);
                num /= d;
            }
        }
        if (num > 1) factors.push(num);
        return factors;
    }

    function isPrime(num) {
        if (num < 2) return false;
        for (let i = 2; i <= Math.sqrt(num); i++) {
            if (num % i === 0) return false;
        }
        return true;
    }

    function formatPowers(factors) {
        const counts = {};
        factors.forEach(f => counts[f] = (counts[f] || 0) + 1);

        const mapSuperscript = {
            '2': '²',
            '3': '³',
            '4': '⁴',
            '5': '⁵',
            '6': '⁶',
            '7': '⁷',
            '8': '⁸'
        };

        return Object.entries(counts)
            .map(([f, count]) => count > 1 ? `${f}${mapSuperscript[count] || '^' + count}` : f)
            .join(' × ');
    }
}
