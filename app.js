let input = document.querySelector('#input');
let searchBtn = document.querySelector('#search');
let loading = document.querySelector('.loading');
let notFound = document.querySelector('.not_found');
let defBox = document.querySelector('.def');
let audioBox = document.querySelector('.audio');
let apiKey = 'c6738edf-457b-44e6-90d2-e7afdd2c40e8';

searchBtn.addEventListener('click', function (e) {
    e.preventDefault();
    // Clear data
    audioBox.innerHTML = '';
    notFound.innerHTML = '';
    defBox.innerHTML = '';

    // Get input data
    let word = input.value;

    // Call API Get Data
    if (word === '') {
        alert('Word Is Requred');
        return;
    }
    getData(word);
});

async function getData(word) {
    loading.style.display = 'block';
    // Ajax call
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/learners/json/${word}?key=${apiKey}`);
    const data = await response.json();

    // if empty res
    if (!data.length) {
        loading.style.display = 'none';
        notFound.innerHTML = 'Result Not Found :(';
        return;
    }

    // if resoult is suggestion 
    if (typeof data[0] === 'string') {
        loading.style.display = 'none';
        let heading = document.createElement('h3');
        heading.innerHTML = 'Did You Mean ?';
        notFound.appendChild(heading);
        data.forEach(element => {
            let suggestion = document.createElement('span');
            suggestion.classList.add('suggested');
            suggestion.innerHTML = element;
            notFound.appendChild(suggestion);
        });
        return;
    }

    // Resoult found
    loading.style.display = 'none';
    let defination = data[0].shortdef[0];
    defBox.innerHTML = defination;

    // Sound
    const soundName = data[0].hwi.prs[0].sound.audio;
    if (soundName) {
        renderSound(soundName);
    }
    // console.log(data);
}

function renderSound(soundName) {
    // https://media.merriam-webster.com/soundc11
    let subfolder = soundName.charAt(0);
    let soundSrc = `https://media.merriam-webster.com/soundc11/${subfolder}/${soundName}.wav?key = ${apiKey}`;
    let aud = document.createElement('audio');
    aud.src = soundSrc;
    aud.controls = true;
    audioBox.appendChild(aud);
}