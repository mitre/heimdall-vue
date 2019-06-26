<template>
  <div id="welcome_div">
    <!-- Full Width Image Header -->
    <header class="header-image">
        <div class="headline">
            <div class="container" style="background: #99b3ff;">
                <h1>Welcome to Heimdall-lite!</h1>
            </div>
        </div>
    </header>

    <div class="container">
      <hr class="featurette-divider">

      <!-- First Featurette -->
      <div class="featurette" id="about">

         <h2 class="featurette-heading">View the results of an InSpec execution json.</h2>
         <p class="lead">Easily see how many controls passed and failed.</p>
         <p class="lead">Click on the donut charts to filter the controls by status and severity.</p>
         <img class="featurette-image img-fluid" id="base_image" src="./src/assets/heimdall-lite-controls.png">
      </div>

      <hr class="featurette-divider">

      <!-- Second Featurette -->
      <div class="featurette" id="services">
         <h2 class="featurette-heading">Use the treemap or datatable to navigate through your controls.</h2>
         <p class="lead"></p>
         <img class="featurette-image img-fluid" id="treemap_image" src="./src/assets/nist_tree_map.png">

         <hr class="featurette-divider">

         <img class="featurette-image img-fluid" id="data_table_image" style="width: 100%" src="./src/assets/data_table.png">
      </div>

      <hr class="featurette-divider">

      <!-- Third Featurette -->
      <div class="featurette" id="contact">
         <h2 class="featurette-heading">Click on a control to detect which tests passed or failed, or see its details and code.</h2>
         <p class="lead"></p>
         <img class="featurette-image img-fluid pull-right" id="results_image" src="./src/assets/results_details.png">
      </div>

      <hr class="featurette-divider">

      <!-- Fourth Featurette -->
      <div class="featurette" id="contact">
         <h2 class="featurette-heading">View the profile before you execute it on a system.</h2>
         <p class="lead">The profile must be loaded into Heimdall-lite as a json value.</p>
         <p class="lead">To create a json of a profile use the following steps:
           <ul class="list-group">
             <li class="list-group-item">1. Open a terminal to the directory of the profile.</li>
             <li class="list-group-item">2. Run the command: `inspec json [path to profile] -o [name]`</li>
           </ul>
         </p>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.header-image {
    display: block;
    width: 100%;
    text-align: center;
    background: #99b3ff;
    -webkit-background-size: cover;
    -moz-background-size: cover;
    background-size: cover;
    -o-background-size: cover;
}
.headline {
  padding: 120px 0;
}

.headline h1 {
  font-size: 130px;
  background: #99b3ff;
}

.headline h2 {
  font-size: 77px;
  background: #99b3ff;
  background: rgba(255,255,255,0.9);
}

.featurette-divider {
  margin: 80px 0;
}

.featurette {
  overflow: hidden;
}

.featurette-image.pull-left {
  margin-right: 40px;
}

.featurette-image.pull-right {
  margin-left: 40px;
}

.featurette-heading {
  font-size: 50px;
}
@media(max-width:1200px) {
  .headline h1 {
    font-size: 140px;
  }

  .headline h2 {
    font-size: 63px;
  }

  .featurette-divider {
    margin: 50px 0;
  }

  .featurette-image.pull-left {
    margin-right: 20px;
  }

  .featurette-image.pull-right {
    margin-left: 20px;
  }

  .featurette-heading {
    font-size: 35px;
  }
}

@media(max-width:991px) {
  .headline h1 {
    font-size: 105px;
  }

  .headline h2 {
    font-size: 50px;
  }

  .featurette-divider {
    margin: 40px 0;
  }

  .featurette-image.pull-left {
    margin-right: 10px;
  }

  .featurette-image.pull-right {
    margin-left: 10px;
  }

  .featurette-heading {
    font-size: 30px;
  }
}

@media(max-width:768px) {
  .container {
    margin: 0 15px;
  }

  .featurette-divider {
    margin: 40px 0;
  }

  .featurette-heading {
    font-size: 25px;
  }
}

@media(max-width:668px) {
  .headline h1 {
    font-size: 70px;
  }

  .headline h2 {
    font-size: 32px;
  }

  .featurette-divider {
    margin: 30px 0;
  }
}

@media(max-width:640px) {
  .headline {
    padding: 75px 0 25px 0;
  }

  .headline h1 {
    font-size: 60px;
  }

  .headline h2 {
    font-size: 30px;
  }
}

@media(max-width:375px) {
  .featurette-divider {
    margin: 10px 0;
  }

  .featurette-image {
    max-width: 100%;
  }

  .featurette-image.pull-left {
    margin-right: 0;
    margin-bottom: 10px;
  }

  .featurette-image.pull-right {
    margin-bottom: 10px;
    margin-left: 0;
  }
}
</style>
