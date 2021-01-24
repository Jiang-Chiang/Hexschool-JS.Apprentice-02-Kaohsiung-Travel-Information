// 變數宣告
const districtSelect = document.querySelector('#districtSelect');
const selectedTitle = document.querySelector('#selectedTitle');
const informationCardsContainer = document.querySelector('#informationCardsContainer');
const filterButton = document.querySelectorAll('.filterButton');
const pagination = document.querySelector('#pagination');
const xhr = new XMLHttpRequest();

// XMLHttpRequest抓取目標JSON檔案
xhr.open('get', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', false);
xhr.send(null);

// JSON檔解析放入變數
let allAttractionsArr = JSON.parse(xhr.responseText).result.records;
let selectedAttractionsArr = allAttractionsArr;

// 監聽事件
districtSelect.addEventListener('change', selectDistrict);
for (let i = 0; i < filterButton.length; i++) {
    filterButton[i].addEventListener('click', selectDistrict);
}
pagination.addEventListener('click', selectPage);

// 初始化渲染
renderDistrictList();
updateInformationCardsContainer(allAttractionsArr, 0);
updatepagination(allAttractionsArr);

// 函式：渲染行政區下拉選單
function renderDistrictList() {
    let districtArr = [];

    for (let i = 0; i < allAttractionsArr.length; i++) {
        let district = allAttractionsArr[i].Zone;

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

// 函式：選擇行政區
function selectDistrict(e) {
    let selectedDistrict = e.target.value;

    selectedTitle.innerHTML = selectedDistrict;
    selectedAttractionsArr = [];

    if (selectedDistrict == '全部結果') {
        selectedAttractionsArr = allAttractionsArr;
    } else {
        for (let i = 0; i < allAttractionsArr.length; i++) {
            if (selectedDistrict == allAttractionsArr[i].Zone) {
                selectedAttractionsArr.push(allAttractionsArr[i]);
            }
        }
    }

    if (e.target.classList == 'filterButton') {
        let options = document.querySelectorAll('option');

        for (let i = 0; i < options.length; i++) {
            options[i].removeAttribute('selected');
        }
        for (let i = 0; i < options.length; i++) {
            if (options[i].value == selectedDistrict) {
                options[i].setAttribute('selected', 'selected');
            }
        }
    }

    updateInformationCardsContainer(selectedAttractionsArr, 0);
    updatepagination(selectedAttractionsArr);
}

// 函式：更新與渲染景點清單區域
function updateInformationCardsContainer(attractionsArr, currentPage) {
    let informationCardStr = '';

    informationCardsContainer.innerHTML = '';

    if (attractionsArr.length == 0) {
        informationCardStr = `
            <h2 id='noInformationAlert'>查無資料</h2>`
    } else {

        attractionsArr = attractionsArr.slice(currentPage * 6, (currentPage + 1) * 6);

        for (let i = 0; i < attractionsArr.length; i++) {
            informationCardStr += `
                <div class="informationCard">
                    <div class="informationCardCover">
                        <img src="${attractionsArr[i].Picture1}" alt="">
                        <div class="attractionTtile">${attractionsArr[i].Name}</div>
                        <div class="attractionDistrict">${attractionsArr[i].Zone}</div>
                    </div>
                    <div class="informationCardDetails">
                        <div class="informationCardDetailsRow attractionOpenTime">
                            <img src="./img/icons_clock.png" alt="">
                            <div>${attractionsArr[i].Opentime}</div>
                        </div>
                        <div class="informationCardDetailsRow attractionAddress">
                            <img src="./img/icons_pin.png" alt="">
                            <div>${attractionsArr[i].Add}</div>
                        </div>
                        <div class="informationCardDetailsRow attractionPhone">
                            <img src="./img/icons_phone.png" alt="">
                            <div>${attractionsArr[i].Tel}</div>
                        </div>
                        <div class="attractionTagBlock">
                            <img src="./img/icons_tag.png" alt="">
                            ${attractionsArr[i].Ticketinfo}
                        </div>
                    </div>
                </div>`;
        }
    }

    informationCardsContainer.innerHTML = informationCardStr;

    if (attractionsArr.length > 2) {
        if (attractionsArr.length % 2 == 0) {
            informationCardsContainer.style.height = `${((attractionsArr.length) / 2) * 273 + (attractionsArr.length - 1) * 36}px`;
        } else {
            informationCardsContainer.style.height = `${((attractionsArr.length + 1) / 2) * 273 + (attractionsArr.length - 1) * 36}px`;
        }
    } else {
        informationCardsContainer.style.height = `273px`;
    }

}

// 函式：更新並渲染分頁頁碼
function updatepagination(attractionsArr) {
    let totalPages = Math.ceil(attractionsArr.length / 6);
    let paginationStr = '';

    if (totalPages <= 1) {
        paginationStr = `
            <li class='page currentPage' data-index='0'>1</li>`;
    } else {
        paginationStr += `
        <li id='prevPageButton'>< prev</li>
        <li class='page currentPage' data-index='${0}'>${1}</li>`;

        for (let i = 1; i < totalPages; i++) {
            paginationStr += `
            <li class='page' data-index='${i}'>${i + 1}</li>`;
        }

        paginationStr += `
        <li id='nextPageButton'>Next ></li>`;
    }

    pagination.innerHTML = paginationStr;
}

// 函式：選擇分頁
function selectPage(e) {
    e.preventDefault();
    let pages = document.querySelectorAll('.page');
    let selectPageNum = Number(e.target.dataset.index);
    let currentPageNum = Number(document.querySelectorAll('.currentPage')[0].dataset.index);

    if (e.target.nodeName !== 'LI') {
        return;
    } else if (e.target.id == 'prevPageButton') {
        if (currentPageNum > 0) {
            selectPageNum = Number(pages[currentPageNum - 1].dataset.index);
            pages[currentPageNum].classList.remove('currentPage');
            pages[currentPageNum - 1].classList.add('currentPage');
        } else {
            selectPageNum = 0;
            alert('已經是第一頁了！')
        }
    } else if (e.target.id == 'nextPageButton') {
        if (currentPageNum < pages.length - 1) {
            selectPageNum = Number(pages[currentPageNum + 1].dataset.index);
            pages[currentPageNum].classList.remove('currentPage');
            pages[currentPageNum + 1].classList.add('currentPage');
        } else {
            selectPageNum = pages.length - 1;
            alert('已經是最後一頁了！');
        }
    } else {
        pages.forEach(function (element) {
            element.classList.remove('currentPage');
        });
        e.target.classList.add('currentPage');
    }

    updateInformationCardsContainer(selectedAttractionsArr, selectPageNum);
}