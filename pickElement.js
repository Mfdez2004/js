        function pickElement(A, Z, carga, simbolo, canvas) {
            // Initiate a Canvas instance  
            var canvas1 = new fabric.Canvas(canvas);

            //var simbolo = eval('{#simbolo#}');
            //var Z = eval('{#Z#}');
            //var A = eval('{#A#}');
            //var carga = eval('{#cargaEl#}');
            var cargaTxt = "";
            switch (carga) {
                case 0:
                    cargaTxt = "";
                    break;
                case 1:
                    cargaTxt = "+";
                    break;
                case -1:
                    cargaTxt = "-";
                    break;
                default:
                    cargaAbs = Math.abs(carga);
                    cargaTxt = cargaAbs.toString();
                    if (carga < 0) {
                        cargaTxt = cargaTxt + "-"
                    };
                    if (carga > 0) {
                        cargaTxt = cargaTxt + "+"
                    }
                    break;
            }

            var altura = canvas1.height;
            var anchura = canvas1.width;
            var anchoLinea = 3;
            // Initiate a Rect instance
            const orX = 25;
            const orY = 100;
            const txtSymbol = new fabric.Text(simbolo, {
                originX: 'center',
                originY: 'center',
                left: 0.5 * anchura,
                top: 0.5 * altura,
                stroke: 'black',
                fill: 'darkGreen',
                strokeUniform: true,
                fontFamily: 'Computer Modern',
                fontStyle: 'oblique',
                fontWeight: 'bold',
                fontSize: 90,
                "selectable": false
            });
            var symbHeight = txtSymbol.height;
            var symbWidth = txtSymbol.width;

            var rec = new fabric.Rect({
                top: 0,
                left: 0,
                width: anchura - anchoLinea,
                height: altura - anchoLinea,
                fill: 'PeachPuff',
                stroke: '#993300',
                strokeWidth: anchoLinea,
                "selectable": false,
                rx: 30, // Radio de redondeo horizontal
                ry: 30
            });
            const txtA = new fabric.Text(A.toString(), {
                originX: 'right',
                originY: 'center',
                left: txtSymbol.left - txtSymbol.width / 2,
                top: txtSymbol.top - 40,
                stroke: 'black',
                fill: 'red',
                strokeUniform: false,
                fontFamily: 'Computer Modern',
                fontStyle: 'oblique',
                fontWeight: 'bold',
                fontSize: 30,
                "selectable": false
            });
            const txtZ = new fabric.Text(Z.toString(), {
                originX: 'right',
                originY: 'center',
                left: txtSymbol.left - txtSymbol.width / 2 - 4,
                top: 130,
                stroke: 'black',
                fill: 'blue',
                strokeUniform: false,
                fontFamily: 'Computer Modern',
                fontStyle: 'oblique',
                fontWeight: 'bold',
                fontSize: 30,
                "selectable": false
            });
            const txtCarga = new fabric.Text(cargaTxt, {
                originX: 'left',
                originY: 'center',
                left: txtSymbol.left + txtSymbol.width / 2 + 10,
                top: txtSymbol.top - 40,
                fill: 'purple',
                stroke: 'black',
                strokeUniform: false,
                fontFamily: 'Symbol',
                fontStyle: 'oblique',
                fontWeight: 'bold',
                fontSize: 40,
                "selectable": false
            });
            canvas1.add(rec, txtSymbol, txtA, txtZ, txtCarga);
            //this.__canvases.push(canvas1);
        }
