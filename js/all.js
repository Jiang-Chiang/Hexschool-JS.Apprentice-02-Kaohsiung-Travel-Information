const districtSelect = document.querySelector('#districtSelect');
const selectedTitle = document.querySelector('#selectedTitle');
const informationCardsContainer = document.querySelector('#informationCardsContainer');
const informationCardDetailsRow = document.querySelectorAll('.informationCardDetailsRow');
const attractionTagBlock = document.querySelectorAll('.attractionTagBlock');
const xhr = new XMLHttpRequest();

xhr.open('get', 'https://raw.githubusercontent.com/hexschool/KCGTravel/master/datastore_search.json', true)
xhr.send(null);

districtSelect.addEventListener('click', filterDistrict);

xhr.onload = function () {
    let resObj = JSON.parse(xhr.responseText);
    let attractionsArr = resObj.result.records;

    renderDistrictSelect(attractionsArr);
    updateInformationCardsContainer(attractionsArr);

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

function updateInformationCardsContainer(selectedAttractionsArr) {
    let str = '';

    for (let i = 0; i < selectedAttractionsArr.length; i++) {
        str += `
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
            </div>`
    }

    informationCardsContainer.innerHTML = str;

    if (selectedAttractionsArr.length > 2) {

        if (selectedAttractionsArr.length % 2 == 0) {
            informationCardsContainer.style.height = `${((selectedAttractionsArr.length) / 2) * 273 + (selectedAttractionsArr.length - 1) * 36}px`;
            informationCardsContainer.style.border = `1px solid red`;
        } else {
            informationCardsContainer.style.height = `${((selectedAttractionsArr.length + 1) / 2) * 273 + (selectedAttractionsArr.length - 1) * 36}px`;
            informationCardsContainer.style.border = `1px solid red`;
        }

    } else {

        informationCardsContainer.style.height = `273px`;
    }
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

    updateInformationCardsContainer(selectedAttractionsArr);
}

function showTips() {
    alert('yo');
}
