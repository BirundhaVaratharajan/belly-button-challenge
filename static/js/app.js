
// getting the samples data url
const url = "https://2u-data-curriculum-team.s3.amazonaws.com/dataviz-classroom/v1.1/14-Interactive-Web-Visualizations/02-Homework/samples.json"

//Global variable to hold the json data from sample.json 
var data;

//
function dashboardInit(){
// fetch the JSON data and console log it 
d3.json(url).then((sampledata)=> {
    console.log(`Data: ${sampledata}`);
    //updating the global variable
    data = sampledata;

    let subjectId = data.names;
    console.log(`Data: ${data}`);
    subjectId.forEach((subjectId) => {
     // Append each name as an option to the drop down menu
     // This is adding each name to the html file as an option element with value = a name in the names array
     dropdownMenu.append("option").text(subjectId).property("value", subjectId);
   
 });
 //Display the dashboard with first default meta data and its chart
 demographicInfo(subjectId[0]);
 Chart(subjectId[0]);
    
});
}

// dashboard update function based on the test Id selected in dropdown menu
function updateDashBoard(){
    let id = d3.select("#selDataset").property("value");
    console.log("id:", id)
    demographicInfo(id);
    Chart(id);

        
}
// function to display the metadata(demographic Information)
function demographicInfo (id){
    let meta = data.metadata;
    console.log("metadata:", meta)

    let metaData = meta.filter((meta) => meta.id == id);

    d3.select("#sample-metadata").html("");

    let demoInfo = Object.entries(metaData[0]);
    demoInfo.forEach(([key,value]) => {
        d3.select("#sample-metadata").append("h5").text(`${key}: ${value}`);
    });

    // Log the entries Array
    console.log(demoInfo);       

}
//function to plot the Bar and Bubble charts
function Chart (id){
    
    let samples = data.samples;
    let sampledata = samples.filter((sample) => sample.id === id);
    
    let sample_values = sampledata[0].sample_values;
    let otu_ids = sampledata[0].otu_ids;
    let otu_labels =sampledata[0].otu_labels;

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
            sizemode: 'area',
            sizemin: 6
    
        }
       
    }];
    
    // Apply title to the bubble layout
    let layoutBubble = {
       xaxis:{title: " OTU ID"}
      };
      
  // Using Plotly to plot the data in a Bar and  bubble chart

     Plotly.newPlot("bar", traceBar, layout);
     Plotly.newPlot("bubble", traceBubble, layoutBubble);

}

//call the init function to display the default metadta 
dashboardInit();
// Use D3 to select the dropdown menu
let dropdownMenu = d3.select("#selDataset");
//call the updateDashBoard based on event change in dropdown menu
d3.selectAll("#selDataset").on("change", updateDashBoard);


