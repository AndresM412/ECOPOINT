document.addEventListener('DOMContentLoaded', () => {
    let db;
    const request = indexedDB.open('EcopointDB', 1);

    request.onerror = function(event) {
        console.error('Database error:', event.target.errorCode);
    };

    request.onsuccess = function(event) {
        db = event.target.result;
        console.log('Database opened successfully');
        displayProducts();  // Cargar y mostrar los productos al cargar la página
    };

    request.onupgradeneeded = function(event) {
        db = event.target.result;
        const objectStore = db.createObjectStore('products', { keyPath: 'id', autoIncrement: true });
        objectStore.createIndex('name', 'name', { unique: false });
        objectStore.createIndex('telefono', 'telefono', { unique: false });
        objectStore.createIndex('correo', 'correo', { unique: false });
        objectStore.createIndex('producto', 'producto', { unique: false });
        objectStore.createIndex('address', 'address', { unique: false });
        objectStore.createIndex('product', 'product', { unique: false });
        objectStore.createIndex('image', 'image', { unique: false });
    };

    document.getElementById('productForm').addEventListener('submit', function(event) {
        event.preventDefault();
        
        const name = document.getElementById('name').value;
        const telefono = document.getElementById('telefono').value;
        const correo = document.getElementById('correo').value;
        const producto = document.getElementById('producto').value;
        const address = document.getElementById('address').value;
        const product = document.getElementById('product').value;
        const image = document.getElementById('image').files[0];

        const reader = new FileReader();
        reader.onload = function(event) {
            const newProduct = {
                name,
                telefono,
                correo,
                producto,
                address,
                product,
                image: event.target.result
            };
            addProduct(newProduct);
        };
        reader.readAsDataURL(image);
    });

    function addProduct(product) {
        const transaction = db.transaction(['products'], 'readwrite');
        const objectStore = transaction.objectStore('products');
        const request = objectStore.add(product);

        request.onsuccess = function(event) {
            console.log('Product added to the database');
            displayProducts();

            // Resetear el formulario después de añadir el producto
            document.getElementById('productForm').reset();
        };

        request.onerror = function(event) {
            console.error('Error adding product to the database');
        };
    }

    function displayProducts() {
        const transaction = db.transaction(['products'], 'readonly');
        const objectStore = transaction.objectStore('products');
        const request = objectStore.getAll();

        request.onsuccess = function(event) {
            const productList = document.getElementById('productList');
            productList.innerHTML = '';
            event.target.result.forEach(product => {
                const productElement = document.createElement('div');
                productElement.classList.add('product');
                productElement.innerHTML = `
                    <img src="${product.image}" alt="${product.product}">
                    <div class="details">
                        <span><strong>Nombre:</strong> ${product.name}</span>
                        <span><strong>Teléfono:</strong> ${product.telefono}</span>
                        <span><strong>Correo:</strong> ${product.correo}</span>
                        <span><strong>Tipo de Oferta:</strong> ${product.producto}</span>
                        <span><strong>Dirección:</strong> ${product.address}</span>
                        <span><strong>Producto:</strong> ${product.product}</span>
                        <button class="delete-btn" data-id="${product.id}">Eliminar</button>
                    </div>
                `;
                productList.appendChild(productElement);
            });

            // Agregar manejador de eventos para botones de eliminación
            document.querySelectorAll('.delete-btn').forEach(button => {
                button.addEventListener('click', function() {
                    const productId = Number(this.getAttribute('data-id'));
                    deleteProduct(productId);
                });
            });
        };

        request.onerror = function(event) {
            console.error('Error reading products from the database');
        };
    }

    function deleteProduct(id) {
        const transaction = db.transaction(['products'], 'readwrite');
        const objectStore = transaction.objectStore('products');
        const request = objectStore.delete(id);

        request.onsuccess = function(event) {
            console.log('Product deleted from the database');
            displayProducts();  // Actualizar la lista de productos
        };

        request.onerror = function(event) {
            console.error('Error deleting product from the database');
        };
    }
});





