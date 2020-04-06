import axios from 'axios';
import Swal from 'sweetalert2';

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

    const vacantesListado = document.querySelector('.panel-administracion');
    if (vacantesListado) {
        vacantesListado.addEventListener('click', accionesListado);
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

//elimiar vacantes
const accionesListado = (e) => {
    e.preventDefault();
    
    if (e.target.dataset.eliminar) {
        //ei tocas el boton, eliminar por medio de axios
        Swal.fire({
            title: '¿Confirmar Eliminación?',
            text: "Una vez eliminada, no se puede recuperar",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonColor: '#3085d6',
            cancelButtonColor: '#d33',
            confirmButtonText: 'Si, Eliminar',
            cancelButtonText : 'No, Cancelar'
        }).then((result) => {
            if (result.value) {
                //enviar peticion con axios para elimar
                const url = `${location.origin}/vacantes/eliminar/${e.target.dataset.eliminar}`;
                //lo que hace esto es, leer la url actual y le agrega la ruta con el id para luego ponerselo a la accion de axios.activo
                //el id lo toma de e.target.dataset.eliminar que es la parte de html que tiene el boton
                
                //axios para hacer la peticin http y elimnar el registro

                axios.delete(url)
                    .then(function(respuesta) {
                        if (respuesta.status === 200) {
                            Swal.fire(
                                'Eliminado',
                                respuesta.data,
                                'success'
                            );
                            //elimar del dom
                            e.target.parentElement.parentElement.parentElement.removeChild(e.target.parentElement.parentElement);
                            //primero navega hacia atras hasta llegar al div panel-administracion
                            //despues con removeChild borra los hijos de esta clase
                            //pasandole el parentElement 2 veces, borra sus 2 hijos. las divs
                        }
                    }).catch(() => {
                        Swal.fire({
                            icon: 'error',
                            title: 'Hubo un error',
                            text: 'No puedes elimar una vacante que tu no creaste'
                        })
                    })
                    
            }
          })
    } else if (e.target.tagName === 'A'){ //si tiene enlace, sino no (a href) 
        //si tocas los otros botones, le haces caso al href que tienen
        window.location.href = e.target.href;
    }
}