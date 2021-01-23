const districtSelect = document.querySelector('#districtSelect');
const selectedTitle = document.querySelector('#selectedTitle');
const informationCardsContainer = document.querySelector('#informationCardsContainer');
const filterButton = document.querySelectorAll('.filterButton');
const pagination = document.querySelector('#pagination');
const xhr = new XMLHttpRequest();

xhr.open('get', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true)
xhr.send(null);

districtSelect.addEventListener('change', filterDistrict);
// pagination.addEventListener('click', currentPage);

for (let i = 0; i < filterButton.length; i++) {
    filterButton[i].addEventListener('click', filterDistrict)
}

xhr.onload = function () {
    let resObj = JSON.parse(xhr.responseText);
    let attractionsArr = resObj.result.records;
    let selectIndex = 0;
    let currentPageArr = attractionsArr.slice(selectIndex * 6, (selectIndex + 1) * 6);

    renderDistrictSelect(attractionsArr);
    renderPagination(attractionsArr);
    updateInformationCardsContainer(currentPageArr);
}

function renderDistrictSelect(attractionsArr) {
    let districtArr = [];

    for (let i = 0; i < attractionsArr.length; i++) {
        let district = attractionsArr[i].Zone;

        if (districtArr.indexOf(district) == -1) {
            districtArr.push(district)
        }
    }

    let str = '';

    for (let i = 0; i < districtArr.length; i++) {
        str += `<option value="${districtArr[i]}">${districtArr[i]}</option>`
    }

    districtSelect.innerHTML += str;
}

function renderPagination(selectedAttractionsArr) {
    let paginationStr = '';
    let totalPages = Math.ceil(selectedAttractionsArr.length / 6);

    for (let i = 0; i < totalPages; i++) {
        paginationStr += `
        <li data-index='${i}'>${i + 1}</li>`;
    }

    pagination.innerHTML = paginationStr;
}

function updateInformationCardsContainer(selectedAttractionsArr) {
    let informationCardStr = '';

    for (let i = 0; i < selectedAttractionsArr.length; i++) {
        informationCardStr += `
            <div class="informationCard">
                <div class="informationCardCover">
                    <img src="${selectedAttractionsArr[i].Picture1}" alt="">
                    <div class="attractionTtile">${selectedAttractionsArr[i].Name}</div>
                    <div class="attractionDistrict">${selectedAttractionsArr[i].Zone}</div>
                </div>
                <div class="informationCardDetails">
                    <div class="informationCardDetailsRow attractionOpenTime">
                        <img src="/img/icons_clock.png" alt="">
                        <div>${selectedAttractionsArr[i].Opentime}</div>
                    </div>
                    <div class="informationCardDetailsRow attractionAddress">
                        <img src="/img/icons_pin.png" alt="">
                        <div>${selectedAttractionsArr[i].Add}</div>
                    </div>
                    <div class="informationCardDetailsRow attractionPhone">
                        <img src="/img/icons_phone.png" alt="">
                        <div>${selectedAttractionsArr[i].Tel}</div>
                    </div>
                    <div class="attractionTagBlock">
                        <img src="/img/icons_tag.png" alt="">
                        ${selectedAttractionsArr[i].Ticketinfo}
                    </div>
                </div>
            </div>`;
    }


    if (selectedAttractionsArr.length > 2) {
        if (selectedAttractionsArr.length % 2 == 0) {
            informationCardsContainer.style.height = `${((selectedAttractionsArr.length) / 2) * 273 + (selectedAttractionsArr.length - 1) * 36}px`;
        } else {
            informationCardsContainer.style.height = `${((selectedAttractionsArr.length + 1) / 2) * 273 + (selectedAttractionsArr.length - 1) * 36}px`;
        }
    } else {
        informationCardsContainer.style.height = `273px`;
    }

    informationCardsContainer.innerHTML = informationCardStr;
}

function filterDistrict(e) {
    let resObj = JSON.parse(xhr.responseText);
    let attractionsArr = resObj.result.records;
    let selectedDistrict = e.target.value;
    let selectedAttractionsArr = [];

    selectedTitle.innerHTML = selectedDistrict;

    if (selectedDistrict == '全部結果') {
        selectedAttractionsArr = attractionsArr;
    } else {
        for (let i = 0; i < attractionsArr.length; i++) {
            if (selectedDistrict == attractionsArr[i].Zone) {
                selectedAttractionsArr.push(attractionsArr[i]);
            }
        }
    }

    let selectIndex = 0;
    let currentPageArr = selectedAttractionsArr.slice(selectIndex * 6, (selectIndex + 1) * 6)

    updateInformationCardsContainer(currentPageArr);
    renderPagination(selectedAttractionsArr);
}

// function currentPage(e) {

//     e.preventDefault();
//     if (e.target.nodeName !== 'LI') { return; }

//     let selectIndex = e.target.dataset.index;
//     let currentPageArr = selectedAttractionsArr.slice(selectIndex * 6, (selectIndex + 1) * 6)

//     updateInformationCardsContainer(currentPageArr);
// }