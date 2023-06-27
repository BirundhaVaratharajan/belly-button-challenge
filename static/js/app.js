
// getting the samples data url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//Global variable to hold the json data from samples.json 
var data;

//Init function to read and display the dashboard with first sample data
function dashboardInit(){
// using D3 library reading the samplesJ SON data and console log it 
    d3.json(url).then((sampledata)=> {

        //updating the global variable data
        data = sampledata;

        //console log the data
        console.log(`Data: ${data}`);

        //getting the all the id from data 
        let subjectId = data.names;
        //dropdown menu to list out the all subjectId to test
        subjectId.forEach((subjectId) => {
        // Append each id 
        dropdownMenu.append("option").text(subjectId).property("value", subjectId);
    
    });
    //Display the dashboard with first default meta data and its chart
    demographicInfo(subjectId[0]);
    Chart(subjectId[0]);
        
    });
}

// dashboard update function based on the test Id selected in dropdown menu
function updateDashBoard(){
    //getting the test ID form the fropdown menu
    let id = d3.select("#selDataset").property("value");
    console.log("id:", id)
    Chart(id);
    demographicInfo(id);

        
}
// function to display the metadata(demographic Information)
function demographicInfo (id){
    //fetching the all meta data 
    let meta = data.metadata;

    //console log meta data
    console.log("metadata:", meta)
    //filter and get the metadata that matches the id
    let metaData = meta.filter((meta) => meta.id == id);

    // clearing the old meta data from the demographic info
    d3.select("#sample-metadata").html("");

    //Display each key-value pair from the metadata JSON object on the page
    let demoInfo = Object.entries(metaData[0]);
    demoInfo.forEach(([key,value]) => {
        d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });

    // console Log the entries 
    console.log(demoInfo);       

}
//function to plot the Bar and Bubble charts
function Chart (id){
    
    let samples = data.samples;
    let meta = data.metadata;

    let sampledata = samples.filter((sample) => sample.id === id);
    let metaData = meta.filter((meta) => meta.id == id);

    
    let sample_values = sampledata[0].sample_values;
    let otu_ids = sampledata[0].otu_ids;
    let otu_labels =sampledata[0].otu_labels;
    //getting washing frequency from meta data
    let wfreq = metaData[0].wfreq;

    //Trace top 10 data (slice function is used to get the top 10)for Bar chart
    let traceBar = [{
        x: sample_values.slice(0,10).reverse(),
        y: otu_ids.slice(0,10).map((otu_id) => `OTU ${otu_id}`).reverse(),
        text: otu_labels.slice(0,10).reverse(),
        type: "bar",
        orientation: "h"

    }];
    // Apply title to the bar chart  layout
    let layout = {
        title: "Top 10 OTUs"
      };
          
    //Trace data for Bubble chart
    let traceBubble =[{
        x:otu_ids ,
        y:sample_values ,
        text: otu_labels,
        mode: "markers",
        marker: {
            size:sample_values,
            color: otu_ids,
            colorscale: "Rainbow"        
        }
       
    }];
    console.log("wash freq:",wfreq);
    let traceGauge = [{
        domain: { x: [0, 1], y: [0, 1] },
        value: wfreq,
        title: { text: "<b>Belly Button Washing Frequency</b><br>Scrubs per Week", font: {size: 24}},
        type: "indicator", 
        mode: "gauge+number",
        gauge: {
            axis: {range: [null, 10],tickwidth:2}, 
            bar: {color: "rgb(68,166,198)"},
            steps: [
                { range: [0, 2], color: "yellow" },
                { range: [2, 4], color: "lime" },
                { range: [4, 6], color: "green" },
                { range: [6, 8], color: "cyan" },
                { range: [8, 10], color: "blue" },

            ]
        }
    }];

    

    // Apply title to the bubble layout
    let layoutBubble = {
       xaxis:{title: " OTU ID"}
      };
     
    let layoutGauge = { width: 600, height: 450, margin: { t: 0, b: 0 } };

  // Using Plotly to plot the data in a Bar,  bubble and gauge chart

     Plotly.newPlot("bar", traceBar, layout);
     Plotly.newPlot("bubble", traceBubble, layoutBubble);
     Plotly.newPlot("gauge", traceGauge,layoutGauge);


}

//call the init function to display the default metadta 
dashboardInit();
// Use D3 to select the dropdown menu
let dropdownMenu = d3.select("#selDataset");
//call the updateDashBoard based on event change in dropdown menu
d3.selectAll("#selDataset").on("change", updateDashBoard);


