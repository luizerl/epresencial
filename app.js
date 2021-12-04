const getData = () => {
    const input = document.querySelector('input');
    const submit = document.querySelector('button');
    const departamento = document.getElementById('department');
    const modalidade = document.getElementById('modality');
    let arrDepartamento = [], arrModalidade = [];
    let count = 0;

    axios.get('./api.json').then(res =>{
        const {data} = res.data;
        for (let dat of data){
            const {disciplina, codigo, turma, presencial} = dat;
            
            arrDepartamento.push(getDepartment(codigo));
            arrModalidade.push(presencial);
            buildWrap(disciplina, codigo, turma, presencial);
        }

        arrDepartamento = removeDuplicate(arrDepartamento);
        arrDepartamento.forEach( itm => {
            buildOption(itm, 'department');
        })

        arrModalidade = removeDuplicate(arrModalidade);
        arrModalidade.forEach( itm => {
            buildOption(itm, 'modality');
        })

    });
    

   

    submit.addEventListener('click', (e) => {
        e.preventDefault();

        const disciplinas = [...document.querySelectorAll('.disciplina')];
        const codigo = [...document.querySelectorAll('.codigo')];
        const el = input.value;
        
        count++;

        if (count != 0){
            [...document.querySelectorAll('.visible')].forEach( i => { 
                i.classList.remove('visible');
            });

            
        }
        
        
        searchOption(departamento, modalidade, disciplinas, el);
        searchOption(departamento, modalidade, codigo, el);
        searchOption(modalidade, departamento, disciplinas ,el);
        searchOption(modalidade, departamento, codigo ,el);
        
        addClass(disciplinas, el);
        addClass(codigo, el);
        input.value = '';
        
    });
};

function searchOption (select){
    const firstSelect = [...document.getElementsByClassName(select.value)];
    let [option] = [...select.selectedOptions]
    let [secondSelect] = [...arguments[1].selectedOptions]
    let input = arguments[2];
    
    option = option.innerText.toLocaleLowerCase();

    firstSelect.forEach( itm => {
        if (itm.innerText.toLocaleLowerCase().includes(option)){
            const p = [...itm.parentElement.getElementsByClassName(secondSelect.value)];
          
            if (!secondSelect.innerText.includes('Escolha')){
               p.forEach( itm => {
                    if (itm.innerText.includes(secondSelect.innerText)){
                        itm.parentElement.classList.add('visible');
                    } 
                });
            }
    
            else{
                itm.parentElement.classList.add('visible');
            } 
        }
    });

}


function addClass (array, el){
    
    array.filter( i => { 
        if ( !el ) return false;
        else if (i.innerText.toLocaleLowerCase().startsWith(el.toLocaleLowerCase())){
            i.parentElement.classList.add('visible');
        }
    });
}


function buildWrap(d, c, t , p){
    const wrap = document.createElement('div');
    const disciplina = document.createElement('p');
    const codigo = document.createElement('p');
    const turma = document.createElement('p');
    const presencial = document.createElement('p');
    
    disciplina.className = 'disciplina';
    codigo.className = 'codigo';
    turma.className = 'turma';
    presencial.className = 'presencial';

    disciplina.innerText = d;
    codigo.innerText =c;
    turma.innerText = 'Turma: ' + t;
    presencial.innerText = 'Modalidade: ' + p;

    wrap.appendChild(disciplina);
    wrap.appendChild(codigo);
    wrap.appendChild(turma);
    wrap.appendChild(presencial);
    
    document.querySelector('.container').appendChild(wrap);
}


function buildOption (code, id) {
    const select = document.getElementById(id);
    const option = document. createElement('option');

    option.value = select.value;
    option.innerText = code;

    select.append(option);
}

function getDepartment (string){
    const code = string.split('');
    const department = [];

    for (letter of code){
        if ( !Number(letter) && letter !== '0' ){
            department.push(letter)
        }
    }
    return department.join('');
}

function removeDuplicate (arr){
    const newArr = [];

    for (let itm of arr){
        if ( !newArr.includes(itm) ){
            newArr.push(itm.toLocaleUpperCase());
        }
    }

    newArr.sort()

    if (newArr.length !== arr.length){
        return newArr;
    } else{
        return removeDuplicate(newArr);
    }
}

getData();