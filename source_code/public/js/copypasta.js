const ivButton  = document.querySelector('#copy-iv-btn');
const authTagButton = document.querySelector('#copy-auth-tag-btn');

function copy(selector, tooltip){
    let value = document.querySelector(selector).value;
    navigator.clipboard.writeText(value);

    let ttElement = document.querySelector(tooltip);
    ttElement.innerHTML = `Copied: ${value}`;
}
function resetToolTip(selector) {
    let tooltip = document.querySelector(selector);
    tooltip.innerHTML = "Copy to clipboard";
}

ivButton.addEventListener('click', function(){
    copy('#copy-iv', '#copy-iv-btn')
});

ivButton.addEventListener('mouseleave', function(){
    resetToolTip('#copy-iv-btn')
});

authTagButton.addEventListener('click', function(){
    copy('#copy-auth-tag', '#copy-auth-tag-btn')
});

authTagButton.addEventListener('mouseleave', function(){
    resetToolTip('#copy-auth-tag-btn')
});