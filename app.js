document.addEventListener('DOMContentLoaded', loadData);


// Display a loading indicator while data is being fetched
function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'loading';
    loader.innerHTML =
        `
            <div class="text-center my-5">
                <div class="spinner-border text-primary text-center my-5" role="status">
                    <span class="visually-hidden">Loading...</span>
                </div>
            </div>
        `
        ;
    document.body.appendChild(loader);
}


// Remove the loading indicator when data is done loading
function hideLoading() {
    const loader = document.getElementById('loading');
    if (loader) {
        loader.remove();
    }
}


// Load data with api 
async function loadData() {
    showLoading();
    const url = 'https://openapi.programming-hero.com/api/ai/tools';

    const response = await fetch(url);
    const data = await response.json()

    hideLoading();

    displayData(data.data.tools);
    showMore(data.data.tools)
    sortByDate(data.data.tools)
}



// Html template 
function html(element) {
    return `
        <div class="card p-4">
            <img style="height: 200px; object-fit: fit" src="${element.image}" class="card-img-top" alt="...">
            <div class="card-body">
                <h5 class="card-title">Features</h5>
                <ol>
                    <li>${element.features[0]}</li>
                    <li>${element.features[1]}</li>
                    <li>${element.features[1]}</li>
                </ol>
            </div>

            <hr />
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h4>${element.name}</h4>
                    <p>🗓️ ${element.published_in}</p>
                </div>
                <!-- Button trigger modal -->
                <button onclick="details('${element.id}')" type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                    View more
                </button>
            </div>
        </div>
    `
}

// Display data 
function displayData(data) {
    let card = document.getElementById('card-loop');

    data = data.slice(0, 6)

    data.forEach(element => {

        const div = document.createElement('div');
        div.classList.add('col')
        div.innerHTML = html(element)
        card.appendChild(div)

    });

}


// Grape with id 
async function details(id) {
    const url = `https://openapi.programming-hero.com/api/ai/tool/${id}`;
    const res = await fetch(url);
    const data = await res.json();
    displayDetails(data.data);
}


// Details popup 
function displayDetails(moreDetails) {
    const modalDialog = document.querySelector('.modal-dialog');

    modalDialog.innerHTML = `
        <div class="modal-content">
            <div class="modal-header">
                <h5 class="modal-title" id="exampleModalLabel">${moreDetails.tool_name}</h5>
                <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>


            <div class="modal-body d-md-flex flex-md-row" style="gap: 10px;">
                <div class="col-md-6 col">
                    <div class="border border-danger p-3 rounded">
                        <div class="mb-3">${moreDetails.description}</div>
                        <div class="small-container">

                            <div class="small-card">
                                ${moreDetails.pricing[0].plan}
                                ${moreDetails.pricing[0].price}
                            </div>

                            <div class="small-card">
                                ${moreDetails.pricing[1].plan}
                                ${moreDetails.pricing[1].price}
                            </div>

                            <div class="small-card">
                                ${moreDetails.pricing[2].plan}
                                ${moreDetails.pricing[2].price}
                            </div>
                        </div>
                    </div>
                </div>
                <div class="col-md-6 col position-relative">
                    <div class="accuracy">
                    ${moreDetails.accuracy.score !== null ? moreDetails.accuracy.score : "accuracy not found"}
                        
                    </div>
                    <img class="w-100" src="${moreDetails.image_link[0]}" alt="">

                    <div class="fw-bold">${moreDetails.input_output_examples[0].input}</div>
                    <div>${moreDetails.input_output_examples[0].output}</div>
                </div>
            </div>
            

            <div class="col-12">
                <div class="info d-md-flex flex-md-row justify-between">
                    <ul>
                        <h3>Features</h3>
                        <li>
                            <div>${moreDetails.features[1].feature_name}</div>
                        </li>
                        <li>
                            <div>${moreDetails.features[2].feature_name}</div>
                        </li>
                        <li>
                            <div>${moreDetails.features[3].feature_name}</div>
                        </li>
                    </ul>

                    <ul>
                        <h3>Integrations</h3>
                        <li>
                            <div>${moreDetails.integrations[0]}</div>
                        </li>
                        <li>
                            <div>${moreDetails.integrations[1] !== undefined ? moreDetails.integrations[1] : "Data not found"}
                            </div>
                        </li>
                        <li>${moreDetails.integrations[2] !== undefined ? moreDetails.integrations[2] : "Data not found"}</li>
                    </ul>
                </div>

            </div>


            <div class="modal-footer">
                <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
            </div>
        </div>
    `
}


// Show more functionality 
function showMore(data) {
    let showMoreItem = document.querySelector('.show-more');
    showMoreItem.addEventListener('click', function () {

        let card = document.getElementById('card-loop');

        // Show loading spinner
        showMoreItem.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';

        // Fetch more data
        const newData = data.slice(6, 12);

        newData.forEach(element => {
            const div = document.createElement('div');
            div.classList.add('col')
            div.innerHTML = html(element)
            card.appendChild(div)
        });

        // Disable "Load More" button if all items have been displayed
        if (data.length <= 12) {
            showMoreItem.disabled = true;
        }


        // Stop the loading spinner and replace the "Loading..." text with "Load More"
        setTimeout(() => {
            if (card.children.length === data.length) {
                showMoreItem.innerHTML = 'Load More';
            }
        }, 2000)

        loader.classList.remove('d-none');

    })
}

// Sort functionality
function sortByDate(data) {
    let showMoreItem = document.querySelector('.sort-by-data');
    showMoreItem.addEventListener('click', function () {
        let card = document.getElementById('card-loop');

        data = data.slice(0, 6);

        // Sort the list of tools by the "published_" property in descending order
        const sortedTools = data.sort((a, b) => new Date(b.published_in) - new Date(a.published_in));

        // Clear existing card elements
        card.innerHTML = '';

        // Add sorted card elements to the page
        sortedTools.forEach(element => {
            const div = document.createElement('div');
            div.classList.add('col')
            div.innerHTML = html(element);
            card.appendChild(div)
        });
    })
}
