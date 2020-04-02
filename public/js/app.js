document.addEventListener('DOMContentLoaded' , () => {
    const skills = document.querySelector('.lista-conocimientos');

    if (skills) {
        skills.addEventListener('click' , agregarSkills);
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