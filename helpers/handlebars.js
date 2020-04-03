module.exports = {
    seleccionarSkills : (seleccionadas = [], opciones) => {
        const skills = ['HTML5', 'CSS3', 'CSSGrid', 'Flexbox', 'JavaScript', 'jQuery', 'Node', 'Angular', 'VueJS', 'ReactJS', 'React Hooks', 'Redux', 'Apollo', 'GraphQL', 'TypeScript', 'PHP', 'Laravel', 'Symfony', 'Python', 'Django', 'ORM', 'Sequelize', 'Mongoose', 'SQL', 'MVC', 'SASS', 'WordPress', 'MongoDB'];

        let html = '';
        skills.forEach(skill => {
            html += `
                <li ${seleccionadas.includes(skill) ? 'class="activo"' : ""}>${skill}</li>
            `;
        });

        // <li ${seleccionadas.includes(skill) ? 'class="activo"' : ""}>${skill}</li>
        // Es un if que al silicitar la lista, se fija si la skill esta seleccionada y le agrega la clase, sino la quita. Y ahi te devuelve un array con todos los skills pero cada uno con su clase correspondiente.
        // Si no tiene ninguna seleccionada, arranca como un array vacio. Las opciones son lo que recive del front. Bastante tramboliko todo esto


        return opciones.fn().html = html;
    },
    tipoContrato: (seleccionado, opciones) => {
        return opciones.fn(this).replace(
            new RegExp(`value="${seleccionado}"`),'$% selected="selected"'
        )
    },
    mostrarAlertas: (errores = {}, alertas) => {
        const categoria = Object.keys(errores);
        
        let html = '';
        if (categoria.length) {
            errores[categoria].forEach(error => {
                html += `
                <div class="${categoria} alerta">
                    ${error}
                </div>
                `;
            })
        }
        return alertas.fn().html = html;
    }
}