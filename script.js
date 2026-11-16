/* =========================================
   DOAFÁCIL
   SISTEMA DE GERENCIAMENTO DE DOAÇÕES

   Sem banco de dados.
   Os dados ficam no localStorage.
========================================= */


/* =========================================
   CHAVES DO LOCALSTORAGE
========================================= */

const PRODUCTS_KEY =
    "doafacil_products";

const ACTIVITY_KEY =
    "doafacil_activities";


/* =========================================
   PRODUTOS INICIAIS
========================================= */

const initialProducts = [

    {
        id: 1,

        name: "Arroz",

        category: "Alimentos",

        quantity: 20,

        date: "2026-11-10",

        expiry: ""
    },


    {
        id: 2,

        name: "Óleo",

        category: "Alimentos",

        quantity: 2,

        date: "2026-11-11",

        expiry: ""
    },


    {
        id: 3,

        name: "Sabonete",

        category: "Higiene",

        quantity: 8,

        date: "2026-11-12",

        expiry: ""
    }

];


/* =========================================
   CARREGAR DADOS
========================================= */

let products =
    JSON.parse(
        localStorage.getItem(
            PRODUCTS_KEY
        )
    ) || initialProducts;


let activities =
    JSON.parse(
        localStorage.getItem(
            ACTIVITY_KEY
        )
    ) || [

        {
            text:
                "Doação recebida: Arroz (20 unidades)",

            time:
                "Hoje"
        },


        {
            text:
                "Doação recebida: Óleo (2 unidades)",

            time:
                "Hoje"
        }

    ];


/* =========================================
   SALVAR
========================================= */

function saveData() {

    localStorage.setItem(

        PRODUCTS_KEY,

        JSON.stringify(products)

    );


    localStorage.setItem(

        ACTIVITY_KEY,

        JSON.stringify(activities)

    );

}


/* =========================================
   NAVEGAÇÃO
========================================= */

function openPage(pageName) {

    const pages =
        document.querySelectorAll(
            ".page"
        );


    pages.forEach(page => {

        page.classList.toggle(

            "active",

            page.id === pageName

        );

    });


    const buttons =
        document.querySelectorAll(
            "[data-tela]"
        );


    buttons.forEach(button => {

        button.classList.toggle(

            "active",

            button.dataset.tela === pageName

        );

    });


    const titles = {

        dashboard:
            "Painel inicial",

        cadastro:
            "Cadastrar doação",

        estoque:
            "Estoque de produtos",

        saida:
            "Registrar saída"

    };


    document.getElementById(

        "pageTitle"

    ).textContent =
        titles[pageName];


    if (
        pageName === "estoque"
    ) {

        renderStock();

    }


    if (
        pageName === "saida"
    ) {

        renderOutProducts();

    }


    window.scrollTo({

        top: 0,

        behavior: "smooth"

    });

}


/* =========================================
   CLIQUES DE NAVEGAÇÃO
========================================= */

document.addEventListener(

    "click",

    function(event) {

        const button =
            event.target.closest(
                "[data-tela]"
            );


        if (!button) {

            return;

        }


        openPage(
            button.dataset.tela
        );

    }

);


/* =========================================
   TOAST
========================================= */

function showToast(message) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(

        function() {

            toast.classList.remove(
                "show"
            );

        },

        2500

    );

}


/* =========================================
   VERIFICAR ESTOQUE BAIXO
========================================= */

function isLowStock(product) {

    return product.quantity <= 3;

}


/* =========================================
   ATUALIZAR DASHBOARD
========================================= */

function renderDashboard() {

    document.getElementById(
        "totalProducts"
    ).textContent =
        products.length;


    document.getElementById(
        "availableProducts"
    ).textContent =

        products.filter(

            product =>
                product.quantity > 0

        ).length;


    document.getElementById(
        "lowProducts"
    ).textContent =

        products.filter(
            isLowStock
        ).length;


    renderLowStock();


    renderActivities();

}


/* =========================================
   ESTOQUE BAIXO
========================================= */

function renderLowStock() {

    const container =
        document.getElementById(
            "lowStockList"
        );


    const lowProducts =
        products.filter(
            isLowStock
        );


    if (
        lowProducts.length === 0
    ) {

        container.innerHTML = `

            <div class="activity-item">

                <div class="dot">
                </div>

                <div>

                    <strong>
                        Tudo certo!
                    </strong>

                    <div>
                        Nenhum produto
                        está com estoque baixo.
                    </div>

                </div>

            </div>

        `;

        return;

    }


    container.innerHTML =

        lowProducts.map(

            product => `

                <div
                    class="activity-item"
                >

                    <div
                        class="dot"
                        style="
                            background:
                            var(--orange);
                        "
                    >
                    </div>


                    <div>

                        <strong>
                            ${product.name}
                        </strong>


                        <div>

                            ${product.quantity}

                            unidade(s)

                            — estoque baixo

                        </div>

                    </div>

                </div>

            `

        ).join("");

}


/* =========================================
   ATIVIDADES
========================================= */

function renderActivities() {

    const container =
        document.getElementById(
            "activityList"
        );


    container.innerHTML =

        activities
        .slice(0, 6)
        .map(

            activity => `

                <div
                    class="activity-item"
                >

                    <div
                        class="dot"
                    >
                    </div>


                    <div>

                        <strong>
                            ${activity.text}
                        </strong>


                        <div>

                            ${activity.time}

                        </div>

                    </div>

                </div>

            `

        ).join("");

}


/* =========================================
   CADASTRAR PRODUTO
========================================= */

const productForm =
    document.getElementById(
        "productForm"
    );


