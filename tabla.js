    function creaTabla(verSimbolo, verBotones,  numeroZ, canvasName) {
        var nomCanvas = [];
        var nomInput = [];
        var inpTxt = jQuery("input[type='text']")[0];
        var canvas1 = new fabric.Canvas(canvasName);
        results1 = document.getElementById('results-'+canvasName);
        var modeReview = false;
        //if ($("[name='" + inpTxt.name + "']").attr("readonly") !== undefined) {
        //    modeReview = true;
        //}

        var numeroZ2 = numeroZ;
        numeroZ2--;
        var sumar = false;
        var car = 0;
        var valorAnt = 0;
        var valor = 0;
        var sumando = false;
        var respuesta = 'La respuesta es:';
        var userAns = '';
        var texto = '';
        const LE=55;
        var esSubIndex = false;
        var pulsacion = [],
            pulsacion2 = [];
        var arriba = 30,
            izquierda = 200;
        canvas1.selection = false;
        if (verBotones==true){        
            var izqda = 300;
            var altura = 425;
            var simbolos = ["1", "2", "3", "4", "5", "6", "7", "←"];
            var posicion4 = [];
            var pos = [
                [izqda, altura - LE],
                [izqda  + LE, altura - LE],
                [izqda  + LE * 2, altura - LE],
                [izqda  + LE * 3, altura - LE],
                [izqda  + LE * 4, altura - LE],
                [izqda  + LE * 5, altura - LE],
                [izqda  + LE * 6, altura - LE],
                [izqda  + LE * 7, altura - LE],
                [izqda  + LE * 8, altura - LE]
            ];
            for (var b = 1; b < 9; b++) {
                simbolo = simbolos[b - 1];
                CrearBotones(b, 'beige', b);
            }
            izqda = 355;
            altura = 480;
            var pos = [
                [izqda, altura - LE],
                [izqda  + LE, altura - LE],
                [izqda  + LE * 2, altura - LE],
                [izqda  + LE * 3, altura - LE],
                [izqda  + LE * 4, altura - LE],
                [izqda  + LE * 5, altura - LE],
                [izqda  + LE * 6, altura - LE],
                [izqda  + LE * 7, altura - LE],
                [izqda  + LE * 8, altura - LE]
            ];
            var simbolos = ["s", "p", "d", "f"];
            for (var b = 1; b < 5; b++) {
                simbolo = simbolos[b - 1];
                CrearBotones(b, 'khaki', b + 8);
            }
            var simbolos = ["1", "2", "3", "4", "5", "6", "7", "8", "9", "10"];
            izqda = 245;
            altura = 535;
            var pos = [
                [izqda, altura - LE],
                [izqda  + LE, altura - LE],
                [izqda  + LE * 2, altura - LE],
                [izqda  + LE * 3, altura - LE],
                [izqda  + LE * 4, altura - LE],
                [izqda  + LE * 5, altura - LE],
                [izqda  + LE * 6, altura - LE],
                [izqda  + LE * 7, altura - LE],
                [izqda  + LE * 8, altura - LE],
                [izqda  + LE * 9, altura - LE]
            ];
            for (var b = 1; b < 11; b++) {
                simbolo = simbolos[b - 1];
                CrearBotones(b, 'LightSteelBlue', b + 12);
            }
        }
        for (var a = 1; a < 89; a++) {
            CrearElemento(a);
        }
        canvas1.renderAll();

        function borrar() {
            if (pulsacion2.length > 0) {
                var objs = canvas1._objects;
                canvas1.remove(objs[objs.length - 1]);
                izquierda = posicion4[posicion4.length - 1];
                posicion4.pop();
                pulsacion2.pop();
                userAns = "";
                for (var a = 0; a < pulsacion2.length; a++) {
                    userAns += pulsacion2[a];
                }
                //document.getElementById('formula').innerHTML = userAns; //añadir con moodle
            }
        };

        function CrearBotones(num, color, numList) {

            num--;
            if (modeReview != true) {
                var txt = new fabric.Text(simbolo, {
                    originX: 'center',
                    originY: 'center',
                    stroke: 'saddlebrown',
                    strokeUniform: true,
                    fontFamily: 'Computer Modern',
                    fontStyle: 'oblique',
                    fontSize: 26
                });
                const rectang = new fabric.Rect({
                    originX: 'center',
                    originY: 'center',
                    width: LE-0.1*LE,
                    height: LE-0.1*LE,
                    cornerStyle: 'circle',
                    rx: 10,
                    ry: 10,
                    stroke: 'saddlebrown',
                    strokeWidth: 3,
                    fill: color
                });
                var group2 = new fabric.Group([rectang, txt], {
                    left: pos[num][0],
                    top: pos[num][1],
                    tex2: simbolos[num],
                    orden: numList
                });

                canvas1.add(group2);
                group2.lockRotation = true;
                group2.lockScalingFlip = true;
                group2.lockScalingX = true;
                group2.lockScalingX = true;
                group2.lockMovementX = true;
                group2.lockMovementY = true;
                group2.hasBorders = false;
                group2.setControlsVisibility({
                    mt: false,
                    mb: false,
                    ml: false,
                    mr: false,
                    bl: false,
                    br: false,
                    tl: false,
                    tr: false,
                    mtr: false
                });
                group2.objectCaching = false;

                group2.on('mousedown', anade2);


                function anade2() {
                    valor = group2.tex2;
                    sumando = false;
                    if (group2.orden > 12) {

                        if (sumar = true) {
                            car++;
                            valor = parseInt(valor) + parseInt(valorAnt);
                            valorAnt = valor;
                            if (car > 1) {
                                sumando = true;
                                borrar()
                            }

                        }
                        var prev = '<sup>';
                        var post = '</sup>';
                        var prev2 = '^{';
                        var post2 = '}';
                        sumar = true;
                    } else {
                        valorAnt = 0;
                        sumar = false;
                        car = 0;
                    }
                    if (group2.orden <= 12 && group2.orden != 8) {
                        prev = '';
                        post = '';
                        prev2 = '';
                        post2 = '';
                    }
                    if (group2.orden == 8) {
                        borrar()
                    } else {

                        texto = texto + prev + valor + post;
                        userAns = userAns + prev2 + valor + post2;
                        pulsacion.push(prev + valor + post);
                        pulsacion2.push(prev2 + valor + post2);
                        //inpTxt.value = userAns; //añadir con moodle
                        var tamano = 26,
                            offset = 0;
                        if (group2.orden > 11) {
                            tamano = 22;
                            offset = -10;
                        }

                        if (sumar) {
                            valor = valor.toString();
                        }
                        var txt = new fabric.Text(valor, {
                            top: arriba + offset,
                            left: izquierda,
                            originX: 'left',
                            originY: 'center',
                            stroke: 'black',
                            strokeUniform: true,
                            fontFamily: 'Computer Modern',
                            fontStyle: 'oblique',
                            fontWeight: 'bold',
                            fontSize: tamano
                        });
                        canvas1.add(txt);
                        posicion4.push(izquierda);
                        izquierda = izquierda + txt.width;
                        if (num = 7) {
                            izquierda = izquierda + 5;
                        }
                    };
                }
            }
        }

        function CrearElemento(Z) {
            const colorH = 'darkorchid';
            const colorHe = 'cyan';
            const colorLi = 'orange';
            const colorB = 'green';
            const colorF = 'pink';
            const colorC = 'purple';
            const colorBe = 'moccasin';
            const colorAl = '#daf87d';
            const colorSc = '#ffff00';
            const izqda = 10;
            const altura = 10;


            var simbolos = ["H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne", "Na", "Mg", "Al", "Si", "P", "S", "Cl", "Ar", "K", "Ca", "Sc", "Ti", "V", "Cr", "Mn", "Fe", "Co", "Ni", "Cu", "Zn", "Ga", "Ge", "As", "Se", "Br", "Kr", "Rb", "Sr", "Y", "Zr", "Nb", "Mo", "Tc", "Ru", "Rh", "Pd", "Ag", "Cd", "In", "Sn", "Sb", "Te", "I", "Xe", "Cs", "Ba", "La", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "Hf", "Ta", "W", "Re", "Os", "Ir", "Pt", "Au", "Hg", "Tl", "Pb", "Bi", "Po", "At", "Rn", "Fr", "Ra", "Ac", "", "", ""];
            var eValencia = [1, 2, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 3, 4, 5, 6, 7, 8, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 4, 5, 6, 7, 8, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 1, 2, 3, 4, 5, 6, 7];
            var pos = [
                [izqda, altura],
                [LE * 17 + izqda, altura],
                [izqda, altura + LE],
                [izqda  + LE, altura + LE],
                [LE * 12 + izqda, altura + LE],
                [LE * 13 + izqda, altura + LE],
                [LE * 14 + izqda, altura + LE],
                [LE * 15 + izqda, altura + LE],
                [LE * 16 + izqda, altura + LE],
                [LE * 17 + izqda, altura + LE],
                [izqda, altura + LE * 2],
                [izqda  + LE, altura + LE * 2],
                [LE * 12 + izqda, altura + LE * 2],
                [LE * 13 + izqda, altura + LE * 2],
                [LE * 14 + izqda, altura + LE * 2],
                [LE * 15 + izqda, altura + LE * 2],
                [LE * 16 + izqda, altura + LE * 2],
                [LE * 17 + izqda, altura + LE * 2],
                [izqda, altura + LE * 3],
                [izqda  + LE, altura + LE * 3],
                [LE * 2 + izqda, altura + LE * 3],
                [LE * 3 + izqda, altura + LE * 3],
                [LE * 4 + izqda, altura + LE * 3],
                [LE * 5 + izqda, altura + LE * 3],
                [LE * 6 + izqda, altura + LE * 3],
                [LE * 7 + izqda, altura + LE * 3],
                [LE * 8 + izqda, altura + LE * 3],
                [LE * 9 + izqda, altura + LE * 3],
                [LE * 10 + izqda, altura + LE * 3],
                [LE * 11 + izqda, altura + LE * 3],
                [LE * 12 + izqda, altura + LE * 3],
                [LE * 13 + izqda, altura + LE * 3],
                [LE * 14 + izqda, altura + LE * 3],
                [LE * 15 + izqda, altura + LE * 3],
                [LE * 16 + izqda, altura + LE * 3],
                [LE * 17 + izqda, altura + LE * 3],
                [izqda, altura + LE * 4],
                [izqda  + LE, altura + LE * 4],
                [LE * 2 + izqda, altura + LE * 4],
                [LE * 3 + izqda, altura + LE * 4],
                [LE * 4 + izqda, altura + LE * 4],
                [LE * 5 + izqda, altura + LE * 4],
                [LE * 6 + izqda, altura + LE * 4],
                [LE * 7 + izqda, altura + LE * 4],
                [LE * 8 + izqda, altura + LE * 4],
                [LE * 9 + izqda, altura + LE * 4],
                [LE * 10 + izqda, altura + LE * 4],
                [LE * 11 + izqda, altura + LE * 4],
                [LE * 12 + izqda, altura + LE * 4],
                [LE * 13 + izqda, altura + LE * 4],
                [LE * 14 + izqda, altura + LE * 4],
                [LE * 15 + izqda, altura + LE * 4],
                [LE * 16 + izqda, altura + LE * 4],
                [LE * 17 + izqda, altura + LE * 4],
                [izqda, altura + LE * 5],
                [izqda  + LE, altura + LE * 5],
                [LE * 2 + izqda, altura + LE * 5],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [],
                [LE * 3 + izqda, altura + LE * 5],
                [LE * 4 + izqda, altura + LE * 5],
                [LE * 5 + izqda, altura + LE * 5],
                [LE * 6 + izqda, altura + LE * 5],
                [LE * 7 + izqda, altura + LE * 5],
                [LE * 8 + izqda, altura + LE * 5],
                [LE * 9 + izqda, altura + LE * 5],
                [LE * 10 + izqda, altura + LE * 5],
                [LE * 11 + izqda, altura + LE * 5],
                [LE * 12 + izqda, altura + LE * 5],
                [LE * 13 + izqda, altura + LE * 5],
                [LE * 14 + izqda, altura + LE * 5],
                [LE * 15 + izqda, altura + LE * 5],
                [LE * 16 + izqda, altura + LE * 5],
                [LE * 17 + izqda, altura + LE * 5],
                [izqda, altura + LE * 6],
                [izqda  + LE, altura + LE * 6]
            ];

            var colores = [colorH, colorHe, colorLi, colorBe, colorB, colorC, colorC, colorC, colorF, colorHe, colorLi, colorBe, colorAl, colorB, colorC, colorC, colorF, colorHe, colorLi, colorBe, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorAl, colorB, colorB, colorC, colorF, colorHe, colorLi, colorBe, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorAl, colorAl, colorB, colorB, colorF, colorHe, colorLi, colorBe, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorSc, colorAl, colorAl, colorAl, colorB, colorF, colorHe, colorLi, colorBe, colorSc, colorSc, colorSc, colorSc];
            Z--;
            simbolo = simbolos[Z];
            numElec = eValencia[Z];
            electrones = [];
            if (verSimbolo!==true) {simbolo = "";}
            //simbolo = "";
            var txt = new fabric.Text(simbolo, {
                originX: 'center',
                originY: 'center',
                stroke: 'black',
                strokeUniform: true,
                fontFamily: 'Computer Modern',
                fontStyle: 'oblique',
                fontWeight: 'bold',
                fontSize: 26
            });
            const rectang = new fabric.Rect({
                originX: 'center',
                originY: 'center',
                width: LE-0.1*LE,
                height: LE-0.1*LE,
                fill: colores[Z]
            });
            var colorFil = 'black';
            var encuadrado = false;
            if (numeroZ2 == Z) {
                colorFil = 'red';
                encuadrado = true;
            }
            if (encuadrado) {
                const encuadra = new fabric.Rect({
                    originX: 'center',
                    originY: 'center',
                    width: LE,
                    height: LE,
                    fill: colorFil
                });
                encuadrado = false;
                var group = new fabric.Group([rectang, encuadra, txt], {
                    left: pos[Z][0] - 2.5,
                    top: pos[Z][1] - 2.5
                });
            } else {
                var group = new fabric.Group([rectang, txt], {
                    left: pos[Z][0],
                    top: pos[Z][1],
                    Natomico: Z + 1
                });
            }

            canvas1.add(group);

            group.lockRotation = true;
            group.lockScalingFlip = true;
            group.lockScalingX = true;
            group.lockScalingX = true;
            group.lockMovementX = true;
            group.lockMovementY = true;
            group.hasBorders = false;
            group.setControlsVisibility({
                mt: false,
                mb: false,
                ml: false,
                mr: false,
                bl: false,
                br: false,
                tl: false,
                tr: false,
                mtr: false
            });
            group.objectCaching = false;

            function anade() {
                texto = texto + simbolos[group.Natomico - 1];
                userAns = userAns + simbolos[group.Natomico - 1];
                pulsacion.push(simbolos[group.Natomico - 1]);
                pulsacion2.push(simbolos[group.Natomico - 1]);
                document.getElementById('formula').innerHTML = texto;
                var txt = new fabric.Text(simbolos[group.Natomico - 1], {
                    top: arriba,
                    left: izquierda,
                    originX: 'center',
                    originY: 'center',
                    stroke: 'black',
                    strokeUniform: true,
                    fontFamily: 'Computer Modern',
                    fontStyle: 'oblique',
                    fontWeight: 'bold',
                    fontSize: 26
                });
                canvas1.add(txt);
                izquierda = izquierda + txt.width;
            };
        }
function resizeCanvas() {
  // 1. Obtener el ancho del contenedor (o ventana)
  //const containerWidth = window.innerWidth;
  
  // 2. Calcular la escala (proporción)
  const scale = canvas1.width / 1000;

  // 3. Ajustar tamaño del lienzo de Fabric
  //canvas1.setDimensions({
  //  width: 920 * scale,
  //  height: 560 * scale
  //});

  // 4. Aplicar zoom al contenido
  canvas1.setZoom(scale);
  canvas1.renderAll();
}

// Escuchar el evento de cambio de tamaño
window.addEventListener('resize', resizeCanvas);

// Llamar al inicio para ajustar al cargar la página
resizeCanvas();
    };
