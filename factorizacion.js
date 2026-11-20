function factoriza(selected, inpTxt) {
    // --- 1. CONFIGURACIÓN Y NÚMEROS VÁLIDOS (5-smooth <= 300) ---
    const VALID_NUMBERS = [
        6, 8, 9, 10, 12, 15, 16, 18, 20, 24, 25, 27, 30, 32, 36, 40, 45, 48, 50,
        54, 60, 64, 72, 75, 80, 81, 90, 96, 100, 108, 120, 125, 128, 135, 144,
        150, 160, 162, 180, 192, 200, 216, 225, 240, 243, 250, 256, 270, 288, 300
    ];

    const GREEN_COLOR = '#15803d';
    const RED_COLOR = '#b91c1c';

    let examExercises = [];
    let currentIndex = 0;
    const hasInputs = Array.isArray(inpTxt) || (inpTxt && typeof inpTxt.length === 'number' && inpTxt.length > 0);
    let isReviewMode = hasInputs ? Boolean(inpTxt[0].readOnly) : false;

    let canvas = null;
    let activeFactorBox = null;
    let activeQuotientBox = null;

    // --- 2. INICIALIZACIÓN ---
    initFabricCanvas();
    startNewExam();

    document.getElementById('btnAddStep').addEventListener('click', handleAddStep);
    document.getElementById('btnDeleteStep').addEventListener('click', handleDeleteStep);
    document.getElementById('btnNextEx').addEventListener('click', handleNextExercise);
    document.getElementById('btnPrevEx').addEventListener('click', handlePrevExercise);
    document.getElementById('btnRestart').addEventListener('click', startNewExam);
    document.getElementById('btnBackToSummary').addEventListener('click', showResultsSummary);

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

    function parseSavedSteps(index) {
        if (!hasInputs || !inpTxt[index] || !inpTxt[index].value) return [];
        try {
            const parsed = JSON.parse(inpTxt[index].value);
            if (!Array.isArray(parsed)) return [];
            return parsed.filter(
                step => step && Number.isInteger(step.factor) && Number.isInteger(step.quotient)
            );
        } catch (err) {
            return [];
        }
    }

    // --- 3. GESTIÓN DEL EXAMEN ---
    function startNewExam() {
        const sourceList = (Array.isArray(selected) && selected.length > 0)
            ? selected
            : VALID_NUMBERS.slice(0, 10);

        examExercises = sourceList.map((num, idx) => ({
            number: Number(num),
            userSteps: isReviewMode ? parseSavedSteps(idx) : [],
            isCorrect: false,
            errorMessage: '',
            correctFactors: getPrimeFactors(Number(num))
        }));

        if (!isReviewMode && hasInputs) {
            for (let i = 0; i < examExercises.length; i++) {
                if (inpTxt[i]) inpTxt[i].value = '[]';
            }
        }

        currentIndex = 0;

        if (!isReviewMode) {
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
        } else {
            document.getElementById('instructionsBox').style.display = 'none';
            document.getElementById('btnAddStep').style.display = 'none';
            document.getElementById('btnDeleteStep').style.display = 'none';
            evaluateExercises();
            enterReviewMode();
        }
    }

    function loadExercise(index) {
        currentIndex = index;
        const ex = examExercises[currentIndex];
        const total = examExercises.length;

        document.getElementById('exerciseCounter').textContent = `Ejercicio ${currentIndex + 1} / ${total}`;
        document.getElementById('targetNumDisplay').textContent = `Número: ${ex.number}`;

        if (isReviewMode) {
            document.getElementById('btnPrevEx').style.display = currentIndex > 0 ? 'inline-flex' : 'none';
            document.getElementById('btnNextEx').style.display = currentIndex < total - 1 ? 'inline-flex' : 'none';
            document.getElementById('btnNextEx').textContent = "Siguiente ➔";
        } else {
            document.getElementById('btnPrevEx').style.display = 'none';
            document.getElementById('btnNextEx').style.display = 'inline-flex';
            document.getElementById('btnNextEx').textContent =
                currentIndex === total - 1 ? "Finalizar y Corregir 🏁" : "Siguiente Número ➔";
        }

        renderBoard();
    }

    // --- 4. RENDERIZADO DEL LIENZO (CANVAS) ---
    function renderBoard() {
        canvas.clear();
        const ex = examExercises[currentIndex];
        const startY = 50;
        const lineHeight = 42;

        if (isReviewMode && !ex.isCorrect) {
            // Columna izquierda: respuesta incorrecta en rojo
            drawVerticalFactorization(
                140,
                startY,
                lineHeight,
                ex.number,
                ex.userSteps,
                RED_COLOR,
                "Tu Respuesta (Incorrecta)"
            );

            const middleDivider = new fabric.Line([275, 20, 275, 340], {
                stroke: '#cbd5e1',
                strokeWidth: 2,
                strokeDashArray: [6, 4],
                selectable: false,
                evented: false
            });
            canvas.add(middleDivider);

            const correctSteps = [];
            let tempNum = ex.number;
            ex.correctFactors.forEach(f => {
                tempNum /= f;
                correctSteps.push({ factor: f, quotient: tempNum });
            });

            // Columna derecha: factorización correcta en verde
            drawVerticalFactorization(
                410,
                startY,
                lineHeight,
                ex.number,
                correctSteps,
                GREEN_COLOR,
                "Factorización Correcta"
            );
        } else {
            // En modo revisión con respuesta correcta: todo en verde
            const reviewColor = isReviewMode ? GREEN_COLOR : null;
            const reviewTitle = isReviewMode ? "Respuesta Correcta" : null;

            drawVerticalFactorization(
                275,
                startY,
                lineHeight,
                ex.number,
                ex.userSteps,
                reviewColor,
                reviewTitle
            );

            const lastQuotient = ex.userSteps.length > 0
                ? ex.userSteps[ex.userSteps.length - 1].quotient
                : ex.number;

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

    function drawVerticalFactorization(centerX, startY, lineHeight, number, steps, highlightColor, titleHeader) {
        if (titleHeader) {
            const titleText = new fabric.Text(titleHeader, {
                left: centerX,
                top: 15,
                fontFamily: 'Segoe UI, sans-serif',
                fontSize: 15,
                fontWeight: 'bold',
                fill: highlightColor || GREEN_COLOR,
                originX: 'center',
                selectable: false,
                evented: false
            });
            canvas.add(titleText);
        }

        const maxRows = Math.max(steps.length + 1, 4);
        const line = new fabric.Line([centerX, startY - 10, centerX, startY + (maxRows * lineHeight)], {
            stroke: '#1e293b',
            strokeWidth: 3,
            selectable: false,
            evented: false
        });
        canvas.add(line);

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

        steps.forEach((step, i) => {
            const currentY = startY + (i * lineHeight);

            const factorText = new fabric.Text(step.factor.toString(), {
                left: centerX + 25,
                top: currentY,
                fontFamily: 'Segoe UI, sans-serif',
                fontSize: 24,
                fontWeight: 'bold',
                fill: isReviewMode ? (highlightColor || GREEN_COLOR) : '#3b82f6',
                originX: 'left',
                selectable: false,
                evented: false
            });
            canvas.add(factorText);

            const quotText = new fabric.Text(step.quotient.toString(), {
                left: centerX - 25,
                top: currentY + lineHeight,
                fontFamily: 'Segoe UI, sans-serif',
                fontSize: 24,
                fontWeight: 'bold',
                fill: isReviewMode ? (highlightColor || GREEN_COLOR) : '#8b5cf6',
                originX: 'right',
                selectable: false,
                evented: false
            });
            canvas.add(quotText);
        });
    }

    function syncInputValue() {
        if (hasInputs && inpTxt[currentIndex]) {
            inpTxt[currentIndex].value = JSON.stringify(examExercises[currentIndex].userSteps);
        }
    }

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

        const clearInterrogation = () => {
            if (box.text.includes('?')) {
                box.text = box.text.replace(/\?/g, '');
                canvas.renderAll();
            }
        };

        const restoreInterrogationIfNeeded = () => {
            const cleanText = box.text.replace(/\?/g, '').trim();
            if (cleanText === "") {
                box.text = '?';
                canvas.renderAll();
            }
        };

        box.on('editing:entered', clearInterrogation);
        box.on('selection:created', clearInterrogation);
        box.on('changed', clearInterrogation);
        box.on('editing:exited', restoreInterrogationIfNeeded);

        return box;
    }

    // --- 5. LÓGICA DE AÑADIR / BORRAR PASOS ---
    function handleAddStep(e) {
        if (e) e.preventDefault();
        if (isReviewMode || !activeFactorBox || !activeQuotientBox) return;

        const factorVal = parseInt(activeFactorBox.text.replace(/\?/g, '').trim(), 10);
        const quotientVal = parseInt(activeQuotientBox.text.replace(/\?/g, '').trim(), 10);

        if (isNaN(factorVal) || isNaN(quotientVal)) {
            alert("Por favor, escribe números válidos en ambas casillas antes de continuar.");
            return;
        }

        examExercises[currentIndex].userSteps.push({
            factor: factorVal,
            quotient: quotientVal
        });

        syncInputValue();
        renderBoard();
    }

    function handleDeleteStep(e) {
        if (e) e.preventDefault();
        if (isReviewMode) return;
        const ex = examExercises[currentIndex];
        if (ex.userSteps.length > 0) {
            ex.userSteps.pop();
            syncInputValue();
            renderBoard();
        }
    }

    // --- 6. NAVEGACIÓN Y EVALUACIÓN FINAL ---
    function handleNextExercise(e) {
        if (e) e.preventDefault();
        const total = examExercises.length;

        if (!isReviewMode) {
            if (activeFactorBox && activeQuotientBox) {
                const fVal = parseInt(activeFactorBox.text.replace(/\?/g, '').trim(), 10);
                const qVal = parseInt(activeQuotientBox.text.replace(/\?/g, '').trim(), 10);
                if (!isNaN(fVal) && !isNaN(qVal)) {
                    examExercises[currentIndex].userSteps.push({
                        factor: fVal,
                        quotient: qVal
                    });
                    syncInputValue();
                }
            }

            if (currentIndex < total - 1) {
                loadExercise(currentIndex + 1);
            } else {
                evaluateAndShowResults();
            }
        } else {
            if (currentIndex < total - 1) {
                loadExercise(currentIndex + 1);
            }
        }
    }

    function handlePrevExercise(e) {
        if (e) e.preventDefault();
        if (currentIndex > 0) {
            loadExercise(currentIndex - 1);
        }
    }

    function evaluateExercises() {
        examExercises.forEach(ex => {
            const target = ex.number;
            const steps = ex.userSteps;

            if (!steps || steps.length === 0) {
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
    }

    function evaluateAndShowResults(e) {
        if (e) e.preventDefault();
        evaluateExercises();
        showResultsSummary();
    }

    function showResultsSummary(e) {
        if (e) e.preventDefault();
        document.getElementById('examScreen').style.display = 'none';
        document.getElementById('resultsScreen').style.display = 'flex';

        const total = examExercises.length;
        const correctCount = examExercises.filter(item => item.isCorrect).length;
        const pct = total > 0 ? Math.round((correctCount / total) * 100) : 0;

        document.getElementById('finalScoreTitle').textContent =
            `Resultado: ${correctCount} de ${total} Correctos (${pct}%)`;

        const resultsGrid = document.getElementById('resultsGrid');
        resultsGrid.innerHTML = '';

        examExercises.forEach((ex, idx) => {
            const card = document.createElement('div');
            card.className = `result-card ${ex.isCorrect ? 'correct' : 'incorrect'}`;

            const userFactorsStr = ex.userSteps.map(s => s.factor).join(' × ') || 'Ninguna';
            const correctFactorsStr = ex.correctFactors.join(' × ');
            const correctPowerStr = formatPowers(ex.correctFactors);
            const userAnswerColor = ex.isCorrect ? GREEN_COLOR : 'inherit';

            card.innerHTML = `
                <div class="card-title-bar">
                    <strong>#${idx + 1}. Número: ${ex.number}</strong>
                    <span class="badge-status ${ex.isCorrect ? 'correct' : 'incorrect'}">
                        ${ex.isCorrect ? 'Correcto' : 'Incorrecto'}
                    </span>
                </div>
                <div class="factor-comparison">
                    <div style="color: ${userAnswerColor};"><b>Tu respuesta:</b> ${userFactorsStr}</div>
                    ${!ex.isCorrect ? `<div style="color: ${RED_COLOR}; font-size: 0.85rem; margin-top:2px;">⚠️ ${ex.errorMessage}</div>` : ''}
                    <div class="correct-ans" style="color: ${GREEN_COLOR}; margin-top: 4px;">
                        <b>Factorización Correcta:</b> ${correctFactorsStr} (${correctPowerStr})
                    </div>
                </div>
            `;

            resultsGrid.appendChild(card);
        });
    }

    function enterReviewMode(e) {
        if (e) e.preventDefault();
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
        if (!Number.isInteger(num) || num < 2) return false;
        for (let i = 2; i * i <= num; i++) {
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
