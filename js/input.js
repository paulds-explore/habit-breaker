function enableWaitSlider(labelName) {
    var id = `${labelName}_wait`;
    var element = document.getElementById(id);
    element.disabled = !element.disabled;
    saveValue(labelName, !element.disabled);
}

function updateLabelWaitSliderValue(labelName) {
    var id = `${labelName}_value`;
    var wait = document.getElementById(labelName).value;
    element = document.getElementById(id);
    element.innerHTML = `${wait}s`;
    saveValue(id, wait);
}