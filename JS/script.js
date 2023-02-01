var datos = {}

function titleCase(string){
    return string[0].toUpperCase() + string.slice(1).toLowerCase()
}

async function getData() {
    const promise = fetch('https://api.jsonbin.io/v3/b/63cf4bfcace6f33a22c69438?meta=false')
        .then((response) => response.json())
        .then((data) => datos = data);
    
    return promise
}

async function createProductos() {
    let productosContainer = $('.productos')
    $.each(datos.productos, (key, value) => {
        productosContainer.append(`
            <div class="form-check">
                <input class="form-check-input" value="${key}" type="radio" name="radioProducto" id="radioProducto${titleCase(key)}">
                <label class="form-check-label" for="radioProducto${titleCase(key)}">
                    ${titleCase(key)}: $${value.precio}
                </label>
            </div>`
        )
    });
}

async function createTarjetas() {
    let tarjetasContainer = $('.tarjetas')
    $.each(datos.tarjetas, (key, value) => {
        tarjetasContainer.append(`
            <div class="form-check">
                <input class="form-check-input" value="${key}"  type="radio" name="radioTarjeta" id="radioTarjeta${titleCase(key)}">
                <label class="form-check-label" for="radioTarjeta${titleCase(key)}">
                    ${titleCase(key.toUpperCase())}
                </label>
            </div>`
        )
    });
}

async function createCuotas() {
    let cuotasContainer = $('.cuotas')
    $.each(datos.cuotas, (key, value) => {
        cuotasContainer.append(`
            <div class="form-check">
                <input class="form-check-input" value="${value}" type="radio" name="radioCuotas" id="radioCuotas${value}">
                <label class="form-check-label" for="radioCuotas${value}">
                    ${value}
                </label>
            </div>`
        )
    });
}

function onClickProductoRadio(elemento) {
    const tipo = elemento.value
    const precio = datos['productos'][tipo]['precio']

    localStorage.setItem('precioProductoSeleccionado', precio)
}

function onClickTarjetaRadio(elemento) {
    const tipo = elemento.value
    localStorage.setItem('tarjetaSeleccionada', tipo)
}

function onClickCuotasRadio(elemento) {
    const cuotas = elemento.value
    const tarjeta = localStorage.getItem('tarjetaSeleccionada')
    const coeficienteDeInteres = datos['tarjetas'][tarjeta]['cuotas'][cuotas]['coeficienteDeInteres']
    localStorage.setItem('coeficienteDeInteresSeleccionado', coeficienteDeInteres)
}

function onClickJubiladoRadio(elemento) {
    const esJubilado = elemento.value === 'true'
    localStorage.setItem('esJubilado', esJubilado)
}

function onClickCalcularButton() {
    const precioProducto = parseFloat(localStorage.getItem('precioProductoSeleccionado'))
    const coeficiente = parseFloat(localStorage.getItem('coeficienteDeInteresSeleccionado'))
    const esJubilado = localStorage.getItem('esJubilado') === 'true'

    let valorFinal = precioProducto + precioProducto * coeficiente

    if (esJubilado) {
        valorFinal *= 1 - 0.15
    }

    const inputValorFinal = document.getElementById('valorFinalInput')
    inputValorFinal.setAttribute('value', `$${valorFinal}`)
}

(async () => {
    await getData()
    await createProductos()
    await createTarjetas()
    await createCuotas()

    document.getElementsByName('radioProducto').forEach((el) => el.addEventListener('click', () => { onClickProductoRadio(el)}))
    document.getElementsByName('radioTarjeta').forEach((el) => el.addEventListener('click', () => { onClickTarjetaRadio(el)}))
    document.getElementsByName('radioCuotas').forEach((el) => el.addEventListener('click', () => { onClickCuotasRadio(el) }))
    document.getElementsByName('radioJubilado').forEach((el) => el.addEventListener('click', () => { onClickJubiladoRadio(el)}))
    document.getElementById('calcularButton').addEventListener('click', onClickCalcularButton)
})();
