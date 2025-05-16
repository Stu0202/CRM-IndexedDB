(function (){
    const nameInput = document.querySelector('#nombre')
    const emailInput = document.querySelector('#email')
    const phoneInput = document.querySelector('#telefono')
    const companyInput = document.querySelector('#empresa')
    const form = document.querySelector('#formulario')
    let DB;
    let clientID;

    document.addEventListener('DOMContentLoaded',()=> {
        connectDB();
        form.addEventListener('submit',updateClient)


        const URLparameters = new URLSearchParams(window.location.search)
        
        clientID = URLparameters.get('id')
        if(clientID){
            setTimeout(() => {
                getClient(clientID);
            }, 100);
            
        }
    })

    function updateClient(e) {
        e.preventDefault();

        if(nameInput.value===''|| emailInput === '' || phoneInput ===''||companyInput===''){
            showAlert('All fields are required','error')
            return;
            
        }

        const clientUpdated = {
            name: nameInput.value,
            email: emailInput.value,
            phone: phoneInput.value,
            company: companyInput.value,
            id: Number(clientID)
        }
        const transaction = DB.transaction(['crm'],'readwrite')
        const objectStore = transaction.objectStore('crm')

        objectStore.put(clientUpdated)

        transaction.oncomplete = function(){
            showAlert('Client Updated successfully')
            setTimeout(() => {
                window.location.href = 'index.html'
            }, 3000);
        }

        transaction.onerror = function(error){
           
            showAlert('There was an error','error')
        }
    }

    function getClient(id) {
       const transaction = DB.transaction(['crm'],'readwrite')
       const objectStore = transaction.objectStore('crm');
       const client = objectStore.openCursor();

       client.onsuccess = function(e){
        const cursor = e.target.result;
        if(cursor){
            if(cursor.value.id === Number(id)){
               fillForm(cursor.value);
            }
            cursor.continue();
        }
       }
       
    }

    function fillForm(clientData){
        const {name,email,phone,company} = clientData;
        nameInput.value =name 
        emailInput.value =email 
        phoneInput.value =phone 
        companyInput.value =company 
    }

    function connectDB() {
        const openConnection = window.indexedDB.open('crm',1)

            openConnection.onerror = function () {
                console.log('There was an error');
            }

            openConnection.onsuccess = function(){
                DB = openConnection.result
            }
    }

    function showAlert(message,type) {
            const alert = document.querySelector('.alert')
            if(!alert){
                const divMessage = document.createElement('DIV')
                divMessage.classList.add('px-4','py-4','rounded','max-w-lg','mx-auto','mt-6','text-center','border','alert')
                if(type==='error'){
                    divMessage.classList.add('bg-red-100','border-red-400','text-red-700')
                }else{
                    divMessage.classList.add('bg-green-100','border-green-400','text-green-700')
                }

                divMessage.textContent = message;

                form.appendChild(divMessage)

                setTimeout(() => {
                    divMessage.remove()
                }, 3000);
            }
            
        }
})();