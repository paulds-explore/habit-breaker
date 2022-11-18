// Classifier Variable
let classifier;

// Model URL
let imageModelURL = document.getElementById("modelUrl").value;

// Video
let video;
let flippedVideo;
// To store the classification
let label = "";
// To store the possible classifications
let labels = null;

// Used to do some timing to avoid spamming notifications and erroneous transient effects
let priorLabel = "";
let timeSincePriorLabel = 0;

// Load the model first
function preload() {
    classifier = ml5.imageClassifier(imageModelURL + 'model.json', setLabels);
    setLabels();
}

// Change model
function loadNewModel() {
    let imageModelURL = document.getElementById("modelUrl").value;
    console.log(`Loading ${imageModelURL}`);
    classifier = ml5.imageClassifier(imageModelURL + 'model.json', setLabels);
    element = document.getElementById("modelUrl");

    // Clear the cache and save the new model as default
    window.localStorage.clear();
    saveValue(element.id, element.value);
}

function setup() {
    canvas = createCanvas(320, 260);
    canvas.parent("camera");
    // Create the video
    video = createCapture(VIDEO);
    video.size(320, 240);
    video.hide();

    // Start classifying
    classifyVideo();
}

function draw() {
    background(0);
    // Draw the video
    image(flippedVideo, 0, 0);

    // Draw the label
    fill(255);
    textSize(16);
    textAlign(CENTER);
    text(label, width / 2, height - 4);
}

// Get a prediction for the current video frame
function classifyVideo() {
    flippedVideo = ml5.flipImage(video);
    classifier.classify(flippedVideo, gotResult);
    flippedVideo.remove();
}

// When we get a result
function gotResult(error, results) {
    // If there is an error
    if (error) {
        console.error(error);
        return;
    }
    priorLabel = label;
    // The results are in an array ordered by confidence.
    label = results[0].label;
    checkIfNotificationNeeded();
    // Classify again!
    classifyVideo();
}

function setLabels() {
    labels = classifier.mapStringToIndex;
    template = `
            <div class="labelAndOption">
                <label class="label" for="{label}">{label}</label>
                <select class="labelOption" id="{label}" onchange="enableWaitSlider(this.id)">
                    <option value=false>Don't Notify</option>
                    <option value=true>Notify</option>
                </select>
                <input type="range" min="1" max="15" value="3" class="slider" id="{label}_wait" name="{label}_wait"
                    onchange="updateLabelWaitSliderValue(this.id)" disabled>  
                <div class="tooltip">
                    <p class="sliderValue" id="{label}_wait_value">3s</p>
                    <span class="tooltiptext">Must detect for this many seconds consecutively before notifying.</span>
                </div>
            </div>
        `
    update_div = ""
    for (labelName of labels) {
        update_div += template.replaceAll("{label}", labelName);
    }

    document.getElementById("labels").innerHTML = update_div;

    // set the previously stored settings
    for (labelName of labels) {
        disabled = getSavedValue(labelName);
        if (disabled !== null) {
            disabled = (disabled === 'true');

            if (disabled === true) {
                // set the notification option
                document.getElementById(labelName).value = disabled;
                enableWaitSlider(labelName);
            }
        };

        // set the slider properties
        var id = `${labelName}_wait`;
        var updateValue = getSavedValue(`${id}_value`);

        if (updateValue !== '') {
            document.getElementById(id).value = updateValue;
            updateLabelWaitSliderValue(`${labelName}_wait`);
        }
    }
}