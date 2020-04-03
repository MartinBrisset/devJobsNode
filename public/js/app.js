document.addEventListener('DOMContentLoaded' , () => {
    const skills = document.querySelector('.lista-conocimientos');

    //limbiar las alertas iniciadas
    let alertas = document.querySelector('.alertas');
    if (alertas) {
        limpiarAlertas(alertas);
    }

    if (skills) {
        skills.addEventListener('click' , agregarSkills);

        //esta funcion se llama cuando estamos en la parte de editar
        skillsSeleccionados();
    }
})
//utilizamos set, funciona parecido a un array pero es mas facil de manipular[]
const skills = new Set();

const agregarSkills = (e) => {
    if (e.target.tagName === 'LI') {
        if (e.target.classList.contains('activo')) { //mira si tiene la clase activo
            //sacarle la clase y sacarlo del set
            skills.delete(e.target.textContent); //saca al set las que le di click sin repetirse
            e.target.classList.remove('activo'); //borra la clase activo
        } else {
            //agregarlo al set y agregar la clase     
            skills.add(e.target.textContent); //agrega al set las que le di click sin repetirse
            e.target.classList.add('activo'); //agrega la clase activo
        }
    }

    const skillsArray = [...skills] //convertir el set a un array para agregarlo al html
    document.querySelector('#skills').value = skillsArray;
}

const skillsSeleccionados = () => {
    //lee la clase del array de skills (activo) y genera un array para luego introducirlo en el html
    const seleccionadas = Array.from(document.querySelectorAll('.lista-conocimientos .activo')); //lee la la clase y generar el array

    //recorrer el array y llenar el set
    seleccionadas.forEach(seleccionada => {
        skills.add(seleccionada.textContent);
    })

    //inyectarlo en el html hidden
    const skillsArray = [...skills] //convertir el set a un array para agregarlo al html
    document.querySelector('#skills').value = skillsArray;

}

const limpiarAlertas = (alertas) => {

    const interval = setInterval(() => {
        if (alertas.children.length > 0) {
            alertas.removeChild(alertas.children[0]);
        } else if (alertas.children.length === 0) {
            alertas.parentElement.removeChild(alertas);
            clearInterval(interval);
        }
    }, 2000);

    
}