    (function (){
    

        const form = document.querySelector('#formulario')

        document.addEventListener('DOMContentLoaded',()=>{

            connectDB();
            form.addEventListener('submit',validateClient)
        })

        function connectDB() {
            const openConnection = window.indexedDB.open('crm',1)

            openConnection.onerror = function () {
                console.log('There was an error');
            }

            openConnection.onsuccess = function(){
                DB = openConnection.result
            }
        }

        function validateClient(e) {
            e.preventDefault()
            
            const name = document.querySelector('#nombre').value
            const email = document.querySelector('#email').value
            const phone = document.querySelector('#telefono').value
            const company = document.querySelector('#empresa').value

            if(name === ''||email === ''||phone === ''||company=== ''){
                showAlert('All fields are required','error')
                return;
            }

            const client = {
                name,
                email,
                phone,
                company,
                id: Date.now()
            }

            createNewClient(client);
        }

        function createNewClient(client) {
            const transaction = DB.transaction(['crm'],'readwrite')
            const objectStore = transaction.objectStore('crm')
            objectStore.add(client)
        
            transaction.onerror=function () {
                showAlert('This email already exists','error');
            }

            transaction.oncomplete = function () {
                showAlert('Client Added');
                setTimeout(() => {
                    window.location.href = 'index.html'
                }, 3000);
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