var defaultProducts = [
    {
        name: "Razer BlackWidow V4",
        price: "9500",
        desc: "Mechanical Gaming Keyboard with Green Switches, RGB Chroma lighting, and dedicated macro keys.",
        img: "imges/Razer BlackWidow V4.webp"
    },
    {
        name: "Echo Dot 5th Gen",
        price: "3200",
        desc: "Smart speaker with Alexa, featuring a sleek design and improved audio for vibrant sound.",
        img: "imges/Echo Dot 5th Gen.webp"
    },
    {
        name: "MacBook Pro M3 Max",
        price: "98000",
        desc: "The most advanced laptop with M3 Max chip, Liquid Retina XDR display, and 36GB unified memory.",
        img: "imges/MacBook Pro M3 Max.jpg"
    },
    {
        name: "Sony WH-1000XM5",
        price: "18500",
        desc: "Industry-leading noise canceling headphones with dual processors and 8 microphones.",
        img: "imges/Sony WH-1000XM5.jpg"
    },
    {
        name: "Logitech G502 X Plus",
        price: "5800",
        desc: "Wireless RGB gaming mouse with LIGHTFORCE hybrid switches and HERO 25K sensor.",
        img: "imges/Logitech G502 X Plus.jpg"
    },
    {
        name: "Apple Watch Ultra 2",
        price: "45000",
        desc: "The most rugged Apple Watch, with a titanium case and precision dual-frequency GPS.",
        img: "imges/Apple Watch Ultra 2.avif"
    },
    {
        name: "Samsung Odyssey G7",
        price: "28500",
        desc: "32-inch curved gaming monitor with 240Hz refresh rate and QLED technology.",
        img: "imges/Samsung Odyssey G7.webp"
    },
    {
        name: "DJI Mini 4 Pro",
        price: "52000",
        desc: "Foldable mini camera drone with 4K HDR video and omnidirectional obstacle sensing.",
        img: "imges/DJI Mini 4 Pro.jpg"
    }
];
var productList;
if (localStorage.getItem("products") == null) {
    productList = defaultProducts;
    localStorage.setItem("products", JSON.stringify(productList));
} else {
    productList = JSON.parse(localStorage.getItem("products"));
}
window.onload = function() {
    display();
};
var productList = JSON.parse(localStorage.getItem("products")) || [];
window.onload = function() {
    display();
};
var productName = document.getElementById("productName");
var productPrice = document.getElementById("productPrice");
var productDesc = document.getElementById("productDesc");
var productImage = document.getElementById("productImage");
var imagePreview = document.getElementById("imagePreview");
var addBtn = document.getElementById("addButton");
var updateBtn = document.getElementById("updateButton");
var rowBody = document.getElementById("rowBody");
var searchInput = document.getElementById("searchInput");
var nameError = document.getElementById("nameAlert");
var priceError = document.getElementById("priceAlert");
var descError = document.getElementById("descAlert");
var currentIndex;
var selectedImageDataUrl = null;
function handleImageChange(event) {
  var file = event.target.files[0];
  if (!file) return;
  var reader = new FileReader();
  reader.onload = function (e) {
    var img = new Image();
    img.src = e.target.result;
    img.onload = function () {
      var canvas = document.createElement('canvas');
      var ctx = canvas.getContext('2d');
      var MAX_WIDTH = 400; 
      var scaleSize = MAX_WIDTH / img.width;
      canvas.width = MAX_WIDTH;
      canvas.height = img.height * scaleSize;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      selectedImageDataUrl = canvas.toDataURL('image/jpeg', 0.5);
      if (imagePreview) {
        imagePreview.src = selectedImageDataUrl;
        imagePreview.classList.remove("d-none");
      }
    };
  };
  reader.readAsDataURL(file);
}
function resetImageInput() {
  selectedImageDataUrl = null;
  if (productImage) {
    productImage.value = "";
  }
  if (imagePreview) {
    imagePreview.src = "";
    imagePreview.classList.add("d-none");
  }
}
function createProduct() {
  console.log("Name:", nameValidation(), "Price:", priceValidation(), "Desc:", descValidation());
  if (validateAll()) {
    var product = {
      img: selectedImageDataUrl ? selectedImageDataUrl : "imges/default.png", 
      name: productName.value,
      price: productPrice.value,
      desc: productDesc.value,
    };
    productList.push(product);
    localStorage.setItem('products', JSON.stringify(productList));
    display();
    clearForm();
    var modalElement = document.getElementById('exampleModal');
    var modal = bootstrap.Modal.getInstance(modalElement);
    if (modal) {
        modal.hide();
    }
  } else {
      alert("Please make sure all fields are valid! (Name starts with Capital, Price > 1000)");
  }
}
function display() {
    var box = "";
    for (var i = 0; i < productList.length; i++) {
        var safeName = productList[i].name.replace(/</g, "&lt;");
        var safeDesc = productList[i].desc.replace(/</g, "&lt;");
        box += `
        <div class="col-lg-3 col-md-6 mb-4">
            <div class="card h-100 product-card border-secondary bg-transparent text-white shadow">
                <div class="img-container p-2 bg-light d-flex align-items-center justify-content-center" style="height: 180px; border-radius: 10px 10px 0 0;">
                    <img src="${productList[i].img}" class="img-fluid" style="max-height: 100%; object-fit: contain;">
                </div>
                <div class="card-body d-flex flex-column">
                    <div class="d-flex justify-content-between align-items-start mb-2">
                        <h5 class="card-title text-info mb-0">
                        ${safeName}
                        </h5>
                        <span class="badge bg-info text-dark">
                        ${productList[i].price} EGP
                        </span>
                    </div>
                    <p class="card-text text-secondary small flex-grow-1 mt-1" style="min-height: 40px;">${safeDesc}</p>
                    <hr class="border-secondary my-2">
                    <div class="d-flex gap-2">
                        <button class="btn btn-outline-success btn-sm w-50" onclick="editProduct(${i})">
                            <i class="fa-regular fa-pen-to-square"></i> Edit
                        </button>
                        <button class="btn btn-outline-danger btn-sm w-50" onclick="deletProduct(${i})">
                            <i class="fa-solid fa-trash">
                            </i>
                            Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>`;
    }
    document.getElementById("rowBody").innerHTML = box;
    updateCounter();
}
function clearForm() {
  productName.value = '';
  productPrice.value = '';
  productDesc.value = '';
  if (productImage) {
    productImage.value = '';
  }
  if (imagePreview) {
    imagePreview.src = '';
    imagePreview.classList.add("d-none");
  }
  selectedImageDataUrl = null;
}
function deletProduct(index) {
    if (confirm("Are you sure you want to delete this product?")) {
        productList.splice(index, 1);
        localStorage.setItem('products', JSON.stringify(productList));
        display();
    }
}
function searchProduct() {
    var searchValue = searchInput.value.toLowerCase();
    var box = "";
    for (var i = 0; i < productList.length; i++) {
        if (productList[i].name.toLowerCase().includes(searchValue)) {
            var safeName = productList[i].name.replace(/</g, "&lt;");
            var safeDesc = productList[i].desc.replace(/</g, "&lt;");
            box += `
            <div class="col-lg-3 col-md-6 mb-4">
                <div class="card h-100 product-card border-secondary bg-transparent text-white shadow">
                    <div class="img-container p-2 bg-light d-flex align-items-center justify-content-center" style="height: 180px; border-radius: 10px 10px 0 0;">
                        <img src="${productList[i].img}" class="img-fluid" style="max-height: 100%; object-fit: contain;">
                    </div>
                    <div class="card-body d-flex flex-column">
                        <div class="d-flex justify-content-between align-items-start mb-2">
                            <h5 class="card-title text-info mb-0">${safeName}</h5>
                            <span class="badge bg-info text-dark">${productList[i].price} EGP</span>
                        </div>
                        <p class="card-text text-secondary small flex-grow-1 mt-1" style="min-height: 40px;">${safeDesc}</p>
                        <hr class="border-secondary my-2">
                        <div class="d-flex gap-2">
                            <button class="btn btn-outline-success btn-sm w-50" onclick="editProduct(${i})">
                                <i class="fa-regular fa-pen-to-square"></i> Edit
                            </button>
                            <button class="btn btn-outline-danger btn-sm w-50" onclick="deletProduct(${i})">
                                <i class="fa-solid fa-trash"></i> Delete
                            </button>
                        </div>
                    </div>
                </div>
            </div>`;
        }
    }
    document.getElementById("rowBody").innerHTML = box;
}
function clearAllProducts() {
    if (confirm("Are you sure you want to delete ALL products?")) {
        productList = [];
        localStorage.removeItem('products');
        display();
    }
}
function editProduct(index) {
    currentIndex = index;
    var product = productList[index];
    productName.value = product.name; 
    productPrice.value = product.price;
    productDesc.value = product.desc;
    selectedImageDataUrl = product.img;
    if (imagePreview) {
        imagePreview.src = product.img;
        imagePreview.classList.remove("d-none");
    }
    addBtn.classList.add('d-none');
    updateBtn.classList.remove('d-none');
    var modalElement = document.getElementById('exampleModal');
    var myModal = bootstrap.Modal.getOrCreateInstance(modalElement);
    myModal.show();
}
function updateproduct() {
  if (validateAll()) {
    var product = {
      img: selectedImageDataUrl,
      name: productName.value,
      price: productPrice.value,
      desc: productDesc.value,
    };
    productList.splice(currentIndex, 1, product);
    localStorage.setItem('products', JSON.stringify(productList));
    display();
    clearForm();
    addBtn.classList.remove('d-none');
    updateBtn.classList.add('d-none');
    var modal = bootstrap.Modal.getInstance(document.getElementById('exampleModal'));
    modal.hide();
    try {
      localStorage.setItem('products', JSON.stringify(productList));
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        alert("عفواً، مساحة التخزين في المتصفح امتلأت بسبب حجم الصور الكبير. يرجى مسح بعض المنتجات أو استخدام صور أصغر.");
      }
    }
  }
}
function nameValidation() {
  var regex = /^[A-Z][a-zA-Z\s]{2,20}$/; 
  var isValid = regex.test(productName.value);
  if (isValid) {
    nameError.classList.add("d-none");
    productName.classList.replace("is-invalid", "is-valid");
  } else {
    nameError.classList.remove("d-none");
    productName.classList.add("is-invalid");
    productName.classList.remove("is-valid");
  }
  return isValid;
}
function priceValidation() {
  var priceValue = Number(productPrice.value);
  var isValid = priceValue >= 1000 && priceValue <= 100000;
  if (isValid) {
    priceError.classList.add("d-none");
    productPrice.classList.replace("is-invalid", "is-valid");
  } else {
    priceError.classList.remove("d-none");
    productPrice.classList.add("is-invalid");
    productPrice.classList.remove("is-valid");
  }
  return isValid;
}
function descValidation() {
  var regex = /^[\w\s\d\.,!-]{3,500}$/; 
  var isValid = regex.test(productDesc.value.trim());
  
  if (isValid) {
    descError.classList.add("d-none");
    productDesc.classList.replace("is-invalid", "is-valid");
  } else {
    descError.classList.remove("d-none");
    productDesc.classList.add("is-invalid");
    productDesc.classList.remove("is-valid");
  }
  return isValid;
}
function validateAll() {
  var res1 = nameValidation();
  var res2 = priceValidation();
  var res3 = descValidation();
  return res1 && res2 && res3;
}
function updateCounter() {
    var counterElement = document.getElementById("productCount");
    if (counterElement) {
        counterElement.innerHTML = `Total Products: ${productList.length}`;
    }
}
function escapeHTML(text) {
    var p = document.createElement('p');
    p.textContent = text;
    return p.innerHTML;
}