(function (){
    const nameInput = document.querySelector('#nombre')
    let DB;
    document.addEventListener('DOMContentLoaded',()=> {
        connectDB();
        const URLparameters = new URLSearchParams(window.location.search)
        
        const clientID = URLparameters.get('id')
        if(clientID){
            setTimeout(() => {
                getClient(clientID);
            }, 100);
            
        }
    })

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
        const {name} = clientData;
        nameInput.value =name 
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
})();