/*
 * Date Upddated: March 13, 2021
 * Author: Laura, mod by Shanel
 * Project: Accenture Force Fabric
 * 
 * This code has functions to read and print all sensor inputs to the same serial plotter. Rudimentary smoothing has been achieved by 
 * running an initailization function that takes an average on each sensor to calculate its baseline. All readings, then, are based on
 * offset from this baseline. This helps align all inputs to a common axis. Also, the values seem to drift form their baseline, which might 
 * cause false presses in the visualization. To mitigate this, I noticed that all drifting happens in the negative offset range. As such, the
 * only meaningful "press" values happen in the positive offset range. 
 * 
 * 
 */

/* read for cycles and then write the average as the base value. */
void calculate_base_values(int cycles){
  int totals[] = {0,0,0,0,0,0};
  int count = 0;
  for(int c = 0; c < cycles; c++){
    for(int i = 0; i < num_regs; i++){
      totals[i] += analogRead(fregs[i]);
    }
    delay(100);
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
  //Serial.println("read vals");
}



/* intended for viewing a single input at a time */
void print_raw_value(int i){
   Serial.println(vals[i]);
}

/* reads and prints all inputs */
void print_raw_values(){
 //iterate through each input
  for(int i = 0; i < num_regs; i++){
    Serial.print(vals[i]);
    if(i < (num_regs-1)) Serial.print(","); //a comma between vals allows multiple draws to plotter 
    else Serial.println();
  }  
}

/* reads and prints all inputs */
void print_offset_values(){
 //iterate through each input
  for(int i = 0; i < num_regs; i++){
    Serial.print(base[i] -vals[i]);
    if(i < (num_regs-1)) Serial.print(","); //a comma between vals allows multiple draws to plotter 
    else Serial.println();
  }  
}


/* reads and prints all inputs and sends them to websocket */
// printing is disabled for release
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
    if (diff_step > 0) {
      packVals(i, diff_step);
      webSocket.broadcastTXT(dataBuffer);
    }
   
    if(i < (num_regs-1)) Serial.print(","); //a comma between vals allows multiple draws to plotter 
    else Serial.println();
  }  
}