productForm.addEventListener(

    "submit",

    function(event) {

        event.preventDefault();


        const name =
            document.getElementById(
                "productName"
            ).value.trim();


        const category =
            document.getElementById(
                "productCategory"
            ).value;


        const quantity =
            Number(
                document.getElementById(
                    "productQuantity"
                ).value
            );


        const date =
            document.getElementById(
                "productDate"
            ).value;


        const expiry =
            document.getElementById(
                "productExpiry"
            ).value;


        const product = {

            id:
                Date.now(),

            name,

            category,

            quantity,

            date,

            expiry

        };


        products.unshift(
            product
        );


        activities.unshift({

            text:
                `Doação recebida:
                ${name}
                (${quantity} unidade(s))`,

            time:
                "Agora"

        });


        saveData();


        renderDashboard();


        productForm.reset();


        setToday();


        showToast(

            "Produto cadastrado com sucesso! 💗"

        );


        openPage(
            "dashboard"
        );

    }

);


/* =========================================
   RENDERIZAR ESTOQUE
========================================= */

function renderStock() {

    const search =
        document.getElementById(
            "searchProduct"
        ).value.toLowerCase();


    const category =
        document.getElementById(
            "categoryFilter"
        ).value;


    const filteredProducts =
        products.filter(

            product => {

                const matchesSearch =

                    !search ||

                    product.name
                    .toLowerCase()
                    .includes(search);


                const matchesCategory =

                    !category ||

                    product.category ===
                    category;


                return (

                    matchesSearch &&

                    matchesCategory

                );

            }

        );


    const table =
        document.getElementById(
            "stockTable"
        );


    if (
        filteredProducts.length === 0
    ) {

        table.innerHTML = `

            <tr>

                <td
                    colspan="5"
                    style="
                        text-align:center;
                        padding:40px;
                    "
                >

                    Nenhum produto encontrado.

                </td>

            </tr>

        `;

        return;

    }


    table.innerHTML =

        filteredProducts
        .map(

            product => `

                <tr>

                    <td>

                        <strong>
                            ${product.name}
                        </strong>

                    </td>


                    <td>

                        ${product.category}

                    </td>


                    <td>

                        ${product.quantity}

                    </td>


                    <td>

                        <span
                            class="
                                badge
                                ${
                                    isLowStock(product)

                                    ? "low"

                                    : "ok"
                                }
                            "
                        >

                            ${
                                isLowStock(product)

                                ? "Estoque baixo"

                                : "Disponível"
                            }

                        </span>

                    </td>


                    <td>

                        <button

                            class="table-btn"

                            onclick="
                                prepareOut(
                                    ${product.id}
                                )
                            "
                        >

                            Registrar saída

                        </button>

                    </td>

                </tr>

            `

        ).join("");

}


/* =========================================
   PESQUISA
========================================= */

document
    .getElementById(
        "searchProduct"
    )
    .addEventListener(

        "input",

        renderStock

    );


/* =========================================
   FILTRO
========================================= */

document
    .getElementById(
        "categoryFilter"
    )
    .addEventListener(

        "change",

        renderStock

    );


/* =========================================
   PRODUTOS PARA SAÍDA
========================================= */

function renderOutProducts(
    selectedId = ""
) {

    const select =
        document.getElementById(
            "outProduct"
        );


    const available =
        products.filter(

            product =>
                product.quantity > 0

        );


    if (
        available.length === 0
    ) {

        select.innerHTML = `

            <option value="">
                Nenhum produto disponível
            </option>

        `;

        return;

    }


    select.innerHTML = `

        <option value="">
            Selecione o produto
        </option>

        ${
            available.map(

                product => `

                    <option
                        value="${product.id}"

                        ${
                            String(product.id)
                            ===
                            String(selectedId)

                            ? "selected"

                            : ""
                        }
                    >

                        ${product.name}

                        —

                        ${product.quantity}

                        disponível(is)

                    </option>

                `

            ).join("")
        }

    `;

}


/* =========================================
   PREPARAR SAÍDA
========================================= */

function prepareOut(id) {

    openPage(
        "saida"
    );


    renderOutProducts(
        id
    );

}


/* =========================================
   REGISTRAR SAÍDA
========================================= */

const outForm =
    document.getElementById(
        "outForm"
    );


outForm.addEventListener(

    "submit",

    function(event) {

        event.preventDefault();


        const productId =
            Number(
                document.getElementById(
                    "outProduct"
                ).value
            );


        const quantity =
            Number(
                document.getElementById(
                    "outQuantity"
                ).value
            );


        const product =
            products.find(

                item =>
                    item.id ===
                    productId

            );


        if (!product) {

            showToast(
                "Selecione um produto."
            );

            return;

        }


        if (
            quantity <= 0 ||
            quantity > product.quantity
        ) {

            showToast(
                "Quantidade inválida."
            );

            return;

        }


        product.quantity -=
            quantity;


        activities.unshift({

            text:
                `Saída registrada:
                ${product.name}
                (${quantity} unidade(s))`,

            time:
                "Agora"

        });


        saveData();


        renderDashboard();


        outForm.reset();


        setToday();


        showToast(

            "Saída registrada com sucesso!"

        );


        openPage(
            "dashboard"
        );

    }

);


/* =========================================
   DATA ATUAL
========================================= */

function setToday() {

    const today =

        new Date()
        .toISOString()
        .slice(0, 10);


    document.getElementById(
        "productDate"
    ).value =
        today;


    document.getElementById(
        "outDate"
    ).value =
        today;

}


/* =========================================
   INICIALIZAÇÃO
========================================= */

setToday();

renderDashboard();

renderOutProducts();