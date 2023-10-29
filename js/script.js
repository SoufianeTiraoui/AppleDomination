function count(values, row) {
    let i = 0;
    let j = 0;
    let magasin = 0;
    let apple = 0;
    let samsung = 0;
    let xiaomi = 0;
    let sony = 0;
    let online = 0;
    let both = 0;
    let other = 0;
    let feminin = 0;
    let masculin = 0;
   
    for (let index = 0; index < values.length; index++) {
      const valueLower = values[index][row];
      
      switch (valueLower) {
        case "Oui":
          i++;
          break;
        case "Non":
          j++;
          break;
        case "Apple":
          apple++;
          break;
        case "Samsung":
          samsung++;
          break;  
        case "SONY":
          sony++;
          break; 
        case "Xiaomi":
          xiaomi++;
          break; 
        case "Magasin":
          magasin++;
          break; 
        case "En ligne":
          online++;
          break; 
        case "Les deux":
            both++;
            break;   
        case "Feminin":
            feminin++;
            break; 
        case "Masculin":
            masculin++;
            break;           
        default:
          other++;
          break;
      }
    }
    
    return { i, j, samsung, apple, xiaomi, online, both, other, magasin, sony, feminin, masculin };
  }
  async function loadData() {
    const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vRTWsCB6ItjaDhWbcPDpbfySsEGlso7DMLeb69BmtVd6vmM0on2T9xHVsX6aXdl_URaQMAT-QG4KOdS/pub?output=csv');
    const data = await response.text()
    // Parse CSV data into an array
    const rows = data.split('\n');
    const labels = data.split('\r\n')[0].split(',')
    const values = []
    for (let i = 1; i < rows.length; i++) {
      const row = rows[i].split(',');
      values.push(row);
    }
    return { labels, values };
  }
  
  function piechart(fulldata, i, chartId, charts) {
    const labels = [fulldata.labels[i], fulldata.labels[i + 1]];
    let data = [];
    let titles = [];
    let colors = ['red', 'blue', 'green'];
  
    if (i === 4 || i === 6 || i === 1) {
      switch (i) {
        case 4:
          colors.push('purple', 'gray');
          titles = ['Samsung', 'Apple', 'Sony', 'Xiaomi', 'Autre'];
          data.push(count(fulldata.values, i).samsung, count(fulldata.values, i).apple, count(fulldata.values, i).sony,
            count(fulldata.values, i).xiaomi, count(fulldata.values, i).other);
          break;
        case 6:
          titles = ['Magasin', 'En ligne', 'Les deux'];
          data.push(count(fulldata.values, i).magasin, count(fulldata.values, i).online, count(fulldata.values, i).both);
          break;
        case 1:
            titles = ['Feminin', 'Masculin'];
            data.push(count(fulldata.values, i).feminin, count(fulldata.values, i).masculin);
            break;  
        default:
          break;
      }
    }
  
    const chartData = {
      labels: titles,
      datasets: [
        {
          label: labels[0],
          data,
          backgroundColor: colors,
          borderWidth: 1,
        },
      ],
    };
  
    const chartConfig = {
      type: 'pie',
      data: chartData,
    };
  
    const chartContainer = d3.select(`#${chartId}`)
      .append('div')
      .attr('class', 'chart-container');
  
    const canvas = chartContainer
      .append('canvas')
      .attr('id', `myChart${i / 2}`);
  
    charts.push(new Chart(canvas.node(), chartConfig));
  }
  
  function barchart(fulldata, i, chartId, charts) {
    const labels = [fulldata.labels[i], fulldata.labels[i + 1]];
    let data = [count(fulldata.values, i).i, count(fulldata.values, i).j];
    let titles = ['Oui', 'Non'];
  
    const chartData = {
      labels: titles,
      datasets: [
        {
          label: labels[0],
          data,
          backgroundColor: [
            'rgba(255, 26, 104, 0.2)',
            'rgba(54, 162, 235, 0.2)',
          ],
          borderColor: [
            'rgba(255, 26, 104, 1)',
            'rgba(54, 162, 235, 1)',
          ],
          borderWidth: 1,
        },
      ],
    };
  
    const chartConfig = {
      type: 'bar',
      data: chartData,
      options: {
        scales: {
          y: {
            beginAtZero: true,
          },
        },
        plugins: {
          legend: {
            display: false,
          },
        },
      },
    };
  
    const container = d3.select(`#${chartId}`);
  
    container.html('');
  
    const chartCanvas = container.append('canvas').node();
    const ctx = chartCanvas.getContext('2d');
    new Chart(ctx, chartConfig);
  
    charts.push({ chartId, chartConfig });
  }
  
  
  function showbarchart(fulldata,heading){
    let charts = [];
    switch (heading) {
      case "social":
        barchart(fulldata, 5, 'chartContainer',charts);
        piechart(fulldata, 4, 'chartContainer',charts);
        piechart(fulldata, 6, 'chartContainer',charts);
        break;
      case "private":
        barchart(fulldata, 7, 'chartContainer1',charts);
        
        break;
      case "politiques":
        barchart(fulldata, 8, 'chartContainer2',charts);
       
        break;
      case "connaissance":
        barchart(fulldata, 9, 'chartContainer3',charts);
        break;
      case "gender":
        piechart(fulldata, 1, 'chartContainer4',charts);
        break;
      
      default:
        break;
    }
  
  }
  
  
  document.addEventListener("DOMContentLoaded", function() {
    const navLinks = document.querySelectorAll(".nav-link");
    const contentDivs = document.querySelectorAll(".content");
    let data = [];
    loadData().then((fulldata) => {
      createAndAppendCards(fulldata);
      data = fulldata;
    });
    contentDivs.forEach(div => {
        div.style.display = "none";
    });
  
    const profilContentDiv = document.getElementById("profil");
    profilContentDiv.style.display = "block";
    const cardContainer = document.getElementById("card-container");
  
    function createCard(dataRow) {
        const card = document.createElement('div');
        card.classList.add('card');
        
        const backgroundImageURL = dataRow[3].replace("open?", "uc?export=view&");
        
        const cardImageDiv = document.createElement('div');
        cardImageDiv.classList.add('card-image');
        cardImageDiv.style.backgroundImage = `url(${backgroundImageURL})`;
        card.appendChild(cardImageDiv);
        
        const cardNomComplet = document.createElement('p');
        cardNomComplet.textContent = dataRow[2];
        card.appendChild(cardNomComplet);
  
        return card;
    }
  
    function createAndAppendCards(data) {
        for (let i = 0; i < data.values.length; i++) {
          
            console.log(data.values[i]);
            const dataRow = data.values[i];
            const card = createCard(dataRow);
            cardContainer.appendChild(card);
        }
    }
    
    let currentTargetId = null;
  
    navLinks.forEach(link => {
        link.addEventListener("click", function(e) {
            e.preventDefault();
    
            const targetId = this.getAttribute("data-target");
    
            if (targetId !== currentTargetId) {
                contentDivs.forEach(div => {
                    div.style.display = "none";
                });
    
                document.getElementById(targetId).style.display = "block";
    
                currentTargetId = targetId;
                
                showbarchart(data, targetId);
            } else {
              
            }
        });
    });
    
    
    
  });