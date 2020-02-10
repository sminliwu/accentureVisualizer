/*
 * Date: Feb 10
 * Author: Laura 
 * Project: Accenture Force Fabric
 * 
 * 
 * This code has functions to read and print all sensor inputs to the same serial plotter. Rudimentary smoothing has been achieved by 
 * running an initailization function that takes an average on each sensor to calculate its baseline. All readings, then, are based on
 * offset from this baseline. This helps align all inputs to a common axis. Also, the values seem to drift form their baseline, which might 
 * cause false presses in the visulaization. To mitigate this, I noticed that all drifting happens in the negative offset range. As such, the
 * only meaningful "press" values happen in the positive offset range. Most range to a max offset of 1000. I break this into 
 * steps so that this code can send meaningful integer values from 1-10 that correspond to the force of a press:
 * 
 * TO DO: there are still some small false values that "spike" meaning they rise and lower in 1 cycle, which is likely to short to be a press. 
 * Could implementt smoothing to eliminate these but they will also be so momentary that they might not be an issue. 
 * 
 * TO DO: since discreet steps are being sent to the visualization, we should add some simple interpolation in the sketch to smooth out 
 * rough sequences
 * 
 */

//pins for force region 1-6 
int fregs[] = {36, 37, 38, 39, 32, 33};

//the sensor values on each round
int vals[6];

//preset / compiled baselines for each value
int base[6];

// preset max offset 
int max_offset = 1000;

//preset number of "steps" to detect in each press
int offset_step_size = 100;

//the total number of regions on the fabric
int num_regs = 6;

//how long to search for a baseline during the initialization phase
int baseline_window = 100;

//updates on each loop
int counter = 0;

void setup() {
  Serial.begin(9600);
  Serial.println("calculating base values");
  calculate_base_values(baseline_window);
  print_base_values();
  Serial.println("end base values");
}

void loop() {
  read_values();
  //print_raw_values();
  print_offset_steps();
  delay(100);  

}

//read for cycles and then write the average as the base value.
void calculate_base_values(int cycles){
  int totals[] = {0,0,0,0,0,0};
  for(int c = 0; c < cycles; c++){
    for(int i = 0; i < num_regs; i++){
      totals[i] += analogRead(fregs[i]);
    }
  }

  //divide all by cycles to get average. 
  for(int i = 0; i < num_regs; i++){
      base[i] = totals[i] / cycles;
    }
}


void print_base_values(){
  for(int i = 0; i < num_regs; i++){
      Serial.print(base[i]);
       if(i < (num_regs-1)) Serial.print(","); //a comma between vals allows multiple draws to plotter 
       else Serial.println();
  }
}


void read_values(){
  for(int i = 0; i < num_regs; i++){
      vals[i] = analogRead(fregs[i]); 
    }  
}



/* intended for viewing a single input at a time */
void print_raw_value(int i){
   Serial.println(vals[i]);
}

/*reads and prints all inputs*/
void print_raw_values(){
 //iterate through each input
  for(int i = 0; i < num_regs; i++){
    Serial.print(vals[i]);
    if(i < (num_regs-1)) Serial.print(","); //a comma between vals allows multiple draws to plotter 
    else Serial.println();
  }  
}

/*reads and prints all inputs*/
void print_offset_values(){
 //iterate through each input
  for(int i = 0; i < num_regs; i++){
    Serial.print(base[i] -vals[i]);
    if(i < (num_regs-1)) Serial.print(","); //a comma between vals allows multiple draws to plotter 
    else Serial.println();
  }  
}


/*reads and prints all inputs*/
void print_offset_steps(){
  int diff = 0;
  int diff_step = 0;
 //iterate through each input
  for(int i = 0; i < num_regs; i++){
    int diff = base[i] -vals[i];
    if(diff > 0){
      diff_step = diff/offset_step_size;
    }else{
      diff_step = 0;
    }
    
    
    Serial.print(diff_step);
   
    if(i < (num_regs-1)) Serial.print(","); //a comma between vals allows multiple draws to plotter 
    else Serial.println();
  }  
}
